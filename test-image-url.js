// Test if the Cultural Triangle image URL is accessible
const https = require('https');

const imageUrl = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80';

console.log('Testing image URL accessibility...');
console.log('URL:', imageUrl);

https.get(imageUrl, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
});