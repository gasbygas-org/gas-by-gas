// utils/auth.js
import { auth } from '../firebase.config';

export const logout = async () => {
    try {
        // Sign out from Firebase
        await auth.signOut();
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};
