import type { Periods, RegistrationFormData } from "../types";

export const ERROR_CLASSNAME = "border-red-500 rounded";
export const NON_ERROR_CLASSNAME = "border-gray-200 focus:border-gray-500";
export const PHONE_REG =
  /^(\+?420)?(2[0-9]{2}|3[0-9]{2}|4[0-9]{2}|5[0-9]{2}|72[0-9]|73[0-9]|77[0-9]|60[1-8]|56[0-9]|70[2-5]|79[0-9])[0-9]{3}[0-9]{3}$/;

export const EMAIL_REG = /^\S+@\S+\.\S+$/;

export const DEFAULT_ERROR_VALUES = {
  eMail: [],
  firstName: [],
  lastName: [],
  notes: [],
  phone: [],
  term: [],
  gdp: [],
};

export const periodSelectOptions: Array<{ label: string; value: Periods }> = [
  { label: "Září 2024", value: "september" },
  { label: "Prosinec 2024", value: "december" },
];

export const DEFAULT_FORM_VALUES: RegistrationFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  eMail: "",
  notes: "",
  term: periodSelectOptions[0].value,
  gdp: "false",
};
