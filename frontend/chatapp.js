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
  
      console.log(obj);
  
      const result = await axios.post("http://localhost:4000/user/sendMessage",obj,{headers: {Authorization: token}});
  
      console.log(result);
      window.location.reload();
      
    } catch (err) {
      console.log(err);
    }
  });





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
        chatDiv.innerHTML = `<strong>${msg.name}: </strong>${msg.message}`;
        parent.appendChild(chatDiv);
      });
    } catch (err) {
      console.log(err);
    }
  }
  

  fetchChats()



async function showMembers(){
  try{
  const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");

  const response = await axios.get("http://localhost:4000/user/members", {
      params: { groupId },
      headers: { Authorization: token },
    });

    const members = response.data.users

    members.forEach((member) => {
      console.log("Name:", member.name);
      console.log("Email:", member.email);
    });
  } catch (error) {
    console.log(error);
  
}
}
