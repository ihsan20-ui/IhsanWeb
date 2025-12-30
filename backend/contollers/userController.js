import userModel from "../modals/userModal.js";
import jwt from 'jsonwebtoken'
import bycrypt from "bcryptjs";

import validator from 'validator'

const  loginUser=async (req,res)=>{
    const {email,password}=req.body
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User Does not exist"})
        }
        const isMatch=await bycrypt.compare(password,user.password)
        if(!isMatch){
            return  res.json({success:false,message:"invalid creds"})
        }

        const token =createToken(user._id);
        res.json({success:true,token})

    }catch(error){
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const registerUser=async(req ,res)=>{
    const {username,password,email}=req.body;
    try {
        const exists=await userModel.findOne({email})
        if(exists){
            return  res.json({success:false,message:"user already Exists"})
        }

        if(!validator.isEmail(email)){
             return  res.json({success:false,message:"please enter a vaild email"})
        }

        if(password.length <8){
               return  res.json({success:false,message:"please enter a strong password"})
        }

        const salt=await bycrypt.genSalt(10)
        const hashedPassword=await bycrypt.hash(password,salt)

        //new user
        const newUser=new userModel({
            username:username,
            email:email,
            password:hashedPassword
        })

        const user=await newUser.save()

        const token=createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

export {loginUser,registerUser}