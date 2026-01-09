import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trackCTAClick } from '@/modules/analytics';

interface CTABlockProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  ctaId?: string;
  placement?: string;
}

export default function CTABlock({ 
  title, 
  description, 
  buttonText = 'Заказать услугу',
  onButtonClick,
  ctaId = 'cta-block',
  placement = 'content'
}: CTABlockProps) {
  const handleClick = () => {
    trackCTAClick(ctaId, placement);
    onButtonClick?.();
  };

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
        onClick={handleClick}
        data-testid="button-cta"
        data-track="cta_click"
        data-track-meta={JSON.stringify({ ctaId, placement })}
      >
        {buttonText}
      </Button>
    </Card>
  );
}
