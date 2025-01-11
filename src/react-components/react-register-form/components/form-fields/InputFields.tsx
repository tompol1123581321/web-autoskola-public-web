import React from "react";
import type { FieldErrorsImpl, UseFormRegister } from "react-hook-form";
import type { ClientRegistrationFormData } from "../../types";
import { GenericFieldWithValidation } from "../generic-field/GenericInputField";

interface InputFieldsProps {
  register: UseFormRegister<ClientRegistrationFormData>;
  errors: FieldErrorsImpl<ClientRegistrationFormData>;
}

export const InputFields: React.FC<InputFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-2">
      <GenericFieldWithValidation
        type="text"
        label="Jméno"
        name="firstName"
        register={register}
        errorMessage={errors.firstName?.message}
        isRequired
      />

      <GenericFieldWithValidation
        type="text"
        label="Příjmení"
        name="lastName"
        register={register}
        errorMessage={errors.lastName?.message}
        isRequired
      />

      <GenericFieldWithValidation
        label="Email"
        name="email"
        type="email"
        register={register}
        errorMessage={errors.email?.message}
        isRequired
      />

      <GenericFieldWithValidation
        label="Telefon"
        name="phoneNumber"
        register={register}
        errorMessage={errors.phoneNumber?.message}
        isRequired
      />
    </div>
  );
};
