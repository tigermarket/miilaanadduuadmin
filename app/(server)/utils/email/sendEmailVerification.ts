// import nodemailer from "nodemailer";
// import Mailgen from "mailgen";
// import { google } from "googleapis";

// export async function sendEmailVerification({
//   to,
//   username,
//   verificationUrl,
// }: {
//   to: string;
//   username: string;
//   verificationUrl: string;
// }) {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI
//   );

//   oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
//   const accessToken = await oauth2Client.getAccessToken();

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.EMAIL_SENDER,
//       clientId: process.env.CLIENT_ID!,
//       clientSecret: process.env.CLIENT_SECRET!,
//       refreshToken: process.env.REFRESH_TOKEN!,
//       accessToken: accessToken?.token as string,
//     },
//   });

//   const mailGenerator = new Mailgen({
//     theme: "#22ccdd",
//     product: {
//       name: "Miilaan",
//       link: "http://localhost:3000",
//     },
//   });

//   const mailgenContent = {
//     body: {
//       name: username,
//       intro: "Welcome! Let’s get your email verified.",
//       action: {
//         instructions: "Click the button to verify your email:",
//         button: {
//           color: "#22BC66",
//           text: "Verify email",
//           link: verificationUrl,
//         },
//       },
//       outro: "If you didn’t create an account, you can ignore this email.",
//     },
//   };

//   const emailText = mailGenerator.generatePlaintext(mailgenContent);
//   const emailHtml = mailGenerator.generate(mailgenContent);

//   await transporter.sendMail({
//     from: `"${process.env.APP_NAME}" <${process.env.EMAIL_SENDER}>`,
//     to,
//     subject: "Verify your email",
//     text: emailText,
//     html: emailHtml,
//   });
// }
import nodemailer from "nodemailer";
import { google } from "googleapis";

export async function sendEmailVerification({
  to,
  username,
  verificationUrl,
}: {
  to: string;
  username: string;
  verificationUrl: string;
}) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = await oauth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_SENDER,
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      refreshToken: process.env.REFRESH_TOKEN!,
      accessToken: accessToken?.token as string,
    },
  });

  const emailText = `
Hi ${username},

Welcome to Miilaan! Let’s get your email verified.

Click the link below to verify your email:
${verificationUrl}

If you didn’t create an account, you can ignore this email.
`;

  const emailHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Welcome, ${username}!</h2>
    <p>Let’s get your email verified.</p>
    <p>Click the button below to verify your email:</p>
    <a href="${verificationUrl}" 
       style="display:inline-block; padding:10px 20px; background-color:#22BC66; color:#fff; text-decoration:none; border-radius:5px;">
       Verify Email
    </a>
    <p style="margin-top:20px;">If you didn’t create an account, you can ignore this email.</p>
  </div>
  `;

  await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_SENDER}>`,
    to,
    subject: "Verify your email",
    text: emailText,
    html: emailHtml,
  });
  return {
    success: true,
    message: "Email sent successful",
  };
}
