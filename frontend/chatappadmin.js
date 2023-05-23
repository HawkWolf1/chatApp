async function showMembers() {
  try {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("groupId");

    const response = await axios.get("http://localhost:4000/user/members", {
      params: { groupId },
      headers: { Authorization: token },
    });

    const members = response.data.users;
    console.log(members)


    members.sort((a, b) => a.name.localeCompare(b.name));

    const container = document.createElement("div");
    container.classList.add("members-list");

    members.forEach((member) => {
      const listItem = document.createElement("div");
      listItem.textContent = `Name: ${member.name}, Email: ${member.email}`;
      listItem.setAttribute("id", `user-${member.id}`);

      console.log(`User ID: ${member.id}`);


      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      listItem.addEventListener("click", () => {
        listItem.appendChild(overlay);
      });

      container.appendChild(listItem);
    });
  
      document.body.appendChild(container);
  
      container.addEventListener("click", (event) => {
        event.stopPropagation();
      });
  
  
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
  
      document.body.appendChild(overlay);
  
      overlay.addEventListener("click", () => {
        container.remove();
        overlay.remove();
      });
  
      const searchInput = document.createElement("input");
      searchInput.setAttribute("type", "text");
      searchInput.setAttribute("placeholder", "Search by initials");
      container.insertBefore(searchInput, container.firstChild);
  
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.trim().toLowerCase();
        const listItems = container.querySelectorAll(".members-list > div");
  
        listItems.forEach((listItem) => {
          const name = listItem.textContent
            .replace("Name: ", "")
            .replace(", Email:", "")
            .trim()
            .toLowerCase();
  
          if (name.startsWith(searchTerm)) {
            listItem.style.display = "block";
          } else {
            listItem.style.display = "none";
          }
        });
      });
  
      container.style.overflow = "auto";
      container.style.maxHeight = "300px";
  
      return members;
    } catch (error) {
      console.log(error);
    }
  }





  async function openAdminModel() {
    try {
      const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");
  
      const response = await axios.get("http://localhost:4000/user/isAdmin", {
        params: { groupId },
        headers: { Authorization: token },
      });
  
      const isAdmin = response.data.isAdmin;
  
      const adminModel = document.getElementById("adminModel");
      const adminMessage = document.getElementById("adminMessage");
      const adminButtons = document.getElementById("adminButtons");
      const addUserForm = document.getElementById("addUserForm");
  
      if (isAdmin) {
       
        adminModel.style.display = "block";
        adminMessage.style.display = "none";
        adminButtons.style.display = "block";
      } else {
       
        adminModel.style.display = "block";
        adminMessage.style.display = "block";
        adminButtons.style.display = "none";
        adminMessage.textContent = "You are not an admin.";
      }

      addUserForm.style.display = "none";

    } catch (error) {
      console.log(error);
    }
  }






  function addUsers() {
    const addUserForm = document.getElementById("addUserForm");
    addUserForm.style.display = "block"; 
  }
  
  async function addUserByEmail() {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
  
    if (email === "") {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");
  
      const response = await axios.post(
        "http://localhost:4000/user/addMoreUser",
        { groupId, email },
        { headers: { Authorization: token } }
      );
  
      const message = response.data.message;
      console.log(response)
      console.log(message)
      alert(message);
    
      emailInput.value = "";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const message = error.response.data.message;
        alert(message);
      } else {
        console.log(error);
      }
    }
  }







  async function removeUsers() {
    const members = await showMembers();
  
    // Remove any existing member lists
    const existingLists = document.querySelectorAll(".members-list");
    existingLists.forEach((list) => list.remove());
  
    const container = document.createElement("div");
    container.classList.add("members-list");
  
    members.forEach((member) => {
      const listItem = document.createElement("div");
      listItem.textContent = `Name: ${member.name}, Email: ${member.email}`;
      listItem.setAttribute("id", `user-${member.id}`);
  
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => {
        removeUser(member.groupId, member.id);
      });
  
      listItem.appendChild(removeButton);
      container.appendChild(listItem);
    });
  
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search by initials");
    container.insertBefore(searchInput, container.firstChild);
  
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.trim().toLowerCase();
      const listItems = container.querySelectorAll(".members-list > div");
  
      listItems.forEach((listItem) => {
        const name = listItem.textContent
          .replace("Name: ", "")
          .replace(", Email:", "")
          .trim()
          .toLowerCase();
  
        if (name.startsWith(searchTerm)) {
          listItem.style.display = "block";
        } else {
          listItem.style.display = "none";
        }
      });
    });
  
    container.style.overflow = "auto";
    container.style.maxHeight = "300px";
  
    document.body.appendChild(container);
  
    // Close the list when clicking outside
    document.addEventListener("click", (event) => {
      if (!container.contains(event.target)) {
        container.remove();
      }
    });
  }



  
  async function removeUser(groupId, userId) {
    try {
      const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");
  
      
  
      const response = await axios.delete(
        `http://localhost:4000/user/removeUser`,
        { 
          data: { groupId, userId },
          headers: { 
            Authorization: token 
          }
        }
      );
  
      const message = response.data.message;
      alert(message);
  
      // Remove the user from the screen
      const listItem = document.getElementById(`user-${userId}`);
      console.log(userId)
      if (listItem && listItem.parentNode) {
        listItem.parentNode.removeChild(listItem);
      }
    } catch (error) {
      console.log(error);
    }
  }






  async function modifyAdmins() {
    try {
      const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");
  
      const response = await axios.get("http://localhost:4000/user/members", {
        params: { groupId },
        headers: { Authorization: token },
      });
  
      const users = response.data.users;

  
      const adminsList = [];
      const nonAdminsList = [];
  
      users.forEach((user) => {
        const listItem = document.createElement("div");
        listItem.textContent = `Name: ${user.name}, Email: ${user.email}`;
  
        const button = document.createElement("button");
        button.textContent = user.isAdmin ? "Remove Admin" : "Make Admin";
  
        if (user.isAdmin) {
          button.addEventListener("click", () => {
            removeAdmin(user.id, listItem);
          });
        } else {
          button.addEventListener("click", () => {
            makeAdmin(user.id, listItem);
          });
        }
  
        listItem.appendChild(button);
  
        if (user.isAdmin) {
          adminsList.push(listItem);
        } else {
          nonAdminsList.push(listItem);
        }
      });
  
      adminsList.sort((a, b) => a.textContent.localeCompare(b.textContent));
      nonAdminsList.sort((a, b) => a.textContent.localeCompare(b.textContent));
  
      const container = document.createElement("div");
  
      const adminsSection = document.createElement("div");
      adminsSection.classList.add("members-section");
      adminsSection.textContent = "Admins List";
      adminsList.forEach((listItem) => adminsSection.appendChild(listItem));
  
      const nonAdminsSection = document.createElement("div");
      nonAdminsSection.classList.add("members-section");
      nonAdminsSection.textContent = "Non-Admins List";
      nonAdminsList.forEach((listItem) => nonAdminsSection.appendChild(listItem));
  
      container.appendChild(adminsSection);
      container.appendChild(nonAdminsSection);
  
      const popupContainer = document.createElement("div");
      popupContainer.classList.add("popup-container");
      popupContainer.appendChild(container);
  
      document.body.appendChild(popupContainer);
  
      // Add event listener to fade and close the pop-up when clicked outside
      document.body.addEventListener("click", (event) => {
        if (popupContainer && popupContainer.parentNode === document.body && !popupContainer.contains(event.target)) {
          document.body.removeChild(popupContainer);
        }
      });
  
      return users;
    } catch (error) {
      console.log(error);
    }
  }
  


  async function removeAdmin(userId, listItem) {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("groupId");
  
    try {
      response = await axios.delete(`http://localhost:4000/admin/remove`, {
        headers: { Authorization: token },
        data: { userId: userId, groupId: groupId },
      });
  
      // Remove the admin from the UI
      const message = response.data.message;
      alert(message);

      listItem.parentNode.removeChild(listItem);
    } catch (error) {
      console.log(error);
    }
  }
  
  async function makeAdmin(userId, listItem) {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("groupId");
  
    try {
      response = await axios.post(
        `http://localhost:4000/admin/Add`,
        { userId: userId, groupId: groupId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const message = response.data.message;
      alert(message);
  
      listItem.parentNode.removeChild(listItem);
    } catch (error) {
      console.log(error);
    }
  }
      