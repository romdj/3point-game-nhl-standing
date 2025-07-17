module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      tableLayout: ['hover'],
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
