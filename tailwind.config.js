module.exports = {
  theme: {
    colors: {
      canvas: "oklch(0.9634 0.0128 95.24)",
      surface: "oklch(1 0 0)",

      primary: "oklch(0.4689 0.1776 255.43)",
      blue: "oklch(0.4689 0.1776 255.43)",

      red: "oklch(0.6349 0.2336 27.81)",
      yellow: "oklch(0.8907 0.1789 95.76)",

      black: "oklch(0.1452 0 0)",
      muted: "oklch(0.5518 0.0163 257.08)",
      border: "oklch(0.1732 0 0)",
    },

    extend: {
      borderRadius: { none: "0px", sm: "4px", md: "8px", lg: "16px", full: "999px" },

      boxShadow: {
        bauhaus: "4px 4px 0 oklch(0.1732 0 0)",
        shadowBauhaus: "0 8px 20px oklch(0.1452 0 0 / 0.12)",
      },

      spacing: { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 10: "40px" },
    },
  },

  plugins: [],
};
