const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>UzChat</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #eef3fb;
        }
        header {
          background: #1268e8;
          color: white;
          padding: 20px;
          font-size: 25px;
          font-weight: bold;
        }
        #messages {
          height: 65vh;
          overflow-y: auto;
          padding: 12px;
        }
        .msg {
          background: white;
          margin: 8px 0;
          padding: 12px;
          border-radius: 12px;
          overflow-wrap: anywhere;
        }
        form {
          position: fixed;
          bottom: 0;
          background: white;
          padding: 12px;
          display: flex;
          gap: 8px;
          width: calc(100% - 24px);
        }
        input {
          min-width: 0;
          flex: 1;
          padding: 13px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        button {
          background: #1268e8;
          color: white;
          border: 0;
          padding: 12px;
          border-radius: 10px;
        }
      </style>
    </head>
    <body>
      <header>💬 UzChat</header>
      <div id="messages"></div>
      <form id="form">
        <input id="message" placeholder="Xabar yozing..." autocomplete="off">
        <button>Yuborish</button>
      </form>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        const form = document.getElementById('form');
        const input = document.getElementById('message');
        const messages = document.getElementById('messages');

        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const text = input.value.trim();
          if (text) {
            socket.emit('chat message', text);
            input.value = '';
          }
        });

        socket.on('chat message', function(data) {
          const div = document.createElement('div');
          div.className = 'msg';
          div.textContent = data;
          messages.appendChild(div);
          messages.scrollTop = messages.scrollHeight;
        });
      </script>
    </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    if (typeof message !== 'string') return;
    const text = message.trim().slice(0, 2000);
    if (text) io.emit('chat message', text);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('UzChat server ishga tushdi: ' + PORT);
});
