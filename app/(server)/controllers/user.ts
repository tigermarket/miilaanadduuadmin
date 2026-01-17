"use server";
import { connectedToMongodb } from "../startup/db";
import { FormState, withErrorHandling } from "../utils/errorHandler";
import User, { validateSignupForm } from "../models/User";
import { sendEmailVerification } from "../utils/email/sendEmailVerification";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// export async function signup(
//   prevState: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   return withErrorHandling(async () => {
//     const { firstName, lastName, email, password } = await validateSignupForm(
//       formData
//     );
//     await connectedToMongodb();
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return { success: false, message: "Email already registered." };
//     }
//     const user = await User.create({
//       email,
//       firstName,
//       lastName,
//       password,
//       isEmailVerified: false,
//     });
//     const { unHashedToken, hashedToken, tokenExpiry } =
//       user.generateTemporaryToken();
//     user.emailVerificationToken = hashedToken;
//     user.emailVerificationExpiry = tokenExpiry;
//     await user.save({ validateBeforeSave: false });

//     const verificationUrl = `${
//       process.env.APP_URL
//     }/verify-email?token=${encodeURIComponent(
//       unHashedToken
//     )}&email=${encodeURIComponent(user.email)}`;
//     await sendEmailVerification({
//       to: user.email,
//       username: user.displayName || user.firstName,
//       verificationUrl,
//     });
//     return {
//       success: true,
//       message: "Verification email sent. Please check your inbox.",
//     };
//   });
// }

// const regesterSignInLog = async (status, user, deviceInfo, desc) => {
//   await Log.create({
//     succeed: status,
//     userId: user?._id,
//     actionType: "Sign-In",
//     description: desc,
//     details: {
//       email: user?.email,
//       device: deviceInfo?.model,
//       os: deviceInfo?.os,
//       ip: deviceInfo?.ipAddress,
//       browser: deviceInfo?.browser,
//       timestamp: new Date(),
//     },
//   });
// };
// const generateAccessAndRefreshTokens = async (userId) => {
//   const user = await User.findById(userId);
//   const accessToken = user.generateAccessToken();
//   const refreshToken = user.generateRefreshToken();
//   user.refreshToken = refreshToken;
//   await user.save({ validateBeforeSave: false });
//   return { accessToken, refreshToken };
// };
// const generateOptions = (link, email, unHashedToken, name) => {
//   let options = {
//     link: link,
//     email: email,
//     subject: "Please verify your email",
//     mailgenContent: {
//       body: {
//         name: name,
//         intro: "Welcome to Addu! We're very excited to have you on board.",
//         action: {
//           instructions: `Use this confirmation code: ${unHashedToken} or just click the confirm your account button to complete confirmation `,
//           button: {
//             color: "#22BC66",
//             text: "Confirm your account",
//             link: `${link}/auth/confirm?code=${unHashedToken}`,
//           },
//         },
//         outro:
//           "Need help, or have questions? Just reply to this email, we'd love to help.",
//       },
//     },
//   };
//   return options;
// };
const sendEmail = async (user: any) => {
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${
    process.env.APP_URL
  }/verify-email?token=${encodeURIComponent(
    unHashedToken
  )}&email=${encodeURIComponent(user.email)}`;
  await sendEmailVerification({
    to: user.email,
    username: user.displayName || user.firstName,
    verificationUrl,
  });
  return {
    success: true,
    message: "Verification email sent. Please check your inbox.",
  };
};
export const signup = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  return withErrorHandling(async () => {
    const { firstName, lastName, email, password } = await validateSignupForm(
      formData
    );
    await connectedToMongodb();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email already registered." };
    }
    const user = await User.create({
      email,
      firstName,
      lastName,
      password,
      isEmailVerified: false,
    });
    return sendEmail(user);
  });
};
export const resend = async (email?: string): Promise<FormState> => {
  return withErrorHandling(async () => {
    if (!email)
      return { success: false, message: "You must provide valid email" };
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: "User with this email not found." };
    }

    return sendEmail(user);
  });
};
export const verifyEmail = async (verificationToken: string, email: string) => {
  if (!verificationToken) {
    const err = new Error(
      "We couldn’t verify your email. The link may have expired or already been used."
    );
    (err as any).email = email;
    throw err;
  }

  let hashedToken = createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
    email: email,
  });

  if (!user) {
    const err = new Error(
      "We couldn’t verify your email. The link may have expired or already been used."
    );
    (err as any).email = email;
    throw err;
  }
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  const savedUser = await user.save({ validateBeforeSave: false });
  console.log("========Look at the access token the following==============");
  console.log(savedUser);
  console.log(accessToken);
  console.log(savedUser.accessToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  cookieStore.set("session", accessToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  redirect("/miilaan");
};

// export default {
//   // signup: async (
//   //   prevState: FormState,
//   //   formData: FormData
//   // ): Promise<FormState> => {
//   //   return withErrorHandling(async () => {
//   //     const { firstName, lastName, email, password } = await validateSignupForm(
//   //       formData
//   //     );
//   //     await connectedToMongodb();
//   //     const existingUser = await User.findOne({ email });
//   //     if (existingUser) {
//   //       return { success: false, message: "Email already registered." };
//   //     }
//   //     const user = await User.create({
//   //       email,
//   //       firstName,
//   //       lastName,
//   //       password,
//   //       isEmailVerified: false,
//   //     });
//   //     return sendEmail(user);
//   //   });
//   // },
//   // resend: async (email?: string): Promise<FormState> => {
//   //   return withErrorHandling(async () => {
//   //     if (!email)
//   //       return { success: false, message: "You must provide valid email" };
//   //     const user = await User.findOne({ email });

//   //     if (!user) {
//   //       return { success: false, message: "User with this email not found." };
//   //     }

//   //     return sendEmail(user);
//   //   });
//   // },
//   // verifyEmail: async (verificationToken: string, email: string) => {
//   //   return withErrorHandling(async () => {
//   //     if (!verificationToken) {
//   //       const err = new Error(
//   //         "We couldn’t verify your email. The link may have expired or already been used."
//   //       );
//   //       (err as any).email = email;
//   //       throw err;
//   //     }

//   //     let hashedToken = createHash("sha256")
//   //       .update(verificationToken)
//   //       .digest("hex");
//   //     const user = await User.findOne({
//   //       emailVerificationToken: hashedToken,
//   //       emailVerificationExpiry: { $gt: Date.now() },
//   //       email: email,
//   //     });

//   //     if (!user) {
//   //       const err = new Error(
//   //         "We couldn’t verify your email. The link may have expired or already been used."
//   //       );
//   //       (err as any).email = email;
//   //       throw err;
//   //     }
//   //     user.emailVerificationToken = undefined;
//   //     user.emailVerificationExpiry = undefined;
//   //     user.isEmailVerified = true;
//   //     await user.save({ validateBeforeSave: false });
//   //     const accessToken = user.generateAccessToken();
//   //     const refreshToken = user.generateRefreshToken();
//   //     user.refreshToken = refreshToken;
//   //     const savedUser = await user.save({ validateBeforeSave: false });
//   //     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   //     const cookieStore = await cookies();
//   //     cookieStore.set("session", accessToken, {
//   //       httpOnly: true,
//   //       secure: true,
//   //       expires: expiresAt,
//   //       sameSite: "lax",
//   //       path: "/",
//   //     });
//   //     redirect("/miilaan");
//   //   });
//   // },
//   // createUser: async (req, res) => {
//   //   const { email, firstName, lastName, password } = req.body;
//   //   const existedUser = await User.findOne({ email });
//   //   if (existedUser) return res.status(409).send("User already Registered");
//   //   const user = await User.create({
//   //     creator: req.user?._id,
//   //     mustResetPassword: true,
//   //     email,
//   //     firstName,
//   //     lastName,
//   //     password,
//   //     displayName: firstName + " " + lastName,
//   //     isEmailVerified: true,
//   //   });
//   //   const savedUser = await user.save();
//   //   const { unHashedToken, hashedToken, tokenExpiry } =
//   //     savedUser.generateTemporaryToken();
//   //   savedUser.forgotPasswordToken = hashedToken;
//   //   savedUser.forgotPasswordExpiry = tokenExpiry;
//   //   await savedUser.save();

//   //   const owner = await User.findOne({ role: UserRolesEnum.OWNER });
//   //   if (owner && owner?._id && savedUser?._id) {
//   //     await createOneToOneChatAuthmatically(savedUser?._id, owner?._id, req);
//   //   }
//   //   if (!savedUser) {
//   //     return res
//   //       .status(500)
//   //       .send("Something went wrong while registering the user");
//   //   }

//   //   return res.status(201).send({
//   //     email: user?.email,
//   //     displayName: user?.displayName,
//   //     _id: user?._id,
//   //   });
//   // },
//   // warnUser: async (req, res) => {
//   //   const user = await User.findById(req.params.id);
//   //   if (!user) return res.status(404).json({ message: "User not found." });
//   //   user.warningCount += 1;
//   //   if (user.warningCount >= 3) {
//   //     user.suspensionUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
//   //   }

//   //   await user.save();
//   //   res.status(200).send("user suspended");
//   // },
//   // suspendUser: async (req, res) => {
//   //   const { durationInDays } = req.body;
//   //   const suspensionEndDate = new Date(
//   //     Date.now() + durationInDays * 24 * 60 * 60 * 1000
//   //   );
//   //   const user = await User.findById(req.params.id);
//   //   if (!user) return res.status(404).json({ message: "User not found." });

//   //   user.suspensionUntil = suspensionEndDate;
//   //   await user.save();

//   //   res.json({
//   //     message: `User suspended until ${suspensionEndDate.toISOString()}`,
//   //     user,
//   //   });
//   // },

//   // updateUserByAdminOrOwner: async (req, res) => {
//   //   const { userId } = req.params;
//   //   const isOwner = await User.findById(userId);
//   //   if (isOwner?.role == UserRolesEnum.ADDUOWNER)
//   //     return res.status(403).send("Access denied");
//   //   const user = await User.findByIdAndUpdate(userId, req.body, {
//   //     new: true,
//   //   });

//   //   if (!user) return res.status(404).send(null);

//   //   res.status(200).send(user);
//   // },
//   // deleteUser: async (req, res) => {
//   //   const { userId } = req.params;
//   //   if (!userId) return res.status(404).send("Provide id to delete");
//   //   if (userId == req.user?._id)
//   //     return res.status(403).send("You can't remove yourself.");
//   //   const user = await User.findByIdAndDelete(userId);
//   //   if (!user) return res.status(404).send("Couldn't delete this account.");
//   //   res.send({ message: "User deleted successfully" });
//   // },
//   // assignRole: async (req, res) => {
//   //   const { userId } = req.params;
//   //   const { role } = req.body;
//   //   const user = await User.findById(userId);
//   //   if (!user) return res.status(404).send("User does not exist");
//   //   user.role = role;
//   //   await user.save({ validateBeforeSave: false });

//   //   return res.status(200).send("Role changed for the user");
//   // },
//   // getCurrentUser: async (req, res) => {
//   //   const userId = req.params?.userId;
//   //   const currentUser = await User.findById(userId);
//   //   if (!currentUser) return res.status(404).send("User does not exists");
//   //   return res.status(200).send(currentUser);
//   // },
//   // getUsers: async (req, res) => {
//   //   const page = parseInt(req.query.pages) || 1;
//   //   const limit = parseInt(req.query.itemsPerPage) || 10;
//   //   const skip = (page - 1) * limit;

//   //   const totalUsers = await User.countDocuments(req.query?.filterBy);
//   //   if (!totalUsers)
//   //     return res.status(404).send({
//   //       message: "No user is found.",
//   //     });

//   //   const users = await User.find(
//   //     req.query?.filterBy,
//   //     "_id firstName lastName role email createdAt  creator warningCount suspensionUntil accountBlocked "
//   //   )
//   //     .sort("createdAt")
//   //     .skip(skip)
//   //     .limit(limit);

//   //   res.status(200).send({
//   //     currentPage: page,
//   //     totalPages: Math.ceil(totalUsers / limit),
//   //     totalDocuments: totalUsers,
//   //     products: users,
//   //   });
//   // },
//   // getUsersByRole: async (req, res) => {
//   //   const users = await User.find();
//   //   const roleCounts = {
//   //     [UserRolesEnum.USER]: 0,
//   //     [UserRolesEnum.ADMIN]: 0,
//   //     [UserRolesEnum.MANAGER]: 0,
//   //     [UserRolesEnum.OWNER]: 0,
//   //     [UserRolesEnum.SELLER]: 0,
//   //     [UserRolesEnum.PROMOTERS]: 0,
//   //     [UserRolesEnum.COURIER]: 0,
//   //     [UserRolesEnum.PARTNER]: 0,
//   //   };

//   //   users.forEach((user) => {
//   //     if (roleCounts[user.role] !== undefined) {
//   //       roleCounts[user.role]++;
//   //     }
//   //   });

//   //   const response = Object.keys(roleCounts).map((role) => ({
//   //     [role]: roleCounts[role],
//   //   }));

//   //   return res.status(200).send(response);
//   // },
//   // resetPassword: async (req, res) => {
//   //   const { userId } = req.params;
//   //   const isOwner = await User.findById(userId);
//   //   if (isOwner?.role == UserRolesEnum.ADDUOWNER)
//   //     return res.status(403).send("Access denied");
//   //   const user = await User.findById(userId);
//   //   if (!user) return res.status(404).send("User not found");
//   //   const { unHashedToken, hashedToken, tokenExpiry } =
//   //     user.generateTemporaryToken();
//   //   user.mustResetPassword = true;
//   //   user.forgotPasswordToken = hashedToken;
//   //   user.forgotPasswordExpiry = tokenExpiry;
//   //   await user.save({ validateBeforeSave: false });
//   //   res.status(200).send(user);
//   // },

//   // //===usesr
//   // checkEmail: async (req, res) => {
//   //   const { email } = req.body;
//   //   const platform = req.query.platform;

//   //   const to =
//   //     platform === "web" ? process.env.BASE_URL : process.env.APP_SCHEME;
//   //   const user = await User.findOne({ email });

//   //   if (!user) {
//   //     return res.status(200).send({ email });
//   //   }

//   //   if (!user.isEmailVerified) {
//   //     const { unHashedToken, hashedToken, tokenExpiry } =
//   //       user.generateTemporaryToken();
//   //     user.emailVerificationToken = hashedToken;
//   //     user.emailVerificationExpiry = tokenExpiry;
//   //     const savedUser = await user.save({ validateBeforeSave: false });
//   //     const isSent = await sendEmail(
//   //       generateOptions(to, user.email, unHashedToken, user?.displayName)
//   //     );

//   //     if (isSent) {
//   //       return res.status(400).send({
//   //         user: savedUser?._id,
//   //         isEmailVerified: false,
//   //         email,
//   //         emailVerificationExpiry: savedUser?.emailVerificationExpiry,
//   //       });
//   //     } else {
//   //       return res.status(500).send({ message: "Couldn't send email" });
//   //     }
//   //   }

//   //   return res
//   //     .status(400)
//   //     .send({ user: user?._id, email: user?.email, isEmailVerified: true });
//   // },
//   // registerUser: async (req, res) => {
//   //   const platform = req.query.platform;

//   //   const link =
//   //     platform == "web" ? process.env.BASE_URL : process.env.APP_SCHEME;
//   //   const { email, firstName, lastName, password } = req.body;
//   //   const existedUser = await User.findOne({ email });
//   //   if (existedUser) return res.status(409).send("User already Registered");

//   //   const user = await User.create({
//   //     email,
//   //     firstName,
//   //     lastName,
//   //     password,
//   //     displayName: firstName + " " + lastName,
//   //     isEmailVerified: false,
//   //   });
//   //   const { unHashedToken, hashedToken, tokenExpiry } =
//   //     user.generateTemporaryToken();
//   //   user.emailVerificationToken = hashedToken;
//   //   user.emailVerificationExpiry = tokenExpiry;
//   //   await user.save({ validateBeforeSave: false });

//   //   const isSent = await sendEmail(
//   //     generateOptions(link, user?.email, unHashedToken, user?.displayName)
//   //   );
//   //   if (!isSent)
//   //     return res.status(500).send({ message: "Couldn't send email" });
//   //   const createdUser = await User.findById(user._id).select(
//   //     "-password -refreshToken -emailVerificationToken "
//   //   );

//   //   if (!createdUser) {
//   //     return res
//   //       .status(500)
//   //       .send("Something went wrong while registering the user");
//   //   }

//   //   return res.status(201).send(createdUser);
//   // },
//   // verifyEmail: async (req, res) => {
//   //   const platform = req.query.platform;
//   //   const { verificationToken } = req.params;
//   //   if (!verificationToken)
//   //     return res.status(400).send("Email verification code is missing");
//   //   let hashedToken = crypto
//   //     .createHash("sha256")
//   //     .update(verificationToken)
//   //     .digest("hex");
//   //   const user = await User.findOne({
//   //     emailVerificationToken: hashedToken,
//   //     emailVerificationExpiry: { $gt: Date.now() },
//   //   });

//   //   if (!user) return res.status(489).send("Invalid confirmation code");
//   //   user.emailVerificationToken = undefined;
//   //   user.emailVerificationExpiry = undefined;
//   //   user.isEmailVerified = true;
//   //   await user.save({ validateBeforeSave: false });
//   //   const accessToken = user.generateAccessToken();
//   //   const refreshToken = user.generateRefreshToken();
//   //   user.refreshToken = refreshToken;
//   //   const savedUser = await user.save({ validateBeforeSave: false });
//   //   const owner = await User.findOne({ role: UserRolesEnum.OWNER });
//   //   if (owner && owner?._id && savedUser?._id) {
//   //     await createOneToOneChatAuthmatically(savedUser?._id, owner?._id, req);
//   //   }
//   //   return res.status(200).send({
//   //     accessToken,
//   //     refreshToken,
//   //     expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//   //   });
//   // },
//   // resendEmailVerification: async (req, res) => {
//   //   const { email } = req.body;
//   //   const platform = req.query.platform;

//   //   const to =
//   //     platform === "web" ? process.env.BASE_URL : process.env.APP_SCHEME;
//   //   const user = await User.findOne({ email });

//   //   if (!user) {
//   //     return res.status(404).send("User does not exists");
//   //   }

//   //   const { unHashedToken, hashedToken, tokenExpiry } =
//   //     user.generateTemporaryToken();
//   //   user.emailVerificationToken = hashedToken;
//   //   user.emailVerificationExpiry = tokenExpiry;
//   //   const savedUser = await user.save({ validateBeforeSave: false });
//   //   const isSent = await sendEmail(
//   //     generateOptions(to, user.email, unHashedToken, user?.displayName)
//   //   );

//   //   if (isSent) {
//   //     return res.status(200).send("Email sent");
//   //   } else {
//   //     return res.status(500).send({ message: "Couldn't send email" });
//   //   }
//   // },
//   // loginUser: async (req, res) => {
//   //   const platform = req.query.platform;
//   //   const deviceInfo = getDeviceInfo(req);
//   //   const { email, password } = req.body;
//   //   const webPushToken = req.body?.webPushToken;
//   //   const expoPushToken = req.body?.expoPushToken;
//   //   const user = await User.findOne({ email });
//   //   if (!user) {
//   //     return res.status(404).send("Invalid credentials");
//   //   }

//   //   if (user.loginType !== UserLoginType.EMAIL_PASSWORD) {
//   //     regesterSignInLog(false, user, deviceInfo, "Wrong login method");
//   //     return res
//   //       .status(400)
//   //       .send(
//   //         "You have previously registered using " +
//   //           user.loginType?.toLowerCase() +
//   //           ". Please use the " +
//   //           user.loginType?.toLowerCase() +
//   //           " login option to access your account."
//   //       );
//   //   }

//   //   if (user?.mustResetPassword)
//   //     return res.status(200).send({ resetToken: user?.forgotPasswordToken });
//   //   const isPasswordValid = await user.isPasswordCorrect(password);
//   //   if (!isPasswordValid) {
//   //     regesterSignInLog(false, user, deviceInfo, "Wrong password trial");
//   //     return res.status(401).send("Invalid user credentials");
//   //   }

//   //   const accessToken = user.generateAccessToken();
//   //   const refreshToken = user.generateRefreshToken();
//   //   user.refreshToken = refreshToken;

//   //   if (webPushToken && user.webPushToken !== webPushToken) {
//   //     if (typeof webPushToken === "string") {
//   //       user.webPushToken = webPushToken;
//   //     }

//   //     sendWebPushNotification([webPushToken], {
//   //       title: "Signed in",
//   //       body: "You are signed in successfully",
//   //     });
//   //   }

//   //   if (expoPushToken) {
//   //     if (typeof expoPushToken === "string") {
//   //       user.expoPushToken = expoPushToken;
//   //     }
//   //     sendExpoPushNotification([expoPushToken], {
//   //       title: "Sign in succeed",
//   //       body: "Have a good time with addu!",
//   //     });
//   //   }

//   //   await user.save({ validateBeforeSave: false });

//   //   regesterSignInLog(true, user, deviceInfo, "Signed in succesfull");
//   //   return res.status(200).send({
//   //     accessToken,
//   //     refreshToken,
//   //     expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//   //   });
//   // },
//   // changeCurrentPassword: async (req, res) => {
//   //   const { oldPassword, newPassword } = req.body;
//   //   const deviceInfo = getDeviceInfo(req);
//   //   const user = await User.findById(req.user?._id);
//   //   const isPasswordValid = await user.isPasswordCorrect(oldPassword);
//   //   if (!isPasswordValid) {
//   //     regesterSignInLog(false, user, deviceInfo, "Password change failed");
//   //     return res.status(400).send("Invalid password");
//   //   }
//   //   user.password = newPassword;
//   //   await user.save({ validateBeforeSave: false });
//   //   regesterSignInLog(true, user, deviceInfo, "Password change successful");

//   //   return res.status(200).send("Password changed successfully");
//   // },
//   // deleteMyAccount: async (req, res) => {
//   //   const deviceInfo = getDeviceInfo(req);
//   //   const user = await User.findByIdAndDelete(req.user?._id);
//   //   if (!user) {
//   //     regesterSignInLog(false, user, deviceInfo, "Deleting account failed");
//   //     return res.status(404).send("Couldn't delete this account.");
//   //   }
//   //   regesterSignInLog(true, user, deviceInfo, "Deleting account successful");
//   //   res.send({ message: "User deleted successfully" });
//   // },
//   // resetForgottenPassword: async (req, res) => {
//   //   const deviceInfo = getDeviceInfo(req);
//   //   const { resetToken } = req.params;

//   //   const { newPassword } = req.body;
//   //   let hashedToken = crypto
//   //     .createHash("sha256")
//   //     .update(resetToken)
//   //     .digest("hex");

//   //   const user = await User.findOne({
//   //     forgotPasswordToken: resetToken,
//   //     forgotPasswordExpiry: { $gt: Date.now() },
//   //   });

//   //   if (!user) {
//   //     return res.status(489).send("Invalid credentials");
//   //   }

//   //   user.forgotPasswordToken = undefined;
//   //   user.forgotPasswordExpiry = undefined;
//   //   user.mustResetPassword = false;
//   //   user.password = newPassword;
//   //   const accessToken = user.generateAccessToken();
//   //   const refreshToken = user.generateRefreshToken();
//   //   user.refreshToken = refreshToken;
//   //   await user.save({ validateBeforeSave: false });
//   //   regesterSignInLog(true, user, deviceInfo, "Password reset successful");
//   //   return res.status(200).send({
//   //     accessToken: accessToken,
//   //     refreshToken: refreshToken,
//   //   });
//   // },
//   // refreshAccessToken: async (req, res) => {
//   //   const incomingRefreshToken = req.body.refreshToken;
//   //   if (!incomingRefreshToken)
//   //     return res.status(401).send("Unauthorized request");

//   //   try {
//   //     const decodedToken = jwt.verify(
//   //       incomingRefreshToken,
//   //       process.env.REFRESH_TOKEN_SECRET
//   //     );

//   //     if (!decodedToken) return res.status(401).send("Invalid refresh token");
//   //     const currentTime = Math.floor(Date.now() / 1000);

//   //     if (decodedToken.exp < currentTime)
//   //       return res.status(401).send("Access denied");

//   //     const user = await User.findById(decodedToken?._id);
//   //     if (!user) return res.status(401).send("Invalid refresh token");

//   //     if (incomingRefreshToken !== user?.refreshToken)
//   //       return res.status(401).send("Invalid refresh token");

//   //     const { accessToken, refreshToken: newRefreshToken } =
//   //       await generateAccessAndRefreshTokens(user._id);

//   //     user.refreshToken = newRefreshToken;

//   //     return res.status(200).send({
//   //       accessToken: accessToken,
//   //       refreshoken: newRefreshToken,
//   //       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//   //     });
//   //   } catch (error) {
//   //     return res.status(401).send(error?.message || "Access denied");
//   //   }
//   // },
//   // updateUser: async (req, res) => {
//   //   const userId = req.user?._id;
//   //   const user = await User.findByIdAndUpdate(userId, req.body, {
//   //     new: true,
//   //   });

//   //   if (!user) return res.status(404).send(null);
//   //   res.status(200).send(user);
//   // },

//   // getOnlineUsers: async (req, res) => {
//   //   const onlineUsers = await OnlineUsers.find();
//   //   if (onlineUsers.length == 0) return res.status(404).send([]);
//   //   return res.status(200).send(onlineUsers);
//   // },
//   // searchUser: async (req, res) => {
//   //   const user = await Users.find(req.query);
//   //   if (!user || user?.length == 0)
//   //     return res.status(404).send("User not found");
//   //   res.send(user);
//   // },
//   // forgotPasswordRequest: async (req, res) => {
//   //   const { email } = req.body;
//   //   const platform = req.query.platform;
//   //   const link =
//   //     platform == "web" ? process.env.WEB_CLIENT : process.env.APP_CLIENT;
//   //   const user = await User.findOne({ email });
//   //   if (!user) return res.status(404).send("User does not exists");
//   //   const { unHashedToken, hashedToken, tokenExpiry } =
//   //     user.generateTemporaryToken();

//   //   user.forgotPasswordToken = hashedToken;
//   //   user.forgotPasswordExpiry = tokenExpiry;
//   //   await user.save({ validateBeforeSave: false });
//   //   await sendEmail({
//   //     email: user?.email,
//   //     subject: "Password reset request",
//   //     mailgenContent: forgotPasswordMailgenContent(
//   //       user.displayName,
//   //       platform == "web"
//   //         ? `${link}/auth/resetPassword?code=${unHashedToken}`
//   //         : `${link}/auth/resetPassword=${unHashedToken}`
//   //     ),
//   //   });
//   //   return res.status(200).send({ email: user?.email });
//   // },
//   // checkForDashboard: async (req, res) => {
//   //   const user = await User.findById(req.user?._id);
//   //   if (!user) return res.status(404).send("Access denied");
//   //   if (!(user?.role == UserRolesEnum.OWNER))
//   //     return res.status(403).send("Access denied");
//   //   res.status(200).send(true);
//   // },

//   // signWithAddu: async (req, res) => {
//   //   const { code, platform = "native" } = req.body;
//   //   const deviceInfo = getDeviceInfo(req);

//   //   const webPushToken = req.body?.webPushToken;
//   //   const expoPushToken = req.body?.expoPushToken;
//   //   if (!code) return res.status(400).send("Missing authorization code");
//   //   let userInfo;
//   //   userInfo = jwt.decode(code);
//   //   const {
//   //     _id,
//   //     firstName,
//   //     email,
//   //     lastName,
//   //     displayName,
//   //     profilePicture,
//   //     role,
//   //   } = userInfo;

//   //   let user = await User.findOne({ email: email });
//   //   if (!user) {
//   //     const newUser = new User({
//   //       email,
//   //       firstName,
//   //       lastName,
//   //       displayName,
//   //       profilePicture,
//   //       isEmailVerified: true,
//   //       role: UserRolesEnum.USER,
//   //       loginType: UserLoginType.ADDU,
//   //     });
//   //     user = await newUser.save();
//   //     const owner = await User.findOne({ role: UserRolesEnum.OWNER });
//   //     if (owner && owner?._id && user?._id) {
//   //       await createOneToOneChatAuthmatically(user?._id, owner?._id, req);
//   //     }
//   //   }
//   //   console.log(user.loginType !== UserLoginType.ADDU);
//   //   console.log(user.loginType);
//   //   console.log(email);
//   //   if (user.loginType !== UserLoginType.ADDU) {
//   //     regesterSignInLog(false, user, deviceInfo, "Wrong login method");
//   //     return res
//   //       .status(400)
//   //       .send(
//   //         "You have previously registered using " +
//   //           user.loginType?.toLowerCase() +
//   //           ". Please use the " +
//   //           user.loginType?.toLowerCase() +
//   //           " login option to access your account."
//   //       );
//   //   }
//   //   const accessToken = user.generateAccessToken();
//   //   const refreshToken = user.generateRefreshToken();
//   //   user.refreshToken = refreshToken;

//   //   if (webPushToken && user.webPushToken !== webPushToken) {
//   //     if (typeof webPushToken === "string") {
//   //       user.webPushToken = webPushToken;
//   //     }

//   //     sendWebPushNotification([webPushToken], {
//   //       title: "Signed in",
//   //       body: "You are signed in successfully",
//   //     });
//   //   }

//   //   if (expoPushToken) {
//   //     if (typeof expoPushToken === "string") {
//   //       user.expoPushToken = expoPushToken;
//   //     }
//   //     sendExpoPushNotification([expoPushToken], {
//   //       title: "Sign in succeed",
//   //       body: "Have a good time with addu!",
//   //     });
//   //   }
//   //   await user.save({ validateBeforeSave: false });

//   //   regesterSignInLog(false, user, deviceInfo, "Successfull login");

//   //   return res.status(200).send({
//   //     accessToken,
//   //     refreshToken,
//   //     expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//   //   });
//   // },
// };
