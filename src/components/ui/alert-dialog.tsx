import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function AlertDialog({
                         ...props
                     }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
                                ...props
                            }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
    return (
        <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
    )
}

function AlertDialogPortal({
                               container,
                               ...props
                           }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
    return (
        <AlertDialogPrimitive.Portal
            data-slot="alert-dialog-portal"
            {...props}
            container={container}
        />
    )
}

function AlertDialogOverlay({
                                className,
                                ...props
                            }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
    return (
        <AlertDialogPrimitive.Overlay
            data-slot="alert-dialog-overlay"
            className={cn(
                "rcb:fixed rcb:inset-0 rcb:z-50 rcb:bg-black/50 rcb:data-[state=open]:animate-in rcb:data-[state=closed]:animate-out rcb:data-[state=closed]:fade-out-0 rcb:data-[state=open]:fade-in-0",
                className
            )}
            {...props}
        />
    )
}

function AlertDialogContent({
                                className,
                                ...props
                            }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay/>
            <AlertDialogPrimitive.Content
                data-slot="alert-dialog-content"
                className={cn(
                    "rcb:fixed rcb:top-[50%] rcb:left-[50%] rcb:z-50 rcb:grid rcb:w-full rcb:max-w-[calc(100%-2rem)] rcb:translate-x-[-50%] rcb:translate-y-[-50%] rcb:gap-4 rcb:rounded-lg rcb:border rcb:bg-background rcb:p-6 rcb:shadow-lg rcb:duration-200 rcb:data-[state=open]:animate-in rcb:data-[state=closed]:animate-out rcb:data-[state=closed]:fade-out-0 rcb:data-[state=open]:fade-in-0 rcb:data-[state=closed]:zoom-out-95 rcb:data-[state=open]:zoom-in-95 rcb:sm:max-w-lg",
                    className
                )}
                {...props}
            />
        </AlertDialogPortal>
    )
}

function AlertDialogHeader({
                               className,
                               ...props
                           }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-header"
            className={cn(
                "rcb:flex rcb:flex-col rcb:gap-2 rcb:text-center rcb:sm:text-left",
                className
            )}
            {...props}
        />
    )
}

function AlertDialogFooter({
                               className,
                               ...props
                           }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-footer"
            className={cn(
                "rcb:flex rcb:flex-col-reverse rcb:gap-2 rcb:sm:flex-row rcb:sm:justify-end",
                className
            )}
            {...props}
        />
    )
}

function AlertDialogTitle({
                              className,
                              ...props
                          }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className={cn("rcb:text-lg rcb:font-semibold", className)}
            {...props}
        />
    )
}

function AlertDialogDescription({
                                    className,
                                    ...props
                                }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className={cn("rcb:text-sm rcb:text-muted-foreground", className)}
            {...props}
        />
    )
}

function AlertDialogAction({
                               className,
                               ...props
                           }: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
    return (
        <AlertDialogPrimitive.Action
            className={cn(buttonVariants(), className)}
            {...props}
        />
    )
}

function AlertDialogCancel({
                               className,
                               ...props
                           }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
    return (
        <AlertDialogPrimitive.Cancel
            className={cn(buttonVariants({variant: "outline"}), className)}
            {...props}
        />
    )
}

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
}
