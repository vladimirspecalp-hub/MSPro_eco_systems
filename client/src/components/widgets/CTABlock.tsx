// TODO: Реализовать модуль после подключения Supabase и API.

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CTABlockProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function CTABlock({ 
  title, 
  description, 
  buttonText = 'Заказать услугу',
  onButtonClick 
}: CTABlockProps) {
  return (
    <Card className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4" data-testid="text-cta-title">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-6" data-testid="text-cta-description">
          {description}
        </p>
      )}
      <Button 
        size="lg" 
        onClick={onButtonClick}
        data-testid="button-cta"
      >
        {buttonText}
      </Button>
    </Card>
  );
}
