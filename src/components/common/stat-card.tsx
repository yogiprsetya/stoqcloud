import { type LucideIcon, XCircle as DefaultIcon } from 'lucide-react';
import { FC } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { cn } from '~/utils/css';
import { If } from '../ui/if';

type Props = {
  variant: 'info' | 'warning' | 'success' | 'purple';
  title: string;
  stat: string | number;
  textHelper?: string;
  icon?: LucideIcon;
  classNames?: string;
};

export const StatCard: FC<Props> = ({ variant, icon, ...props }) => {
  const Icon = icon ?? DefaultIcon;

  const mainStyles = cn({
    'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800':
      variant === 'info',
    'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800':
      variant === 'success',
    'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800':
      variant === 'warning',
    'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800':
      variant === 'purple'
  });

  const titleClasses = cn({
    'text-blue-600 dark:text-blue-400': variant === 'info',
    'text-green-600 dark:text-green-400': variant === 'success',
    'text-orange-600 dark:text-orange-400': variant === 'warning',
    'text-purple-600 dark:text-purple-400': variant === 'purple'
  });

  const statClasses = cn({
    'text-blue-900 dark:text-blue-100': variant === 'info',
    'text-green-900 dark:text-green-100': variant === 'success',
    'text-orange-900 dark:text-orange-100': variant === 'warning',
    'text-purple-900 dark:text-purple-100': variant === 'purple'
  });

  return (
    <Card className={cn(mainStyles, 'bg-gradient-to-br', props.classNames)}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <If condition={!!icon}>
            <Icon className={cn('size-8', titleClasses)} />
          </If>

          <div className={cn(props.textHelper && 'space-y-1')}>
            <p className={cn('text-sm font-medium', titleClasses)}>{props.title}</p>
            <p className={cn('text-2xl font-bold', statClasses)}>{props.stat}</p>

            <If condition={!!props.textHelper}>
              <p className={cn('text-xs', titleClasses)}>{props.textHelper}</p>
            </If>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
