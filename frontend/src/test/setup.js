import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock socket.io-client
vi.mock('socket.io-client', () => {
    return {
        default: vi.fn(() => ({
            on: vi.fn(),
            emit: vi.fn(),
            off: vi.fn(),
            disconnect: vi.fn(),
            connect: vi.fn(),
        })),
    };
});
