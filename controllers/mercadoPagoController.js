const axios = require('axios');

exports.getPagoPage = (req, res) => {
  res.render('pago', { 
    title: 'Pagar con Mercado Pago',
    publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY
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

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  if (!accessToken) {
    return res.status(500).json({ 
      success: false, 
      error: 'Token no configurado' 
    });
  }

  console.log('🔑 Token usado:', accessToken.substring(0, 20) + '...');

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
      paymentLink: response.data.init_point
    });

  } catch (error) {
    console.error('❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
    });
  }
};

exports.getSuccess = (req, res) => {
  res.render('success', { title: 'Pago Exitoso' });
};

exports.getFailure = (req, res) => {
  res.render('failure', { title: 'Pago Fallido' });
};

exports.getPending = (req, res) => {
  res.render('pending', { title: 'Pago Pendiente' });
};

exports.recibirWebhook = (req, res) => {
  console.log('📡 Webhook recibido:', req.body);
  res.status(200).send('OK');
};