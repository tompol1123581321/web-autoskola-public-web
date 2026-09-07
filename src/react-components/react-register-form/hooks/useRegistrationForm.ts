import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ClientRegistrationFormData } from "../types";
import { PHONE_REG } from "../constants";
import { useCallback, useEffect, useState } from "react";
import type { TermOption } from "autoskola-web-shared-models";
import { getTermOptions, postNewRegistration } from "../api";

const schema: yup.ObjectSchema<ClientRegistrationFormData> = yup.object({
  firstName: yup.string().trim().required("Jméno je povinné"),
  lastName: yup.string().trim().required("Příjmení je povinné"),
  email: yup
    .string()
    .trim()
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
  notes: yup.string().default(""),
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
  const [isLoading, setIsLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const loadTermOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const termOptions = await getTermOptions();
      setTermOptions(termOptions);
    } catch {
      setTermOptions([]);
    } finally {
      setIsLoading(false);
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
      try {
        const { message, result } = await postNewRegistration(data);
        setRegistrationResult({ message, success: !!result });
        reset(); // Reset form after successful submission
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
    [reset],
  );

  return {
    register,
    termOptions,
    errors,
    isLoading,
    registrationResult,
    handleSubmit: handleSubmit(onSubmit),
    reset: resetForm,
    submitDisabled: !isValid,
  };
};
