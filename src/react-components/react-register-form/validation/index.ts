import { EMAIL_REG, PHONE_REG } from "../constants";
import type { FieldKey, ArrayReason } from "../types";

export const validator = (
  name: FieldKey,
  value?: string,
): { name: FieldKey; isOk: boolean; reason?: ArrayReason } => {
  switch (name) {
    case "eMail": {
      if (RegExp(EMAIL_REG).test(value ?? "")) {
        return { name, isOk: true };
      }
      return {
        name,
        isOk: false,
        reason: !!value ? ["format"] : ["required", "format"],
      };
    }
    case "lastName":
    case "firstName": {
      const isOk = !!value;
      return { name, isOk, reason: isOk ? undefined : ["required"] };
    }
    case "gdp": {
      const isOk = value === "true";
      return { name, isOk, reason: isOk ? undefined : ["required"] };
    }
    case "phone": {
      if (RegExp(PHONE_REG).test(value ?? "")) {
        return { name, isOk: true };
      }

      return {
        name,
        isOk: false,
        reason: !!value ? ["format"] : ["required", "format"],
      };
    }
    case "term":
    case "notes": {
      return { name, isOk: true };
    }
    default: {
      return { isOk: false, name, reason: ["unknown"] };
    }
  }
};
