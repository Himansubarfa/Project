const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  let filePath;
  let contentType;

  switch (req.url) {
    case '/':
    case '/home':
      filePath = path.join(__dirname, 'home.html');
      contentType = 'text/html';
      break;

    case '/index':
      filePath = path.join(__dirname, 'index.html');
      contentType = 'text/html';
      break;

    case '/home.css':
      filePath = path.join(__dirname, 'home.css');
      contentType = 'text/css';
      break;

    case '/home.js':
      filePath = path.join(__dirname, 'home.js');
      contentType = 'application/javascript';
      break;

    // Correct path for index.css
    case '/style.css':  // Serving index.css
      filePath = path.join(__dirname, 'style.css');
      contentType = 'text/css';
      break;

    // Correct path for index.js
    case '/script3.js':   // Serving index.js
      filePath = path.join(__dirname, 'script3.js');
      contentType = 'application/javascript';
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>404 Not Found</h1>');
  }

  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      return res.end('<h1>Server Error</h1>');
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
