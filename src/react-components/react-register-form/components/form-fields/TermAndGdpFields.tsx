import React from "react";
import type { RegistrationFormData, FieldKey } from "../../types";
import { periodSelectOptions } from "../../constants";

interface TermAndGdpFieldsProps {
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
  onChangeGdp: () => void;
}

export const TermAndGdpFields: React.FC<TermAndGdpFieldsProps> = ({
  formValues,
  showErrors,
  onChange,
  onChangeGdp,
}) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-6">
      {/* Term */}
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-state">
          Termín:
        </label>
        <div className="relative">
          <select
            name="term"
            onChange={onChange}
            value={formValues.term}
            className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state">
            {periodSelectOptions.map((o: { value: string; label: string }) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 px-3 mb-6 mt-6 md:mb-0">
        <div className={`flex items-center ${showErrors("gdp").className}`}>
          <label htmlFor="souhlas">
            Souhlasím se zpracováním osobních údajů{" "}
            <a
              className="text-primary-400 hover:text-primary-800 mb-4 sm:mb-0"
              target="_blank"
              href="/gdpr.pdf">
              <b>GDPR</b>
            </a>
            .
          </label>
          <input
            onChange={onChangeGdp}
            name="gdp"
            checked={formValues.gdp === "true"}
            type="checkbox"
            className="h-4 w-4 ml-4 mr-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
        {showErrors("gdp").message}
      </div>
    </div>
  );
};
