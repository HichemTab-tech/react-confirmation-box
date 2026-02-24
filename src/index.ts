import './index.css';
export type {
    ConfirmationDialogProps,
} from './components/ConfirmationDialogWrapper';

// noinspection JSUnusedGlobalSymbols
export {
    default as ConfirmationProvider,
    type ConfirmationProps,
    type ConfirmationProviderProps,
    promptConfirmation,
    createConfirmation
} from './components/ConfirmationProvider';
