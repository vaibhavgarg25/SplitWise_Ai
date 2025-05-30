const express = require('express');
const User = require('./models/user-model')
const bcrypt = require('bcryptjs')
const Group = require('./models/group-model')
const mongoose = require('mongoose');
const Expense = require('./models/expense-model');
const multer = require("multer");
const Tesseract = require("tesseract.js");
const upload = multer({ storage: multer.memoryStorage() });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const emailexist = await User.findOne({ email: email })
        if (emailexist) {
            return res.status(400).send({
                message: "email already exists",
            })
        }
        const newuser = await User.create({ username, email, password })
        // console.log(newuser)
        res.status(201).json({
            message: "account registered",
            token: await newuser.generatetoken(),
            userid: newuser._id.toString(),
        })
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userexist = await User.findOne({ email: email })
        if (!userexist) {
            return res.status(400).send({ message: "email does not exist" })
        }
        const validpass = await bcrypt.compare(password, userexist.password);
        if (validpass) {
            res
                .status(200)
                .json({
                    message: "account login successfull",
                    token: await userexist.generatetoken(),
                    userid: userexist._id.toString(),
                });
        } else {
            res.status(401).send({ message: "invalid password or email" });
        }
    } catch (error) {
        console.log(error)
    }
}

const user = async (req, res) => {
    try {
        const userdata = req.user
        return res.status(200).json(userdata)
    } catch (error) {
        next(error)
    }
}

const getusers = async (req, res) => {
    try {
        const users = await User.find()
        // const usernames=users.map(user=>user.username)
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}


const updateusersbyid = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedata = req.body;
        const updateduser = await User.updateOne({ _id: id }, { $set: updatedata })
        return res.status(200).json(updateduser);
    } catch (error) {
        next(error)
    }
}

const creategroup = async (req, res, next) => {
    try {
        const { name, description, members } = req.body;
        const ids = members.map((ele) => new mongoose.Types.ObjectId(ele._id));
        const newgroup = await Group.create({ 
            groupname: name, 
            groupdesc: description, 
            members: ids 
        });

        await User.updateMany(
            { _id: { $in: members } }, 
            { $push: { groups: newgroup._id } }
        );

        const newExpense = await Expense.create({
            groupId: newgroup._id,
            groupname: name,
            groupdesc: description,
            expenseName: name,
            expenses: [] 
        });

        return res.status(201).json({ group: newgroup, expense: newExpense });
    } catch (error) {
        next(error);
    }
};


const getgroups = async (req, res, next) => {
    try {
        const idString = req.params.id
        const objectId = new mongoose.Types.ObjectId(idString);
        // console.log(id)
        const groups = await User.aggregate([
            { $match: { _id: objectId } },
            {
                $lookup: {
                    from: "groups",
                    localField: "groups",
                    foreignField: "_id",
                    as: "groupdetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    username: 0,
                    email: 0,
                    password: 0,
                    __v: 0 // Remove unnecessary field
                }
            }
        ]);
        return res.status(200).json(groups[0].groupdetails)
    } catch (error) {
        next(error)
    }
}

const deletegroupbyid = async (req, res, next) => {
    try {
        const groupId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID" });
        }

        const objectId = new mongoose.Types.ObjectId(groupId);

        await Group.deleteOne({ _id: objectId });

        await User.updateMany(
            { groups: objectId },
            { $pull: { groups: objectId } }
        );
        await Expense.deleteOne({ groupId: objectId });

        return res.json({ message: "Group and related expenses deleted successfully" });
    } catch (error) {
        next(error);
    }
};


const getgroupmembers = async (req, res, next) => {
    try {
        const idString = req.params.id
        const objectId = new mongoose.Types.ObjectId(idString);
        const data = await Group.aggregate([
            { $match: { _id: objectId } },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "memberdetails"
                }
            }, {
                $project: {
                    memberdetails: 1,
                    groupname: 1
                }
            }
        ])
        return res.status(201).json(data)
    } catch (error) {
        next(error)
    }
}

const getexpenses = async (req, res, next) => {
    try {
        const idString = req.params.id
        const objectId = new mongoose.Types.ObjectId(idString);
        const data = await Expense.findOne(
            { groupId: objectId },
            { _id: 0, expenses: 1 }
        );
        return res.status(201).json(data.expenses)
    } catch (error) {
        next(error)
    }
}

const getsplit = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required." });
        }
        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString("base64");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Extract items, quantity, and price from the bill image. If qty > 1, update the price as (price * qty) and append the qty in brackets next to the item name. Return a valid JSON array where each object contains a 'name' key for the item name, a 'price' key for the updated total price, and an 'assignedTo' key with an empty array []. Include 'Total GST' as an item with its price. Ensure the output is a clean JSON array of objects without extra formatting or strings, so it can be directly used in JavaScript.";
        const result = await model.generateContent([
            { text: prompt },
            { inlineData: { mimeType: req.file.mimetype, data: base64Image } },
        ]);
        const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
        const rawResponse = responseText.replace(/^```json/, "").replace(/```$/, "").trim();
        const jsonResponse = JSON.parse(rawResponse);
        return res.status(200).json({ success: true, geminiResponse: jsonResponse });
    } catch (error) {
        console.error("Error in getsplit:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const unequalsplit=async(req,res,next)=>{
    try {
        const {groupId,group,description,members,amount,totalAmount}=req.body
        const groupexist=await Expense.findOne({groupId:groupId})
        if(groupexist){
            await Expense.updateOne({groupId:groupId}, { $push: { expenses: {description,date:new Date(),members,totalAmount}} })
            return res.status(200).json("updated sucessfully")
        }
        return res.status(400).json("group does not exist")
    } catch (error) {
        next(error)
    }
}

const getUserActivityInGroup = async (req, res, next) => {
    try {
      const { userId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
      }
  
      
      const user = await User.findById(userId, 'groups');
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const groupIds = user.groups; 
      if (!groupIds || groupIds.length === 0) {
        return res.json({
          totalSpent: null,
          activities: []
        });
      }
  
      let totalSpent = 0;
      let userActivities = [];
  
      for (const groupId of groupIds) {
        if (!mongoose.Types.ObjectId.isValid(groupId)) continue; 
        const expenses = await Expense.findOne({ groupId: groupId });
        if (!expenses) continue;
  
        expenses.expenses.forEach((expense) => {
          expense.members.forEach((member) => {
            if (member.memberId.toString() === userId) {
              totalSpent += member.amount;
              userActivities.push({
                description: expense.description,
                date: expense.date,
                amountSpent: member.amount
              });
            }
          });
        });
      }
  
      return res.json({
        totalSpent,
        activities: userActivities
      });
  
    } catch (error) {
      next(error);
    }
  };  


module.exports = {
    signup,
    login,
    user,
    updateusersbyid,
    creategroup,
    getusers,
    getgroups,
    deletegroupbyid,
    getgroupmembers,
    getexpenses,
    getsplit,
    upload,
    unequalsplit,
    getUserActivityInGroup
}