import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { ConfirmationProvider, promptConfirmation, type ConfirmationDialogProps, createConfirmation } from '../src';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../src/components/ui/alert-dialog';

const TestComponent = ({ title, description, onConfirm, onCancel, open, onOpenChange }: ConfirmationDialogProps) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

afterEach(async () => {
    cleanup();
    // because of removing the item after timeout.
    await new Promise(resolve => setTimeout(resolve, 1000));
});

describe('ConfirmationProvider and promptConfirmation', () => {

    it('should show confirmation dialog and resolve with true when confirmed', async () => {
        render(<ConfirmationProvider Component={TestComponent} />);

        const confirmationPromise = promptConfirmation();

        const continueButton = await screen.findByText('Continue');
        expect(screen.findByText('Continue')).not.toBeNull();

        act(() => {
            continueButton.click();
        });

        const result = await confirmationPromise;
        expect(result).toBe(true);
    });

    it('should show confirmation dialog and resolve with false when canceled', async () => {
        render(<ConfirmationProvider Component={TestComponent} />);

        const confirmationPromise = promptConfirmation();

        const cancelButton = await screen.findByText('Cancel');
        expect(cancelButton).not.toBeNull();

        act(() => {
            cancelButton.click();
        });

        const result = await confirmationPromise;
        expect(result).toBe(false);
    });

    it('should render the dialog with custom props', async () => {
        render(<ConfirmationProvider Component={TestComponent} />);

        void promptConfirmation({
            title: 'Custom Title',
            description: 'Custom Description',
        });

        expect(await screen.findByText('Custom Title')).not.toBeNull();
        expect(await screen.findByText('Custom Description')).not.toBeNull();
    });

    it('should resolve confirmations scoped to a named provider', async () => {
        render(<ConfirmationProvider Component={TestComponent} name="secondary" />);

        const confirmationPromise = promptConfirmation({ title: 'Secondary flow' }, 'secondary');

        expect(await screen.findByText('Secondary flow')).not.toBeNull();
        const continueButton = await screen.findByText('Continue');

        act(() => {
            continueButton.click();
        });

        const result = await confirmationPromise;
        expect(result).toBe(true);
    });

    it('should allow createConfirmation to produce scoped helpers', async () => {
        const {
            ConfirmationProvider: ScopedProvider,
            promptConfirmation: scopedPrompt,
        } = createConfirmation(undefined, TestComponent);

        render(<ScopedProvider />);

        const confirmationPromise = scopedPrompt({ title: 'Scoped helper' });

        expect(await screen.findByText('Scoped helper')).not.toBeNull();
        const continueButton = await screen.findByText('Continue');

        act(() => {
            continueButton.click();
        });

        const result = await confirmationPromise;
        expect(result).toBe(true);
    });
});
