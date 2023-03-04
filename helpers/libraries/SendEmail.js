const nodemailer=require("nodemailer")

const sendEmail = async(mailOptions) => {

    await nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }).sendMail(mailOptions)

    
    

}

module.exports = sendEmail;