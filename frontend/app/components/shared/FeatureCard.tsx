import React from 'react';
import { IFeatureCard } from '../../types/component.types';

/**
 * Reusable Feature Card Component - Following OOP Principles
 * 
 * Single Responsibility: Displays feature information in a card format
 * Encapsulation: Handles its own styling and layout
 * Reusability: Can be used across different pages and sections
 */
interface IFeatureCardProps {
  feature: IFeatureCard;
  className?: string;
}

export class FeatureCardComponent extends React.Component<IFeatureCardProps> {
  
  /**
   * Encapsulated method to render the icon section
   */
  private renderIcon(): React.ReactNode {
    const { feature } = this.props;
    
    return (
      <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
        {feature.icon}
      </div>
    );
  }

  /**
   * Encapsulated method to render the content section
   */
  private renderContent(): React.ReactNode {
    const { feature } = this.props;
    
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {feature.description}
        </p>
      </div>
    );
  }

  /**
   * Main render method
   */
  render() {
    const { className = '' } = this.props;
    
    const baseStyles = 'bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300';
    const combinedStyles = `${baseStyles} ${className}`.trim();
    
    return (
      <div className={combinedStyles}>
        {this.renderIcon()}
        {this.renderContent()}
      </div>
    );
  }
}

export default FeatureCardComponent;