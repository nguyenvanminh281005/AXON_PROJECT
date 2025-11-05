import React from 'react';
import { INavigationConfig, IFeatureCard, IHeroSection, IStatItem } from '../types/component.types';

/**
 * Application Data Configuration - Following OOP Principles
 * 
 * Single Responsibility: Centralized data management
 * Separation of Concerns: Data separated from UI logic
 * Easy Maintenance: All content in one place
 */

/**
 * Navigation Configuration
 */
export const navigationConfig: INavigationConfig = {
  brand: {
    name: 'AXON',
    logo: (
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">A</span>
      </div>
    )
  },
  menuItems: [
    { label: 'Home', href: '/' },
    // { label: 'Features', href: '#features' },
    // { label: 'About', href: '#about' },
    // { label: 'Contact', href: '#contact' }
  ],
  authButtons: {
    login: { children: 'Login', variant: 'outline' as const },
    register: { children: 'Register', variant: 'primary' as const }
  }
};

/**
 * Hero Section Data
 */
export const heroSectionData: IHeroSection = {
  title: 'Employee Expense',
  subtitle: 'Management System',
  description: 'Streamline your expense reporting process with our intuitive platform. Track, submit, and approve expenses effortlessly while maintaining complete transparency and control over your company\'s financial workflow.'
};

/**
 * Statistics Data
 */
export const statsData: IStatItem[] = [
  { value: '10K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '500K+', label: 'Expenses Processed' },
  { value: '24/7', label: 'Support' }
];

/**
 * Features Data
 */
export const featuresData: IFeatureCard[] = [
  {
    id: 'easy-submission',
    title: 'Easy Submission',
    description: 'Submit expenses quickly with photo uploads, receipt scanning, and automated categorization for maximum efficiency.',
    bgColor: 'bg-green-100 dark:bg-green-900',
    icon: (
      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'real-time-tracking',
    title: 'Real-time Tracking',
    description: 'Monitor expense status and approval workflow in real-time with instant notifications and updates.',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    icon: (
      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    id: 'detailed-reports',
    title: 'Detailed Reports',
    description: 'Generate comprehensive reports and analytics for better financial insights and decision making.',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    icon: (
      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'multi-currency',
    title: 'Multi-Currency Support',
    description: 'Handle expenses in multiple currencies with automatic conversion and exchange rate tracking.',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    icon: (
      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  {
    id: 'approval-workflow',
    title: 'Smart Approval Workflow',
    description: 'Customizable approval workflows with automated routing based on expense amount and category.',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
    icon: (
      <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  {
    id: 'integration',
    title: 'Seamless Integration',
    description: 'Connect with your existing accounting software and HR systems for complete workflow integration.',
    bgColor: 'bg-red-100 dark:bg-red-900',
    icon: (
      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  }
];