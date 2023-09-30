enum SpecificWebSettings {
  "PRICE_LIST" = "priceList",
  "IMAGES" = "images",
  "ALL" = "all",
}

const getWebSettings = async (specificDataName: SpecificWebSettings) => {
  switch (specificDataName) {
    case SpecificWebSettings.PRICE_LIST:
      return [{ name: "", price: "", additionalMessage: "" }];

    case SpecificWebSettings.IMAGES:
      return [{ url: "", title: "" }];

    case SpecificWebSettings.ALL:
    default:
      break;
  }
};

export const getPriceListData = async () => {
  return await getWebSettings(SpecificWebSettings.PRICE_LIST);
};

export const getImageDataData = async () => {
  return await getWebSettings(SpecificWebSettings.IMAGES);
};

// export const getPriceListData = () => {};
