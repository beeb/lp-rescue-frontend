/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			'light',
			{
				dark: {
					...require('daisyui/src/colors/themes')['[data-theme=dark]'],
					'base-content': 'white'
				}
			}
		]
	}
}
