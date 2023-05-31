const socket = io('http://localhost:4000');
const loggedInUserName = localStorage.getItem("name");


document.getElementById("send").addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      const message = document.getElementById("chatInput").value;
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");
      console.log(groupId)
  
      const obj = {
        name,
        message,
        groupId
      };
      
      socket.emit("sendMessage", obj)

      console.log(obj);
  
      const result = await axios.post("http://localhost:4000/user/sendMessage",obj,{headers: {Authorization: token}});
  
      console.log(result);
      window.location.reload();
      
    } catch (err) {
      console.log(err);
    }
  });



  function handleNewMessage(msg) {
  const chatDiv = document.createElement("div");
  const messageContent = document.createElement("span");
  messageContent.innerHTML = msg.message;
  chatDiv.appendChild(messageContent);

  if (msg.name === loggedInUserName) {
        chatDiv.style.textAlign = "right";
        chatDiv.style.paddingRight = "10px";
      } else {
        const nameElement = document.createElement("span");
        nameElement.innerHTML = msg.name + ": ";
        nameElement.style.fontWeight = "bold";
        chatDiv.insertBefore(nameElement, messageContent);
        chatDiv.style.textAlign = "left";
        chatDiv.style.paddingLeft = "10px";
      }

  chatDiv.style.marginBottom = "20px";
  chatDiv.style.fontSize = "20px";
  parent.appendChild(chatDiv);
}




  


  const parent = document.getElementById("chat");


  async function fetchChats() {
    try {
      const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");


      const response = await axios.get("http://localhost:4000/user/getChats", {
      params: { groupId },
      headers: { Authorization: token },
    });
      const chats = response.data.msg;
    
      

    chats.forEach(msg => {
      const chatDiv = document.createElement("div");
      const messageContent = document.createElement("span");
      messageContent.innerHTML = msg.message;
      chatDiv.appendChild(messageContent);

      if (msg.name === loggedInUserName) {
        chatDiv.style.textAlign = "right";
        chatDiv.style.paddingRight = "10px";
      } else {
        const nameElement = document.createElement("span");
        nameElement.innerHTML = msg.name + ": ";
        nameElement.style.fontWeight = "bold";
        chatDiv.insertBefore(nameElement, messageContent);
        chatDiv.style.textAlign = "left";
        chatDiv.style.paddingLeft = "10px";
      }

      chatDiv.style.marginBottom = "20px";
      chatDiv.style.fontSize = "20px";
      parent.appendChild(chatDiv);
    });
    socket.on('newMessage', handleNewMessage);
    
    } catch (err) {
      console.log(err);
    }
  }
  
  fetchChats()


  window.addEventListener('load', function () {
    const groupName = localStorage.getItem('groupName');
    const appHeading = document.getElementById('appHeading');
    if (groupName) {
      appHeading.textContent = groupName;
    }
  });



function initializeGroupNames() {
  const groupNames = JSON.parse(localStorage.getItem("groupNames")) || {};
  return groupNames;
}


function setGroupName(groupId, groupName) {
  const groupNames = initializeGroupNames();
  groupNames[groupId] = groupName;
  localStorage.setItem("groupNames", JSON.stringify(groupNames));
}

function getGroupName(groupId) {
  const groupNames = initializeGroupNames();
  return groupNames[groupId];
}

async function changeGroupName() {
  const newGroupName = prompt("Enter the new group name:");
  if (newGroupName) {
    try {
      const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");

      const response = await axios.post(
        "http://localhost:4000/group/nameChange",
        { groupId, newGroupName },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        const groupName = response.data.groupName;
        console.log(groupName);
        console.log(`Group name changed to: ${groupName}`);

        const appHeading = document.getElementById("appHeading");
        appHeading.textContent = groupName;

      
        setGroupName(groupId, groupName);
        
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function displayGroupName(groupId) {
  const groupName = getGroupName(groupId);
  if (groupName) {
    const appHeading = document.getElementById("appHeading");
    appHeading.textContent = groupName;
  }
}

const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get("groupId");
displayGroupName(groupId);



async function leaveGroup() {
  try {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("groupId");
    const userId = localStorage.getItem("userId");

    const response = await axios.delete("http://localhost:4000/leave/group", {
      headers: { Authorization: token },
      data: { userId: userId, groupId: groupId }
    });

    console.log(response.data);
    alert(response.data.message);

  } catch (error) {
    console.log(error);
  }
}

  

    
  