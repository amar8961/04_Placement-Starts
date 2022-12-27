const nodemailer = require("nodemailer");
const ForgotPassword=require('../model/forgotPassword')
const Users=require('../model/users')
const { v4: uuidv4 } = require('uuid');
const url="http://localhost:4000/resetPassword/"
const bcrypt = require('bcrypt');
const saltRounds = 10;

var password="fzegxhjutcimuixo"
// to get this password
// 1. Go to your Google account at https://myaccount.google.com/
// 2. Go to Security
// 3. In "Signing in to Google" section choose 2-Step Verification - here you have to verify yourself, in my case it was with phone number and a confirmation code send as text message. After that you will be able to enabled 2-Step Verification
// 4. Back to Security in "Signing in to Google" section choose App passwords
// 5. From the Select app drop down choose Other (Custom name) and put a name e.g. nodemailer
// 6. A modal dialog will appear with the password. Get that password and use it in your code.

exports.sendMail=(req, res, next)=>{
    const id=uuidv4()
    ForgotPassword.create({
        id:id,
        email:req.params.email,
        isActive:true
    }).then(response=>{
        var from="amarkr75@gmail.com"
        var to=req.params.email
        var subject="Password Reset Link"
        var message=`Here's your Password Reset Link:${url}${id}`

        var transporter=nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:from,
                pass:password
            }
        });
        var mailOptions={
            from: from,
            to: to,
            subject: subject,
            text: message
        };

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err)
            }
            else{
                res.status(200).send({info:info.response, sent:true})
                console.log(info)
            }
        })
    })
}

exports.resetPassword=(req, res, next)=>{
    const uuid=req.params.uuid
    ForgotPassword.findOne({where: {id:uuid, isActive:true}})
    .then(entry=>{
        console.log(entry)
        if (entry){
            res.sendFile('/views/reset.html', {root: __dirname })  // reset html
        }else{
            res.send(`<h1>"Invalid Link"</h1>`)
        }
    })
}

exports.updatePassword=(req, res, next)=>{
    var uuid=(req.params.uuid)
    ForgotPassword.findOne({where: {id:uuid, isActive:true}}).then(entry=>{
        if (entry){
            entry.isActive=false
            entry.save()
            Users.findOne({where:{email:entry.email}}).then(user=>{
                bcrypt.hash(req.body.password, saltRounds).then((hash)=>{
                    user.password=hash
                    user.save()
                    console.log('Password Updated!')
                }).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }else{
            console.log(entry)
        }
    }).catch(err=>console.log(err))
}
