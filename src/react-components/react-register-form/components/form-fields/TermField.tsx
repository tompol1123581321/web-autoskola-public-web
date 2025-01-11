import React from "react";
import type { TermOption } from "autoskola-web-shared-models";
import type { UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import type { ClientRegistrationFormData } from "../../types";

interface TermFieldProps {
  register: UseFormRegister<ClientRegistrationFormData>;
  errors: FieldErrorsImpl<ClientRegistrationFormData>;
  termOptions: TermOption[] | null;
}

/**
 * Renders a label to the left of a select dropdown for selecting a term.
 */
export const TermField: React.FC<TermFieldProps> = ({
  register,
  errors,
  termOptions,
}) => {
  return (
    <div className="w-full md:w-1/2 h-12 px-3 mb-4">
      {/* Container for label + select side-by-side */}
      <div className="flex items-center">
        <label
          htmlFor="termId"
          className="text-sm  w-40 font-medium text-gray-700 whitespace-nowrap mr-4">
          Termín kurzu:
        </label>

        <select
          id="termId"
          className={`form-select block w-full bg-white  ${
            errors.termId ? "border-red-500" : ""
          }`}
          {...register("termId")}>
          <option value="">Vyberte termín</option>
          {termOptions?.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error message below */}
      {errors.termId && (
        <p className="text-red-500 text-xs italic mt-1">
          {errors.termId.message}
        </p>
      )}
    </div>
  );
};
