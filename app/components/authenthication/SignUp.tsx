"use client";

import { useActionState, useEffect } from "react";
import TextInput from "../adduwebui/components/TextInput";
import { Card, Text } from "../adduwebui";
import user, { signup } from "@/(server)/controllers/user";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <Card>
      {state?.success ? (
        <div className="shadow-lg p-8">
          <p>{state.message}</p>
        </div>
      ) : (
        <div className="shadow-lg p-8">
          {state?.message && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              {state.message}
            </div>
          )}

          <div className="items-center mt-2 mb-4">
            <Text style={{ textAlign: "center" }} variant="titleLarge">
              Create Miilaan account
            </Text>
          </div>
          {/* Form */}
          <form action={action} className="space-y-4 sm:space-y-5">
            <TextInput
              label="Name"
              name="firstName"
              placeholder="name"
              error={state?.errors?.firstName}
              errorMessage={state?.errors?.firstName}
            />
            <TextInput
              label="Name"
              name="lastName"
              placeholder="name"
              error={state?.errors?.lastName}
              errorMessage={state?.errors?.lastName}
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
      )}
    </Card>
  );
}
