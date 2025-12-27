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
            <AlertDialogContent className="rcb:sm:max-w-md rcb:bg-white">
                <AlertDialogHeader>
                    <div className="rcb:flex rcb:items-center rcb:gap-3">
                        {props.warning ? (
                            <div
                                className="rcb:flex rcb:h-10 rcb:w-10 rcb:items-center rcb:justify-center rcb:rounded-full rcb:bg-destructive/10">
                                <AlertTriangle className="rcb:h-5 rcb:w-5 rcb:text-destructive"/>
                            </div>
                        ) : (
                            <div
                                className="rcb:flex rcb:h-10 rcb:w-10 rcb:items-center rcb:justify-center rcb:rounded-full rcb:bg-primary/10">
                                <Info className="rcb:h-5 rcb:w-5 rcb:text-primary"/>
                            </div>
                        )}
                        <AlertDialogTitle className="rcb:text-left">{props.title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription
                        className="rcb:text-left">{props.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter
                    className="rcb:flex-col-reverse rcb:sm:flex-row rcb:sm:justify-end rcb:sm:space-x-2">
                    <AlertDialogCancel
                        onClick={props.onCancel}>{props.cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={props.onConfirm}
                        className={cn(props.warning && "rcb:bg-destructive rcb:text-destructive-foreground rcb:hover:bg-destructive/90")}
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
