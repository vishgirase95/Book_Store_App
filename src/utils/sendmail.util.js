import dotenv from 'dotenv';
import nodemailer from "nodemailer";


dotenv.config("./.env");
let password=process.env.EMAIL_PASS
let EMAIL_ID=process.env.EMAIL_ID_AUTH
export const mailSend=(mail_ID,token)=>{
const transport=nodemailer.createTransport(
    
    {
        
        service: "gmail",
        auth:{
            user:EMAIL_ID,
            pass:password
        }
    }
)



const mailOption={
    from:EMAIL_ID,
    to:mail_ID,
    subject:"BridgeLabz:Pasword Reset",
    text: "Hello world?",
    html:`<h2 style="color:#9a3fda">Hello Sir,Please Reset your password by below link!</h2><h3>Varification Link : <span style="color:#9a3fda"><a href="http://localhost:5000/${token}">click here</a></h3>`
  
}



return new Promise((resolve, reject) => {
    transport.sendMail(mailOption, (err, result) => {
        if (err) {
            return reject(err)
        }
        
        return resolve({result,token});
    });
});

}
    
