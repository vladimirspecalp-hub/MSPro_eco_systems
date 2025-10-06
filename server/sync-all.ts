import { Octokit } from '@octokit/rest';
import fs from 'fs';
import { execSync } from 'child_process';

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
    throw new Error('X_REPLIT_TOKEN not found');
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

async function getRepoInfo() {
  try {
    const gitConfig = fs.readFileSync('.git/config', 'utf8');
    const match = gitConfig.match(/url = .*github\.com[:/]([^/]+)\/([^/.]+)/);
    if (match) {
      return { owner: match[1], repo: match[2].replace('.git', '') };
    }
  } catch (e) {}
  return null;
}

async function syncAll() {
  try {
    const accessToken = await getAccessToken();
    const octokit = new Octokit({ auth: accessToken });

    const repoInfo = await getRepoInfo();
    if (!repoInfo) {
      console.log('❌ Не удалось получить информацию о репозитории');
      return;
    }

    const { owner, repo } = repoInfo;
    console.log(`📦 Репозиторий: ${owner}/${repo}`);

    // Получаем список измененных файлов
    const changedFiles = execSync('git diff --name-only HEAD', { encoding: 'utf8' })
      .split('\n')
      .filter(f => f.trim() && fs.existsSync(f));
    
    const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' })
      .split('\n')
      .filter(f => f.trim() && fs.existsSync(f));

    const allFiles = [...new Set([...changedFiles, ...untrackedFiles])];

    if (allFiles.length === 0) {
      console.log('✓ Нет файлов для синхронизации');
      return;
    }

    console.log(`\n📝 Файлов для отправки: ${allFiles.length}`);

    const { data: ref } = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    });

    const currentCommitSha = ref.object.sha;

    const blobs = [];
    for (const file of allFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: Buffer.from(content).toString('base64'),
          encoding: 'base64'
        });
        blobs.push({ path: file, sha: blob.sha, mode: '100644', type: 'blob' });
        console.log(`✓ ${file}`);
      } catch (e) {
        console.log(`✗ ${file} (ошибка чтения)`);
      }
    }

    if (blobs.length === 0) {
      console.log('✓ Нет валидных файлов для отправки');
      return;
    }

    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: currentCommitSha,
      tree: blobs
    });

    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: 'Sync all changes from Replit',
      tree: newTree.sha,
      parents: [currentCommitSha]
    });

    await octokit.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: newCommit.sha
    });

    console.log(`\n✅ Все изменения отправлены в GitHub!`);
    console.log(`🔗 Коммит: ${newCommit.sha.slice(0, 7)}`);
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
  }
}

syncAll();
