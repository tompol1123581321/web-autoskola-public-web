import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ClientRegistrationFormData } from "../types";
import { PHONE_REG } from "../constants";
import { useCallback, useEffect, useState } from "react";
import type { TermOption } from "autoskola-web-shared-models";
import { getTermOptions, postNewRegistration } from "../api";

const schema: yup.ObjectSchema<ClientRegistrationFormData> = yup.object({
  firstName: yup.string().required("Jméno je povinné"),
  lastName: yup.string().required("Příjmení je povinné"),
  email: yup
    .string()
    .email("Zadejte platný email")
    .required("Email je povinný"),
  phoneNumber: yup
    .string()
    .required("Telefonní číslo je povinné")
    .matches(PHONE_REG, "Telefonní číslo není platné"),

  gdpr: yup
    .boolean()
    .oneOf([true], "Souhlas s GDPR je povinný")
    .required("Souhlas s GDPR je povinný"),
  notes: yup.string().default(""),
  termId: yup.string().required("Termín kurzu je povinný"),
});
export const useRegistrationForm = () => {
  const [termOptions, setTermOptions] = useState<Array<TermOption>>([]);
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
    } catch (error) {
      setTermOptions([]);
      console.error(error);
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
    defaultValues: {
      email: "",
      firstName: "",
      gdpr: false,
      lastName: "",
      notes: "",
      phoneNumber: "",
      termId: "",
    },
  });

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
    reset: () => reset(),
    submitDisabled: !isValid,
  };
};
