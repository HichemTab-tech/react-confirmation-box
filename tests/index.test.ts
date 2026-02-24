import { describe, it, expect } from 'vitest';
import * as ReactConfirmationBox from '../src';

describe('package exports', () => {
    it('should expose promptConfirmation', () => {
        expect(typeof ReactConfirmationBox.promptConfirmation).toBe('function');
    });

    it('should expose createConfirmation helper', () => {
        expect(typeof ReactConfirmationBox.createConfirmation).toBe('function');
    });
});