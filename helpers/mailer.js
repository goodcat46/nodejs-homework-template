require("dotenv").config();

const nodemailer = require("nodemailer");

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

async function sendEmail(emailOptions) {
  if (!emailOptions) {
    return;
  }
  const msg = {
    from: UKR_NET_EMAIL,
    to: emailOptions?.to,
    object: emailOptions?.object,
    text: emailOptions?.text,
    html: emailOptions?.html,
  };
  try {
    const res = transporter.sendMail(msg);

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = sendEmail;
