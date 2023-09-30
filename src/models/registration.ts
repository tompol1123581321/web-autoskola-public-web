export type RegistrationPageData = {
  registrationPageText: string;
  termOptions: Array<{
    label: string;
    value: string;
    amountOfFreeSpaces: number;
  }>;
};
