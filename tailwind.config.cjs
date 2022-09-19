/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					primary: '#8839ef',
					secondary: '#ea76cb',
					accent: '#179299',
					neutral: '#4c4f69',
					'neutral-content': '#dce0e8',
					'base-100': '#eff1f5',
					'base-200': '#e6e9ef',
					'base-300': '#dce0e8',
					'base-content': '#4c4f69',
					info: '#1e66f5',
					success: '#40a02b',
					'success-content': '#ffffff',
					warning: '#fe640b',
					error: '#d20f39',

					'--rounded-box': '1.5rem', // border radius rounded-box utility class, used in card and other large boxes
					'--rounded-btn': '9999px', // border radius rounded-btn utility class, used in buttons and similar element
					'--rounded-badge': '9999px', // border radius rounded-badge utility class, used in badges and similar
					'--btn-text-case': 'none', // set default text transform for buttons
					'--tab-radius': '9999px' // border radius of tabs
				}
			},
			{
				dark: {
					primary: '#cba6f7',
					secondary: '#f5c2e7',
					accent: '#94e2d5',
					neutral: '#45475a',
					'neutral-content': '#b4befe',
					'base-100': '#1e1e2e',
					'base-200': '#181825',
					'base-300': '#11111b',
					'base-content': '#cdd6f4',
					info: '#89b4fa',
					success: '#a6e3a1',
					warning: '#fab387',
					error: '#f38ba8',

					'--rounded-box': '1.5rem', // border radius rounded-box utility class, used in card and other large boxes
					'--rounded-btn': '9999px', // border radius rounded-btn utility class, used in buttons and similar element
					'--rounded-badge': '9999px', // border radius rounded-badge utility class, used in badges and similar
					'--btn-text-case': 'none', // set default text transform for buttons
					'--tab-radius': '9999px' // border radius of tabs
				}
			}
		]
	}
}
