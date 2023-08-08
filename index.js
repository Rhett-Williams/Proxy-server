const express = require('express');
const {HttpsProxyAgent} = require('https-proxy-agent')
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000; // Choose a suitable port

// Define proxy credentials
const proxyUsername = process.env.PROXY_USERNAME;
const proxyPassword = process.env.PROXY_PASSWORD;

// Define a route to handle proxy requests

app.use('/', async (req, res) => {
  const url = req.url.slice(1); // Remove the leading slash

  try {
    const proxyAgent = new HttpsProxyAgent(`http://${proxyUsername}:${proxyPassword}@p.webshare.io:80`);
    
    const response = await axios.get(url, { httpsAgent: proxyAgent });
    const body = response.data;

    // Modify the base URL for resources in the HTML content
    const modifiedBody = body.replace(/(src|href)=("|')(\/[^"']+)/g, (match, p1, p2, p3) => {
      return `${p1}=${p2}${url}${p3}`;
    });

    res.send(modifiedBody);
  } catch (error) {
    console.log('error', error);
    res.status(500).send('An error occurred');
  }
});

// Start the proxy server
app.listen(port, () => {
  console.log(`Proxy server is listening on port ${port}`);
});


