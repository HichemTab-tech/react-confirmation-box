import React, {useCallback, useEffect, useState, useSyncExternalStore} from "react";
import ConfirmationDialogWrapper, {
    type ConfirmationDialogWrapperProps
} from "./ConfirmationDialogWrapper";

export type ConfirmationProps = Omit<
    ConfirmationDialogWrapperProps,
    "Component" |
    "open" |
    "onOpenChange"
>

type ConfirmationRequest = {
    props?: ConfirmationProps
    resolve?: (value: boolean) => void
};

const confirmationRegistry = new Map<string, ConfirmationRequest>();
let confirmationRegistryIds: string[] = [];
const listeners: (() => void)[] = [];
const subscribe = (callback: () => void) => {
    listeners.push(callback);
    return () => unsubscribe(callback);
}
const unsubscribe = (callback: () => void) => {
    listeners.splice(listeners.indexOf(callback), 1);
}
const notifyListeners = () => {
    listeners.forEach(callback => callback());
}
const register = (id: string, props?: ConfirmationProps) => {
    confirmationRegistry.set(id, {props});
    if (!confirmationRegistryIds.includes(id)) {
        confirmationRegistryIds = [...confirmationRegistryIds, id];
        notifyListeners();
    }
}
const getConfirmationsFromRegistry = () => {
    return confirmationRegistryIds;
}
const removeConfirmationId = (id: string) => {
    confirmationRegistryIds = confirmationRegistryIds.filter(existingId => existingId !== id);
    confirmationRegistry.delete(id);
    notifyListeners();
}

export type ConfirmationProviderProps = Pick<ConfirmationDialogWrapperProps, 'Component'>;

let confirmationProviderInstancesNumber = 0;

export const promptConfirmation = (props?: ConfirmationProps) => {
    if (confirmationProviderInstancesNumber === 0) {
        throw new Error("No ConfirmationProvider component found on the page. You can't use promptConfirmation if your app doesn't have ConfirmationProvider component. Please add one to your page, check https://github.com/HichemTab-tech/react-confirmation-box#-60-second-tldr for more information.");
    }
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    register(uniqueId, props);
    return new Promise<boolean>((resolve) => {
        confirmationRegistry.get(uniqueId)!.resolve = resolve;
    });
}

const ConfirmationProvider = ({Component}: ConfirmationProviderProps) => {
    const ids = useSyncExternalStore(subscribe, getConfirmationsFromRegistry, getConfirmationsFromRegistry);

    useEffect(() => {
        confirmationProviderInstancesNumber++;
        if (confirmationProviderInstancesNumber > 1) {
            console.error("You can't have more than one ConfirmationProvider component on the page. You will have unexpected behavior. Please remove one of them.");
        }
        return () => {
            confirmationProviderInstancesNumber--;
        }
    }, []);

    return (
        <>
            {ids.map(id => (
                <ConfirmationDialog
                    id={id}
                    key={id}
                    Component={Component}
                />
            ))}
        </>
    )
}

const ConfirmationDialog = ({id, Component}: {id: string} & Pick<ConfirmationDialogWrapperProps, 'Component'>) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, [setOpen]);

    const handle = useCallback((ok: boolean, then?: () => void) => {
        confirmationRegistry.get(id)?.resolve?.(ok);
        then?.();
        setOpen(false);
        setTimeout(() => {
            removeConfirmationId(id);
        }, 800);
    }, [setOpen]);

    const {onConfirm, onCancel, ...props} = confirmationRegistry.get(id)?.props??{};

    return (
        <ConfirmationDialogWrapper
            {...props}
            open={open}
            onOpenChange={setOpen}
            Component={Component}
            onConfirm={() => handle(true, onConfirm)}
            onCancel={() => handle(false, onCancel)}
        />
    );
}

export default ConfirmationProvider;
