const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini con tu API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getIndex = (req, res) => {
  res.render('gemini', { title: 'IA - Google Gemini' });
};

// Generar texto
exports.generateText = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Se requiere un prompt' });
  }

  try {
    // Usar modelo gemini-2.0-flash (estable y rápido)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      generated_text: text
    });
  } catch (error) {
    console.error('Error en Gemini:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Análisis de sentimiento
exports.analyzeSentiment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Se requiere un texto' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Analiza el sentimiento del siguiente texto y responde SOLO con una de estas opciones: POSITIVE, NEGATIVE, NEUTRAL. También incluye un porcentaje de confianza del 0 al 100.
    
Texto: "${text}"

Formato de respuesta: SENTIMIENTO: [POSITIVE/NEGATIVE/NEUTRAL], CONFIANZA: [0-100]%`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    // Extraer sentimiento y confianza
    let sentiment = 'NEUTRAL';
    let score = 0.5;

    if (analysis.includes('POSITIVE')) sentiment = 'POSITIVE';
    else if (analysis.includes('NEGATIVE')) sentiment = 'NEGATIVE';
    
    const confidenceMatch = analysis.match(/CONFIANZA:\s*(\d+)/i);
    if (confidenceMatch) score = parseInt(confidenceMatch[1]) / 100;

    res.json({
      success: true,
      sentiment: sentiment,
      score: score,
      analysis: analysis
    });
  } catch (error) {
    console.error('Error en análisis:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Resumen de texto
exports.summarize = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Se requiere un texto' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Resume el siguiente texto de forma concisa (máximo 3 oraciones):

${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({
      success: true,
      summary: summary
    });
  } catch (error) {
    console.error('Error en resumen:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};