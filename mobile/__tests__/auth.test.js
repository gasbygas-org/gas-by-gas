// __tests__/auth.test.js
import { login } from '../services/auth';

jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
}));

describe('Auth Service', () => {
    it('stores token on successful login', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: 'test-token' }),
        }));
        await login('test@example.com', 'password');
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'test-token');
    });
});
