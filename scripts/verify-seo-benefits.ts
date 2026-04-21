
import { loadAllSEOData } from '../server/services/seo-service';

async function verify() {
    console.log("Loading SEO Data...");
    const data = await loadAllSEOData();

    // Pick a few cities to compare
    const cities = ['antikorrozionnaya-zaschita-ams-tula', 'antikorrozionnaya-zaschita-ams-ryazan', 'antikorrozionnaya-zaschita-ams-tver', 'antikorrozionnaya-zaschita-ams-kaluga', 'antikorrozionnaya-zaschita-ams-vladimir'];

    const pages = data.filter(p => cities.includes(p.slug));

    if (pages.length === 0) {
        console.error("No pages found for verification cities.");
        return;
    }

    console.log(`\nAnalyzing ${pages.length} pages for uniqueness...\n`);

    for (const page of pages) {
        console.log(`\n--- [${page.region}] (${page.slug}) ---`);

        // Check Benefits
        if (page.benefits && page.benefits.length > 0) {
            console.log(`✅ Benefits Set (${page.benefits.length} items): "${page.benefits[0]}" ...`);
        } else {
            console.error(`❌ NO Benefits found!`);
        }

        // Check FAQ Injection & Variation
        if (page.faq && page.faq.length > 0) {
            const firstQ = page.faq[0];
            console.log(`✅ FAQ Q1: "${firstQ.question}"`);
            console.log(`✅ FAQ A1: "${firstQ.answer.substring(0, 50)}..."`);

            // Check for city name injection
            const combinedText = JSON.stringify(page.faq);
            if (combinedText.includes(page.region || "FAIL")) {
                console.log(`✅ City Name Injection Detected: "${page.region}" found in FAQ.`);
            } else {
                // Some templates might not have {{CITY}} in the first Q/A, check all
                console.warn(`⚠️ City Name "${page.region}" NOT found in FAQ text (might be in other questions).`);
            }

        } else {
            console.error(`❌ NO FAQ found!`);
        }
    }
}

verify().catch(console.error);
