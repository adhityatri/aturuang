export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: "text-main",
      },
    },
    select: {
      slots: {
        base: "rounded-[2em] bg-neutral-100! main-shadow",
      },
      variants: {
        size: {
          xl: {
            base: "px-6 py-4 text-sm",
          },
        },
      },
    },
    input: {
      slots: {
        base: "rounded-[2em] bg-neutral-100! main-shadow",
      },
      variants: {
        size: {
          xl: {
            base: "px-6 py-4 text-sm",
          },
        },
      },
    },
    inputNumber: {
      slots: {
        base: "main-shadow",
      },
    },
    tabs: {
      slots: {
        root: "main-shadow",
      },
    },
    slideover: {
      slots: {
        overlay: "bg-black/70",
      },
    },
    container: {
      base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8",
    },
    textarea: {
      slots: {
        base: "main-shadow border-2 border-white rounded-2xl text-md",
      },
    },
  },
});
