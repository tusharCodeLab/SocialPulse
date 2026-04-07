const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'supabase', 'functions'),
    __dirname
];

const IGNORED_DIRS = ['node_modules', 'dist', '.git', '.lovable', '.vscode'];

function crawl(dir, fileCallback) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!IGNORED_DIRS.includes(file)) {
                crawl(fullPath, fileCallback);
            }
        } else {
            fileCallback(fullPath);
        }
    }
}

function processFile(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json') || filePath.endsWith('.md')) {

        // Skip this script itself
        if (filePath.endsWith('clean.cjs')) return;

        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Replace API Gateway
        content = content.replace(/https:\/\/ai\.gateway\.lovable\.dev\/v1\/chat\/completions/g, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
        content = content.replace(/https:\/\/ai\.gateway\.custom\.dev\/v1\/chat\/completions/g, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');

        // Replace lovable key
        content = content.replace(/LOVABLE_API_KEY/g, 'GEMINI_API_KEY');

        // Replace Gemini model string
        content = content.replace(/google\/gemini-3-flash-preview/g, 'gemini-2.5-flash');
        content = content.replace(/google\/gemini-2\.5-flash/g, 'gemini-2.5-flash');

        // Remove lovable-tagger from vite.config.ts
        if (filePath.endsWith('vite.config.ts')) {
            content = content.replace(/import \{ componentTagger \} from "lovable-tagger";\n?/g, '');
            content = content.replace(/,\s*mode === "development" && componentTagger\(\)/g, '');
        }

        // Remove lovable-tagger from package.json
        if (filePath.endsWith('package.json')) {
            try {
                const pkg = JSON.parse(content);
                let changed = false;
                if (pkg.dependencies && pkg.dependencies['lovable-tagger']) {
                    delete pkg.dependencies['lovable-tagger'];
                    changed = true;
                }
                if (pkg.devDependencies && pkg.devDependencies['lovable-tagger']) {
                    delete pkg.devDependencies['lovable-tagger'];
                    changed = true;
                }
                if (changed) {
                    content = JSON.stringify(pkg, null, 2) + '\n';
                }
            } catch (e) {
            }
        }

        // General replacements
        content = content.replace(/Lovable AI/g, 'Google Gemini');
        content = content.replace(/lovable/gi, 'custom');
        content = content.replace(/LOVABLE/g, 'GEMINI');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
}

DIRECTORIES_TO_SCAN.forEach(dir => {
    if (dir === __dirname) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isFile()) {
                processFile(fullPath);
            }
        }
    } else {
        crawl(dir, processFile);
    }
});
