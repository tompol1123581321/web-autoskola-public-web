import React from "react";
import type { UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import type { ClientRegistrationFormData } from "../../types";

interface NotesFieldProps {
  register: UseFormRegister<ClientRegistrationFormData>;
  errors: FieldErrorsImpl<ClientRegistrationFormData>;
}

export const NotesField: React.FC<NotesFieldProps> = ({ register, errors }) => {
  return (
    <div className="mb-6">
      <div className="w-full">
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-semibold text-gray-700">
          Poznámky
        </label>
        <textarea
          id="notes"
          rows={4}
          placeholder="Například preferovaný termín nebo doplňující informace"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          className={`block min-h-28 w-full resize-y rounded-lg border bg-white px-3 py-3 text-base text-gray-700 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.notes ? "border-red-500" : "border-gray-300"}`}
          {...register("notes")}
        />
        {errors.notes && (
          <p id="notes-error" className="mt-1 text-xs italic text-red-500" role="alert">
            {errors.notes.message}
          </p>
        )}
      </div>
    </div>
  );
};
