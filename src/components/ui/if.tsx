import { ReactNode } from 'react';

interface IfProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function If({ condition, children, fallback }: IfProps) {
  if (condition) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
