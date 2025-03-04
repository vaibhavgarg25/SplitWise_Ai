const express = require('express');
const User = require('./models/user-model')
const bcrypt = require('bcryptjs')
const Group = require('./models/group-model')
const mongoose = require('mongoose');
const Expense = require('./models/expense-model');


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
        const newgroup = await Group.create({ groupname: name, groupdesc: description, members: ids })
        const updateuser = await User.updateMany({ _id: { $in: members } }, { $push: { groups: newgroup._id } })
        return res.status(201).json(newgroup)
    } catch (error) {
        console.log(error)
    }
}

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
        await User.updateMany({ groups: objectId }, { $pull: { groups: objectId } });
        return res.json({ message: "Group deleted successfully" });
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
        const { GoogleGenerativeAI } = require("@google/generative-ai");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "who will win today in india vs aus";

        const result = await model.generateContent(prompt);
        return res.status(201).json(result.response.text())
    } catch (error) {
        next(error)
    }
}

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
    getsplit
}