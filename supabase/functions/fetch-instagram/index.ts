import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FACEBOOK_GRAPH_API = "https://graph.facebook.com/v18.0";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isRateLimitError(responseText: string): boolean {
  try {
    const parsed = JSON.parse(responseText);
    return parsed?.error?.code === 4 || parsed?.error?.message?.includes("request limit");
  } catch {
    return false;
  }
}

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authToken = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(authToken);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine which Instagram token to use
    let ACCESS_TOKEN: string | null = null;
    let userProvidedToken = false;

    // Check for user-provided token in request body
    let body: { token?: string; token_id?: string } = {};
    try {
      body = await req.json();
    } catch {
      // No body provided, that's fine
    }

    if (body.token) {
      // Validate token format
      const trimmed = body.token.trim();
      if (trimmed.length > 500 || !/^[A-Za-z0-9_\-\.]+$/.test(trimmed)) {
        return new Response(
          JSON.stringify({ error: "Invalid token format. Must be alphanumeric, max 500 characters." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      ACCESS_TOKEN = trimmed;
      userProvidedToken = true;
    } else if (body.token_id) {
      // Look up token from instagram_tokens table
      const { data: tokenRecord, error: tokenError } = await supabase
        .from("instagram_tokens")
        .select("access_token")
        .eq("id", body.token_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (tokenError || !tokenRecord) {
        return new Response(
          JSON.stringify({ error: "Token not found or unauthorized" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      ACCESS_TOKEN = tokenRecord.access_token;
    } else {
      // Fall back to shared env token
      ACCESS_TOKEN = Deno.env.get("INSTAGRAM_ACCESS_TOKEN") || null;
    }

    if (!ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: "No Instagram access token available. Add a profile with your own token." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching Instagram data for user: ${user.id}, userProvided: ${userProvidedToken}`);

    // Step 1: Get Facebook Pages
    const pagesResponse = await fetch(
      `${FACEBOOK_GRAPH_API}/me/accounts?access_token=${ACCESS_TOKEN}`
    );
    
    const pagesRawResponse = await pagesResponse.text();
    
    if (!pagesResponse.ok) {
      const statusCode = isRateLimitError(pagesRawResponse) ? 429 : 400;
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch Facebook Pages", 
          details: pagesRawResponse,
          hint: statusCode === 429 
            ? "Facebook API rate limit reached. Please wait a few minutes before syncing again."
            : "Make sure your token has 'pages_show_list' permission and is a valid User Access Token from Graph API Explorer",
          rateLimited: statusCode === 429,
        }),
        { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    let pagesData;
    try {
      pagesData = JSON.parse(pagesRawResponse);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid response from Facebook API" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!pagesData.data || pagesData.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "No Facebook Pages found", 
          hint: "Make sure your Facebook account has a Page connected to an Instagram Business/Creator account"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Find Instagram Business Account
    let instagramAccountId: string | null = null;
    let instagramUsername: string | null = null;
    let instagramFollowersCount = 0;
    let instagramMediaCount = 0;
    let pageAccessToken: string | null = null;
    let pageId: string | null = null;

    for (const page of pagesData.data) {
      await delay(500);
      const igAccountResponse = await fetch(
        `${FACEBOOK_GRAPH_API}/${page.id}?fields=instagram_business_account{id,username,followers_count,follows_count,media_count}&access_token=${page.access_token || ACCESS_TOKEN}`
      );
      
      if (igAccountResponse.ok) {
        const igData = await igAccountResponse.json();
        if (igData.instagram_business_account) {
          instagramAccountId = igData.instagram_business_account.id;
          instagramUsername = igData.instagram_business_account.username;
          instagramFollowersCount = igData.instagram_business_account.followers_count || 0;
          instagramMediaCount = igData.instagram_business_account.media_count || 0;
          pageAccessToken = page.access_token || ACCESS_TOKEN;
          pageId = page.id;
          break;
        }
      }
    }

    if (!instagramAccountId) {
      return new Response(
        JSON.stringify({ 
          error: "No Instagram Business Account found",
          hint: "Your Facebook Page must be connected to an Instagram Business or Creator account."
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 3: Save token to instagram_tokens if user-provided
    if (userProvidedToken) {
      const { error: tokenSaveError } = await supabase
        .from("instagram_tokens")
        .upsert({
          user_id: user.id,
          access_token: ACCESS_TOKEN,
          instagram_user_id: instagramAccountId,
          instagram_username: instagramUsername,
          page_access_token: pageAccessToken,
          page_id: pageId,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,instagram_user_id",
          ignoreDuplicates: false,
        });

      if (tokenSaveError) {
        console.error("Error saving token:", tokenSaveError);
      }
    }

    // Step 4: Upsert social account — use instagram_user_id as unique key per user
    const { data: socialAccount, error: accountError } = await supabase
      .from("social_accounts")
      .upsert({
        user_id: user.id,
        platform: "instagram",
        account_name: instagramUsername || "Instagram Account",
        account_handle: `@${instagramUsername}`,
        followers_count: instagramFollowersCount,
        is_connected: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,platform,account_handle",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (accountError) {
      console.error("Error upserting social account:", accountError);
    }

    // Step 5: Fetch media
    const mediaResponse = await fetch(
      `${FACEBOOK_GRAPH_API}/${instagramAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=25&access_token=${pageAccessToken}`
    );
    
    let mediaData: InstagramMedia[] = [];
    if (mediaResponse.ok) {
      const mediaJson = await mediaResponse.json();
      mediaData = mediaJson.data || [];
    }

    // Step 6: Save posts
    const postsToUpsert = mediaData.map((media) => ({
      user_id: user.id,
      platform: "instagram" as const,
      external_post_id: media.id,
      content: media.caption || "",
      media_url: media.media_url || null,
      post_type: media.media_type?.toLowerCase() || "image",
      published_at: media.timestamp,
      likes_count: media.like_count || 0,
      comments_count: media.comments_count || 0,
      social_account_id: socialAccount?.id || null,
      updated_at: new Date().toISOString(),
    }));

    if (postsToUpsert.length > 0) {
      await supabase
        .from("posts")
        .upsert(postsToUpsert, {
          onConflict: "user_id,external_post_id",
          ignoreDuplicates: false,
        });
    }

    // Step 7: Fetch comments for top 5 posts
    let totalComments = 0;
    for (const media of mediaData.slice(0, 5)) {
      await delay(1000);
      try {
        const commentsResponse = await fetch(
          `${FACEBOOK_GRAPH_API}/${media.id}/comments?fields=id,text,timestamp,username&limit=50&access_token=${pageAccessToken}`
        );
        
        if (commentsResponse.ok) {
          const commentsJson = await commentsResponse.json();
          const comments = commentsJson.data || [];
          
          if (comments.length > 0) {
            const { data: postData } = await supabase
              .from("posts")
              .select("id")
              .eq("user_id", user.id)
              .eq("external_post_id", media.id)
              .maybeSingle();

            if (postData) {
              for (const c of comments) {
                const { error: insertError } = await supabase
                  .from("post_comments")
                  .upsert({
                    user_id: user.id,
                    post_id: postData.id,
                    content: c.text,
                    author_name: c.username || "Anonymous",
                    created_at: c.timestamp,
                    external_comment_id: c.id,
                  }, {
                    onConflict: "user_id,external_comment_id",
                    ignoreDuplicates: true,
                  });
                
                if (!insertError) totalComments++;
              }
            }
          }
        }
      } catch (e) {
        console.error(`Error fetching comments for ${media.id}:`, e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        account: {
          username: instagramUsername,
          id: instagramAccountId,
          followers_count: instagramFollowersCount,
          media_count: instagramMediaCount,
          social_account_id: socialAccount?.id,
        },
        imported: {
          posts: postsToUpsert.length,
          comments: totalComments,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Instagram fetch error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
