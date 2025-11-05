import React from 'react';
import { IHeroSection, IStatItem } from '../../types/component.types';
import ButtonComponent from '../shared/Button';

/**
 * Hero Section Component - Following OOP Principles
 * 
 * Single Responsibility: Handles hero section display and CTA
 * Encapsulation: Manages its own layout and styling
 * Composition: Uses ButtonComponent for actions
 */
interface IHeroProps {
  heroData: IHeroSection;
  stats: IStatItem[];
  onGetStartedClick: () => void;
  onLearnMoreClick: () => void;
}

export class HeroSectionComponent extends React.Component<IHeroProps> {
  
  /**
   * Encapsulated method to render the main hero content
   */
  private renderHeroContent(): React.ReactNode {
    const { heroData } = this.props;
    
    return (
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {heroData.title}
          <span className="block text-blue-600 mt-2">{heroData.subtitle}</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          {heroData.description}
        </p>
        {this.renderCallToActionButtons()}
      </div>
    );
  }

  /**
   * Encapsulated method to render call-to-action buttons
   */
  private renderCallToActionButtons(): React.ReactNode {
    const { onGetStartedClick, onLearnMoreClick } = this.props;
    
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <ButtonComponent
          variant="primary"
          size="lg"
          onClick={onGetStartedClick}
        >
          Get Started Free
        </ButtonComponent>
        <ButtonComponent
          variant="outline"
          size="lg"
          onClick={onLearnMoreClick}
        >
          Learn More
        </ButtonComponent>
      </div>
    );
  }

  /**
   * Encapsulated method to render statistics section
   */
  private renderStats(): React.ReactNode {
    const { stats } = this.props;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * Main render method
   */
  render() {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20">
        {this.renderHeroContent()}
        {this.renderStats()}
      </section>
    );
  }
}

export default HeroSectionComponent;