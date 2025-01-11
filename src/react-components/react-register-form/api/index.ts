import type { TermOption } from "autoskola-web-shared-models";
import type { ClientRegistrationFormData } from "../types";

export const postNewRegistration = async (data: ClientRegistrationFormData) => {
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

export const getTermOptions = async (): Promise<Array<TermOption>> => {
  const response = await fetch("");
  const termOptions = await response.json();
  return termOptions;
};
