"use client";

import React from "react";
import { useTheme } from "./adduwebui";

interface ScreenProps {
  children: React.ReactNode;
}

export default function Screen({ children }: ScreenProps) {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </div>
  );
}
