export function applyUserThemeToDocument(prefs) {
  if (!prefs) return;

  const root = document.documentElement;

  //ini buat theme (dark/light)
  if (prefs.theme) {
    root.setAttribute("data-theme", prefs.theme);
  }

  //ini buat font (default / serif / open-dyslexic)
  if (prefs.fontStyle) {
    root.setAttribute("data-font", prefs.fontStyle);
  }

  //ini buat font size (small / medium / large)
  if (prefs.fontSize) {
    root.setAttribute("data-size", prefs.fontSize);
  }

  //ini buat layout width (fullWidth / mediumWidth)
  if (prefs.layoutWidth) {
    root.setAttribute("data-width", prefs.layoutWidth);
  }

  console.log(
    `%c[THEME APPLIED] theme=${prefs.theme} | font=${prefs.fontStyle} | size=${prefs.fontSize} | width=${prefs.layoutWidth}`,
    "color:#4ade80;font-weight:bold;"
  );
}
