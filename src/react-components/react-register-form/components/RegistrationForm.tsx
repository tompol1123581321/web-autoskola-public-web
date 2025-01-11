// components/RegistrationForm/RegistrationForm.tsx
import React from "react";
import { RegistrationResultMessage } from "./result-message/RegistrationResultMessage";
import { NotesField } from "./form-fields/NotesFields";
import { InputFields } from "./form-fields/InputFields";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { ControlButtons } from "./control-buttons/ControlButtons";
import { TermField } from "./form-fields/TermField";
import { GdprField } from "./form-fields/GDPRField";

export const RegistrationForm: React.FC = () => {
  const {
    errors,
    isLoading,
    handleSubmit,
    register,
    registrationResult,
    reset,
    submitDisabled,
    termOptions,
  } = useRegistrationForm();

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full mt-5 px-1 max-w-5xl mx-auto">
      <InputFields errors={errors} register={register} />

      <NotesField errors={errors} register={register} />

      <div className="flex flex-wrap items-center -mx-3 mb-4">
        <TermField
          errors={errors}
          register={register}
          termOptions={termOptions}
        />
        <GdprField errors={errors} register={register} />
      </div>

      <ControlButtons
        onRegister={handleSubmit}
        onReset={reset}
        disabled={submitDisabled}
        isLoading={isLoading}
      />

      <RegistrationResultMessage registrationResult={registrationResult} />
    </form>
  );
};
