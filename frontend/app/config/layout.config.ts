/**
 * Layout Configuration
 * Centralized layout structure for consistent UI across all pages
 * Following DRY principle - single source of truth
 */

import themeConfig from './theme.config';

/**
 * Page Layout Configuration
 */
export const pageLayoutConfig = {
  /**
   * Main container classes for all pages
   */
  container: {
    full: themeConfig.layout.pageBackground,
    content: themeConfig.layout.container,
  },

  /**
   * Header configuration
   */
  header: {
    base: themeConfig.layout.header,
    sticky: 'sticky top-0 z-50',
  },

  /**
   * Main content area
   */
  main: {
    base: 'flex-1',
    withPadding: `${themeConfig.layout.container} py-8`,
  },

  /**
   * Footer configuration
   */
  footer: {
    base: 'bg-white border-t border-gray-200 py-8',
    content: 'max-w-7xl mx-auto px-6 text-center',
  },

  /**
   * Card layouts for content sections
   */
  card: {
    base: themeConfig.layout.card,
    interactive: `${themeConfig.layout.card} hover:shadow-md transition-shadow cursor-pointer`,
  },

  /**
   * Section spacing
   */
  section: {
    default: 'py-12',
    compact: 'py-8',
    spacious: 'py-16',
  },

  /**
   * Grid layouts
   */
  grid: {
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    cols3: 'grid grid-cols-1 md:grid-cols-3 gap-6',
    cols4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
  },

  /**
   * Responsive breakpoints info (for reference)
   */
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/**
 * Common page structure helper
 */
export const getPageLayout = (variant: 'default' | 'dashboard' | 'landing') => {
  switch (variant) {
    case 'landing':
      return {
        container: pageLayoutConfig.container.full,
        main: pageLayoutConfig.main.base,
        section: pageLayoutConfig.section.spacious,
      };
    case 'dashboard':
      return {
        container: pageLayoutConfig.container.full,
        main: pageLayoutConfig.main.withPadding,
        section: pageLayoutConfig.section.compact,
      };
    default:
      return {
        container: pageLayoutConfig.container.full,
        main: pageLayoutConfig.main.withPadding,
        section: pageLayoutConfig.section.default,
      };
  }
};

export default pageLayoutConfig;
