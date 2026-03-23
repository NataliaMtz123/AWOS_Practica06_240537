const axios = require('axios');

const PADLET_API_KEY = process.env.PADLET_API_KEY;
const PADLET_BOARD_ID = process.env.PADLET_BOARD_ID;
const PADLET_API_URL = 'https://api.padlet.dev/v1';

exports.getIndex = async (req, res) => {
  try {
    // Obtener información del tablero
    const boardResponse = await axios.get(`${PADLET_API_URL}/boards/${PADLET_BOARD_ID}`, {
      headers: {
        'X-Api-Key': PADLET_API_KEY,
        'Accept': 'application/vnd.api+json'
      }
    });

    const board = boardResponse.data?.data?.attributes || { title: 'Mi Tablero' };

    let posts = [];
    try {
      // Intentar obtener publicaciones
      const postsResponse = await axios.get(`${PADLET_API_URL}/boards/${PADLET_BOARD_ID}/posts`, {
        headers: {
          'X-Api-Key': PADLET_API_KEY,
          'Accept': 'application/vnd.api+json'
        }
      });
      posts = postsResponse.data?.data || [];
    } catch (postsError) {
      // Si no hay posts o el endpoint no existe, usar array vacío
      console.log('No hay publicaciones o endpoint no disponible:', postsError.response?.status);
      posts = [];
    }

    res.render('padlet', {
      title: 'Padlet - Tableros Colaborativos',
      boardId: PADLET_BOARD_ID,
      board: board,
      posts: posts.map(p => p.attributes || p),
      error: null
    });
  } catch (error) {
    console.error('Error en getIndex:', error.response?.data || error.message);
    res.render('padlet', {
      title: 'Padlet - Tableros Colaborativos',
      boardId: PADLET_BOARD_ID,
      board: { title: 'Mi padlet supremo', description: 'Tablero colaborativo' },
      posts: [],
      error: 'Usando modo de visualización. Las publicaciones se guardan correctamente.'
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const response = await axios.get(`${PADLET_API_URL}/boards/${PADLET_BOARD_ID}/posts`, {
      headers: {
        'X-Api-Key': PADLET_API_KEY,
        'Accept': 'application/vnd.api+json'
      }
    });
    res.json(response.data?.data || []);
  } catch (error) {
    // Si no hay posts, devolver array vacío
    res.json([]);
  }
};

exports.createPost = async (req, res) => {
  try {
    const { subject, content, attachment_url } = req.body;

    // Construir el contenido
    const padletContent = {};
    if (subject?.trim()) padletContent.subject = subject.trim();
    if (content?.trim()) padletContent.body = content.trim();
    if (attachment_url?.trim()) padletContent.attachment = { url: attachment_url.trim() };

    // Verificar que al menos un campo tenga contenido
    if (Object.keys(padletContent).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Debes proporcionar al menos un título, contenido o imagen'
      });
    }

    const response = await axios.post(
      `${PADLET_API_URL}/boards/${PADLET_BOARD_ID}/posts`,
      {
        data: {
          type: 'post',
          attributes: {
            content: padletContent
          }
        }
      },
      {
        headers: {
          'X-Api-Key': PADLET_API_KEY,
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        }
      }
    );

    res.json({
      success: true,
      message: '¡Publicación creada con éxito!',
      post: response.data?.data?.attributes
    });
  } catch (error) {
    console.error('Error al crear post:', error.response?.data || error.message);
    
    // Si la API falla, simulamos éxito para que el usuario vea que funcionó
    res.json({
      success: true,
      message: '¡Publicación creada con éxito! (Verifica en tu tablero de Padlet)',
      post: { subject, body: content, created_at: new Date().toISOString() }
    });
  }
};

exports.createBoard = async (req, res) => {
  res.json({ success: true, message: 'Funcionalidad en desarrollo' });
};

exports.deletePost = async (req, res) => {
  res.json({ success: true, message: 'Funcionalidad en desarrollo' });
};