const axios = require('axios');

let accessToken;
let expirationTime;

const getAccessToken = async (clientId, clientSecret) => {
  if (!accessToken || expirationTime <= Date.now()) {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    );
    accessToken = response.data.access_token;
    expirationTime = Date.now() + (response.data.expires_in - 60) * 1000;
  }
  return accessToken;
};

const refreshAccessToken = async () => {
  const response = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
  );
  accessToken = response.data.access_token;
  expirationTime = Date.now() + (response.data.expires_in - 60) * 1000;
};

module.exports = { getAccessToken, refreshAccessToken };
