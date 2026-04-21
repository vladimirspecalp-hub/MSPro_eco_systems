import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';

const html = fs.readFileSync('dist/public/_index.html', 'utf8');
const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);

const dom = new JSDOM(html, {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable',
  virtualConsole
});

dom.window.addEventListener('error', (event) => {
  console.error('JSDOM ERROR:', event.error);
});

setTimeout(() => {
  console.log("Root innerHTML length:", dom.window.document.getElementById('root').innerHTML.length);
  process.exit(0);
}, 5000);
