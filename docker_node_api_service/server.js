// Używamy wbudowanego modułu http, aby nie potrzebować npm install
const http = require('http');

const port = 3000;
const host = '0.0.0.0'; // Nasłuchujemy na wszystkich interfejsach w kontenerze

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/data') {
    // Odpowiedź JSON dla konkretnego endpointu
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      wiadomosc: "Witaj z serwisu Node.js!",
      timestamp: new Date().toISOString()
    }));
  } else {
    // Domyślna odpowiedź 404 dla innych ścieżek
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Nie znaleziono zasobu');
  }
});

server.listen(port, host, () => {
    console.log(`Serwis Node.js nasłuchuje na http://${host}:${port}`);

});