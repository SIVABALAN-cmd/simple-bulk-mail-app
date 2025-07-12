// const express = require("express")
// const cors = require("cors")
// const app = express()

// app.use(cors())


  


// app.use(express.json())


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service:"gmail",
//   auth: {
//     user: "smartsiva265@gmail.com",
//     pass: "rhvq rffb gdfg ktpf ",
//   },
// });
// var emailList = req.body.emailList;
// var msg = req.body.msg  ;
// app.post("/sendemail",function(req,res){
//   for(var i=0;i<emailList.length;i++){
//       transporter.sendMail ({
//     from: "smartsiva265@gmail.com",
//     to:emailList[i],
//     subject: 'welcome to BulkMail',
//     text:"jo"
//   },
// function(error,info){
//     if(error){
//         console.log("Error Occured",error)
//         setstatus(false)
//     }
//     else{
//         console.log("Email Sent Successfully",info.response)
//         setstatus(true)
//     }
// });

// }})


// app.listen(5000,function(){
//     console.log("Server Started.....")
// })

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());
// mongosoe.connect("mongodb://127.0.0.1:27017/bulkmail")
// .then(function(){
//     console.log("Connected to MongoDB");

// })
// .catch(function(){

//   console.log("Error connecting to MongoDB");
// })



// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "smartsiva265@gmail.com", // Your Gmail ID
    pass: "rhvqrffbgdfgktpf",       // App Password (not your Gmail login password)
  },
});

// Email sending route
app.post("/sendemail", async (req, res) => {
  const { emailList, msg } = req.body;

  if (!emailList || !msg) {
    return res.status(400).json({ error: "emailList and msg are required." });
  }

  try {
    const sendMailPromises = emailList.map(email => {
      return transporter.sendMail({
        from: "smartsiva265@gmail.com",
        to: email,
        subject: "Welcome to BulkMail",
        text: msg,
      });
    });

    await Promise.all(sendMailPromises);

    console.log("All emails sent successfully.");
    res.json(true);
  } catch (error) {
    console.error("Error sending emails:", error);
    res.json(false);
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
