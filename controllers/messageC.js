const chatTable = require('../models/messageTable')

const grpTable = require('../models/groupTable')



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
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
      res.status(200).json({ msg: messages.reverse() })
  } catch (error) {
      console.log('Get message is failing', error)
      res.status(500).json({ error: 'err' })
  }
}





const groupName = async (req, res) => {
  try {
    const { groupId, newGroupName } = req.body;
    console.log(req.body)
    console.log('11111')

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





  module.exports = {
   sendMessage,
   getMessage,
   groupName
}