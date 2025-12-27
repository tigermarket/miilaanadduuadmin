"use client";
import Link from "next/link";
import { Card, Text, useTheme } from "../adduwebui";
import { useTranslations } from "next-intl";

export default function SignIn() {
  const theme = useTheme();
  const t = useTranslations("Hero");
  return (
    <Card>
      <div className="shadow-lg p-8">
        <Text>{t("title")}</Text>
        <div className="mb-4 text-center">
          <Text as="h1" variant="titleLarge" style={{ textAlign: "center" }}>
            Sign Into Miilaan
          </Text>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              <Text variant="labelLarge">Email</Text>
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              <Text variant="labelLarge">Password</Text>
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="#">
            <Text style={{ color: theme.colors.primary }}>
              Forgot your password?
            </Text>
          </Link>
        </div>
        <div className="mt-4 text-center">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </Card>
  );
}
