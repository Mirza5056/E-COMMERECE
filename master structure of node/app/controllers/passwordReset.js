const sendEmail = require('../utils/emailSender');
const User = require('../models/Users');
const bcrypt = require('bcrypt');
/*const generateOTP = () => {
//  Math.floor(100000 + Math.random() * 900000).toString();
}*/
exports.forgetPassword = async (req, res) => {
  // First Email Will Enter User
  const { email } = req.body;
  const user = await User.findOne({ email });
  // If user not exists then we will show this message.
  if (!user)
    res.status(400).json({ message: 'User not find' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Like otp will expire in 10 minutes.
  const expire = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = otp;
  user.otpExpiry = expire;
  const { format } = require('date-fns');
  const date = new Date();
  const formatDate = format(date, 'yyyy-MM-dd')
  await user.save();
  //console.log("Code have been running here");
  await sendEmail(
    email,
    'Your Otp For Password Reset',
    `<!DOCTYPE html>
        <head>
        <html lang="en">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1663574980688_114990/archisketch-logo"
                  height="30px"
                />
              </td>
              <!--<td style="text-align: right;">
                <span
                  style="font-size: 10px; line-height: 30px; color: #ffffff;"
                  >${formatDate}</span
                >
              </td>-->
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Your OTP
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              ${user.name.toUpperCase()},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for choosing Zayra Mart. Use the following OTP
              to complete the procedure to change your password. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">10 minutes</span>.
              Do not share this code with others, including Zayra Mart
              employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 25px;
                font-weight: 600;
                letter-spacing: 10px;
                color: #ba3d4f;
              "
            >
              ${otp}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:kamranakthar8@gmail.com"
            style="color: #499fb6; text-decoration: none;"
            >zayramart@gmail.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          Zayra Mart
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 540, Ujjain Near Freeganj, Madhya Pradesh.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2022 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
`
  );
  //console.log("Code successfully comes here...");
  res.json({ message: 'OTP have been send to your email.' });
};


exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  console.log(email, otp, newPassword, confirmPassword);
  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Password does not match." });

  const user = await User.findOne({ email, otp });
  if (!user || user.otpExpiry < new Date())
    return res.status(400).json({ message: 'Invalid or Expiry OTP.' });

  const hashPassword = await bcrypt.hash(confirmPassword, 10);
  user.password = hashPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ message: 'Password reset successfully.' });
};