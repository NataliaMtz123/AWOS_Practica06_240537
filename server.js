const express = require('express');
const path = require('path');
require('dotenv').config();

// Verificar que las variables se cargaron correctamente
console.log('\n🔧 Variables de entorno cargadas:');
console.log('MP_ACCESS_TOKEN:', process.env.MP_ACCESS_TOKEN ? '✓ Configurado' : '✗ No configurado');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Configurado' : '✗ No configurado');
console.log('PADLET_API_KEY:', process.env.PADLET_API_KEY ? '✓ Configurado' : '✗ No configurado');
console.log('PADLET_BOARD_ID:', process.env.PADLET_BOARD_ID ? '✓ Configurado' : '✗ No configurado');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Página principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Demo - Todas las APIs</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: white; text-align: center; margin-bottom: 20px; font-size: 2.5em; }
        .subtitle { text-align: center; color: rgba(255,255,255,0.9); margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
        .card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: transform 0.3s; }
        .card:hover { transform: translateY(-5px); }
        .card h2 { color: #667eea; margin-bottom: 15px; font-size: 1.5em; }
        .card p { color: #666; margin-bottom: 20px; line-height: 1.6; }
        .card a { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; transition: all 0.3s; }
        .card a:hover { background: #5a67d8; transform: translateX(5px); }
        .status { margin-top: 40px; background: rgba(255,255,255,0.95); border-radius: 12px; padding: 20px; }
        .status h3 { color: #333; margin-bottom: 15px; }
        .status pre { background: #f7f7f7; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 API Demo - Integración Completa</h1>
        <div class="subtitle">Plataforma de pruebas para Google Gemini, Padlet y Mercado Pago</div>
        
        <div class="grid">
          <div class="card">
            <h2>🤖 Google Gemini AI</h2>
            <p>Generación de texto, análisis de sentimiento, resúmenes automáticos y chat interactivo con inteligencia artificial.</p>
            <a href="/ia">Acceder a Gemini →</a>
          </div>
          
          <div class="card">
            <h2>📌 Padlet</h2>
            <p>Tablero colaborativo para crear y gestionar publicaciones. Comparte ideas, imágenes y contenido multimedia.</p>
            <a href="/padlet">Acceder a Padlet →</a>
          </div>
          
          <div class="card">
            <h2>💰 Mercado Pago</h2>
            <p>Sistema de pagos integrado. Procesa transacciones de forma segura con la plataforma líder en Latinoamérica.</p>
            <a href="/pago">Probar Pagos →</a>
          </div>
        </div>
        
        <div class="status">
          <h3>Nombre de la alumna: Ingrid Natalia Martinez Carrasco</h3>
          <h3>Matricula de la alumna: 240537</h3>
          
      </div>
      
      <script>
        fetch('/api/status')
          .then(res => res.json())
          .then(data => {
            document.getElementById('status').innerHTML = JSON.stringify(data, null, 2);
          })
          .catch(err => {
            document.getElementById('status').innerHTML = 'Error cargando estado: ' + err.message;
          });
      </script>
    </body>
    </html>
  `);
});

// Endpoint de estado
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    apis: {
      gemini: {
        configured: !!process.env.GEMINI_API_KEY,
        endpoint: '/ia'
      },
      padlet: {
        configured: !!(process.env.PADLET_API_KEY && process.env.PADLET_BOARD_ID),
        endpoint: '/padlet'
      },
      mercadopago: {
        configured: !!process.env.MP_ACCESS_TOKEN,
        endpoint: '/pago'
      }
    }
  });
});

// Importar rutas
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');
const padletRoutes = require('./routes/padletRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

// Usar rutas
app.use('/', mercadoPagoRoutes);
app.use('/', padletRoutes);
app.use('/', geminiRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Página no encontrada</h1>
    <p>La página que buscas no existe.</p>
    <a href="/">Volver al inicio</a>
  `);
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).send(`
    <h1>Error del servidor</h1>
    <p>Ha ocurrido un error interno.</p>
    <pre>${err.message}</pre>
    <a href="/">Volver al inicio</a>
  `);
});
// ... después de app.use('/', geminiRoutes);

// Rutas de retorno de Mercado Pago
app.get('/success', (req, res) => {
  res.send('<h1>Pago Exitoso!</h1><p>Tu pago se ha procesado correctamente.</p><a href="/">Volver al inicio</a>');
});

app.get('/failure', (req, res) => {
  res.send('<h1>Pago Fallido</h1><p>Hubo un problema con tu pago.</p><a href="/pago">Intentar nuevamente</a>');
});

app.get('/pending', (req, res) => {
  res.send('<h1>Pago Pendiente</h1><p>Tu pago está siendo procesado.</p><a href="/">Volver al inicio</a>');
});


// Endpoint de prueba para Gemini
app.post('/test-gemini', async (req, res) => {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // Probar con gemini-pro
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Responde: "Hola, todo funciona correctamente"');
    const response = await result.response;
    const text = response.text();
    
    res.json({
      success: true,
      message: 'Gemini funciona correctamente con gemini-pro',
      response: text,
      model_used: 'gemini-pro'
    });
  } catch (error) {
    console.error('Error en prueba:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: 'Verifica que tu API key sea válida y que tengas acceso a Gemini API'
    });
  }
});
// Endpoint para verificar modelos disponibles
app.get('/check-models', async (req, res) => {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001'
  ];
  
  const results = {};
  
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Responde "OK"');
      const response = await result.response;
      results[modelName] = {
        success: true,
        response: response.text()
      };
    } catch (error) {
      results[modelName] = {
        success: false,
        error: error.message
      };
    }
  }
  
  res.json({
    api_key_configured: !!process.env.GEMINI_API_KEY,
    key_preview: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 15) + '...' : null,
    models_tested: results,
    available_models_from_api: [
      'gemini-2.5-flash',
      'gemini-2.5-pro', 
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-2.0-flash-lite'
    ],
    recommendation: 'Usando gemini-2.5-flash como modelo principal'
  });
});
// ... todo tu código anterior hasta app.listen

// Endpoint para probar la conexión con Padlet
app.get('/test-padlet', async (req, res) => {
  const axios = require('axios');
  const PADLET_API_KEY = process.env.PADLET_API_KEY;
  const PADLET_BOARD_ID = process.env.PADLET_BOARD_ID;
  
  const urlsToTest = [
    `https://padlet.com/api/v1/boards/${PADLET_BOARD_ID}`,
    `https://api.padlet.com/v1/boards/${PADLET_BOARD_ID}`,
    `https://padlet.com/api/boards/${PADLET_BOARD_ID}`,
    `https://padlet.com/boards/${PADLET_BOARD_ID}/posts`
  ];
  
  const results = {};
  
  for (const url of urlsToTest) {
    try {
      console.log(`Probando URL: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${PADLET_API_KEY}`,
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      results[url] = {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      results[url] = {
        success: false,
        status: error.response?.status,
        error: error.message
      };
    }
  }
  
  res.json({
    board_id: PADLET_BOARD_ID,
    api_key_configured: !!PADLET_API_KEY,
    tests: results,
    recommendation: 'Usa la URL que funcione correctamente'
  });
});
// Endpoint para verificar la configuración de Padlet
app.get('/verify-padlet', async (req, res) => {
  const axios = require('axios');
  const PADLET_API_KEY = process.env.PADLET_API_KEY;
  const PADLET_BOARD_ID = process.env.PADLET_BOARD_ID;
  
  // Diferentes formas de obtener información del tablero
  const tests = [];
  
  // Test 1: Usar la API con diferentes endpoints
  const endpoints = [
    `https://padlet.com/api/1.0/boards/${PADLET_BOARD_ID}`,
    `https://padlet.com/api/boards/${PADLET_BOARD_ID}`,
    `https://api.padlet.com/boards/${PADLET_BOARD_ID}`,
    `https://padlet.com/boards/${PADLET_BOARD_ID}.json`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Probando: ${endpoint}`);
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${PADLET_API_KEY}`,
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      tests.push({
        endpoint,
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      tests.push({
        endpoint,
        success: false,
        status: error.response?.status,
        error: error.message
      });
    }
  }
  
  res.json({
    board_id: PADLET_BOARD_ID,
    api_key: PADLET_API_KEY ? `${PADLET_API_KEY.substring(0, 15)}...` : 'no configurada',
    tests,
    instructions: {
      step1: 'Ve a https://padlet.com y abre tu tablero',
      step2: 'Copia el ID de la URL (ej: si la URL es https://padlet.com/usuario/mi-tablero, el ID es "mi-tablero")',
      step3: 'Actualiza PADLET_BOARD_ID en el archivo .env',
      step4: 'Reinicia el servidor'
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('\n📁 Rutas disponibles:');
  console.log(`   🏠 Home: http://localhost:${PORT}/`);
  console.log(`   🤖 Gemini: http://localhost:${PORT}/ia`);
  console.log(`   📌 Padlet: http://localhost:${PORT}/padlet`);
  console.log(`   💰 Mercado Pago: http://localhost:${PORT}/pago`);
  console.log(`   📊 Status: http://localhost:${PORT}/api/status\n`);
});

// NO agregues nada más después de esto