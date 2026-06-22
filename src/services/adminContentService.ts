import { apiFetch } from './api';

// --- INTERFACES ---
export interface Promo {
    id?: string | number;
    discount: string;
    tagline: string;
    isActive: boolean;
}

export interface Destination {
    id?: string | number;
    name: string;
    location: string;
    description: string;
    image_url: string;
    price: string | number;
    is_active?: boolean;
}

export interface Fleet {
    id?: string | number;
    plate_number: string;
    car_type: string;
    seat_capacity: number;
    description: string;
    image_url: string;
    status: string;
}

export interface UserAdmin {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: string;
}

// Helper to handle tokens safely on client/server
const getAuthHeaders = (): Record<string, string> => {
    // Pada saat build SSR Astro, localStorage tidak ada.
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) return { 'Authorization': `Bearer ${token}` };
    }
    return {};
};

// --- SERVICE LAYER ---
export const adminContentService = {
    // ==========================================
    // PROMOTIONS (BANNER)
    // ==========================================
    async getPromotions(): Promise<Promo[]> {
        try {
            // Menggunakan endpoint publik agar bisa dipakai di landing page juga
            const response = await apiFetch('/api/content/promotions', { method: 'GET' });
            return response?.data || [];
        } catch (error) {
            console.error("Gagal mengambil data promo:", error);
            return [];
        }
    },

    async savePromotion(data: FormData | Record<string, any>): Promise<any> {
        try {
            const isFormData = data instanceof FormData;
            const headers = getAuthHeaders();

            // Jika multipart/form-data, browser akan set Content-Type otomatis (hapus Content-Type bawaan apiFetch)
            const options: RequestInit = {
                method: 'POST', // Asumsi selalu POST untuk replace active promo
                headers: isFormData ? headers : { ...headers, 'Content-Type': 'application/json' },
                body: isFormData ? data : JSON.stringify(data)
            };

            // Menghapus Content-Type agar browser bisa set boundary multipart jika pakai FormData
            if (isFormData) {
                // @ts-ignore
                delete options.headers['Content-Type'];
            }

            return await apiFetch('/api/admin/cms/promotions', options);
        } catch (error) {
            console.error("Gagal menyimpan promo:", error);
            throw error;
        }
    },

    async deletePromotion(id: string | number): Promise<any> {
        try {
            return await apiFetch(`/api/admin/cms/promotions/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Gagal menghapus promo:", error);
            throw error;
        }
    },

    // ==========================================
    // DESTINATIONS
    // ==========================================
    async getDestinations(): Promise<Destination[]> {
        try {
            const response = await apiFetch('/api/content/destinations', { method: 'GET' });
            return response?.data || [];
        } catch (error) {
            console.error("Gagal mengambil data destinasi:", error);
            return [];
        }
    },

    async saveDestination(data: FormData): Promise<any> {
        try {
            const headers = getAuthHeaders();
            const id = data.get('id');
            const method = id ? 'PUT' : 'POST';
            const endpoint = id ? `/api/admin/cms/destinations/${id}` : '/api/admin/cms/destinations';

            const options: RequestInit = {
                method,
                headers, // multipart/form-data boundary diatur otomatis browser
                body: data
            };

            return await apiFetch(endpoint, options);
        } catch (error) {
            console.error("Gagal menyimpan destinasi:", error);
            throw error;
        }
    },

    async deleteDestination(id: string | number): Promise<any> {
        try {
            return await apiFetch(`/api/admin/cms/destinations/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Gagal menghapus destinasi:", error);
            throw error;
        }
    },

    // ==========================================
    // FLEETS (ARMADA)
    // ==========================================
    async getFleetsAdmin(): Promise<Fleet[]> {
        try {
            // Admin menarik semua armada
            const response = await apiFetch('/api/admin/cms/fleets', {
                method: 'GET',
                headers: getAuthHeaders()
            });
            return response?.data || [];
        } catch (error) {
            console.error("Gagal mengambil armada admin:", error);
            return [];
        }
    },

    async getFleetsPublic(): Promise<Fleet[]> {
        try {
            // User landing page menarik dari public endpoint
            const response = await apiFetch('/api/content/fleets', { method: 'GET' });
            return response?.data || [];
        } catch (error) {
            console.error("Endpoint content/fleets gagal (Fallback Array Kosong):", error);
            return [];
        }
    },

    async saveFleet(data: FormData): Promise<any> {
        try {
            const headers = getAuthHeaders();
            const id = data.get('id');
            const method = id ? 'PUT' : 'POST';
            const endpoint = id ? `/api/admin/cms/fleets/${id}` : '/api/admin/cms/fleets';

            const options: RequestInit = {
                method,
                headers,
                body: data
            };

            return await apiFetch(endpoint, options);
        } catch (error) {
            console.error("Gagal menyimpan armada:", error);
            throw error;
        }
    },

    async deleteFleet(id: string | number): Promise<any> {
        try {
            return await apiFetch(`/api/admin/cms/fleets/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Gagal menghapus armada:", error);
            throw error;
        }
    },

    // ==========================================
    // USERS (PENGGUNA & DRIVER)
    // ==========================================
    async getUsersAdmin(): Promise<UserAdmin[]> {
        try {
            const response = await apiFetch('/api/admin/master/users', {
                method: 'GET',
                headers: getAuthHeaders()
            });
            return response?.data || [];
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
            return [];
        }
    },

    async updateUserRole(id: string, role: string, password?: string): Promise<any> {
        try {
            const body: any = { role };
            if (password) body.password = password;
            return await apiFetch(`/api/admin/master/users/${id}`, {
                method: 'PUT',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } catch (error) {
            console.error("Gagal update user:", error);
            throw error;
        }
    }
};
