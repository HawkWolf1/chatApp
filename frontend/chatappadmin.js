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
  
      const popupContainer = document.createElement("div");
      popupContainer.classList.add("popup-container");
  
      const container = document.createElement("div");
      container.classList.add("admins-container");
  
      const adminsSection = document.createElement("div");
      adminsSection.classList.add("members-section");
      const adminsTitle = document.createElement("h4");
      adminsTitle.classList.add("section-title");
      adminsTitle.textContent = "ADMINS LIST";
      adminsSection.appendChild(adminsTitle);
  
      const nonAdminsSection = document.createElement("div");
      nonAdminsSection.classList.add("members-section");
      const nonAdminsTitle = document.createElement("h4");
      nonAdminsTitle.classList.add("section-title");
      nonAdminsTitle.textContent = "NON-ADMINS LIST";
      nonAdminsSection.appendChild(nonAdminsTitle);
  
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
          adminsSection.appendChild(listItem);
        } else {
          nonAdminsSection.appendChild(listItem);
        }
      });
  
      container.appendChild(adminsSection);
      container.appendChild(nonAdminsSection);
  
      popupContainer.appendChild(container);
  
      const overlay = document.createElement("div");
      overlay.classList.add("popup-overlay");
  
      overlay.addEventListener("click", () => {
        document.body.removeChild(popupContainer);
        document.body.removeChild(overlay);
      });
  
      document.body.appendChild(popupContainer);
      document.body.appendChild(overlay);
  
      const searchInput = document.createElement("input");
      searchInput.setAttribute("type", "text");
      searchInput.setAttribute("placeholder", "Search by name");
      searchInput.classList.add("search-input");
  
      container.insertBefore(searchInput, container.firstChild);
  
      const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
  
        const allItems = container.querySelectorAll(".members-section > div");
  
        allItems.forEach((item) => {
          const name = item.textContent.toLowerCase();
  
          if (name.includes(searchTerm)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      };
  
      searchInput.addEventListener("input", handleSearch);
  
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

  function closeAdminModel() {
    const adminModel = document.getElementById("adminModel");
    adminModel.style.display = "none";
  }



  async function deleteGroup() {
    try {
      const token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      const groupId = urlParams.get("groupId");
  
      const confirmDelete = confirm("Are you sure you want to delete this group?");
      if (!confirmDelete) {
        return;
      }
  
      const response = await axios.delete(`http://localhost:4000/group/delete/${groupId}`, {
        headers: { Authorization: token },
      });
  
      console.log(response.data);
      alert(response.data.message);
  
      window.top.location.href = "./group.html"  

    } catch (error) {
      console.log(error);
    }
  }
      