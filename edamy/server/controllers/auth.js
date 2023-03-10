import User from "../models/user"
import {hashPassword,comparePassword} from '../utils/auth'
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import nanoid from 'nanoid';



const awsConfig={
    accessKeyId: process.env.AWS_ACCESS_KEY_IDNew,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEYNew,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}


// AWS.config.update({region: 'ap-south-1'})

const SES=new AWS.SES(awsConfig)


export const register= async (req,res)=>{

    try{
        const {name,email,password}=req.body
        if(!name) return res.status(400).send("Name is required")
        if(!password || password.length<6){
            return res.status(400).send("Password is required and should be min 6 characters long")
        }
        let userExist= await User.findOne({email}).exec()

        if(userExist){
            return res.status(400).send("Email is taken")
        }

        const hashedPassword=await hashPassword(password)

        const user=await new User({
            name,email,password:hashedPassword
        })
        user.save()

        return res.json({ok:true})
    }
    catch(err){
        console.log(err)
        return res.status(400).send("Error. Try again.")
    }

}

export const login= async (req,res)=>{

    try{
        const {email,password}=req.body
       
        let user= await User.findOne({email}).exec()

        if(!user){
            return res.status(400).send("No User Found")
        } 

        const match=await comparePassword(password,user.password)

        if(!match){
            return res.status(400).send("Password is wrong")
        } 

        const token=jwt.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'})

        user.password=undefined

        res.cookie("token",token,{
            httpOnly:true,
            // secure:true
        })

        return res.json({user})
    }
    catch(err){
        console.log(err)
        return res.status(400).send("Error. Try again.")
    }

}

export const logout= async (req,res)=>{

    try{
        res.clearCookie("token")
        return res.json({message:"Signout success"})
    }
    catch(err){
        console.log(err)
    }

}

export const currentUser= async (req,res)=>{

    try{
        console.log(req.auth)
        const user=await User.findById(req.auth._id).select('-password').exec()
        return res.json({user,ok:true})
    }
    catch(err){
        console.log(err)
    }

}

export const sendTestEmail= async (req,res)=>{
    

    const params={
        Source:process.env.EMAIL_FROM,
        Destination:{
            ToAddresses:[process.env.EMAIL_FROM]
        },
        Message:{
            Body:{
                Html:{
                    Charset:"UTF-8",
                    Data:`
                        <html>
                            <h1>Reset password link</h1>
                            <p>please use following link to reset password</p>
                        </html>
                    `
                }
            },
            Subject:{
                Charset:"UTF-8",
                Data:"Password reset link"
            }
        }
    }
   
    try{
        var sendPromise =await SES.sendEmail(params).promise();
        console.log(sendPromise)
        return res.json({ok:true})
    }
    catch(e){
        console.log(e)
    }
   
}

export const forgotPassword= async (req,res)=>{
    try{
        const {email}=req.body

        const shortCode=nanoid(6).toUpperCase()

        const user=await User.findOneAndUpdate({email},{passwordResetCode:shortCode})

        if(!user) return res.status(400).send()

        const params={
            Source:process.env.EMAIL_FROM,
            Destination:{
                ToAddresses:[process.env.EMAIL_FROM]
            },
            Message:{
                Body:{
                    Html:{
                        Charset:"UTF-8",
                        Data:`
                            <html>
                                <h1>Reset password link</h1>
                                <p>please use following code to reset password</p>
                                <h2 style="color:red;">${shortCode}</h2>
                                <i>edemy.com</i>
                            </html>
                        `
                    }
                },
                Subject:{
                    Charset:"UTF-8",
                    Data:"Password reset link"
                }
            }
        }

        try{
            var sendPromise =await SES.sendEmail(params).promise();
            return res.json({ok:true})
        }
        catch(e){
            console.log(e)
        }
    }
    catch(err){
        console.log(err)
    }
}

export const resetPassword= async (req,res)=>{
    try{
        const {email,code,newPassword}=req.body
        console.log(email,code,newPassword)
        const hashedPassword=await hashPassword(newPassword)

        const user=User.findOneAndUpdate({
            email,
            passwordResetCode:code
        },{
            password:hashedPassword,
            passwordResetCode:""
        }).exec()

        return res.json({ok:true})

    }
    catch(err){
        console.log(err)
        return res.status(400).send('Error! try again')
    }
}
