export default defineAppConfig({
  googleFonts: { families: { "Mona Sans": ["300", "400", "500", "600", "700", "800", "900"] } },

  ui: {
    button: { slots: { base: "text-main" } },
    select: { variants: { size: { xl: { base: "px-6 py-4 text-sm" } } } },
    input: {
      slots: {
        base: "focus-visible:ring-dark/30! outline-accent-green/25! rounded-4xl corner-squircle p-4!",
      },
    },
    textarea: {
      slots: {
        base: "corner-based rounded-xl px-4! py-3! text-dark! font-medium! focus-visible:ring-dark/30! outline-accent-green/25! mx-[1px]",
      },
    },
    inputNumber: { slots: { base: "all:unset ring-0!" } },
    tabs: { slots: { root: "main-shadow" } },
    slideover: { slots: { overlay: "bg-black/70" } },
    container: { base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8" },
  },
});
