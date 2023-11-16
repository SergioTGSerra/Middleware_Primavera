const express = require('express');
const app = express();
const port = 3000;

let token = null;
let tokenExpirationTime = null;

async function get_token() {
  if (token && tokenExpirationTime && Date.now() < tokenExpirationTime)
    return token;

  const response = await fetch('https://identity.primaverabss.com/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'scope': 'application',
      'client_id': 'IEOP-API',
      'client_secret': 'aa96e114-5991-424a-b124-574ebf836406',
    }),
  });

  const data = await response.json();
  token = data.access_token;
  tokenExpirationTime = Date.now() + data.expires_in * 1000;
  return token;
}

app.get('/', async (req, res) => {
  const accessToken = await get_token();
  res.send(accessToken);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});