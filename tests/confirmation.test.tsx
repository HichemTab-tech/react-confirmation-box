import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmationProvider, promptConfirmation } from '../src';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../src/components/ui/alert-dialog';

const TestComponent = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
    <AlertDialog defaultOpen>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

describe('ConfirmationProvider and promptConfirmation', () => {
    it('should show confirmation dialog and resolve with true when confirmed', async () => {
        render(<ConfirmationProvider Component={TestComponent} />);

        const confirmationPromise = promptConfirmation();

        const continueButton = await screen.findByText('Continue');
        expect(continueButton).toBeInTheDocument();

        fireEvent.click(continueButton);

        const result = await confirmationPromise;
        expect(result).toBe(true);
    });

    it('should show confirmation dialog and resolve with false when canceled', async () => {
        render(<ConfirmationProvider Component={TestComponent} />);

        const confirmationPromise = promptConfirmation();

        const cancelButton = await screen.findByText('Cancel');
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);

        const result = await confirmationPromise;
        expect(result).toBe(false);
    });

    it('should render the dialog with custom props', async () => {
        render(<ConfirmationProvider Component={TestComponent} />);

        void promptConfirmation({
            title: 'Custom Title',
            description: 'Custom Description',
        });

        expect(await screen.findByText('Custom Title')).toBeInTheDocument();
        expect(await screen.findByText('Custom Description')).toBeInTheDocument();
    });
});
