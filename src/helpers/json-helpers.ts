import type { AnyType } from "../types/any-type";

// Function to download the JSON object as a file
export const DownloadJsonAsFile = (obj: AnyType, filename = "data.json") => {
  const jsonString = JSON.stringify(obj, null, 2); // Pretty-print JSON
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
};
