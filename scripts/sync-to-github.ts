import { Octokit } from '@octokit/rest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const REPO_OWNER = 'vladimirspecalp-hub';
const REPO_NAME = 'MSPro_eco_systems';

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

const filesToSync = [
  'client/src/components/layouts/MainLayout.tsx',
  'client/src/components/layouts/PageLayout.tsx',
  'client/src/components/widgets/CTABlock.tsx',
  'client/src/components/widgets/ReviewCard.tsx',
  'client/src/pages/services/ServicePage.tsx',
  'client/src/modules/geo/index.ts',
  'client/src/modules/seo/index.ts',
  'client/src/modules/crm/index.ts',
  'client/src/lib/telegramApi.ts',
  'client/src/lib/seo.ts',
  'server/crm-handler.ts',
  'server/telegram-handler.ts',
  'server/storage.ts',
  'shared/types.ts',
  'shared/schema.ts',
  'brand/BrandBook.md',
  'brand/BrandTokens.json',
  'brand/CreatedByLogaster/README.md',
];

async function syncFiles() {
  try {
    console.log('Starting GitHub sync...');

    const { data: ref } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: 'heads/main',
    });

    const commitSha = ref.object.sha;
    console.log('Current commit SHA:', commitSha);

    const { data: commit } = await octokit.git.getCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      commit_sha: commitSha,
    });

    const baseTreeSha = commit.tree.sha;

    const tree = await Promise.all(
      filesToSync.map(async (filePath) => {
        try {
          const content = readFileSync(filePath, 'utf8');
          const blob = await octokit.git.createBlob({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            content: Buffer.from(content).toString('base64'),
            encoding: 'base64',
          });

          return {
            path: filePath,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blob.data.sha,
          };
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
          return null;
        }
      })
    );

    const validTree = tree.filter(Boolean);

    const { data: newTree } = await octokit.git.createTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      base_tree: baseTreeSha,
      tree: validTree as any,
    });

    const { data: newCommit } = await octokit.git.createCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      message: 'feat: Add core architecture files - layouts, widgets, modules, handlers',
      tree: newTree.sha,
      parents: [commitSha],
    });

    await octokit.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: 'heads/main',
      sha: newCommit.sha,
    });

    console.log('✅ Successfully synced to GitHub');
    console.log('Commit URL:', `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${newCommit.sha}`);
  } catch (error) {
    console.error('❌ GitHub sync failed:', error);
    throw error;
  }
}

syncFiles();
