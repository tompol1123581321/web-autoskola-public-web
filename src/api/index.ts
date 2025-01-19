import type { WebSettings } from "autoskola-web-shared-models";
import { DEFAULT_PRICE_LIST } from "../constants/defaultValues";

enum SpecificWebSettings {
  "PRICE_LIST" = "priceList",
}

const getWebSettings = async (specificDataName: SpecificWebSettings) => {
  try {
    const response = await fetch(
      "https://web-autoskola-server.deno.dev/api/webSettings",
    );
    const webSettings = await response.json();
    console.log(webSettings);
    return webSettings[0][specificDataName];
  } catch (error) {
    console.log(error);
    return DEFAULT_PRICE_LIST;
  }
};

export const getPriceListData = async () => {
  return await getWebSettings(SpecificWebSettings.PRICE_LIST);
};
