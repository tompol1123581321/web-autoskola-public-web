import type { RegistrationFormData } from "../types";

export const createRegistration = async (
  data: RegistrationFormData,
  config: { tamplateId: string; serviceId: string; userPublicKey: string },
) => {
  console.log("here", config);
  const { serviceId, tamplateId, userPublicKey } = config;
  await send(serviceId, tamplateId, data, userPublicKey);
};
function send(
  serviceId: string,
  tamplateId: string,
  data: RegistrationFormData,
  userPublicKey: string,
) {
  throw new Error("Function not implemented.");
}
