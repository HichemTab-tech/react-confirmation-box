import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {AlertTriangle, Info} from "lucide-react"
import {cn} from '@/lib/utils';
import React from "react";

export interface ConfirmationDialogWrapperProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: "normal" | "warning"
    onConfirm?: () => void
    onCancel?: () => void
    Component?: React.FC<ConfirmationDialogProps>
}

export interface ConfirmationDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    warning: boolean,
    title: string,
    description: string,
    onCancel: () => void,
    cancelText: string,
    onConfirm: () => void,
    confirmText: string
}

function DefaultConfirmationDialog(props: ConfirmationDialogProps) {
    return (
        <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        {props.warning ? (
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-5 w-5 text-destructive"/>
                            </div>
                        ) : (
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Info className="h-5 w-5 text-primary"/>
                            </div>
                        )}
                        <AlertDialogTitle className="text-left">{props.title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription
                        className="text-left">{props.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter
                    className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <AlertDialogCancel
                        onClick={props.onCancel}>{props.cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={props.onConfirm}
                        className={cn(props.warning && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                    >
                        {props.confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function ConfirmationDialogWrapper({
                                       open,
                                       onOpenChange,
                                       title,
                                       description,
                                       confirmText,
                                       cancelText,
                                       variant = "normal",
                                       onConfirm,
                                       onCancel,
                                       Component
                                   }: ConfirmationDialogWrapperProps) {
    confirmText = confirmText ?? "Yes";

    cancelText = cancelText ?? "Cancel";

    title = title ?? "Confirmation";
    description = description ?? "Are you sure you want to do this?";

    const handleConfirm = () => {
        onConfirm?.()
        onOpenChange(false)
    }

    const handleCancel = () => {
        onCancel?.()
        onOpenChange(false)
    }

    const isWarning = variant === "warning"

    Component ??= DefaultConfirmationDialog;

    return (
        <Component
            open={open}
            onOpenChange={onOpenChange}
            warning={isWarning}
            title={title}
            description={description}
            onCancel={handleCancel}
            cancelText={cancelText}
            onConfirm={handleConfirm}
            confirmText={confirmText}
        />
    )
}

export default ConfirmationDialogWrapper;
