/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        olive: '#A3A380',
        clover: '#D7CE93',
        daisy: '#EFEBCE',
        blush: '#D8A48F',
        peach: '#BB8588',
        bg: '#FBF6EE',
        'bg-deep': '#F3E9DE',
        surface: '#FFFDF9',
        'surface-soft': '#FFF9F1',
        ink: '#4A342E',
        'ink-soft': '#8A6E64',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        cozy: '1.25rem',
        stitch: '1.75rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(74, 52, 46, 0.18)',
        gentle: '0 4px 14px -4px rgba(74, 52, 46, 0.12)',
      },
      backgroundImage: {
        'peach-fade': 'linear-gradient(135deg, #FBF6EE 0%, #F3E9DE 55%, #EFEBCE 100%)',
        'blush-fade': 'linear-gradient(135deg, #D8A48F 0%, #BB8588 100%)',
      },
    },
  },
  plugins: [],
}
