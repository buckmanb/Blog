// api/auth/google.js
const { OAuth2Client } = require('google-auth-library');

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

module.exports = async (req, res) => {
    console.debug(`Request to ${req.method} ${req.url}`); // Log the request details
    console.debug('Request Headers:', req.headers);
    if (req.method === 'POST') {
      console.debug('Request Body:', req.body); // Log the request body
    }
    console.debug("starting request");
    console.debug("api/auth/google");
    if (req.method === 'GET') {
      // Generate the URL that will be used for the consent dialog
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        prompt: 'consent',
        ux_mode: 'redirect'
      });

      res.redirect(authorizeUrl);
    } else {
      res.status(405).json({ error: 'Method not allowed' }); // 405 Method Not Allowed
    }
    console.debug("request finished");
  };