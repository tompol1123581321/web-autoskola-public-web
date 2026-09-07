import type React from "react";
import { ERROR_CLASSNAME } from "../../constants";
import type { UseFormRegister } from "react-hook-form";
import type { ClientRegistrationFormData } from "../../types";

type Props = {
  register: UseFormRegister<ClientRegistrationFormData>;
  name: keyof ClientRegistrationFormData;
  validateFunction?: (value: string) => boolean | string;
  errorMessage?: string;
  label: string;
  type?: string;
  isRequired?: boolean;
};

export const GenericFieldWithValidation: React.FC<Props> = ({
  name,
  register,
  errorMessage,
  type = "text",
  isRequired,
  label,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center mb-1">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
          htmlFor={name}>
          {label}
        </label>
        {isRequired && !errorMessage && (
          <span className="ml-1 text-red-500 text-xs" aria-hidden="true">
            *
          </span>
        )}
        {errorMessage && (
          <span
            id={`${name}-error`}
            className="ml-2 text-red-600 text-xs flex items-center"
            role="alert">
            {errorMessage}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={name}
          type={type}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? `${name}-error` : undefined}
          className={`block min-h-11 w-full appearance-none rounded-lg border bg-slate-50 px-3 py-2.5 text-base leading-tight text-gray-700 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            errorMessage ? ERROR_CLASSNAME : "border-gray-300"
          } ${
            errorMessage ? "pr-10 border-red-600" : ""
          }`}
          {...register(name)}
        />

        {errorMessage && (
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            aria-hidden="true">
            <svg
              className="h-5 w-5 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 
                  11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
};
