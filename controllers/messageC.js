const chatTable = require('../models/messageTable')

const grpTable = require('../models/groupTable')

const myTable = require('../models/userTable')

const groupNUser = require('../models/usergroupTable')



const sendMessage = async (req, res) => {
  try {
    const newMessage = {
      message: req.body.message,
      name: req.body.name,
      id: req.body.id,
      userId: req.user.id,
      groupId: req.body.groupId,
      
      
    };

    const result = await chatTable.create(newMessage);

    console.log(result);

    res.status(200).json({
      message: "Message added to DB",
      user: req.user,
    });
  } catch (err) {
    console.log(err);

    res.status(404).json({
      message: "Something went wrong",
    });
  }
};




const getMessage = async (req, res, next) => {
  try {
    const groupId = req.query.groupId
    const messages = await chatTable.findAll({
      where: { groupId: groupId },
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
      res.status(200).json({ msg: messages })
  } catch (error) {
      console.log('Get message is failing', error)
      res.status(500).json({ error: 'err' })
  }
}



const getUsers = async (req, res) => {
  try {
    const groupId = req.query.groupId;

    // Find all the userIDs corresponding to the given groupID
    const users = await groupNUser.findAll({
      attributes: ['userId'],
      where: {
        groupId: groupId
      }
    });

    // Extract the userIDs from the result
    const userIds = users.map(user => user.userId);

    // Find the names and emails of users based on the userIDs
    const userDetails = await myTable.findAll({
      attributes: ['name', 'email'],
      where: {
        id: userIds
      }
    });

    res.status(200).json({
      message: "User details retrieved successfully",
      users: userDetails
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error retrieving user details"
    });
  }
};

  module.exports = {
   sendMessage,
   getMessage,
   getUsers
}