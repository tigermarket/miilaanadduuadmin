// "use client";
// import * as React from "react";
// import { useTheme } from "../core/theming";
// import { useTranslations } from "next-intl";

// type Mode = "flat" | "outlined";

// type TextInputProps = {
//   mode?: Mode;
//   label?: string;
//   name?: string; // ✅ name for form compatibility
//   value?: string; // ✅ optional for uncontrolled usage
//   onChange?: (value: string) => void; // ✅ optional
//   placeholder?: string;
//   error?: boolean;
//   errorMessage?: string;
//   helperText?: string;
//   disabled?: boolean;
//   dense?: boolean;
//   left?: React.ReactNode;
//   right?: React.ReactNode;
//   type?: string;
// };

// const TextInput: React.FC<TextInputProps> = ({
//   mode = "flat",
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   error = false,
//   errorMessage,
//   helperText,
//   disabled = false,
//   dense = false,
//   left,
//   right,
//   type = "text",
// }) => {
//   const theme = useTheme();
//   const t = useTranslations();
//   const [focused, setFocused] = React.useState(false);

//   const inputId = React.useId();

//   const activeColor = error ? theme.colors.error : theme.colors.primary;
//   const borderColor = focused
//     ? activeColor
//     : error
//     ? theme.colors.error
//     : mode === "outlined"
//     ? theme.colors.outline
//     : "transparent";

//   const backgroundColor =
//     mode === "flat" ? theme.colors.surface : theme.colors.background;

//   const paddingY = dense ? "0.25rem" : "0.5rem";

//   return (
//     <div
//       style={{ display: "flex", flexDirection: "column", marginBottom: "1rem" }}
//     >
//       {label && (
//         <label
//           htmlFor={inputId}
//           style={{
//             fontSize: dense ? "0.8rem" : "0.9rem",
//             fontWeight: 500,
//             marginBottom: "0.25rem",
//             color: error
//               ? theme.colors.error
//               : focused
//               ? activeColor
//               : theme.colors.onSurface,
//             cursor: "text",
//             transition: "color 0.2s ease",
//           }}
//         >
//           {t(label)}
//         </label>
//       )}

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           borderRadius: theme.roundness,
//           border: mode === "outlined" ? `1px solid ${borderColor}` : "none",
//           borderBottom: mode === "flat" ? `2px solid ${borderColor}` : "none",
//           backgroundColor,
//           paddingLeft: left ? "0.5rem" : "0",
//           paddingRight: right ? "0.5rem" : "0",
//           transition: "border-color 0.2s ease",
//         }}
//       >
//         {left && <div style={{ marginRight: "0.5rem" }}>{left}</div>}

//         <input
//           id={inputId}
//           name={name}
//           type={type}
//           value={value}
//           onChange={(e) => onChange?.(e.target.value)}
//           placeholder={placeholder ? t(placeholder) : ""}
//           disabled={disabled}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           style={{
//             flex: 1,
//             paddingTop: paddingY,
//             paddingBottom: paddingY,
//             paddingLeft: "0.5rem",
//             paddingRight: "0.5rem",
//             border: "none",
//             outline: "none",
//             fontSize: dense ? "0.9rem" : "1rem",
//             color: disabled
//               ? theme.colors.onSurfaceVariant
//               : theme.colors.onSurface,
//             backgroundColor: "transparent",
//           }}
//         />

//         {right && <div style={{ marginLeft: "0.5rem" }}>{right}</div>}
//       </div>

//       {error && errorMessage ? (
//         <span
//           style={{
//             color: theme.colors.error,
//             fontSize: "0.8rem",
//             marginTop: "0.25rem",
//           }}
//         >
//           {errorMessage}
//         </span>
//       ) : helperText ? (
//         <span
//           style={{
//             color: theme.colors.onSurfaceVariant,
//             fontSize: "0.8rem",
//             marginTop: "0.25rem",
//           }}
//         >
//           {t(helperText)}
//         </span>
//       ) : null}
//     </div>
//   );
// };

// export default TextInput;
"use client";
import * as React from "react";
import { useTheme } from "../core/theming";
import { useTranslations } from "next-intl";
import Icon from "../components/Icon";

type Mode = "flat" | "outlined";

type TextInputProps = {
  mode?: Mode;
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean | any;
  errorMessage?: string | any;
  helperText?: string;
  disabled?: boolean;
  dense?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  type?: string; // "text" | "password" | etc.
};

const TextInput: React.FC<TextInputProps> = ({
  mode = "flat",
  label,
  name,
  value,
  onChange,
  placeholder,
  error = false,
  errorMessage,
  helperText,
  disabled = false,
  dense = false,
  left,
  right,
  type = "text",
}) => {
  const theme = useTheme();
  const t = useTranslations();
  const [focused, setFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const inputId = React.useId();

  const activeColor = error ? theme.colors.error : theme.colors.primary;
  const borderColor = focused
    ? activeColor
    : error
    ? theme.colors.error
    : mode === "outlined"
    ? theme.colors.outline
    : "transparent";

  const backgroundColor =
    mode === "flat" ? theme.colors.surface : theme.colors.background;

  const paddingY = dense ? "0.25rem" : "0.5rem";

  // Determine actual input type
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginBottom: "1rem" }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: dense ? "0.8rem" : "0.9rem",
            fontWeight: 500,
            marginBottom: "0.25rem",
            color: error
              ? theme.colors.error
              : focused
              ? activeColor
              : theme.colors.onSurface,
            cursor: "text",
            transition: "color 0.2s ease",
          }}
        >
          {t(label)}
        </label>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: theme.roundness,
          border: mode === "outlined" ? `1px solid ${borderColor}` : "none",
          borderBottom: mode === "flat" ? `2px solid ${borderColor}` : "none",
          backgroundColor,
          paddingLeft: left ? "0.5rem" : "0",
          paddingRight: right ? "0.5rem" : "0",
          transition: "border-color 0.2s ease",
        }}
      >
        {left && <div style={{ marginRight: "0.5rem" }}>{left}</div>}

        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder ? t(placeholder) : ""}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            border: "none",
            outline: "none",
            fontSize: dense ? "0.9rem" : "1rem",
            color: disabled
              ? theme.colors.onSurfaceVariant
              : theme.colors.onSurface,
            backgroundColor: "transparent",
          }}
        />

        {/* Password toggle icon */}
        {type === "password" ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon
              source={showPassword ? "mdiEyeOff" : "mdiEye"}
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </button>
        ) : right ? (
          <div style={{ marginLeft: "0.5rem" }}>{right}</div>
        ) : null}
      </div>

      {error && errorMessage ? (
        <span
          style={{
            color: theme.colors.error,
            fontSize: "0.8rem",
            marginTop: "0.25rem",
          }}
        >
          {t(errorMessage)}
        </span>
      ) : helperText ? (
        <span
          style={{
            color: theme.colors.onSurfaceVariant,
            fontSize: "0.8rem",
            marginTop: "0.25rem",
          }}
        >
          {t(helperText)}
        </span>
      ) : null}
    </div>
  );
};

export default TextInput;
