/**
 * Auth Guard - Utility to check user authentication and roles on the client side.
 */

export const authGuard = {
    isLoggedIn(): boolean {
        return localStorage.getItem('is_logged_in') === 'true';
    },

    getUser() {
        const userData = localStorage.getItem('dummy_user_rini_trans');
        return userData ? JSON.parse(userData) : null;
    },

    getRole(): string {
        const user = this.getUser();
        return user?.role || 'GUEST';
    },

    requireAuth(redirectUrl: string = '/auth/login') {
        if (!this.isLoggedIn()) {
            alert('Silakan login terlebih dahulu untuk mengakses fitur ini.');
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    checkPermission(allowedRoles: string[]) {
        if (!this.requireAuth()) return false;
        
        const role = this.getRole();
        if (!allowedRoles.includes(role)) {
            alert('Anda tidak memiliki akses ke halaman ini.');
            window.location.href = '/';
            return false;
        }
        return true;
    }
};

// For event interception
export const interceptGuestAction = (e: Event) => {
    if (!authGuard.isLoggedIn()) {
        e.preventDefault();
        e.stopPropagation();
        authGuard.requireAuth();
        return true;
    }
    return false;
};
