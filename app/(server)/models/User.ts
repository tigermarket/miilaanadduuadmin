import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import {
  AvailableSocialLogins,
  AvailableUserRoles,
  UserLoginType,
  UserRolesEnum,
} from "../constant";
import { SignJWT } from "jose";
import { createHash } from "crypto";
import Joi from "joi";
import { encrypt } from "../lib/session";
const userSchema = new Schema(
  {
    // 🔗 Relations
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    profile: { type: Schema.Types.ObjectId, ref: "Profile" },

    // 🔒 Account management
    mustResetPassword: { type: Boolean, default: false },
    warningCount: { type: Number, default: 0 },
    suspensionUntil: { type: Date, default: null },
    accountBlocked: { type: Boolean, default: false },

    // 👤 Identity
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "Must be at least 2 characters"],
      maxlength: [50, "Must be less than 50 characters"],
      lowercase: true,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [2, "Must be at least 2 characters"],
      maxlength: [50, "Must be less than 50 characters"],
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      minlength: [2, "Must be at least 2 characters"],
      maxlength: [100, "Must be less than 100 characters"],
    },

    // 📧 Credentials
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
    },

    // 🎭 Roles & login types (constants integrated)
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.USER,
      required: true,
    },
    loginType: {
      type: String,
      enum: AvailableSocialLogins,
      default: UserLoginType.EMAIL_PASSWORD,
    },

    isEmailVerified: { type: Boolean, default: false },

    // 🔑 Tokens
    refreshToken: { type: String },
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
    emailVerificationToken: { type: String },
    emailVerificationExpiry: { type: Date },

    // 💰 Balance
    balance: { type: Number, default: 0 },

    // 🔔 Notification preferences
    pushNotificationAllowed: { type: Boolean, default: true },
    emailNotificationAllowed: { type: Boolean, default: true },
    phoneMessageNotificationAllowed: { type: Boolean, default: true },
    messageNotificationAllowed: { type: Boolean, default: true },

    // 📱 Device tokens
    webPushToken: { type: String, default: "" },
    expoPushToken: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  this.displayName = `${this.firstName} ${this.lastName}`;

  if (this.password) {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
const refreshSecret = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET!
);

userSchema.methods.generateAccessToken = async function () {
  return await encrypt(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      displayName: this.displayName,
      profilePicture: this.profilePicture,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    process.env.ACCESS_TOKEN_EXPIRY || "15m"
  );
  // return await new SignJWT({
  //   _id: this._id,
  //   firstName: this.firstName,
  //   lastName: this.lastName,
  //   email: this.email,
  //   displayName: this.displayName,
  //   profilePicture: this.profilePicture,
  //   role: this.role,
  // })
  //   .setProtectedHeader({ alg: "HS256" })
  //   .setIssuedAt()
  //   .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || "15m")
  //   .sign(accessSecret);
};
userSchema.methods.generateRefreshToken = async function () {
  return await encrypt(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    process.env.REFRESH_TOKEN_EXPIRY || "7d"
  );
  // return await new SignJWT({
  //   _id: this._id,
  // })
  //   .setProtectedHeader({ alg: "HS256" })
  //   .setIssuedAt()
  //   .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || "7d")
  //   .sign(refreshSecret);
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedToken = createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry =
    Date.now() +
    Number(process.env.USER_TEMPORARY_TOKEN_EXPIRY || 10 * 60 * 1000);

  return { unHashedToken, hashedToken, tokenExpiry };
};
export async function validateSignupForm(formData: FormData) {
  const SignupFormSchema = Joi.object({
    firstName: Joi.alternatives()
      .try(Joi.string().min(2).max(50).required(), Joi.forbidden())
      .label("First name"),
    lastName: Joi.alternatives()
      .try(Joi.string().min(2).max(50).required(), Joi.forbidden())
      .label("Last name"),
    email: Joi.alternatives()
      .try(
        Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: false } })
          .required(),
        Joi.forbidden()
      )
      .label("Email"),
    password: Joi.alternatives()
      .try(
        Joi.string()
          .min(8)
          .pattern(/[a-z]/)
          .pattern(/[A-Z]/)
          .pattern(/[#-@$!%*?&,.]/)
          .required(),
        Joi.forbidden()
      )
      .label("Password"),
  });
  return await SignupFormSchema.validateAsync(
    {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    },
    { abortEarly: false }
  );
}

// userSchema.methods.checkSuspensionStatus = function () {
//   if (this.suspensionUntil && this.suspensionUntil <= new Date()) {
//     this.suspensionUntil = null;
//   }
// };
//=====Validators=====
// export const checkEmailValidator = (req, res, next) => {
//   const userSchema = Joi.object({
//     email: Joi.alternatives()
//       .try(
//         Joi.string()
//           .email({ minDomainSegments: 2, tlds: { allow: false } })
//           .required(),
//         Joi.forbidden()
//       )
//       .label("Email"),
//   });
//   const { error } = userSchema.validate(req.body);
//   if (error) return res.status(422).send(error.details[0].message);
//   else next();
// };

// export const userRegisterValidator = (req, res, next) => {
//   const userSchema = Joi.object({
//     firstName: Joi.alternatives()
//       .try(Joi.string().min(2).max(50).required(), Joi.forbidden())
//       .label("First name"),
//     lastName: Joi.alternatives()
//       .try(Joi.string().min(2).max(50).required(), Joi.forbidden())
//       .label("Last name"),
//     email: Joi.alternatives()
//       .try(
//         Joi.string()
//           .email({ minDomainSegments: 2, tlds: { allow: false } })
//           .required(),
//         Joi.forbidden()
//       )
//       .label("Email"),
//     password: Joi.alternatives()
//       .try(
//         Joi.string()
//           .min(8)
//           .pattern(/[a-z]/)
//           .pattern(/[A-Z]/)
//           .pattern(/[#-@$!%*?&,.]/)
//           .required(),
//         Joi.forbidden()
//       )
//       .label("Password"),
//   });
//   const { error } = userSchema.validate(req.body);
//   if (error) return res.status(422).send(error.details[0].message);
//   else next();
// };
// export const userLoginValidator = (req, res, next) => {
//   const userSchema = Joi.object({
//     email: Joi.alternatives()
//       .try(
//         Joi.string()
//           .email({ minDomainSegments: 2, tlds: { allow: false } })
//           .required(),
//         Joi.forbidden()
//       )
//       .label("Email"),
//     password: Joi.alternatives()
//       .try(
//         Joi.string()
//           .min(8)
//           .pattern(/[a-z]/)
//           .pattern(/[A-Z]/)
//           .pattern(/[#-@$!%*?&,.]/)
//           .required(),
//         Joi.forbidden()
//       )
//       .label("Password"),
//     webPushToken: Joi.string().optional(),
//     expoPushToken: Joi.string().optional(),
//   });
//   const { error } = userSchema.validate(req.body);
//   if (error) return res.status(422).send(error.details[0].message);
//   else next();
// };

// export const userChangeCurrentPasswordValidator = (req, res, next) => {
//   const userSchema = Joi.object({
//     oldPassword: Joi.alternatives()
//       .try(
//         Joi.string()
//           .min(8)
//           .pattern(/[a-z]/)
//           .pattern(/[A-Z]/)
//           .pattern(/[#-@$!%*?&,.]/)
//           .required(),
//         Joi.forbidden()
//       )
//       .label("Old Password"),
//     newPassword: Joi.alternatives()
//       .try(
//         Joi.string()
//           .min(8)
//           .pattern(/[a-z]/)
//           .pattern(/[A-Z]/)
//           .pattern(/[#-@$!%*?&,.]/)
//           .required(),
//         Joi.forbidden()
//       )
//       .label("New Password"),
//   });
//   const { error } = userSchema.validate(req.body);
//   if (error) return res.status(422).send(error.details[0].message);
//   else next();
// };

// export const userForgotPasswordValidator = (req, res, next) => {
//   const userSchema = Joi.object({
//     email: Joi.alternatives()
//       .try(
//         Joi.string()
//           .email({ minDomainSegments: 2, tlds: { allow: false } })
//           .required(),
//         Joi.forbidden()
//       )
//       .label("Email"),
//   });
//   const { error } = userSchema.validate(req.body);
//   if (error) return res.status(422).send(error.details[0].message);
//   else next();
// };

// export const userResetForgottenPasswordValidator = (req, res, next) => {
//   const userSchema = Joi.object({
//     newPassword: Joi.alternatives()
//       .try(
//         Joi.string()
//           .min(8)
//           .pattern(/[a-z]/)
//           .pattern(/[A-Z]/)
//           .pattern(/[@$!%*?&]+/)

//           .required(),
//         Joi.forbidden()
//       )
//       .label("New Password"),
//   });
//   const { error } = userSchema.validate(req.body);
//   if (error) return res.status(422).send(error.details[0].message);
//   else next();
// };
// export const userAssignRoleValidator = (req, res, next) => {
//   const userSchema = Joi.object({
//     role: Joi.alternatives()
//       .try(
//         Joi.string()
//           .min(8)
//           .pattern(/[a-z]/)
//           .pattern(/[A-Z]/)
//           .pattern(/[#-=)(.,<>?}{[]\|+_-@$!%*?&]/)
//           .required(),
//         Joi.forbidden()
//       )
//       .label("New Password"),
//   });
//   const { error } = userSchema.validate(req.body);
//   if (error) return res.status(422).send(error.details[0].message);
//   else next();
// };

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
