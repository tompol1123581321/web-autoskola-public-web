type AdditionalNumberContacts = Record<string, number>;
export type ContactsPageData = {
  address: Array<string>;
  officePhoneNumber: Array<number>;
  email: string;
} & AdditionalNumberContacts;
