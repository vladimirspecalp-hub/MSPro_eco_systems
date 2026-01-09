// TODO: Реализовать модуль после подключения Supabase и API.

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground" data-testid="text-page-description">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
