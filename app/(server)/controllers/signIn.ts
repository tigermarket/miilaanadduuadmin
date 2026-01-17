"use server";

import * as yup from "yup";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { createSession } from "../lib/session";
import { checkRateLimit } from "../lib/rate-limits";

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

// ✅ Yup schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export async function signIn(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
    } catch (validationError: any) {
      const errors: Record<string, string[]> = {};
      validationError.inner.forEach((err: any) => {
        if (!errors[err.path]) errors[err.path] = [];
        errors[err.path].push(err.message);
      });
      return { errors, message: "Validation failed" };
    }

    //implement rate limiting here

    // 3️⃣ Lookup user in MongoDB
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return { message: "Invalid credentials" };
    }

    // 4️⃣ Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { message: "Invalid credentials" };
    }

    await createSession(user._id.toString());

    return { message: "Login successful" };
  } catch (err: any) {
    return { message: "Unexpected error: " + err.message };
  }
}
