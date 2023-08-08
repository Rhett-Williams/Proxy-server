const express = require('express');
const request = require('request'); // For making HTTP requests

const app = express();
const port = 3000; // Choose a suitable port

// Define a route to handle proxy requests
app.use('/', (req, res) => {
  const url = req.url.slice(1); // Remove the leading slash

  // Forward the request to the external website
  request(url, (error, response, body) => {
    if (!error) {
      res.send(body);
    } else {
      res.status("500").send(error || body);
    }
  });
});

// Start the proxy server
app.listen(port, () => {
  console.log(`Proxy server is listening on port ${port}`);
});
