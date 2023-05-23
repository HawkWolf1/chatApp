function showGroupForm(e) {
    e.preventDefault()
    document.getElementById("groupForm").style.display = "block";
    populateMembers();
}


async function populateMembers() {
    try {
      const response = await axios.get("http://localhost:4000/user/all");
      const membersSelect = document.getElementById("members");
      membersSelect.innerHTML = "";
      response.data.forEach((email) => {
        const option = document.createElement("option");
        option.text = email;
        membersSelect.add(option);
      });
    } catch (error) {
      console.log(error);
    }
  }



const groupForm = document.getElementById("groupF")
groupForm.addEventListener("submit", createGroup);



function addSelectedMember() {
    const membersSelect = document.getElementById("members");
    const selectedMembersInput = document.getElementById("selectedMembers");
    const selectedMember = membersSelect.value;
    let selectedMembers = selectedMembersInput.value.trim();

    if (selectedMember) {
      if (selectedMembers) {
        selectedMembers += ", " + selectedMember;
      } else {
        selectedMembers = selectedMember;
      }
      selectedMembersInput.value = selectedMembers;
    }

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

  groups.forEach((group) => {
    const listItem = document.createElement("li");

    const groupName = document.createElement("span");
    groupName.textContent = group.groupName;
    listItem.appendChild(groupName);

    const link = document.createElement("a");
    link.textContent = "Open chats";
    link.href = "javascript:void(0)"; // Set href to prevent navigation

    link.addEventListener("click", () => {
      if (activeIframe) {
        // If an active iframe exists, remove it
        activeIframe.remove();
      }

      const iframe = document.createElement("iframe");
      iframe.src = group.groupLink;
      iframe.style.position = "fixed";
      iframe.style.top = "50%";
      iframe.style.left = "50%";
      iframe.style.transform = "translate(-50%, -50%)";
      iframe.style.width = "60%";
      iframe.style.height = "400px"// Adjust the height as needed
      

      listItem.appendChild(iframe);
      activeIframe = iframe;
    });

    listItem.appendChild(link);
    groupList.appendChild(listItem);
  });
}
  




