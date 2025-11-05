import React from 'react';
import { IFeatureCard } from '../../types/component.types';
import FeatureCardComponent from '../shared/FeatureCard';

/**
 * Features Section Component - Following OOP Principles
 * 
 * Single Responsibility: Manages and displays feature cards
 * Composition: Uses FeatureCardComponent for individual features
 * Reusability: Can be used with different feature sets
 */
interface IFeaturesProps {
  title: string;
  subtitle?: string;
  features: IFeatureCard[];
  className?: string;
}

export class FeaturesSectionComponent extends React.Component<IFeaturesProps> {
  
  /**
   * Encapsulated method to render section header
   */
  private renderSectionHeader(): React.ReactNode {
    const { title, subtitle } = this.props;
    
    return (
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  /**
   * Encapsulated method to render features grid
   */
  private renderFeaturesGrid(): React.ReactNode {
    const { features } = this.props;
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCardComponent
            key={feature.id}
            feature={feature}
            className="transform hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>
    );
  }

  /**
   * Main render method
   */
  render() {
    const { className = '' } = this.props;
    
    return (
      <section className={`max-w-6xl mx-auto px-6 py-16 ${className}`}>
        {this.renderSectionHeader()}
        {this.renderFeaturesGrid()}
      </section>
    );
  }
}

export default FeaturesSectionComponent;