export type Periods = "december" | "march" | "june" | "september";
export type RegistrationFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  eMail: string;
  notes: string;
  term: Periods;
  gdp?: string;
};

export type FieldKey = keyof RegistrationFormData;
export type ArrayReason = Array<"format" | "required" | "unknown">;
export type FormProps = {
  config: { tamplateId: string; serviceId: string; userPublicKey: string };
};
