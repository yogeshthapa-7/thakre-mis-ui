const Humanize = {
  Word: (value: string) => {
    value = (value || "").replace(/([A-Z])/g, " $1").trim();
    value = (value || "").replace("_", " ").trim();
    value = (value || "").replace("  ", " ").trim();
    return value;
  },
  Capitalize: (value: string) => {
    if (!value) return ""; // Handle empty or null strings
    return value.charAt(0).toUpperCase() + value.slice(1);
  },
  Amount: (value: string | undefined | number, decimal?: boolean) => {
    const decimalPoint = decimal === undefined ? true : decimal;
    let currentValue: number | string;
    if (typeof value === "string") {
      currentValue = Number((value ?? "").split(",").join(""));
    } else if (value === 0) {
      currentValue = value.toFixed(2);
    } else {
      currentValue = value ?? 0;
    }
    if (!currentValue) {
      return "";
    }
    const nf = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: decimalPoint ? 2 : 0,
    });
    return nf.format(Number(currentValue));
  },
};

export default Humanize;
