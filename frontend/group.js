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
   
    const groupData = {
        name: groupName,
        members: membersSelect
    };
    
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:4000/group/create", groupData, { headers: { Authorization: token } });
        
        if (response.status === 201){
            alert(response.data.message);
            
            window.location.href = "./group.html";

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
          showAllGroups(groups);
      }
  } catch (error) {
      console.log(error);
  }
}

function showAllGroups(groups) {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = "";
  
  groups.forEach((group) => {
      const listItem = document.createElement("li");
      listItem.textContent = group;
      groupList.appendChild(listItem);
  });
}


  




