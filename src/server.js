const express = require('express');
const axios = require('axios');
require('dotenv').config();

const {
  getAccessToken,
  refreshAccessToken,
} = require('./twitch-token-handler');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const app = express();
const twitchWebhookUrl = 'https://<your-server-domain>/twitch/webhooks';
let accessToken;

// Define your routes here
app.post('/twitch/webhooks', (req, res) => {
  if (
    req.headers['twitch-eventsub-message-type'] ===
    'webhook_callback_verification'
  ) {
    res.status(200).send(req.body.challenge);
  } else {
    console.log('Incoming Twitch notification:', req.body);
    // process the incoming notification here
    res.status(200).end();
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

async function setup() {
  // Call the twitchTokenHandler function to get an access token
  // and start refreshing it automatically
  accessToken = await getAccessToken(clientId, clientSecret);
  await createSubscription(clientId, accessToken);
}

const createSubscription = async (clientId, accessToken) => {
  const response = await axios.post(
    'https://api.twitch.tv/helix/eventsub/subscriptions',
    {
      type: 'stream.online',
      version: '1',
      condition: {
        broadcaster_user_id: '<twitch channel id>',
      },
      transport: {
        method: 'webhook',
        callback: twitchWebhookUrl,
        secret: 'idkwhatthisshoudlbebutok',
      },
    },
    {
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(response.data);
};

setup();
