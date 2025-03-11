// api/auth/callback.js
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
    console.debug("api/auth/callback");
    if (req.method === 'GET') {
        try {
            const { code } = req.query;

            if (!code) {
                return res.status(400).json({ error: 'Authorization code not provided' });
            }

            // Exchange code for tokens
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);

            // Get user info using the access token
            const ticket = await oAuth2Client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            const { email, name, picture } = payload;

            console.debug(`redirecting to ${process.env.CLIENT_URL}/auth/google-callback?token=${tokens.id_token}&email=${email}&name=${name}&picture=${encodeURIComponent(picture)}`);
            res.redirect(`${process.env.CLIENT_URL}/auth/google-callback?token=${tokens.id_token}&email=${email}&name=${name}&picture=${encodeURIComponent(picture)}`);
        } catch (error) {
            console.error('Error processing callback:', error);
            res.redirect(`${process.env.CLIENT_URL}/auth/login?error=Authentication failed`);
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
    console.debug("request finished");
};