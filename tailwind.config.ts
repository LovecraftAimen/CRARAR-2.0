
export const tailwindConfig = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crarar: {
          primary: '#3B7A57',
          secondary: '#F5F5DC',
          text: '#2F2F2F',
          light: '#F8F9F8',
          accent: '#E8E8E8',
          success: '#22c55e',
          danger: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    }
  }
};
