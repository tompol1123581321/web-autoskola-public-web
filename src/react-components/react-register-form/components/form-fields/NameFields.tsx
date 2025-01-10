// components/RegistrationForm/NameFields.tsx
import React from "react";
import type { RegistrationFormData, FieldKey, ArrayReason } from "../../types";

interface NameFieldsProps {
  formValues: RegistrationFormData;
  showErrors: (name: FieldKey) => {
    message: React.ReactNode;
    className: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
    >,
  ) => void;
}

export const NameFields: React.FC<NameFieldsProps> = ({
  formValues,
  onChange,
  showErrors,
}) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-first-name">
          Jméno:
        </label>
        <input
          name="firstName"
          onChange={onChange}
          className={`appearance-none block w-full mb-2 bg-gray-50 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white ${
            showErrors("firstName").className
          }`}
          type="text"
          placeholder="Jane"
          value={formValues.firstName}
        />
        {showErrors("firstName").message}
      </div>

      <div className="w-full md:w-1/2 px-3">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-last-name">
          Příjmení:
        </label>
        <input
          onChange={onChange}
          value={formValues.lastName}
          name="lastName"
          className={`appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white ${
            showErrors("lastName").className
          }`}
          type="text"
          placeholder="Doe"
        />
        {showErrors("lastName").message}
      </div>
    </div>
  );
};
