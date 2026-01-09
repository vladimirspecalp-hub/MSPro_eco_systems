import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, XCircle, Clock, AlertTriangle, Info } from "lucide-react";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  testId?: string;
}

export function Toggle({ checked, onCheckedChange, testId }: ToggleProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      data-testid={testId}
    />
  );
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  testId?: string;
  className?: string;
}

export function TextInput({ value, onChange, placeholder, testId, className }: TextInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      data-testid={testId}
    />
  );
}

interface StatusBadgeProps {
  status: string | null;
  publishedCount?: number;
}

export function StatusBadge({ status, publishedCount }: StatusBadgeProps) {
  switch (status) {
    case "posted":
    case "published":
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          OK
          {publishedCount && publishedCount > 0 && (
            <span className="ml-1">({publishedCount})</span>
          )}
        </Badge>
      );
    case "queued":
    case "posting":
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Очередь
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Ошибка
        </Badge>
      );
    case "disabled":
      return (
        <Badge variant="outline">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Откл.
        </Badge>
      );
    default:
      return <Badge variant="outline">—</Badge>;
  }
}

interface TooltipWrapperProps {
  content: string;
  children: React.ReactNode;
}

export function TooltipWrapper({ content, children }: TooltipWrapperProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface ProfileUrlHintProps {
  show: boolean;
}

export function ProfileUrlHint({ show }: ProfileUrlHintProps) {
  if (!show) return null;
  
  return (
    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1">
      <Info className="w-3 h-3" />
      <span>Добавьте URL профиля</span>
    </div>
  );
}
