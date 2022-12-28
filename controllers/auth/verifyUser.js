const { createError, sendEmail } = require("../../helpers");

const {
  USER_VERIFY_SUCCESS,
  USER_VERIFY_ERROR,
  USER_VERIFIED,
  REPEAT_VERIFY,
} = require("./authConstants");

const {
  getUserByEmail,
  updateUserById,
  getUserByVerifyToken,
} = require("../../models/authModel/auth");

async function verifyUserViaEmail(req, res, next) {
  const { params, body, method } = req;
  let user;
  console.log(req);
  if (method === "GET" && params.verificationToken) {
    user = await getUserByVerifyToken(params.verificationToken);
    if (!user) {
      throw createError({ status: 404 });
    }
    const updatedUser = await updateUserById({
      id: user._id,
      body: { verificationToken: "", verify: true },
    });

    if (!updatedUser) {
      throw createError({ status: 409, message: USER_VERIFY_ERROR });
    }

    res.status(201).json({
      status: 201,
      message: USER_VERIFY_SUCCESS,
    });
  }
  if (method === "POST" && body.email) {
    user = await getUserByEmail(body.email);

    if (!user) {
      throw createError({ status: 404 });
    }
    console.log(user);
    if (user.verify) {
      res.status(201).json({
        status: 201,
        data: user,
        message: USER_VERIFIED,
      });
      return;
    }
    if (user.verificationToken) {
      const emailOptions = {
        to: "goodcat1994@gmail.com",
        subject: "Nodemailer test",
        text: `Привіт. Ми тестуємо надсилання листів!, Посилання для підтвердження реєстрації: http://localhost:3000/api/users/verify/${user.verificationToken}`,
        html: `<strong>Привіт. ${REPEAT_VERIFY}!. Посилання для підтвердження реєстрації: http://localhost:3000/api/auth/verify/${user.verificationToken}</strong>`,
      };

      const afterEmailSendRes = await sendEmail(emailOptions);

      res.status(201).json({
        status: 201,
        message: REPEAT_VERIFY,
        afterEmailSendRes,
      });
    }
  }
}

module.exports = verifyUserViaEmail;
