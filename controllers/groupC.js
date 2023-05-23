const grpTable = require('../models/groupTable')

const myTable = require('../models/userTable')

const groupNUser = require('../models/usergroupTable')




const fetchMembers = async(req,res) =>{
    try{
        const allEmails = await myTable.findAll({
            
                attributes: ["email"],
              
        })

        const emails = allEmails.map((member) => member.email)
        res.json(emails);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
      }
}




const createGroup = async (req, res) => {
    try {
      const newGroup = {
        members: req.body.members,
        groupName: req.body.name,
        id: req.body.id,
        // admin: req.user.id
        
      };
  
      const result = await grpTable.create(newGroup);
      const groupId = result.id; 
      console.log(result)
      
      const memberEmails = newGroup.members.split(',');
      const memberIDs = [];

      while (memberEmails.length > 0) {
        const email = memberEmails[0];
   
        const member = await myTable.findOne({
          attributes: ['id'],
          where: {
          email: email.trim()
         }
     });

    if (member) {
      memberIDs.push(member.id);
      memberEmails.splice(0, 1);
     }
    }

     console.log('Member IDs:', memberIDs);

     await Promise.all(memberIDs.map(async (memberID) => {
      const admin = (memberID === req.user.id); // Check if the member is the creator
      await groupNUser.create({
        groupId: groupId,
        userId: memberID,
        admin: admin,
      });
    }));

    const groupLink = `./chatapp.html?groupId=${groupId}`;
    await grpTable.update({ grouplink: groupLink }, { where: { id: groupId } });

      res.status(201).json({
        message: "Group added to DB",
        groupId: groupId 
      });


    } catch (err) {
      console.log(err);
  
      res.status(500).json({
        message: "Error adding group to DB",
      });
    }
  };





  const showGroups = async (req, res, next) => {
    try {
      const userId = req.query.userId

      const userGroups = await groupNUser.findAll({
        where: { userId: userId },
        attributes: ["groupId"],
      });
  
      const groupIds = userGroups.map((userGroup) => userGroup.groupId);
  
      const groups = await grpTable.findAll({
        where: { id: groupIds },
        attributes: ["groupName", "grouplink"],
      });

      const groupData = groups.map((group) => ({
        groupName: group.groupName,
        groupLink: group.grouplink,
      }));

     console.log(groupData)
      res.status(200).json({ groups: groupData });
    } catch (error) {
        console.log('fetch groups is failing', error)
        res.status(500).json({ error: 'err' })
    }
  }



module.exports = {
    fetchMembers,
    createGroup,
    showGroups
 }