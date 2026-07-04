/**
 * Auth Guard - Utility to check user authentication and roles on the client side.
 */

export const authGuard = {
    isLoggedIn(): boolean {
        return !!localStorage.getItem('jwt_token') || localStorage.getItem('is_logged_in') === 'true';
    },

    getUser() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    },

    getRole(): string {
        const user = this.getUser();
        return user?.role?.toLowerCase() || 'guest';
    },

    requireAuth(redirectUrl: string = '/auth/login') {
        if (!this.isLoggedIn()) {
            if (typeof window !== 'undefined' && (window as any).showFeedbackModal) {
                (window as any).showFeedbackModal('warning', 'Akses Ditolak', 'Silakan login terlebih dahulu untuk mengakses fitur ini.', redirectUrl);
            } else {
                alert('Silakan login terlebih dahulu untuk mengakses fitur ini.');
                window.location.href = redirectUrl;
            }
            return false;
        }
        return true;
    },

    checkPermission(allowedRoles: string[]) {
        if (!this.requireAuth()) return false;

        const role = this.getRole();
        if (!allowedRoles.includes(role)) {
            if (typeof window !== 'undefined' && (window as any).showFeedbackModal) {
                (window as any).showFeedbackModal('error', 'Akses Terlarang', 'Anda tidak memiliki akses ke halaman ini.', '/');
            } else {
                alert('Anda tidak memiliki akses ke halaman ini.');
                window.location.href = '/';
            }
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
