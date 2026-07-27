/**
 * Inlined before the body renders to prevent dark mode flash.
 * Sets `dark` class on <html> from localStorage or system preference.
 */
export function ThemeScript() {
  const script = `
    (function(){
      try {
        var t = localStorage.getItem('theme');
        if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      } catch(e){}
    })();
  `;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
