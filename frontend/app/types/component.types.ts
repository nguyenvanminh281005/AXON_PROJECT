// Component Interface Definitions - Following OOP Abstraction Principle
import React from 'react';

export interface IButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface INavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface IFeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

export interface IStatItem {
  value: string;
  label: string;
}

export interface IHeroSection {
  title: string;
  subtitle: string;
  description: string;
}

// Navigation Configuration
export interface INavigationConfig {
  brand: {
    name: string;
    logo: React.ReactNode;
  };
  menuItems: INavigationItem[];
  authButtons: {
    login: IButtonProps;
    register: IButtonProps;
  };
}