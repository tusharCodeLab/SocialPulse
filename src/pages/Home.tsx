import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  ArrowRight,
  Sparkles,
  LineChart,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle2,
  Zap,
  Check,
  X,
} from "lucide-react";
import { InstagramIcon, YouTubeIcon, FacebookIcon } from "@/components/icons/PlatformIcons";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const features = [
  {
    icon: BarChart3,
    title: "Multi-Platform Analytics",
    description: "Track likes, comments, reach, and YouTube, and Facebook all in one dashboard."
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get personalized recommendations from AI to improve your content strategy across all platforms — backed by real data."
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description: "Automatically detect performance trends and content patterns for each connected platform up to 72 hours before they peak."
  },
  {
    icon: MessageSquare,
    title: "Sentiment Analysis",
    description: "Understand how your audience feels about your content with AI comment analysis."
  },
  {
    icon: Shield,
    title: "Spam Detection",
    description: "AI-powered spam filter to identify bot comments, phishing, and promotional content."
  },
  {
    icon: Clock,
    title: "Best Time to Post",
    description: "Find your optimal posting times based on real engagement data from your audience."
  }
];

const stats = [
  { value: 6, suffix: "+", label: "PLATFORMS SUPPORTED", icon: Zap },
  { value: 100, suffix: "%", label: "AI-POWERED FEATURES", icon: Brain },
  { value: 24, suffix: "/7", label: "FREE TO USE", icon: CheckCircle2 },
  { value: 0, suffix: "", label: "REAL-TIME ANALYTICS", icon: BarChart3, displayText: "24/7" },
];

const steps = [
  { 
    step: "01", 
    title: "Connect Your Accounts", 
    description: "Link your Instagram, YouTube, and Facebook accounts in one click. Live streams automatically — no manual uploads." 
  },
  { 
    step: "02", 
    title: "AI Analyzes Your Data", 
    description: "Our AI engine processes your posts, comments, and engagement patterns in real time — sentiment, trends, and anomalies detected instantly." 
  },
  { 
    step: "03", 
    title: "Get Actionable Insights", 
    description: "Receive personalized recommendations, trend alerts, and optimal posting times. Make decisions before the moment passes." 
  },
];

const dashboardMetrics = [
  { label: "TOTAL FOLLOWERS", value: "48.2K", subtitle: "↑ +8% this month" },
  { label: "ENGAGEMENT RATE", value: "3.4%", subtitle: "↑ Above average" },
  { label: "TOTAL REACH", value: "124K", subtitle: "+21% this week" },
  { label: "AI SCORE", value: "78", subtitle: "Sentiment index" },
];

const emotions = [
  { name: "Joy", value: 72, color: "bg-chart-sentiment-positive" },
  { name: "Curious", value: 46, color: "bg-primary" },
  { name: "Frustrated", value: 18, color: "bg-chart-impressions" },
  { name: "Sarcasm", value: 10, color: "bg-chart-reach" },
];

const whyCards = [
  {
    title: "100% Free",
    description: "No hidden fees or subscriptions. Full AI analytics at zero cost to start.",
  },
  {
    title: "AI Insights",
    description: "AI-powered insights from your real data — not generic advice or templates.",
  },
  {
    title: "1 Dashboard",
    description: "Seamless analytics in one place without switching between tools or tabs.",
  },
];

const pricingTiers = [
  {
    name: "STARTER",
    price: "$49",
    period: "/mo",
    description: "For individual creators getting started with AI analytics.",
    features: [
      { text: "1 brand account", included: true },
      { text: "3 platforms", included: true },
      { text: "Standard sentiment", included: true },
      { text: "30-day history", included: true },
      { text: "Emotion detection", included: true },
      { text: "Conversational AI", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "GROWTH",
    price: "$199",
    period: "/mo",
    description: "For serious content teams who need the full AI intelligence stack.",
    features: [
      { text: "5 brand accounts", included: true },
      { text: "All platforms", included: true },
      { text: "27-label emotion detection", included: true },
      { text: "72-hr trend forecasting", included: true },
      { text: "Conversational AI queries", included: true },
      { text: "Real-time crisis alerts", included: true },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "ENTERPRISE",
    price: "$999",
    period: "/mo",
    description: "For agencies and large brands needing custom models and SLAs.",
    features: [
      { text: "Unlimited brands", included: true },
      { text: "Custom ML models", included: true },
      { text: "White-label dashboard", included: true },
      { text: "99.5% uptime SLA", included: true },
      { text: "API access + docs", included: true },
      { text: "Dedicated support", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Home = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <LineChart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InsightFlow</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-6"
          >
            <button onClick={() => scrollTo('features')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            <Link to="/auth">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-reach/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Social Media Analytics</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Understand Your</span>
              <br />
              <span className="gradient-text">Social Media Performance.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect Instagram, YouTube, and Facebook — unlock AI-powered analytics with sentiment analysis, 
              trend detection, spam filtering, and optimal posting times.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-lg">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 h-14 text-lg"
                onClick={() => scrollTo('how-it-works')}
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { value: 6, suffix: "+", label: "PLATFORMS SUPPORTED" },
              { value: 100, suffix: "%", label: "AI-POWERED FEATURES" },
              { value: 24, suffix: "/7", label: "FREE TO USE" },
              { label: "REAL-TIME ANALYTICS", displayText: "∞" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="text-center p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-foreground">
                  {stat.displayText ? (
                    <span>{stat.displayText}</span>
                  ) : (
                    <>
                      <AnimatedCounter value={stat.value!} duration={1.5} />
                      <span>{stat.suffix}</span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Platform Logo Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Supported Platforms</span>
            {[
              { icon: InstagramIcon, name: "Instagram" },
              { icon: YouTubeIcon, name: "YouTube" },
              { icon: FacebookIcon, name: "Facebook" },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50"
              >
                <p.icon className="w-5 h-5" />
                <span className="text-sm font-medium text-foreground">{p.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview Mockup */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-chart-impressions/60" />
              <div className="w-3 h-3 rounded-full bg-chart-sentiment-positive/60" />
              <span className="ml-4 text-xs text-muted-foreground">InsightFlow Dashboard</span>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {dashboardMetrics.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="rounded-xl bg-muted/30 border border-border/40 p-3 sm:p-4"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{card.label}</p>
                  <div className="text-lg sm:text-2xl font-bold text-foreground mt-1">{card.value}</div>
                  <p className="text-[10px] text-primary mt-1">{card.subtitle}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart + Emotion Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 rounded-xl bg-muted/20 border border-border/40 p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">Engagement Trend — Last 30 Days</p>
                <div className="h-28 sm:h-32 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      className="flex-1 rounded-sm bg-gradient-to-t from-primary to-primary/40"
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-muted/20 border border-border/40 p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">Emotion Breakdown</p>
                <div className="space-y-3">
                  {emotions.map((emotion, i) => (
                    <motion.div
                      key={emotion.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{emotion.name}</span>
                        <span className="text-foreground font-medium">{emotion.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${emotion.value}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                          className={`h-full rounded-full ${emotion.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">WHAT YOU GET</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              What You Get
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real data, real insights — powered by AI across all your platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group metric-card rounded-2xl p-6 border border-border animated-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Creators Choose InsightFlow */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">WHY CREATORS CHOOSE INSIGHTFLOW</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Creators Choose InsightFlow
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Intelligence your current tool simply doesn't have.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-border bg-card p-8 text-center"
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">PRICING</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pricing
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent pricing. Start free. No credit card required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col ${
                  tier.popular 
                    ? 'border-primary bg-primary/5 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]' 
                    : 'border-border bg-card'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{tier.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{tier.description}</p>
                </div>
                <div className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/auth?mode=signup" className="mt-auto">
                  <Button 
                    className={`w-full h-12 ${
                      tier.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-reach/10 to-primary/5" />
            <div className="absolute inset-0 bg-card/80 backdrop-blur-xl" />
            
            <div className="relative p-8 sm:p-12 md:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Ready to Grow Your
                <br />
                <span className="gradient-text">Social Media Presence?</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Sign up, connect your accounts, and start getting AI-powered insights in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 text-lg">
                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-10 h-14 text-lg"
                  onClick={() => scrollTo('features')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <LineChart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">InsightFlow</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button onClick={() => scrollTo('features')} className="hover:text-foreground transition-colors">Features</button>
              <button onClick={() => scrollTo('pricing')} className="hover:text-foreground transition-colors">Pricing</button>
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Contact</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">© 2026 InsightFlow - Team Delta - ADPIT</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
