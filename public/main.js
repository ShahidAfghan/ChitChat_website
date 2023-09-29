

const socket = io();

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const userJoinedElement = document.querySelector(".user-joined");

const messageTune = new Audio('/whistle.mp3');

const imageInput = document.getElementById('imageInput');
let imageData;
document.getElementById('sendImage').addEventListener('click', () => {
  
  const file = imageInput.files[0];

  if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
           imageData = e.target.result;
          //  console.log('image data : ', imageData);

          const messageData ={
            image: imageData,
            name: nameInput.value,
          };

          socket.emit('image', messageData);
          // socket.emit('image', { data: imageData });
      };

      reader.readAsDataURL(file);
  }
});

socket.on('image', (data) => {
  // const messages = document.getElementById('messages');
  // const imageElement = document.createElement('img');
  // imageElement.style.width ='60px';
  // imageElement.style.height = '50px';

  // imageElement.src = data.data;
  // messages.appendChild(imageElement);
  messageTune.play();
addImageToUI(true , data);
imageInput.value= '';


});



















const append = (message , position)=>{
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  userJoinedElement.append(messageElement);

}

const name = nameInput.value;
let userName = prompt("Enter your name to join chat")

nameInput.value = userName;



messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  console.log(data);
  clientsTotal.innerHTML = `Total Clients: ${data}`;
});

socket.emit('new-user-joined' , userName);


function sendMessage() {

    if(messageInput.value === '')return;
    
  console.log(messageInput.value);
  const data = {
    // json object
    name: nameInput.value,
    message: messageInput.value,
    image: '',
    dataTime: new Date(),
  };

 console.log("data include image : ", data);


  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
//   console.log(data);
    messageTune.play();
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
      const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
    <p class="message">
      ${data.message}
      <span>${data.name} 🔘 ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>
`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}


function addImageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `<li class="${isOwnMessage ? 'image-right' : 'image-left'}">
  <img class= "image" src="${data.image}" >
  <span class="imageSpan"><span class="innerSpan">${data.name} 🔘 ${moment(data.dateTime).fromNow()}</span></span>
  
  
</li>`

{/* <span class="imageSpan"> ${data.name} 🔘 ${moment(data.dateTime).fromNow()}</span> */}

messageContainer.innerHTML += element;
scrollToBottom();
}


function scrollToBottom(){
    messageContainer.scrollTo(0 , messageContainer.scrollHeight);
}


messageInput.addEventListener('focus', (e)=>{
    socket.emit('feedback', {
        feedback: `✍️${nameInput.value} is typing a message`,
    })
})

messageInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback', {
        feedback: `✍️${nameInput.value} is typing a message`,
    })
    
})

messageInput.addEventListener('blur', (e)=>{
    socket.emit('feedback', {
        feedback: ``,
    })
})


socket.on('feedback', (data)=>{
    clearFeedback();
    const element = `
    <li class="message-feedback">
          <p class="feedback" id="feedback"> ${data.feedback}</p>
        </li>`;
        messageContainer.innerHTML += element;
})

function clearFeedback(){
    document.querySelectorAll(`li.message-feedback`).forEach(element =>{
        element.parentElement.removeChild(element);
    })
}

socket.on('user-joined', name => {
  append(`${name} joined the chat ` , 'center');

});

socket.on('leave', name => {
  append(`${name} leave the chat ` , 'center');

});