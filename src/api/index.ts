import type { WebSettings } from "autoskola-web-shared-models";
import { DEFAULT_PRICE_LIST } from "../constants/defaultValues";

enum SpecificWebSettings {
  "PRICE_LIST" = "priceList",
}

const getWebSettings = async (specificDataName: SpecificWebSettings) => {
  try {
    const response = await fetch(
      "https://web-autoskola-server.deno.dev/api/currentWebSettings",
    );
    const webSettings: WebSettings = await response.json();
    console.log(webSettings[specificDataName]);
    return webSettings[specificDataName];
  } catch (error) {
    console.error(error);
    return DEFAULT_PRICE_LIST;
  }
};

export const getPriceListData = async () => {
  return await getWebSettings(SpecificWebSettings.PRICE_LIST);
};
