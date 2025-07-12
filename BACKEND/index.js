const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://siva:Sivabalankarthi%402003@cluster0.jv9pt0h.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log("Error connecting to MongoDB"));

 const credentialSchema = new mongoose.Schema({
   user: String,
   password: String,
});

// Create model
const Credential = mongoose.model("bulkmail",credentialSchema, "bulkmail");



// Fetch credentials and set up transporter
Credential.findOne().then(data => {
  if (!data) {
    console.error("No credentials found in DB.");
    return;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: data.user,
      pass: data.password,
    },
  });

  console.log("Transporter initialized with:", data.user);
}).catch(err => {
  console.error("Error fetching data from MongoDB:", err);
});

// Email sending route
app.post("/sendemail", async (req, res) => {
  const { emailList, msg } = req.body;

  if (!emailList || !msg) {
    return res.status(400).json({ error: "emailList and msg are required." });
  }

  if (!transporter) {
    return res.status(500).json({ error: "Email transporter not ready." });
  }

  try {
    const sendMailPromises = emailList.map(email => {
      return transporter.sendMail({
        from: transporter.options.auth.user,
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
