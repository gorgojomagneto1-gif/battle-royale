const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

fs.copyFileSync('index.html', path.join(distDir, 'index.html'));
fs.copyFileSync('styles.css', path.join(distDir, 'styles.css'));
fs.copyFileSync('app.js', path.join(distDir, 'app.js'));

const publicDir = path.join(distDir, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

fs.readdirSync('public').forEach(file => {
  fs.copyFileSync(path.join('public', file), path.join(publicDir, file));
});

console.log('✓ Build completado en /dist');
