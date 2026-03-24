const axios = require('axios');

exports.getPagoPage = (req, res) => {
  res.render('pago', { 
    title: 'Pagar con Mercado Pago',
    publicKey: process.env.MP_PUBLIC_KEY || ''
  });
};

exports.crearPago = async (req, res) => {
  console.log('📝 Recibida solicitud de pago:', req.body);

  const { transaction_amount, description, email } = req.body;

  if (!transaction_amount || !description || !email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan datos requeridos' 
    });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  if (!accessToken) {
    console.error('❌ Token de Mercado Pago no encontrado');
    return res.status(500).json({ 
      success: false, 
      error: 'Token no configurado' 
    });
  }

  console.log('🔑 Token usado:', accessToken.substring(0, 20) + '...');
  console.log('🔗 Base URL:', baseUrl);

  try {
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items: [
          {
            title: description,
            quantity: 1,
            unit_price: Number(transaction_amount),
            currency_id: 'MXN'
          }
        ],
        payer: { email: email },
        back_urls: {
          success: `${baseUrl}/success`,
          failure: `${baseUrl}/failure`,
          pending: `${baseUrl}/pending`
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Preferencia creada:', response.data.id);
    
    res.json({
      success: true,
      paymentLink: response.data.init_point,
      preferenceId: response.data.id
    });

  } catch (error) {
    console.error('❌ Error en Mercado Pago:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
    });
  }
};

exports.getSuccess = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Pago Exitoso</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; border-radius: 10px; padding: 40px; max-width: 500px; margin: 0 auto; }
            h1 { color: #28a745; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✅ Pago Exitoso!</h1>
            <p>Tu pago se ha procesado correctamente.</p>
            <a href="/">Volver al inicio</a>
        </div>
    </body>
    </html>
  `);
};

exports.getFailure = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Pago Fallido</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; border-radius: 10px; padding: 40px; max-width: 500px; margin: 0 auto; }
            h1 { color: #dc3545; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>❌ Pago Fallido</h1>
            <p>Hubo un problema con tu pago. Por favor, intenta nuevamente.</p>
            <a href="/pago">Intentar nuevamente</a>
        </div>
    </body>
    </html>
  `);
};

exports.getPending = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Pago Pendiente</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; border-radius: 10px; padding: 40px; max-width: 500px; margin: 0 auto; }
            h1 { color: #ffc107; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⏳ Pago Pendiente</h1>
            <p>Tu pago está siendo procesado. Recibirás una confirmación pronto.</p>
            <a href="/">Volver al inicio</a>
        </div>
    </body>
    </html>
  `);
};

exports.recibirWebhook = (req, res) => {
  console.log('📡 Webhook recibido:', req.body);
  res.status(200).send('OK');
};