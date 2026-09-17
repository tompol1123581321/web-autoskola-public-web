import { DEFAULT_PRICE_LIST } from "../constants/defaultValues";

enum SpecificWebSettings {
  "PRICE_LIST" = "priceList",
}

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

const getWebSettings = async (specificDataName: SpecificWebSettings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/webSettings/current`, {
      headers: { Accept: "application/json" },
    });
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
