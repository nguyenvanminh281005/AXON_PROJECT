/**
 * Theme Configuration
 * Centralized theme colors and styles for consistent UI
 * Following DRY principle - single source of truth for design tokens
 */

/**
 * Color Palette Class
 * Encapsulates theme colors with utility methods
 */
export class ColorPalette {
  constructor(
    public readonly primary: string,
    public readonly primaryHover: string,
    public readonly primaryLight: string,
    public readonly secondary: string,
    public readonly background: string,
    public readonly backgroundAlt: string,
    public readonly text: string,
    public readonly textSecondary: string,
    public readonly border: string,
    public readonly success: string,
    public readonly warning: string,
    public readonly error: string,
    public readonly info: string
  ) {}

  /**
   * Get Tailwind classes for primary button
   */
  getPrimaryButtonClasses(): string {
    return `bg-${this.primary} hover:bg-${this.primaryHover} text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow`;
  }

  /**
   * Get Tailwind classes for secondary button
   */
  getSecondaryButtonClasses(): string {
    return `bg-${this.secondary} hover:bg-gray-100 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-300`;
  }

  /**
   * Get Tailwind classes for card
   */
  getCardClasses(): string {
    return `bg-white rounded-lg shadow-sm border border-${this.border} p-6`;
  }
}

/**
 * Light Theme Colors
 */
export const lightTheme = new ColorPalette(
  '#42A7C3', // primary
  '#328fa5', // primaryHover (darker shade)
  '#B7E9F6', // primaryLight (background nhạt)
  'white',
  '#B7E9F6', // background chính dùng màu phụ nhạt
  'white',
  'gray-900',
  'gray-600',
  '#B7E9F6', // border (chuyển luôn nếu là border nhẹ)
  'green-600',
  'yellow-500',
  'red-600',
  '#42A7C3' // info
);

/**
 * Dark Theme Colors (for future implementation)
 */
export const darkTheme = new ColorPalette(
  '#42A7C3', // primary
  '#328fa5', // primaryHover
  '#164854', // primaryLight dark
  'gray-800',
  'gray-900',
  'gray-800',
  'white',
  'gray-300',
  '#164854', // border
  'green-500',
  'yellow-400',
  'red-500',
  '#42A7C3' // info
);

/**
 * Theme Configuration Object
 * Centralized styling for consistent UI
 */
export const themeConfig = {
  colors: lightTheme,
  
  // Layout classes
  layout: {
    pageBackground: 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
    header: 'bg-white shadow-sm border-b border-gray-200',
    card: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
    section: 'mb-8',
  },

  // Component classes
  components: {
    // Buttons
    button: {
      primary: 'bg-[#48B7D6] hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-5 rounded-lg transition-colors border border-gray-300 shadow-sm hover:shadow',
      danger: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm hover:shadow disabled:opacity-50',
      success: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm hover:shadow',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-5 rounded-lg transition-colors',
    },

    // Input fields
    input: {
      base: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow',
      error: 'border-red-500 focus:ring-red-500',
      disabled: 'bg-gray-100 cursor-not-allowed',
    },

    // Badges/Status indicators
    badge: {
      pending: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800',
      approved: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800',
      rejected: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800',
      draft: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800',
    },

    // Tables
    table: {
      container: 'overflow-x-auto rounded-lg border border-gray-200',
      base: 'min-w-full divide-y divide-gray-200',
      header: 'bg-gray-50',
      headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      body: 'bg-white divide-y divide-gray-200',
      row: 'hover:bg-gray-50 transition-colors cursor-pointer',
      cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    },

    // Modals
    modal: {
      overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
      container: 'bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto',
      header: 'px-6 py-4 border-b border-gray-200 flex items-center justify-between',
      body: 'px-6 py-4',
      footer: 'px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3',
    },

    // Stats/Cards
    statCard: {
      container: 'bg-white overflow-hidden shadow rounded-lg',
      content: 'p-5',
      icon: 'flex-shrink-0 rounded-md p-3',
      iconYellow: 'bg-yellow-500 text-white',
      iconGreen: 'bg-green-500 text-white',
      iconRed: 'bg-red-500 text-white',
      iconBlue: 'bg-blue-500 text-white',
      title: 'text-sm font-medium text-gray-500 truncate',
      value: 'text-3xl font-semibold text-gray-900',
    },

    // Alerts/Messages
    alert: {
      success: 'bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800',
      error: 'bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800',
      warning: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800',
      info: 'bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800',
    },
  },

  // Typography
  typography: {
    h1: 'text-4xl font-bold text-gray-900',
    h2: 'text-3xl font-bold text-gray-900',
    h3: 'text-2xl font-bold text-gray-900',
    h4: 'text-xl font-semibold text-gray-900',
    h5: 'text-lg font-semibold text-gray-900',
    body: 'text-base text-gray-700',
    bodySecondary: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500',
  },

  // Spacing utilities
  spacing: {
    section: 'py-12',
    container: 'px-4 sm:px-6 lg:px-8',
    card: 'p-6',
    tight: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  },

  // Animation
  animation: {
    transition: 'transition-all duration-200 ease-in-out',
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in',
    spin: 'animate-spin',
  },
};

/**
 * Helper function to combine classes
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Export default theme
 */
export default themeConfig;
