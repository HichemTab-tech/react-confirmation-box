import React, {memo, useCallback, useEffect, useState, useSyncExternalStore} from "react";
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

const confirmationRegistry = new Map<string, Map<string, ConfirmationRequest>>();
let confirmationRegistryIds: Array<{id: string, name: string}> = [];
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
const register = (id: string, props: ConfirmationProps|undefined, name: string) => {
    if (!confirmationRegistry.has(name)) {
        confirmationRegistry.set(name, new Map());
    }
    confirmationRegistry.get(name)!.set(id, {props});
    if (!confirmationRegistryIds.some(entry => entry.id === id)) {
        confirmationRegistryIds = [...confirmationRegistryIds, {id, name}];
        notifyListeners();
    }
}
const getConfirmationsFromRegistry = () => {
    return confirmationRegistryIds;
}
const removeConfirmationId = (id: string, name: string) => {
    confirmationRegistryIds = confirmationRegistryIds.filter(entry => entry.id !== id);
    confirmationRegistry.get(name)?.delete(id);
    if (confirmationRegistry.get(name)?.size === 0) {
        confirmationRegistry.delete(name);
    }
    notifyListeners();
}

export type ConfirmationProviderProps = Pick<ConfirmationDialogWrapperProps, 'Component'> & {name?: string};

let confirmationProviderInstancesNumber = new Map<string, number>();

export const promptConfirmation = (props?: ConfirmationProps, name: string = "default") => {
    if ((confirmationProviderInstancesNumber.get(name)??0) === 0) {
        throw new Error("No ConfirmationProvider component found on the page. You can't use promptConfirmation if your app doesn't have ConfirmationProvider component. Please add one to your page, check https://github.com/HichemTab-tech/react-confirmation-box#-60-second-tldr for more information.");
    }
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    register(uniqueId, props, name);
    return new Promise<boolean>((resolve) => {
        confirmationRegistry.get(name)!.get(uniqueId)!.resolve = resolve;
    });
}

const ConfirmationProvider = memo(({Component, name}: ConfirmationProviderProps) => {
    const ids = useSyncExternalStore(subscribe, getConfirmationsFromRegistry, getConfirmationsFromRegistry);
    name ??= "default";

    useEffect(() => {
        if (!confirmationProviderInstancesNumber.has(name)) {
            confirmationProviderInstancesNumber.set(name, 0);
        }
        confirmationProviderInstancesNumber.set(name, confirmationProviderInstancesNumber.get(name)! + 1);
        if (confirmationProviderInstancesNumber.get(name)! > 1) {
            console.error("You can't have more than one ConfirmationProvider component on the page. You will have unexpected behavior. Please remove one of them.");
        }
        return () => {
            confirmationProviderInstancesNumber.set(name, confirmationProviderInstancesNumber.get(name)! - 1);
            if (confirmationProviderInstancesNumber.get(name)! === 0) {
                confirmationProviderInstancesNumber.delete(name);
            }
        }
    }, []);

    return (
        <>
            {ids.filter(entry => entry.name === name).map(({id}) => (
                <ConfirmationDialog
                    id={id}
                    key={id}
                    Component={Component}
                    name={name}
                />
            ))}
        </>
    )
});

const ConfirmationDialog = memo(({id, Component, name}: {id: string, name: string} & Pick<ConfirmationDialogWrapperProps, 'Component'>) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, [setOpen]);

    const handle = useCallback((ok: boolean, then?: () => void) => {
        confirmationRegistry.get(name)?.get(id)?.resolve?.(ok);
        then?.();
        setOpen(false);
        setTimeout(() => {
            removeConfirmationId(id, name);
        }, 800);
    }, [setOpen, name, id]);

    const {onConfirm, onCancel, ...props} = confirmationRegistry.get(name)?.get(id)?.props??{};

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
});

export const createConfirmation = (props?: ConfirmationProps, Component?: NonNullable<ConfirmationProviderProps['Component']>) => {
    const name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // noinspection JSUnusedGlobalSymbols
    return {
        promptConfirmation: (overrideProps?: ConfirmationProps) => promptConfirmation({
            ...props,
            ...overrideProps
        }, name),
        ConfirmationProvider: () => {
            return <ConfirmationProvider Component={Component} name={name}/>;
        }
    };
}

export default ConfirmationProvider;
