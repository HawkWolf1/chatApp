
const grpTable = require('../models/groupTable')
const myTable = require('../models/userTable')
const groupNUser = require('../models/usergroupTable')



const getUsers = async (req, res) => {
  try {
    const groupId = req.query.groupId;

    const users = await groupNUser.findAll({
      attributes: ['userId', 'admin'], // Include the 'admin' column
      where: {
        groupId: groupId,
      },
    });

    const userIds = users.map(user => user.userId);
    const userDetails = await myTable.findAll({
      attributes: ['id', 'name', 'email'],
      where: {
        id: userIds,
      },
    });

    // Merge 'admin' information into 'userDetails'
    const usersWithAdmin = userDetails.map(user => {
      const matchingUser = users.find(u => u.userId === user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: matchingUser ? matchingUser.admin : false,
      };
    });

    res.status(200).json({
      message: "User details retrieved successfully",
      users: usersWithAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving user details",
    });
  }
};







const isAdmin = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const userId = req.user.id

    const group = await groupNUser.findOne({
      where: {
        groupId: groupId,
        userId: userId,
        admin: true
      }
    });
    console.log(group)
    console.log('cxcxcxcxcxcxcxcxcxc')

    if (group) {
      res.status(200).json({ isAdmin: true });
    } else {
      res.status(200).json({ isAdmin: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error checking admin status" });
  }
};







const addMoreUser = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const email = req.body.email;
    console.log('waterman')

    const user = await myTable.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const group = await grpTable.findOne({
      where: { id: groupId },
    });
    console.log('rrrrrerman')
    console.log('group:', group);
    if (group.members.includes(email)) {
      return res.status(400).json({ message: "User is already a member of the group" });
    }

    let membersArray = group.members;
    if (typeof membersArray === "string") {
      membersArray = membersArray.split(";").map((member) => member.trim());
    }
    console.log('roseman')
    const [affectedRows, _] = await grpTable.update(
      {
        members: membersArray.concat([email]).join(", "),
      },
      {
        where: { id: groupId },
      }
    );
    console.log('firerman')
    console.log(affectedRows);

    if (affectedRows > 0) {
      console.log('inside if statement');
      const updatedGroup = await grpTable.findOne({
        where: { id: groupId },
      });

      console.log('updatedGroup:', updatedGroup);

      if (updatedGroup && updatedGroup.members) {
        const memberEmails = updatedGroup.members.split(",");
        const memberIDs = [];
        console.log('rowdyman')
        while (memberEmails.length > 0) {
          const email = memberEmails[0];

          const member = await myTable.findOne({
            attributes: ["id"],
            where: {
              email: email.trim(),
            },
          });
          console.log('baiganman')
          if (member) {
            memberIDs.push(member.id);
            memberEmails.splice(0, 1);
          }
        }

        console.log("Member IDs:", memberIDs);
        console.log('superman')

      
        await groupNUser.destroy({ where: { groupId } });

       
        await Promise.all(
          memberIDs.map((memberID) => {
            return groupNUser.create({
              groupId,
              userId: memberID,
            });
          })
        );
      }
    }

    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding user to the group" });
  }
};




const removeUser = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const userId = req.body.userId;

    console.log(userId)
    console.log('fffffffffffffff')

    await groupNUser.destroy({ where: { groupId, userId } });

    const remainingUsers = await groupNUser.findAll({
      where: { groupId },
    });

    const remainingUserIds = remainingUsers.map((user) => user.userId);
    const remainingUserEmails = await myTable.findAll({
      attributes: ["email"],
      where: { id: remainingUserIds },
    });

    const updatedMembers = remainingUserEmails.map((user) => user.email).join(", ");
    await grpTable.update(
      { members: updatedMembers },
      { where: { id: groupId } }
    );

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing user from the group" });
  }
};





const adminRemove = async (req, res) => {
  try {
    const { groupId } = req.body;
    const {userId} = req.body

    const userIds = await groupNUser.findAll({
      attributes: ['userId'],
      where: {
        groupId: groupId,
      },
    });

    console.log(userIds)

    await groupNUser.update(
      { admin: false },
      {
        where: {
          groupId: groupId,
          userId: userId
          
        },
      }
    );

    res.status(200).json({ message: "Admin removed successfully", userIds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};




const adminAdd = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const userIds = await groupNUser.findAll({
      attributes: ['userId'],
      where: {
        groupId: groupId,
      },
    });

    console.log(userIds);

    await groupNUser.update(
      { admin: true },
      {
        where: {
          groupId: groupId,
          userId: userId,
        },
      }
    );

    res.status(200).json({ message: "Admin added successfully", userIds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


  module.exports = {
   getUsers,
   isAdmin,
   addMoreUser,
   removeUser,
   adminRemove,
   adminAdd
}