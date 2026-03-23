require('dotenv').config();
const axios = require('axios');

const PADLET_API_KEY = process.env.PADLET_API_KEY;
const PADLET_BOARD_ID = process.env.PADLET_BOARD_ID;

console.log('🔑 API Key:', PADLET_API_KEY ? 'Definida' : 'NO DEFINIDA');
console.log('📋 Board ID:', PADLET_BOARD_ID || 'NO DEFINIDO');

const endpoints = [
  `https://padlet.com/api/v2/boards/${PADLET_BOARD_ID}`,
  `https://padlet.com/api/v1/boards/${PADLET_BOARD_ID}`,
  `https://api.padlet.com/v1/boards/${PADLET_BOARD_ID}`,
  `https://padlet.com/api/boards/${PADLET_BOARD_ID}`,
  `https://padlet.com/api/boards/${PADLET_BOARD_ID}/posts`,
  `https://padlet.com/api/v2/boards/${PADLET_BOARD_ID}/posts`
];

async function testEndpoints() {
  console.log('\n🔍 Probando endpoints...\n');
  
  for (const url of endpoints) {
    try {
      console.log(`📡 Probando: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${PADLET_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      console.log('✅ ÉXITO! Status:', response.status);
      console.log('📦 Datos (primeros 500 caracteres):');
      console.log(JSON.stringify(response.data, null, 2).substring(0, 500));
      console.log('\n' + '='.repeat(50));
      return;
    } catch (error) {
      if (error.response) {
        console.log(`❌ Status: ${error.response.status}`);
      } else if (error.request) {
        console.log(`❌ No hubo respuesta`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
      console.log('-'.repeat(50));
    }
  }
  console.log('\n⚠️ Ningún endpoint funcionó.');
}

testEndpoints();