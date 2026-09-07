import { DEFAULT_PRICE_LIST } from "../constants/defaultValues";

enum SpecificWebSettings {
  "PRICE_LIST" = "priceList",
}

const getWebSettings = async (specificDataName: SpecificWebSettings) => {
  try {
    const response = await fetch(
      "https://web-autoskola-server.deno.dev/api/webSettings/current",
    );
    if (!response.ok) {
      throw new Error(`Web settings request failed: ${response.status}`);
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error("Web settings response was not JSON");
    }
    const webSettings = await response.json();
    return webSettings[specificDataName];
  } catch (error) {
    return DEFAULT_PRICE_LIST;
  }
};

export const getPriceListData = async () => {
  return await getWebSettings(SpecificWebSettings.PRICE_LIST);
};
