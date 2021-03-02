const http = require('http');
const path = require('path');
const fs = require('fs');

// Simple web-server for learning node.js
const server = http.createServer((req, res) => {
  // Dynamic file path
  let filePath = path.join(
    __dirname,
    'public', 
    req.url === '/' ? 'index.html' : req.url
  );
  // File extension 
  let extension = path.extname(filePath);
  // Default content-type
  let contentType = 'text/html';

  switch (extension) {
    case '.js': 
      contentType = 'text/javascript';
      break;

    case '.css': 
      contentType = 'text/css';
      break;
      
    case '.json': 
      contentType = 'application/json';
      break;

    default:
      break;
  }

  // Read file from specified file path
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      // File does not exist
      if (err.code === 'ENOENT') {
        // Read then serve 404.html file 
        fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
          if (err) {
            throw err;
          }
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(content, 'utf-8');
        });
      }
      // Respond with status code: 500 for any other error
      else {
        res.writeHead(500);
        res.end(`Server-error: ${err.code}`);
      }
    }
    else {
      // File exists, respond with its contents
      res.writeHead(200, {'Content-Type': contentType});
      res.end(content, 'utf-8');
    }
  });


});

// Get default port number, or use port:5000
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));