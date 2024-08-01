import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                main: '#131313',
                secondary: '#A3A3A3',
                accent: '#1db954',
                accentSecondary: '#caf4d9',
            },
        },
    },
    plugins: [],
}
export default config
