const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

const users = [];
const messages = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id - ' + socket.id);
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id)
    messages.push(message);
    socket.broadcast.emit('message', message);
   });
   socket.on('join', (user) => { 
    console.log('Oh, new user join us - ' + user.name);
    users.push(user);
    socket.broadcast.emit('message', { author: 'Chat Bot', content: `<i>${user.name} has joined the conversation!` })
    console.log(users);
  });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left')
    const user = users.find((user) => user.id === socket.id);
    users.splice(users.indexOf(user), 1);
    socket.broadcast.emit('message', { author: 'Chat Bot', content: `<i>${user.name} has left the conversation... :(` })
  });
  console.log('I\'ve added a listener on message event \n');
});