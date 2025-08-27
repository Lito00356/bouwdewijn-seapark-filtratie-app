export function generateMeasurementKey(name) {
  return (
    name
      .trim()
      // Split by spaces, underscores, or hyphens
      .split(/[\s_-]+/)
      .map((word, index) => {
        // Remove special characters from each word
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");

        // Skip empty words
        if (!cleanWord) return "";

        if (index === 0) {
          // First word: completely lowercase
          return cleanWord.toLowerCase();
        } else {
          // Other words: first letter uppercase, rest lowercase
          return (
            cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase()
          );
        }
      })
      .filter((word) => word) // Remove empty strings
      .join("")
  );
}
