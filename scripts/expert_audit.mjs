
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function runAudit() {
    console.log('🚀 Starting Expert Tier Audit (JS Mode)...');
    const results = [];

    // 0. Robots & Sitemap
    try {
        const resRobots = await fetch(`${BASE_URL}/robots.txt`);
        const resSitemap = await fetch(`${BASE_URL}/sitemap.xml`);

        let score = 10;
        if (resRobots.status !== 200) score -= 5;
        if (resSitemap.status !== 200) score -= 5;

        results.push({
            name: 'Crawling Accessibility',
            score,
            details: `robots.txt: ${resRobots.status}, sitemap.xml: ${resSitemap.status}`,
            status: score === 10 ? 'PASS' : 'WARN'
        });
    } catch (e) {
        results.push({ name: 'Crawling Accessibility', score: 0, details: `Failed: ${e.message}`, status: 'FAIL' });
    }

    // 1. SSR Performance & Meta Injection
    try {
        const start = performance.now();
        const res = await fetch(`${BASE_URL}/`);
        const duration = performance.now() - start;
        const html = await res.text();

        const hasTitle = html.includes('<title>');
        const hasDesc = html.includes('<meta name="description"');
        const hasJsonLd = html.includes('application/ld+json');

        let score = 10;
        if (duration > 300) score -= 2;
        if (!hasTitle || !hasDesc || !hasJsonLd) score = 0;

        results.push({
            name: 'SSR Performance & Injection',
            score,
            details: `TTFB: ${duration.toFixed(2)}ms. Title: ${hasTitle}, Desc: ${hasDesc}, JSON-LD: ${hasJsonLd}`,
            status: score > 8 ? 'PASS' : 'WARN'
        });
    } catch (e) {
        results.push({ name: 'SSR Performance', score: 0, details: `Failed: ${e.message}`, status: 'FAIL' });
    }

    // 2. /documents Routing Fix
    try {
        const res = await fetch(`${BASE_URL}/documents`, { redirect: 'manual' });
        // Response checks
        const is200 = res.status === 200;
        const isHtml = res.headers.get('content-type')?.includes('text/html');

        results.push({
            name: '/documents Routing',
            score: is200 && isHtml ? 10 : 0,
            details: `Status: ${res.status}, Type: ${res.headers.get('content-type')}`,
            status: is200 && isHtml ? 'PASS' : 'FAIL'
        });
    } catch (e) {
        results.push({ name: '/documents Routing', score: 0, details: `Failed: ${e.message}`, status: 'FAIL' });
    }

    // 3. Security: Path Traversal
    try {
        const res = await fetch(`${BASE_URL}/documents/../package.json`);
        // Should catch-all or fail, NOT return package.json content (which would be JSON)
        // If it renders index.html (SSR), that's fine (200 OK HTML).
        // If it sends package.json file (application/json), that's BAD.

        const contentType = res.headers.get('content-type') || '';
        const isJsonFile = contentType.includes('application/json');

        const score = !isJsonFile ? 10 : 0;
        results.push({
            name: 'Security: Path Traversal',
            score,
            details: `Path /documents/../package.json -> Type: ${contentType}`,
            status: score === 10 ? 'PASS' : 'FAIL'
        });
    } catch (e) {
        results.push({ name: 'Security Check', score: 10, details: `Correctly blocked/failed: ${e.message}`, status: 'PASS' });
    }

    // 4. Meta Tag Deduplication (Top Tier Clean-up)
    try {
        const res = await fetch(`${BASE_URL}/faq`);
        const html = await res.text();

        // Count titles
        const titleCount = (html.match(/<title>/g) || []).length;
        const paramDescCount = (html.match(/<meta name="description"/g) || []).length;

        let score = 10;
        if (titleCount > 1) score -= 5;
        if (paramDescCount > 1) score -= 5;

        results.push({
            name: 'Meta Tag De-duplication',
            score,
            details: `Titles: ${titleCount}, Descriptions: ${paramDescCount}`,
            status: score === 10 ? 'PASS' : 'FAIL'
        });
    } catch (e) {
        results.push({ name: 'Meta Hygiene', score: 0, details: `Failed: ${e.message}`, status: 'FAIL' });
    }

    // 5. Schema Validation (Basic Parse)
    try {
        const res = await fetch(`${BASE_URL}/services/pokraska-dymovyh-trub-norilsk`);
        const html = await res.text();
        const scripts = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

        let validSchemas = 0;
        if (scripts) {
            for (const s of scripts) {
                const json = s.replace('<script type="application/ld+json">', '').replace('</script>', '');
                try {
                    JSON.parse(json);
                    validSchemas++;
                } catch (e) {
                    console.error('Invalid JSON-LD:', json);
                }
            }
        }

        results.push({
            name: 'Schema Validation',
            score: validSchemas >= 3 ? 10 : 5,
            details: `Found ${validSchemas} valid JSON-LD blocks on Service page (Expected >= 3)`,
            status: validSchemas >= 3 ? 'PASS' : 'WARN'
        });

    } catch (e) {
        results.push({ name: 'Schema Validation', score: 0, details: `Failed: ${e.message}`, status: 'FAIL' });
    }

    // Report Generation
    console.log('\n=== EXPERT AUDIT REPORT ===');
    console.table(results);

    const totalScore = results.reduce((acc, r) => acc + r.score, 0);
    const maxScore = results.length * 10;
    const finalPercent = (totalScore / maxScore) * 100;

    console.log(`\nFINAL SCORE: ${finalPercent.toFixed(1)}%`);

    // Identify gaps
    console.log('\n=== GAPS & IMPROVEMENTS ===');
    results.filter(r => r.score < 10).forEach(r => {
        console.log(`[${r.name}] ${r.details}`);
    });
}

runAudit();
