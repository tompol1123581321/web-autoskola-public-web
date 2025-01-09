// components/RegistrationForm/ContactFields.tsx
import React from "react";
import type { RegistrationFormData, FieldKey, ArrayReason } from "../types";

interface ContactFieldsProps {
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

export const ContactFields: React.FC<ContactFieldsProps> = ({
  formValues,
  onChange,
  showErrors,
}) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-6">
      {/* Phone */}
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-phone">
          Telefonní číslo:
        </label>
        <input
          onChange={onChange}
          name="phone"
          className={`appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white ${
            showErrors("phone").className
          }`}
          type="tel"
          value={formValues.phone}
        />
        {showErrors("phone").message}
      </div>

      {/* Email */}
      <div className="w-full md:w-1/2 px-3">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-email">
          E-mail:
        </label>
        <input
          onChange={onChange}
          name="eMail"
          className={`appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white ${
            showErrors("eMail").className
          }`}
          type="email"
          value={formValues.eMail}
        />
        {showErrors("eMail").message}
      </div>
    </div>
  );
};
