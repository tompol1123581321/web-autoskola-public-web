import type { TermOption } from "autoskola-web-shared-models";
import type { ClientRegistrationFormData } from "../types";

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

type RegistrationErrorBody = {
  message?: string;
  errors?: Partial<Record<keyof ClientRegistrationFormData, string>>;
};

export type RegistrationApiResult =
  | { status: "success"; message: string }
  | {
      status: "validation_error";
      message: string;
      errors: Partial<Record<keyof ClientRegistrationFormData, string>>;
    }
  | { status: "conflict"; message: string }
  | { status: "rate_limited"; message: string }
  | { status: "error"; message: string };

export const postNewRegistration = async (
  data: ClientRegistrationFormData,
): Promise<RegistrationApiResult> => {
  try {
    const response = await fetch(apiUrl("/api/registrations"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(data),
    });

    let body: RegistrationErrorBody = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }

    if (response.status === 200 || response.status === 201) {
      return {
        status: "success",
        message: body.message ?? "Registrace byla úspěšně vytvořena.",
      };
    }

    if (response.status === 422) {
      return {
        status: "validation_error",
        message: body.message ?? "Zkontrolujte zadané údaje.",
        errors: body.errors ?? {},
      };
    }

    if (response.status === 409) {
      return {
        status: "conflict",
        message:
          body.message ??
          "Vybraný termín již není dostupný. Zvolte prosím jiný.",
      };
    }

    if (response.status === 429) {
      return {
        status: "rate_limited",
        message: "Příliš mnoho pokusů. Zkuste to prosím později.",
      };
    }

    if (response.status === 400) {
      return {
        status: "error",
        message: "Požadavek se nepodařilo zpracovat.",
      };
    }

    return {
      status: "error",
      message: "Registraci se nepodařilo odeslat. Zkuste to prosím později.",
    };
  } catch {
    return {
      status: "error",
      message: "Registraci se nepodařilo odeslat. Zkuste to prosím později.",
    };
  }
};

export type TermOptionsResult =
  | { status: "success"; termOptions: Array<TermOption> }
  | { status: "error" };

export const getTermOptions = async (): Promise<TermOptionsResult> => {
  try {
    const response = await fetch(apiUrl("/api/registrations/options"), {
      headers: { Accept: "application/json" },
    });
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.includes("application/json")) {
      return { status: "error" };
    }

    const termOptions = await response.json();
    return {
      status: "success",
      termOptions: Array.isArray(termOptions) ? termOptions : [],
    };
  } catch {
    return { status: "error" };
  }
};
