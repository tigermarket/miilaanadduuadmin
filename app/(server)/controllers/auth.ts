"use server";

import bcrypt from "bcrypt";
import { connectedToMongodb } from "../startup/db";

import { createSession } from "../lib/session";
import { redirect } from "next/navigation";
import { FormState, withErrorHandling } from "../utils/errorHandler";
import User, { validateSignupForm } from "../models/User";

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return withErrorHandling(async () => {
    // 1. Validate
    const { errors, value } = await validateSignupForm(formData);
    if (errors) return { success: false, errors };

    const { name, email, password } = value!;

    // 2. Connect DB
    await connectedToMongodb();

    // 3. Check existence
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email already registered." };
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 6. Create session
    await createSession(newUser._id);

    // 7. Redirect
    redirect("/profile");

    return {
      success: true,
      message: "User created successfully",
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    };
  });
}
