const { GoogleGenerativeAI } = require('@google/generative-ai');

// Verificar API key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está configurada en .env');
}

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Lista de modelos disponibles según tu API (de más nuevo a más estable)
const MODELS_TO_TRY = [
  'gemini-2.5-flash',      // Más nuevo y rápido
  'gemini-2.0-flash',      // Estable y rápido
  'gemini-2.0-flash-001',  // Versión estable anterior
  'gemini-2.5-pro',        // Más potente pero más lento
  'gemini-2.0-flash-lite'  // Versión ligera
];

// Función para probar modelos hasta encontrar uno que funcione
async function tryModels(prompt, res, modelType = 'generate') {
  let lastError = null;
  
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Intentando con modelo: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ Éxito con modelo: ${modelName}`);
      return { success: true, text, modelUsed: modelName };
    } catch (error) {
      console.log(`❌ Falló ${modelName}:`, error.message);
      lastError = error;
    }
  }
  
  throw lastError || new Error('No hay modelos disponibles');
}

// Página principal
exports.getIndex = (req, res) => {
  res.render('gemini', { 
    title: 'IA - Google Gemini',
    error: null 
  });
};

// Generar texto
exports.generateText = async (req, res) => {
  console.log('📝 Recibida solicitud de generación de texto');
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ 
      success: false, 
      error: 'Se requiere un prompt' 
    });
  }

  console.log('📝 Prompt:', prompt);

  try {
    const result = await tryModels(prompt, res, 'generate');
    
    res.json({
      success: true,
      generated_text: result.text,
      model_used: result.modelUsed
    });
  } catch (error) {
    console.error('❌ Error en Gemini generateText:', error);
    
    let errorMessage = 'No se pudo generar texto. ';
    
    if (error.message.includes('API key')) {
      errorMessage += 'Tu API key no es válida.';
    } else if (error.message.includes('quota')) {
      errorMessage += 'Has excedido la cuota gratuita.';
    } else {
      errorMessage += error.message;
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.message
    });
  }
};

// Análisis de sentimiento
exports.analyzeSentiment = async (req, res) => {
  console.log('📝 Recibida solicitud de análisis de sentimiento');
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ 
      success: false, 
      error: 'Se requiere un texto para analizar' 
    });
  }

  console.log('📝 Texto a analizar:', text);

  try {
    const prompt = `Analiza el sentimiento del siguiente texto. Responde SOLO en este formato JSON:
{
  "sentiment": "POSITIVE o NEGATIVE o NEUTRAL",
  "confidence": 0-100,
  "explanation": "breve explicación"
}

Texto: "${text}"`;

    const result = await tryModels(prompt, res, 'analyze');
    
    let analysis;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = {
          sentiment: result.text.includes('POSITIVE') ? 'POSITIVE' : 
                     result.text.includes('NEGATIVE') ? 'NEGATIVE' : 'NEUTRAL',
          confidence: 50,
          explanation: result.text
        };
      }
    } catch (parseError) {
      analysis = {
        sentiment: 'NEUTRAL',
        confidence: 50,
        explanation: result.text
      };
    }

    res.json({
      success: true,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      explanation: analysis.explanation,
      score: analysis.confidence / 100,
      model_used: result.modelUsed
    });
  } catch (error) {
    console.error('❌ Error en análisis de sentimiento:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Resumen de texto
exports.summarize = async (req, res) => {
  console.log('📝 Recibida solicitud de resumen');
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ 
      success: false, 
      error: 'Se requiere un texto para resumir' 
    });
  }

  console.log('📝 Texto a resumir, longitud:', text.length);

  try {
    const prompt = `Resume el siguiente texto en 3 oraciones máximo. Sé conciso y mantén la información clave:

${text}`;

    const result = await tryModels(prompt, res, 'summarize');

    res.json({
      success: true,
      summary: result.text.trim(),
      original_length: text.length,
      summary_length: result.text.length,
      model_used: result.modelUsed
    });
  } catch (error) {
    console.error('❌ Error en resumen:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Chat interactivo
exports.chat = async (req, res) => {
  console.log('📝 Recibida solicitud de chat');
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Se requiere un mensaje' 
    });
  }

  console.log('📝 Mensaje:', message);

  try {
    // Para chat, usamos el primer modelo disponible
    const modelName = MODELS_TO_TRY[0];
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const reply = response.text();

    res.json({
      success: true,
      reply: reply,
      model_used: modelName,
      history: [
        ...history,
        { role: 'user', content: message },
        { role: 'model', content: reply }
      ]
    });
  } catch (error) {
    console.error('❌ Error en chat:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};