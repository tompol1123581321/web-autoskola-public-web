import React from "react";
import type { UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import type { ClientRegistrationFormData } from "../../types";

interface NotesFieldProps {
  register: UseFormRegister<ClientRegistrationFormData>;
  errors: FieldErrorsImpl<ClientRegistrationFormData>;
}

export const NotesField: React.FC<NotesFieldProps> = ({ register, errors }) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-2">
      <div className="w-full px-3 mb-4">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700">
          Poznámky
        </label>
        <textarea
          id="notes"
          rows={4}
          className={`form-textarea mt-1 block w-full ${errors.notes ? "border-red-500" : ""}`}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-red-500 text-xs italic mt-1">
            {errors.notes.message}
          </p>
        )}
      </div>
    </div>
  );
};
