// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'vue/no-unused-components': 'warn',
      'vue/multi-word-component-names': 'off',
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    },
  }
)
