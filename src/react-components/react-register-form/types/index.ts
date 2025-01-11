import type { RegistrationFormData } from "autoskola-web-shared-models";

export type ClientRegistrationFormData = Omit<
  RegistrationFormData,
  "id" | "registrationDate"
> & { gdpr: boolean };
