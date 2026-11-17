/**
 * Robust, cross-platform clipboard copy helper.
 * Supports modern Navigator Clipboard API (HTTPS / localhost)
 * with automatic fallback to document.execCommand('copy') for non-secure contexts (LAN HTTP, IP addresses).
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // 1. Try modern navigator.clipboard (available on HTTPS or localhost)
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("[Clipboard API writeText failed, trying fallback]", err);
    }
  }

  // 2. Fallback for non-secure contexts (e.g. mobile accessing via HTTP LAN IP)
  if (typeof document !== "undefined") {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Position off-screen without causing page jump
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.style.opacity = "0";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Support iOS Safari selection range
      textArea.setSelectionRange(0, text.length);

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        return true;
      }
    } catch (fallbackErr) {
      console.error("[Legacy document.execCommand copy failed]", fallbackErr);
    }
  }

  return false;
}
