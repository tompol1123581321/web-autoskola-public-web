import type React from "react";
import type { RegistrationFormData } from "autoskola-web-shared-models";
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
    <div className="w-full md:w-1/2 px-3 mb-4">
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
          className={`appearance-none block w-full bg-gray-50 text-gray-700 border ${
            errorMessage ? ERROR_CLASSNAME : "border-gray-300"
          } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 ${
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
