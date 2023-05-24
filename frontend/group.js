function showGroupForm(e) {
    e.preventDefault()
    document.getElementById("groupForm").style.display = "block";
    populateMembers();
    addSelectedMember()
}


async function populateMembers() {
  try {
    const response = await axios.get("http://localhost:4000/user/all");
    const membersSelect = document.getElementById("members");
    membersSelect.innerHTML = "";

    const currentUserEmail = getCurrentUserEmail();
    const users = response.data.filter((email) => email !== currentUserEmail);

    users.forEach((email) => {
      const option = document.createElement("option");
      option.text = email;
      membersSelect.add(option);
    });
  } catch (error) {
    console.log(error);
  }
}

function getCurrentUserEmail() {
  return localStorage.getItem("email");
}



const groupForm = document.getElementById("groupF")
groupForm.addEventListener("submit", createGroup);



function addSelectedMember() {
  const membersSelect = document.getElementById("members");
  const selectedMembersInput = document.getElementById("selectedMembers");
  const selectedMember = membersSelect.value;
  let selectedMembers = selectedMembersInput.value.trim();

  if (!selectedMembers) {
    const currentUserEmail = localStorage.getItem("email");
    selectedMembers = currentUserEmail;
  }

  if (!selectedMembers.includes(selectedMember)) {
    if (selectedMembers) {
      selectedMembers += ", " + selectedMember;
    } else {
      selectedMembers = selectedMember;
    }
  }

  selectedMembersInput.value = selectedMembers;
}



async function createGroup(e) {
    e.preventDefault();
    const groupName = document.getElementById("groupname").value;
    const membersSelect = document.getElementById("selectedMembers").value;
    const userId = localStorage.getItem('userId')
   
    const groupData = {
        name: groupName,
        members: membersSelect,
        admin: userId
    };
    
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:4000/group/create", groupData, { headers: { Authorization: token } });
        
        if (response.status === 201){
          const groupId = response.data.groupId; 

            alert(response.data.message);
            
            window.location.href =  `./group.html`;

        }
    } catch (error) {
        console.log(error);
    }
}


async function showGroupsList(e) {
  e.preventDefault();
  document.getElementById("showGroupsButton").style.display = "block";
  
  try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId")
      const response = await axios.get("http://localhost:4000/group/showAll", {
        params: { userId: userId },
        headers: { Authorization: token },
      });
      
      if (response.status === 200) {
          const groups = response.data.groups;
          console.log(groups)
          showAllGroups(groups);
      }
  } catch (error) {
      console.log(error);
  }
}




let activeIframe = null; // Track the active iframe

function showAllGroups(groups) {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = "";

  const container = document.createElement("div");
  container.style.position = "relative";

  const list = document.createElement("ul");
  list.style.display = "flex";
  list.style.flexWrap = "wrap"; // Allow wrapping to next line

  let groupCounter = 0; // Track the number of groups displayed

  groups.forEach((group) => {
    const listItem = document.createElement("li");
    listItem.style.marginRight = "10px"; // Adjust the spacing between groups if needed

    const groupName = document.createElement("span");
    groupName.textContent = group.groupName;
    listItem.appendChild(groupName);

    const link = document.createElement("a");
    link.textContent = "Open chats";
    link.href = "javascript:void(0)";

    link.addEventListener("click", () => {
      if (activeIframe) {
        activeIframe.remove();
      }

      const iframeContainer = document.createElement("div");
      iframeContainer.style.position = "absolute";
      iframeContainer.style.left = "0";
      iframeContainer.style.top = "100%"; // Position the iframe container below the list
      iframeContainer.style.width = "100%";
      iframeContainer.style.height = "300px"; // Adjust the height as needed
      iframeContainer.style.marginTop = "10px"; // Adjust the spacing between list and iframe if needed

      const iframe = document.createElement("iframe");
      iframe.src = group.groupLink;
      iframe.style.width = "100%";
      iframe.style.height = "100%";

      iframeContainer.appendChild(iframe);
      container.appendChild(iframeContainer);
      activeIframe = iframe;
    });

    listItem.appendChild(link);
    list.appendChild(listItem);

    groupCounter++;

    if (groupCounter % 8 === 0) {
      // Start a new line after every 8 groups
      list.appendChild(document.createElement("br"));
    }
  });

  container.appendChild(list);
  groupList.appendChild(container);
}




