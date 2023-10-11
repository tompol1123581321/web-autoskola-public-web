import type { ContactsPageData } from "./contacts";
import type { HomePageData } from "./home";
import type { PriceListPageData } from "./priceList";
import type { RegistrationPageData } from "./registration";
import type { StudiumPageData } from "./studium";

export type Configuration = {
  pagesData: {
    home: HomePageData;
    priceList: PriceListPageData;
    contacts: ContactsPageData;
    studium: StudiumPageData;
    registration: RegistrationPageData;
  };
};
