import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "rcb:cursor-pointer rcb:inline-flex rcb:items-center rcb:justify-center rcb:gap-2 rcb:whitespace-nowrap rcb:rounded-md rcb:text-sm rcb:font-medium rcb:transition-[color,box-shadow] rcb:disabled:pointer-events-none rcb:disabled:opacity-50 rcb:[&_svg]:pointer-events-none rcb:[&_svg:not([class*='size-'])]:size-4 rcb:[&_svg]:shrink-0 rcb:outline-none rcb:focus-visible:border-ring rcb:focus-visible:ring-ring/50 rcb:focus-visible:ring-[3px] rcb:aria-invalid:ring-destructive/20 rcb:dark:aria-invalid:ring-destructive/40 rcb:aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: 'rcb:bg-primary rcb:text-primary-foreground rcb:shadow-xs rcb:hover:bg-primary/90',
                destructive:
                    'rcb:bg-destructive rcb:text-white rcb:shadow-xs rcb:hover:bg-destructive/90 rcb:focus-visible:ring-destructive/20 rcb:dark:focus-visible:ring-destructive/40',
                outline: 'rcb:border rcb:border-input rcb:bg-background rcb:shadow-xs rcb:hover:bg-accent rcb:hover:text-accent-foreground',
                secondary: 'rcb:bg-secondary rcb:text-secondary-foreground rcb:shadow-xs rcb:hover:bg-secondary/80',
                ghost: 'rcb:hover:bg-accent rcb:hover:text-accent-foreground',
                link: 'rcb:text-primary rcb:underline-offset-4 rcb:hover:underline',
                root: '',
            },
            size: {
                default: 'rcb:h-9 rcb:px-4 rcb:py-2 rcb:has-[>svg]:px-3',
                sm: 'rcb:h-8 rcb:rounded-md rcb:px-3 rcb:has-[>svg]:px-2.5',
                lg: 'rcb:h-10 rcb:rounded-md rcb:px-6 rcb:has-[>svg]:px-4',
                icon: 'rcb:size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    type = 'button',
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }), 'cursor-pointer')} type={type} {...props} />;
}

export { Button, buttonVariants };
