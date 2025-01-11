import React from "react";
import type { UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import type { ClientRegistrationFormData } from "../../types";

interface GdprFieldProps {
  register: UseFormRegister<ClientRegistrationFormData>;
  errors: FieldErrorsImpl<ClientRegistrationFormData>;
}

export const GdprField: React.FC<GdprFieldProps> = ({ register, errors }) => {
  return (
    <div className="w-full md:w-1/2 px-3 h-12 mb-4">
      {/* One row for checkbox + label */}
      <div className="flex items-center">
        <input
          id="gdpr"
          type="checkbox"
          className={`form-checkbox h-4 w-4 text-indigo-600 ${
            errors.gdpr ? "border-red-500" : ""
          }`}
          {...register("gdpr")}
        />

        <label htmlFor="gdpr" className="ml-2 block text-sm text-gray-700">
          Souhlasím se zpracováním osobních údajů{" "}
          <a download href="/files/gdpr.pdf">
            <b>GDPR</b>
          </a>
        </label>
      </div>

      {/* Error on its own line below */}
      {errors.gdpr && (
        <p className="text-red-500 text-xs italic mt-1" role="alert">
          {errors.gdpr.message}
        </p>
      )}
    </div>
  );
};
