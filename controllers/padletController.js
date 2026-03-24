const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración de Padlet
const PADLET_API_KEY = process.env.PADLET_API_KEY;
const PADLET_BOARD_ID = process.env.PADLET_BOARD_ID;
const PADLET_API_URL = 'https://padlet.com/api/1.0';

// Archivo para guardar publicaciones localmente
const POSTS_FILE = path.join(__dirname, '../data/padlet-posts.json');

// Asegurar que existe el directorio data
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'));
}

// Función para leer publicaciones guardadas localmente
function getLocalPosts() {
  try {
    if (fs.existsSync(POSTS_FILE)) {
      const data = fs.readFileSync(POSTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error leyendo publicaciones locales:', error);
  }
  return [];
}

// Función para guardar publicación localmente
function saveLocalPost(post) {
  try {
    const posts = getLocalPosts();
    posts.unshift({
      ...post,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      is_local: true
    });
    // Mantener solo las últimas 100 publicaciones
    const limitedPosts = posts.slice(0, 100);
    fs.writeFileSync(POSTS_FILE, JSON.stringify(limitedPosts, null, 2));
    return true;
  } catch (error) {
    console.error('Error guardando publicación local:', error);
    return false;
  }
}

// Página principal del tablero
exports.getIndex = async (req, res) => {
  try {
    const localPosts = getLocalPosts();
    
    res.render('padlet', {
      title: 'Padlet - Tablero Colaborativo',
      boardId: PADLET_BOARD_ID,
      board: { 
        title: 'Mi Tablero Padlet', 
        description: 'Tablero colaborativo',
        id: PADLET_BOARD_ID
      },
      posts: localPosts,
      error: null
    });
  } catch (error) {
    console.error('Error en getIndex:', error.message);
    res.render('padlet', {
      title: 'Padlet - Tablero Colaborativo',
      boardId: PADLET_BOARD_ID,
      board: { title: 'Mi Tablero Padlet', description: 'Tablero colaborativo' },
      posts: [],
      error: 'Error al cargar el tablero.'
    });
  }
};

// Obtener todas las publicaciones
exports.getPosts = async (req, res) => {
  try {
    const localPosts = getLocalPosts();
    res.json({
      success: true,
      posts: localPosts
    });
  } catch (error) {
    console.error('Error al obtener posts:', error.message);
    res.json({
      success: false,
      posts: [],
      error: error.message
    });
  }
};

// Crear nueva publicación
exports.createPost = async (req, res) => {
  try {
    const { subject, content, attachment_url } = req.body;
    
    console.log('📝 Creando nueva publicación:');
    console.log('   Título:', subject);
    console.log('   Contenido:', content);
    console.log('   Imagen:', attachment_url);

    if (!subject?.trim() && !content?.trim() && !attachment_url?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Debes proporcionar al menos un título, contenido o imagen'
      });
    }

    // Crear objeto de publicación
    const newPost = {
      title: subject?.trim() || 'Sin título',
      body: content?.trim() || '',
      attachment: attachment_url?.trim() || null,
      board_id: PADLET_BOARD_ID,
      created_at: new Date().toISOString()
    };

    // Intentar enviar a Padlet API (puede fallar)
    let padletResponse = null;
    try {
      console.log('Intentando enviar a Padlet API...');
      const response = await axios.post(
        `${PADLET_API_URL}/boards/${PADLET_BOARD_ID}/posts`,
        {
          title: newPost.title,
          body: newPost.body,
          attachment: newPost.attachment
        },
        {
          headers: {
            'Authorization': `Bearer ${PADLET_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
      padletResponse = response.data;
      console.log('✅ Publicación enviada a Padlet API');
    } catch (apiError) {
      console.log('⚠️ No se pudo enviar a Padlet API, guardando localmente');
      console.log('Error:', apiError.response?.data || apiError.message);
    }

    // Guardar publicación localmente (siempre)
    const saved = saveLocalPost(newPost);
    
    if (saved) {
      const padletUrl = `https://padlet.com/embed/${PADLET_BOARD_ID}`;
      
      res.json({
        success: true,
        message: padletResponse 
          ? '✅ Publicación creada en Padlet y guardada localmente!' 
          : '✅ Publicación guardada localmente. Abre el tablero de Padlet para verla.',
        post: {
          ...newPost,
          id: Date.now().toString(),
          view_link: padletUrl
        },
        padlet_response: padletResponse
      });
    } else {
      throw new Error('No se pudo guardar la publicación');
    }
  } catch (error) {
    console.error('❌ Error al crear publicación:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener publicación específica
exports.getPost = async (req, res) => {
  const { postId } = req.params;
  const localPosts = getLocalPosts();
  const post = localPosts.find(p => p.id === postId);
  
  if (post) {
    res.json({ success: true, post });
  } else {
    res.status(404).json({ success: false, error: 'Publicación no encontrada' });
  }
};

// Actualizar publicación
exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { subject, content, attachment_url } = req.body;
  
  try {
    const localPosts = getLocalPosts();
    const postIndex = localPosts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({ success: false, error: 'Publicación no encontrada' });
    }
    
    localPosts[postIndex] = {
      ...localPosts[postIndex],
      title: subject || localPosts[postIndex].title,
      body: content || localPosts[postIndex].body,
      attachment: attachment_url || localPosts[postIndex].attachment,
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(POSTS_FILE, JSON.stringify(localPosts, null, 2));
    
    res.json({
      success: true,
      message: 'Publicación actualizada con éxito',
      post: localPosts[postIndex]
    });
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar publicación
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  
  try {
    const localPosts = getLocalPosts();
    const filteredPosts = localPosts.filter(p => p.id !== postId);
    
    fs.writeFileSync(POSTS_FILE, JSON.stringify(filteredPosts, null, 2));
    
    res.json({
      success: true,
      message: 'Publicación eliminada con éxito'
    });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener estadísticas
exports.getBoardStats = async (req, res) => {
  try {
    const localPosts = getLocalPosts();
    res.json({
      success: true,
      stats: {
        total_posts: localPosts.length,
        board_url: `https://padlet.com/embed/${PADLET_BOARD_ID}`,
        last_updated: new Date().toISOString(),
        board_id: PADLET_BOARD_ID,
        local_mode: true
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    res.json({
      success: false,
      stats: {
        total_posts: 0,
        error: error.message
      }
    });
  }
};