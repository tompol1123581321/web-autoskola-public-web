import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ClientRegistrationFormData } from "../types";
import { PHONE_REG } from "../constants";
import { useCallback, useEffect, useState } from "react";
import type { TermOption } from "autoskola-web-shared-models";
import { getTermOptions, postNewRegistration } from "../api";

const schema: yup.ObjectSchema<ClientRegistrationFormData> = yup.object({
  firstName: yup
    .string()
    .trim()
    .max(100, "Jméno může mít maximálně 100 znaků")
    .required("Jméno je povinné"),
  lastName: yup
    .string()
    .trim()
    .max(100, "Příjmení může mít maximálně 100 znaků")
    .required("Příjmení je povinné"),
  email: yup
    .string()
    .trim()
    .max(254, "E-mail může mít maximálně 254 znaků")
    .email("Zadejte platný e-mail")
    .required("E-mail je povinný"),
  phoneNumber: yup
    .string()
    .transform((value) => value.replace(/\s+/g, ""))
    .required("Telefonní číslo je povinné")
    .matches(PHONE_REG, "Telefonní číslo není platné"),

  gdpr: yup
    .boolean()
    .oneOf([true], "Souhlas s GDPR je povinný")
    .required("Souhlas s GDPR je povinný"),
  notes: yup
    .string()
    .max(2000, "Poznámka může mít maximálně 2000 znaků")
    .default(""),
  termId: yup.string().required("Termín kurzu je povinný"),
});

const defaultValues: ClientRegistrationFormData = {
  email: "",
  firstName: "",
  gdpr: false,
  lastName: "",
  notes: "",
  phoneNumber: "",
  termId: "",
};

export const useRegistrationForm = () => {
  const [termOptions, setTermOptions] = useState<Array<TermOption> | null>(null);
  const [termsError, setTermsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const loadTermOptions = useCallback(async () => {
    setTermsError(false);
    const result = await getTermOptions();
    if (result.status === "success") {
      setTermOptions(result.termOptions);
    } else {
      setTermOptions(null);
      setTermsError(true);
    }
  }, []);

  useEffect(() => {
    loadTermOptions();
  }, [loadTermOptions]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm<ClientRegistrationFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  const resetForm = useCallback(() => {
    reset(defaultValues);
    setRegistrationResult(null);
  }, [reset]);

  const onSubmit: SubmitHandler<ClientRegistrationFormData> = useCallback(
    async (data) => {
      setIsLoading(true);
      setRegistrationResult(null);
      try {
        const result = await postNewRegistration(data);

        if (result.status === "success") {
          setRegistrationResult({ success: true, message: result.message });
          reset(defaultValues);
          return;
        }

        setRegistrationResult({ success: false, message: result.message });

        if (result.status === "validation_error") {
          (
            Object.entries(result.errors) as Array<
              [keyof ClientRegistrationFormData, string]
            >
          ).forEach(([field, message]) => {
            setError(field, { type: "server", message });
          });
          return;
        }

        if (result.status === "conflict") {
          loadTermOptions();
        }
      } catch (error) {
        console.error("Error submitting registration:", error);
        setRegistrationResult({
          success: false,
          message: "Registrace se nepodařila. Zkuste to prosím znovu.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [reset, setError, loadTermOptions],
  );

  return {
    register,
    termOptions,
    termsError,
    reloadTermOptions: loadTermOptions,
    errors,
    isLoading,
    registrationResult,
    handleSubmit: handleSubmit(onSubmit),
    reset: resetForm,
    submitDisabled: !isValid || isLoading || !termOptions?.length,
  };
};
