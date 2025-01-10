// components/RegistrationForm/RegistrationForm.tsx
import React, { useState } from "react";
import { ContactFields } from "./form-fields/ContactFields";
import { RegistrationResultMessage } from "./result-message/RegistrationResultMessage";

import {
  DEFAULT_ERROR_VALUES,
  DEFAULT_FORM_VALUES,
  ERROR_CLASSNAME,
  NON_ERROR_CLASSNAME,
} from "../constants";

import { validator } from "../validation";
import type { RegistrationFormData, FieldKey, ArrayReason } from "../types";
import { postNewRegistration } from "../api";
import { NotesField } from "./form-fields/NotesFields";
import { NameFields } from "./form-fields/NameFields";
import { TermAndGdpFields } from "./form-fields/TermAndGdpFields";

export const RegistrationForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<
    "success" | "fail" | null
  >(null);

  const [formValues, setFormValues] =
    useState<RegistrationFormData>(DEFAULT_FORM_VALUES);

  const [errors, setErrors] =
    useState<Record<FieldKey, ArrayReason>>(DEFAULT_ERROR_VALUES);

  const showErrors = (
    name: FieldKey,
  ): { message: React.ReactNode; className: string } => {
    if (errors[name].length > 0) {
      const messageText: string = errors[name]
        .map((e: "format" | "required" | "unknown") => {
          switch (e) {
            case "format":
              return "Vyplněná hodnota nemá správný formát.";
            case "required":
              return "Toto pole je povinné.";
            case "unknown":
            default:
              return "Neznámá chyba.";
          }
        })
        .join(" ");

      return {
        className: ERROR_CLASSNAME,
        message: <p className="text-red-500 text-xs italic">{messageText}</p>,
      };
    }

    return { className: NON_ERROR_CLASSNAME, message: null };
  };

  const validateField = (fieldName: FieldKey, fieldValue: string) => {
    const { isOk, name, reason } = validator(fieldName, fieldValue);
    setErrors((prev) => ({
      ...prev,
      [name]: isOk ? [] : reason,
    }));
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
    >,
  ) => {
    const fieldName = e.target.name as FieldKey;
    const fieldValue = e.target.value;
    setFormValues((prev) => ({ ...prev, [fieldName]: fieldValue }));
    validateField(fieldName, fieldValue);
  };

  const onChangeGdp = () => {
    const newValue = formValues.gdp === "true" ? "false" : "true";
    setFormValues((prev) => ({ ...prev, gdp: newValue }));
    validateField("gdp", newValue);
  };

  const isDisabled = React.useMemo(() => {
    // If any field is invalid OR we've already succeeded OR we are loading => disable
    const someFieldInvalid = Object.keys(formValues).some((key: string) => {
      const fieldKey = key as FieldKey;
      const { isOk } = validator(fieldKey, formValues[fieldKey] ?? "");
      return !isOk;
    });

    return someFieldInvalid || registrationResult === "success" || isLoading;
  }, [formValues, registrationResult, isLoading]);

  const onSubmit = async () => {
    setIsLoading(true);
    const { result, message } = await postNewRegistration(formValues);
    if (result) {
      setRegistrationResult("success");
    } else {
      console.error("postNewRegistration:", message);
      setRegistrationResult("fail");
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full mt-5 px-1 max-w-5xl mx-auto">
      <NameFields
        formValues={formValues}
        onChange={onChange}
        showErrors={showErrors}
      />

      <ContactFields
        formValues={formValues}
        onChange={onChange}
        showErrors={showErrors}
      />

      <NotesField formValues={formValues} onChange={onChange} />

      <TermAndGdpFields
        formValues={formValues}
        onChange={onChange}
        onChangeGdp={onChangeGdp}
        showErrors={showErrors}
      />

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-96 m-auto h-10 px-3 mb-6 mt-6 md:mb-0">
          <button
            onClick={onSubmit}
            disabled={isDisabled}
            className="btn text-white rounded h-full w-full bg-cyan-700 hover:bg-cyan-400 disabled:bg-gray-600 sm:mb-0">
            Registrovat
          </button>
        </div>
      </div>

      <RegistrationResultMessage registrationResult={registrationResult} />
    </form>
  );
};
