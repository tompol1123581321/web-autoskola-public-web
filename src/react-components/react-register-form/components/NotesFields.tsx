// components/RegistrationForm/NotesField.tsx
import React from "react";
import type { RegistrationFormData, FieldKey } from "../types";

interface NotesFieldProps {
  formValues: RegistrationFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
    >,
  ) => void;
}

export const NotesField: React.FC<NotesFieldProps> = ({
  formValues,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full px-3">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-notes">
          Poznámky:
        </label>
        <textarea
          rows={5}
          name="notes"
          onChange={onChange}
          value={formValues.notes}
          className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
    </div>
  );
};
