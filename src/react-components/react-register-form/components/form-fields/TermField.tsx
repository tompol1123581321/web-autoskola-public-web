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
    <div className="w-full">
      <div className="flex flex-col items-start">
        <label
          htmlFor="termId"
          className="mb-2 text-sm font-semibold text-gray-700">
          Termín kurzu:
        </label>

        <div className="relative w-full">
          <select
            id="termId"
            required
            aria-invalid={Boolean(errors.termId)}
            aria-describedby={errors.termId ? "termId-error" : undefined}
            disabled={!termOptions?.length}
            className={`block min-h-11 w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-10 text-base text-gray-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.termId ? "border-red-500" : "border-gray-300"
            }`}
            {...register("termId")}>
            <option value="">
              {termOptions === null
                ? "Načítám termíny..."
                : termOptions.length
                  ? "Vyberte termín"
                  : "Termíny nejsou momentálně dostupné"}
            </option>
            {termOptions?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Error message below */}
      {errors.termId && (
        <p id="termId-error" className="mt-1 text-xs italic text-red-500" role="alert">
          {errors.termId.message}
        </p>
      )}
    </div>
  );
};
