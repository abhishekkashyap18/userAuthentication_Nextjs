// going to use Nodemailers
import nodemailer from 'nodemailer'
import bcryptjs from "bcryptjs"
import User from '@/models/user.model';

export const sendEmail = async({email, emailType, userId}: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        if(emailType === "VERIFY" ){
            await User.findByIdAndUpdate(userId,
                {
                    $set:{
                        verifyToken: hashedToken, 
                        verifyTokenExpiry: Date.now() + 3600000
                    }
                }
            )
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,
                {
                    $set: {forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now()+3600000}
                }
            )
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "1d8ebf6a2d9e80",  //yaha nahi hone chaiye the
              pass: "4c69c887f5055e"   //yaha nahi hone chaiye the
            }
          });

          const mailOptions = {
            from: 'hitesh@hitesh.ai', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY'? "Verfiy your email" :"Reset your Password"  , // Subject line
            html: `<p>click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === 'VERIFY'? "Verfiy your email" :"Reset your Password"} or copy and paste the link below in your browser. <br>
            ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // html body
          }

          const mailResponse = await transport.sendMail(mailOptions)
          return mailResponse;
          
    } catch (error:any) {
        throw new Error(error.message)
    }
}