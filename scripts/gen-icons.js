const sharp = require('sharp')
const path = require('path')

const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192">
  <rect width="192" height="192" rx="40" fill="#4E7B5E"/>
  <text x="96" y="130" font-family="Georgia,serif" font-size="100" text-anchor="middle" fill="white">С</text>
</svg>`

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" rx="100" fill="#4E7B5E"/>
  <text x="256" y="350" font-family="Georgia,serif" font-size="270" text-anchor="middle" fill="white">С</text>
</svg>`

const out = path.join(__dirname, '../public')

sharp(Buffer.from(svg192)).png().toFile(path.join(out, 'icon-192.png'), (e) => {
  if (e) console.error('192:', e.message); else console.log('icon-192.png OK')
})
sharp(Buffer.from(svg512)).png().toFile(path.join(out, 'icon-512.png'), (e) => {
  if (e) console.error('512:', e.message); else console.log('icon-512.png OK')
})
