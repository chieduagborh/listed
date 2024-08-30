const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const klaviyoApiKey = process.env.KLAVIYO_API_KEY;

    try {
      const response = await axios.post('https://a.klaviyo.com/api/profile-import/', req.body, {
        headers: {
          'Authorization': `Klaviyo-API-Key ${klaviyoApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
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
