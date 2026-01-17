"use client";

import { signup } from "@/(server)/controllers/auth";
import { useActionState, useEffect } from "react";
import TextInput from "../adduwebui/components/TextInput";
import { Card, Text } from "../adduwebui";

export default function SignIn() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <Card>
      <div className="shadow-lg p-8">
        <div className="items-center mt-2 mb-4">
          <Text style={{ textAlign: "center" }} variant="titleLarge">
            Create Miilaan account
          </Text>
        </div>
        {/* Form */}
        <form action={action} className="space-y-4 sm:space-y-5">
          <TextInput
            label="Name"
            name="name"
            placeholder="name"
            error={state?.errors?.name}
            errorMessage={state?.errors?.name}
          />

          <TextInput
            label="Email"
            name="email"
            placeholder="email"
            error={state?.errors?.email}
            errorMessage={state?.errors?.email}
          />

          <TextInput
            label="Password"
            name="password"
            placeholder="password"
            error={state?.errors?.password}
            errorMessage={state?.errors?.password}
            type="password"
          />

          <button
            disabled={pending}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </Card>
  );
}
