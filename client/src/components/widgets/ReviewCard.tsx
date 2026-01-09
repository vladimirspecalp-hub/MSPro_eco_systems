// TODO: Реализовать модуль после подключения Supabase и API.

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewCardProps {
  author: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export default function ReviewCard({ 
  author, 
  company, 
  content, 
  avatar,
  rating = 5 
}: ReviewCardProps) {
  return (
    <Card data-testid={`card-review-${author}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={avatar} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold" data-testid="text-review-author">{author}</h3>
          {company && (
            <p className="text-sm text-muted-foreground" data-testid="text-review-company">
              {company}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-2">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-yellow-500">★</span>
          ))}
        </div>
        <p className="text-muted-foreground" data-testid="text-review-content">{content}</p>
      </CardContent>
    </Card>
  );
}
