const chatTable = require('../models/messageTable')

const grpTable = require('../models/groupTable')

const myTable = require('../models/userTable')

const groupNUser = require('../models/usergroupTable')

const aMsgTable = require('../models/archivedMsgTable')

const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const moment = require('moment');



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

    req.app.get('io').emit('newMessage', newMessage);

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
    const groupId = req.query.groupId;

    // Retrieve messages to be deleted
    const deletedMessages = await chatTable.findAll({
      where: {
        groupId: groupId,
        createdAt: {
          [Sequelize.Op.lt]: moment().subtract(60, 'minutes').toDate()
        }
      }
    });

    // Archive deleted messages
    await aMsgTable.bulkCreate(deletedMessages.map(message => ({
      id: message.id,
      groupId: message.groupId,
      message: message.message,
      createdAt: message.createdAt,
      userId: message.userId,
      name: message.name,
      archiveDate: Sequelize.literal('CURRENT_DATE') 
    })));

    // Delete old messages
    await chatTable.destroy({
      where: {
        groupId: groupId,
        createdAt: {
          [Sequelize.Op.lt]: moment().subtract(60, 'minutes').toDate()
        }
      }
    });

    // Retrieve latest messages
    const messages = await chatTable.findAll({
      where: { groupId: groupId },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ msg: messages.reverse() });

    const io = req.app.get('io');
    io.emit('messages', messages);
  } catch (error) {
    console.log('Get message is failing', error);
    res.status(500).json({ error: 'err' });
  }
}




const groupName = async (req, res) => {
  try {
    const { groupId, newGroupName } = req.body;
    console.log(req.body)
    

    await grpTable.update(
      { groupName: newGroupName },
      { where: { id: groupId } },
       );


    res.status(200).json({ success: true, groupName: newGroupName });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Failed to update group name" });
  }
};





const leaveGroup = async(req,res) =>{
  try {
    const groupId = req.body.groupId;
    const userId = req.body.userId;

    console.log(userId)

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

    res.status(200).json({ message: "You left the Group" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error leaving the group" });
  }
};










  module.exports = {
   sendMessage,
   getMessage,
   groupName,
   leaveGroup
}