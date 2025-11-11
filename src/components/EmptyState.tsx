import React from 'react';
import Button from './ui/Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, buttonText, onButtonClick }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-surface border-2 border-dashed border-border rounded-lg">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold text-text mb-1">{title}</h3>
      <p className="text-textSecondary mb-6 max-w-sm">{description}</p>
      <Button onClick={onButtonClick}>{buttonText}</Button>
    </div>
  );
};

export default EmptyState;
