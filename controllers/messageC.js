const chatTable = require('../models/messageTable')

const sendMessage = async (req, res) => {
  try {
    const newMessage = {
      message: req.body.message,
      name: req.body.name,
      id: req.body.id,
      userId: req.user.id
      
      
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
    const messages = await chatTable.findAll()
      res.status(200).json({ msg: messages })
  } catch (error) {
      console.log('Get message is failing', error)
      res.status(500).json({ error: 'err' })
  }
}



  module.exports = {
   sendMessage,
   getMessage
}