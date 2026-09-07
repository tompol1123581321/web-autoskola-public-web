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
      className="mx-auto mt-5 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <InputFields errors={errors} register={register} />

      <NotesField errors={errors} register={register} />

      <div className="mb-1 grid gap-4">
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
