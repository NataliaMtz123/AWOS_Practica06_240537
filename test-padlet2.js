require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.PADLET_API_KEY;
const BOARD_ID = process.env.PADLET_BOARD_ID;

console.log('🔑 API Key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NO');
console.log('📋 Board ID:', BOARD_ID || 'NO');

async function test() {
  try {
    const response = await axios.get(`https://api.padlet.dev/v1/boards/${BOARD_ID}`, {
      headers: {
        'X-Api-Key': API_KEY,
        'Accept': 'application/vnd.api+json'
      }
    });
    console.log('✅ ÉXITO!');
    console.log('Tablero:', response.data?.data?.attributes?.title);
  } catch (error) {
    console.log('❌ Error:', error.response?.status);
    console.log('Detalle:', error.response?.data);
  }
}

test();