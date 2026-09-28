export default defineAppConfig({
  googleFonts: { families: { "Mona Sans": ["300", "400", "500", "600", "700", "800", "900"] } },

  ui: {
    button: { slots: { base: "text-main" } },
    select: { variants: { size: { xl: { base: "px-6 py-4 text-sm" } } } },
    input: { variants: { size: { xl: { base: "px-6 py-4 text-sm" } } } },
    inputNumber: { slots: { base: "all:unset ring-0!" } },
    tabs: { slots: { root: "main-shadow" } },
    slideover: { slots: { overlay: "bg-black/70" } },
    container: { base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8" },
    textarea: { slots: { base: "rounded-none" } },
  },
});
