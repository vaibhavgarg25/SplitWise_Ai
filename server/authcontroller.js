const express = require('express');
const User = require('./models/user-model')
const bcrypt = require('bcryptjs')


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
        console.log(newuser)
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

module.exports = {
    signup,
    login
}