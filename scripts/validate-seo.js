import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seoFiles = [
  'seo_core.json',
  'seo_core_part2.json',
  'seo_core_part3.json',
  'seo_core_part4.json',
  'seo_core_part5.json'
];

const requiredFields = ['slug', 'title', 'description', 'keywords', 'h1', 'region'];

console.log('🔍 Валидация всех SEO файлов...\n');

let totalRecords = 0;
let totalValid = 0;
let totalErrors = 0;

seoFiles.forEach(fileName => {
  const filePath = path.resolve(__dirname, '../content', fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Файл ${fileName} не найден, пропускаем...\n`);
    return;
  }

  const seoData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  console.log(`📄 ${fileName}: ${seoData.length} записей`);
  
  let fileValid = 0;
  let fileErrors = 0;

  seoData.forEach((entry, index) => {
    const missing = [];
    
    requiredFields.forEach(field => {
      if (!entry[field] || (Array.isArray(entry[field]) && entry[field].length === 0)) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      fileErrors++;
      console.log(`   ⚠️ Запись #${index + 1} (slug: "${entry.slug || 'отсутствует'}"):`);
      console.log(`      Отсутствуют: ${missing.join(', ')}`);
    } else {
      fileValid++;
    }
  });

  totalRecords += seoData.length;
  totalValid += fileValid;
  totalErrors += fileErrors;
  
  console.log(`   ✅ Валидных: ${fileValid}`);
  if (fileErrors > 0) {
    console.log(`   ⚠️ С ошибками: ${fileErrors}`);
  }
  console.log('');
});

console.log(`\n═══════════════════════════════════════════════════`);
console.log(`📊 ОБЩИЕ РЕЗУЛЬТАТЫ:`);
console.log(`   📝 Всего записей: ${totalRecords}`);
console.log(`   ✅ Валидных: ${totalValid}`);
console.log(`   ⚠️ С ошибками: ${totalErrors}`);
console.log(`═══════════════════════════════════════════════════`);

if (totalErrors === 0) {
  console.log(`\n✅ УСПЕШНО! Все ${totalRecords} записей содержат обязательные поля.`);
  process.exit(0);
} else {
  console.log(`\n⚠️ ВНИМАНИЕ! Обнаружено ${totalErrors} записей с отсутствующими полями.`);
  process.exit(1);
}
