import { ValidationError } from "joi";

export type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: any;
};

// Generic wrapper for server actions
export async function withErrorHandling<T>(
  action: () => Promise<T>
): Promise<T | FormState> {
  try {
    return await action();
  } catch (err: any) {
    console.error("❌ Server  action validation  error:", err);

    // Handle Joi validation errors
    if (err instanceof ValidationError) {
      const errors: Record<string, string[]> = {};
      err.details.forEach((detail) => {
        const field = detail.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(detail.message);
      });
      return { success: false, errors };
    }

    // Generic fallback
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
