const axios = require('axios');

module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.listedmembersclub.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, revision, Authorization');
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    const klaviyoApiKey = process.env.KLAVIYO_API_KEY;
    const email = req.query.email; // Assuming you pass the email as a query parameter
    console.log('email from vercel', email);
    res.setHeader('Access-Control-Allow-Origin', 'https://www.listedmembersclub.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, revision, Authorization');


    try {
       
      const response = await axios.get(`https://a.klaviyo.com/api/profiles/?filter=equals(email,${email})`, {
        headers: {
          'Authorization': `Klaviyo-API-Key ${klaviyoApiKey}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'revision': '2024-07-15'
        }
      });

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
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
