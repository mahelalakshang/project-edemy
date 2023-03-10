// import  expressJwt from "express-jwt";
var { expressjwt: jwt } = require("express-jwt");

// console.log(req.cookies)
export const requireSignin = jwt({

    
    getToken: (req,res)=>req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms:["HS256"]
})





