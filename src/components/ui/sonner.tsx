'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-medium rounded-lg border p-4',
          description: 'group-[.toast]:text-muted-foreground text-sm leading-relaxed',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-md px-3 py-1.5 text-sm font-medium',
          closeButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-md p-1.5 hover:bg-accent/50 transition-colors duration-200'
        },
        duration: 5000
      }}
      {...props}
    />
  );
};

export { Toaster };
