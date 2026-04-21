
import { build } from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const dependencies = Object.keys(packageJson.dependencies || {});
const peerDependencies = Object.keys(packageJson.peerDependencies || {});

console.log('Starting custom server build (v6) with dynamic externals...');

try {
    await build({
        entryPoints: ['server/index.ts'],
        bundle: true,
        platform: 'node',
        format: 'esm',
        outdir: 'dist',
        // Mark all dependencies as external so they are not bundled
        external: [
            ...dependencies,
            ...peerDependencies,
            '@babel/*',
            // Node.js built-ins are automatically handled by platform: 'node', but explicit is fine
        ],
        target: 'node20',
        logLevel: 'info',
        alias: {
            '@shared': path.resolve(__dirname, 'shared'),
        },
        // Ensure sourcemaps are generated for easier debugging
        sourcemap: true,
    });
    console.log('Server build completed successfully.');
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}
