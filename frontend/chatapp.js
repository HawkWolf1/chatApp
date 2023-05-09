const parent = document.getElementById("chat");

function showMessageOnScreen(chat,name){
    parent.innerHTML+=`<h4>${name}: ${chat}</h4>`
}



document.getElementById("send").addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("token");
      const name1 = localStorage.getItem("name");
      const chatInput = document.getElementById("chatInput").value;
  
      const obj = {
        chatInput,
        name1,
      };
  
      console.log(obj);
  
      const result = await axios.post("http://localhost:4000/user/sendMessage",obj,{headers: {Authorization: token}});
  
      console.log(result);
      window.location.reload();
      
    } catch (err) {
      console.log(err);
    }
  });