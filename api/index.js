const axios = require('axios');

module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, revision, Authorization');
    res.status(200).end();
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    const klaviyoApiKey = process.env.KLAVIYO_API_KEY;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, revision, Authorization');

    // Extract data from request body
    const { data } = req.body;

    console.log('here in vercel', data);
    

    // Configure Axios request options
    const options = {
      method: 'POST',
      url: 'https://a.klaviyo.com/api/profile-import/',
      headers: {
        'accept': 'application/json',
        'revision': '2024-07-15',
        'content-type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${klaviyoApiKey}`
      },
      data: {
        data: {
          type: 'profile',
          attributes: {
            email: data.attributes.email,
            properties: data.attributes.properties
          }
        }
      }
    };

    try {
      const response = await axios.request(options);
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
