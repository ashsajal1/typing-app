/**
 * Deobfuscates Base64 encoded text.
 * @param base64Text The Base64 encoded string.
 * @returns The decoded plain text, or an error message if decoding fails.
 */
export function deobfuscateText(base64Text: string): string {
  try {
    // Ensure the Base64 string is valid; browsers' atob can be picky.
    // Remove any non-Base64 characters (like newlines that might have been introduced if edited)
    const cleanedBase64Text = base64Text.replace(/[^A-Za-z0-9+/=]/g, "");
    return atob(cleanedBase64Text);
  } catch (e) {
    console.error("Failed to deobfuscate text (not valid Base64?):", e);
    return "Error: Could not deobfuscate text. Please ensure it is a valid Base64 encoded file.";
  }
}

/**
 * (For external use/testing) Obfuscates plain text to Base64.
 * This function is NOT used by the app for de-obfuscation,
 * but shows how one might create the .bin files.
 * @param plainText The plain text to encode.
 * @returns The Base64 encoded string.
 */
export function obfuscateTextForTesting(plainText: string): string {
  try {
    return btoa(plainText);
  } catch (e) {
    console.error("Failed to obfuscate text:", e);
    return "Error during obfuscation.";
  }
}