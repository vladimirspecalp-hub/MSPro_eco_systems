import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

const OWNER = 'vladimirspecalp-hub';
const REPO = 'MSPro_eco_systems';

const FILES_TO_SYNC = [
  'server/routes/news-api.ts',
  'server/repositories/news-repository.ts',
  'content/news_store.json',
  'reports/replit-checkpoint.md',
  'reports/news-plan.md',
  'reports/analytics-plan.md',
  'reports/analytics-scaffold-report.md',
  'docs/news-architecture.md',
  'docs/analytics-scaffold.md',
  'client/src/App.tsx',
  'client/src/modules/analytics/index.ts',
  'client/src/modules/analytics/config.ts',
  'client/src/modules/analytics/consent.ts',
  'client/src/modules/analytics/events.ts',
  'client/src/modules/analytics/loader.ts',
  'client/src/modules/analytics/track.ts',
  'client/src/modules/analytics/spa.ts',
  'client/src/modules/analytics/delegation.ts',
  'client/src/modules/leads/form.tsx',
  'client/src/modules/calculator/CalculatorForm.tsx',
  'client/src/components/widgets/CTABlock.tsx',
  'client/src/pages/NewsArticle.tsx',
  '.env.example',
  'replit.md'
];

async function syncFile(octokit: Octokit, filePath: string, branch: string = 'main') {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Skip: ${filePath} (not found)`);
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const contentBase64 = Buffer.from(content).toString('base64');

    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: filePath,
        ref: branch
      });
      if ('sha' in data) {
        sha = data.sha;
      }
    } catch (e: any) {
      if (e.status !== 404) throw e;
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: `sync: update ${filePath} from Replit`,
      content: contentBase64,
      sha,
      branch
    });

    console.log(`Synced: ${filePath}`);
  } catch (error: any) {
    console.error(`Error syncing ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('Starting GitHub sync...');
  
  const octokit = await getGitHubClient();
  console.log('Connected to GitHub');

  for (const file of FILES_TO_SYNC) {
    await syncFile(octokit, file);
  }

  console.log('Sync complete!');
}

main().catch(console.error);
