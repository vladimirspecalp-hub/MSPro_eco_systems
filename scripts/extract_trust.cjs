
const fs = require('fs');
const path = require('path');

const seoCorePath = path.resolve('content', 'seo_core.json');
const outputPath = path.resolve('content', 'trust_signals.json');

try {
    const data = fs.readFileSync(seoCorePath, 'utf-8');
    const seoItems = JSON.parse(data);

    const signals = {
        licenses: new Set(),
        certificates: new Set(),
        guarantees: new Set(),
        standards: new Set(),
    };

    const traverse = (obj) => {
        if (!obj) return;
        if (typeof obj === 'string') {
            // Licenses / SRO: e.g., 63-06-2023-003418, Л014-..., СРО-С-..., №1623
            const licenseMatches = obj.match(/(\d{2}-\d{2}-\d{4}-\d{6}|Л\d{3}-\d{5}-\d{2}\/\d{8}|СРО-[А-Я]-\d{3}-\d{8})/g);
            if (licenseMatches) licenseMatches.forEach(m => signals.licenses.add(m));

            // Guarantees: "гарантия ... лет", "20 лет"
            if (/гаранти[а-я]*\s+(до\s+)?20\s+лет/i.test(obj)) {
                signals.guarantees.add("Гарантия 20 лет на покрытие MSPRO Quad");
            }
            if (/гаранти[а-я]*\s+(до\s+)?5\s+лет/i.test(obj)) {
                signals.guarantees.add("Гарантия 5 лет на выполненные работы");
            }

            // Standards: ГОСТ, СНиП
            const gostMatches = obj.match(/(ГОСТ\s+[\d\.-]+|СНиП\s+[\d\.-]+)/g);
            if (gostMatches) gostMatches.forEach(m => signals.standards.add(m));

        } else if (typeof obj === 'object') {
            Object.values(obj).forEach(val => traverse(val));
        }
    };

    traverse(seoItems);

    const result = {
        licenses: Array.from(signals.licenses),
        certificates: Array.from(signals.certificates),
        guarantees: Array.from(signals.guarantees),
        standards: Array.from(signals.standards),
        extractionDate: new Date().toISOString()
    };

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('Trust signals extracted successfully to', outputPath);

} catch (error) {
    console.error('Error extracting trust signals:', error);
}
