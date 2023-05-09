const chatTable = require('../models/messageTable')

const sendMessage = async (req, res) => {
  try {
    const newMessage = {
      message: req.body.chatInput,
      name: req.body.name1,
      id: req.body.id,
      
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


  module.exports = {
   sendMessage
}