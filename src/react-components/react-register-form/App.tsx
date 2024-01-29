import React, { useState } from "react";
import {
  DEFAULT_ERROR_VALUES,
  DEFAULT_FORM_VALUES,
  ERROR_CLASSNAME,
  NON_ERROR_CLASSNAME,
  periodSelectOptions,
} from "./constants";
import { createRegistration } from "./api";
import type { RegistrationFormData, FieldKey, ArrayReason } from "./types";
import { validator } from "./validation";

export const App = () => {
  const config = {} as {
    tamplateId: string;
    serviceId: string;
    userPublicKey: string;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<
    "success" | "fail" | null
  >(null);
  const [formValues, setFormValues] =
    useState<RegistrationFormData>(DEFAULT_FORM_VALUES);
  const [errors, setErrors] =
    useState<Record<FieldKey, ArrayReason>>(DEFAULT_ERROR_VALUES);

  const showErrors = (
    name: FieldKey,
  ): { message: React.ReactNode; className: string } => {
    if (!!errors[name].length) {
      const messageText: string = errors[name]
        .map((e: "format" | "required" | "unknown") => {
          switch (e) {
            case "format":
              return "Vyplněná hodnota nemá správný formát.";
            case "required":
              return "Toto pole je povinné.";

            case "unknown":
            default:
              return "Neznámá chyba";
          }
        })
        .join(" ");
      const message = (
        <p className="text-red-500 text-xs italic">{messageText}</p>
      );
      return { className: ERROR_CLASSNAME, message };
    }
    return { className: NON_ERROR_CLASSNAME, message: null };
  };

  const validateField = (fieldName: FieldKey, fieldValue: string) => {
    const { isOk, name, reason } = validator(fieldName, fieldValue);
    setErrors({ ...errors, [name]: isOk ? [] : reason });
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
    >,
  ) => {
    const fieldName = e.target.name as FieldKey;
    const fieldValue = e.target.value;
    setFormValues({ ...formValues, [fieldName]: fieldValue });
    validateField(fieldName, fieldValue);
  };

  const onChangeGdp = () => {
    const newValue = formValues.gdp === "true" ? "false" : "true";
    setFormValues({ ...formValues, gdp: newValue });
    validateField("gdp", newValue);
  };

  const isDisabled = React.useMemo(() => {
    return Object.keys(formValues).some((key: string) => {
      const fieldKey = key as FieldKey;
      const { isOk } = validator(fieldKey, formValues[fieldKey] ?? "");
      return !isOk || registrationResult === "success" || isLoading;
    });
  }, [formValues, registrationResult, isLoading]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await createRegistration(formValues, config);
      setRegistrationResult("success");
    } catch (error) {
      setRegistrationResult("fail");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full mt-5 px-1 max-w-5xl mx-auto ">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-first-name">
            Jméno:
          </label>
          <input
            name="firstName"
            onChange={onChange}
            className={`appearance-none block w-full mb-2 bg-gray-50 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white ${
              showErrors("firstName").className
            }`}
            type="text"
            placeholder="Jane"
            value={formValues.firstName}
          />
          {showErrors("firstName").message}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-last-name">
            Příjmení:
          </label>
          <input
            onChange={onChange}
            value={formValues.lastName}
            name="lastName"
            className={`appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white ${
              showErrors("lastName").className
            }`}
            type="text"
            placeholder="Doe"
          />
          {showErrors("lastName").message}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-first-name">
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
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-last-name">
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
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password">
            Poznámky:
          </label>
          <textarea
          rows={5}
            name="notes"
            onChange={onChange}
            value={formValues.notes}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"></textarea>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
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
              {periodSelectOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
              </svg>
            </div>
          </div>
        </div>
         <div className="w-full md:w-1/2 px-3 mb-6 mt-6 md:mb-0">
          <div className={` flex items-center ${showErrors("gdp").className}`}>
            <label htmlFor="souhlas">
              Souhlasím se zpracováním osobních údajů{" "}
              <a
                className="text-primary-400 hover:text-primary-800 mb-4 sm:mb-0"
                target={"_blank"}
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
              className="h-4  w-4 ml-4 mr-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          {showErrors("gdp").message}
        </div>
        
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
       
        <div className="w-96 m-auto  h-10 px-3 mb-6 mt-6 md:mb-0">
          <button
            onClick={onSubmit}
            disabled={isDisabled}
            className="btn text-white rounded h-full w-full  bg-cyan-700 hover:bg-cyan-400 disabled:bg-gray-600 sm:mb-0">
            Registrovat
          </button>
        </div>
      </div>
      <div className="mb-6 md:mb-0">
        {registrationResult === "success" ? (
          <div
            className="bg-green-100 border border-green-600 text-green-700 px-3 py-3 flex justify-center items-center rounded"
            role="alert">
            <p className="text-sm mr-3">Registrace proběhla úspěšně!</p>
            <div className=" flex items-center justify-center w-10 h-10 rounded-full border-green-600 border-2">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-green-600 dark:text-slate-200 icon-bold"
                astro-icon="tabler:check">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m5 12 5 5L20 7"></path>
              </svg>
            </div>
          </div>
        ) : registrationResult === "fail" ? (
          <div
            className="bg-red-100 border border-red-500 text-red-700 px-3 py-3 rounded"
            role="alert">
            <p className="text-sm">Registrace selhala.</p>
            <p className="text-sm">Kontaktujte 603928674</p>
          </div>
        ) : null}
      </div>
    </form>
  );
};
