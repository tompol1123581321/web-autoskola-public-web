import type { Periods, RegistrationFormData } from "../types";

export const postNewRegistration = async (data: RegistrationFormData) => {
  try {
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        result,
        message: "Registration successful.",
      };
    }

    if (response.status === 409) {
      return {
        result: null,
        message:
          "A user with the same email, phone, or name is already registered.",
      };
    }

    return {
      result: null,
      message: `Registration failed: ${response.statusText}`,
    };
  } catch (error) {
    return {
      result: null,
      message: "An unexpected error occurred while trying to register.",
    };
  }
};

export const getTermOptions = async (): Promise<
  Array<{ label: string; value: Periods }>
> => {
  const response = await fetch("");
  const termOptions = await response.json();
  return termOptions;
};
