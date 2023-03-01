const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('message', ({ name, id }) => login(name, id));

const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

let userName = '';

const login = e => {
  e.preventDefault();

  let newUser = userNameInput.value;

  if(!newUser.length){
    alert('Please enter a username');
  } else {
    userName = newUser;
    socket.emit('join', { name: userName, id: socket.id });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

loginForm.addEventListener('submit', (e) => login(e));

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author == userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">${content}</div>
  `
  messagesList.appendChild(message);
};

const sendMessage = e => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if(!messageContent.length){
    alert('Please enter a message');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  }
};

addMessageForm.addEventListener('submit', (e) => sendMessage(e));