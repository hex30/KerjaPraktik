import { apiFetch } from './api';

// --- INTERFACES ---
export interface Promo {
    id?: string | number;
    discount: string;
    tagline: string;
    isActive: boolean;
}

export interface Banner {
    id?: string | number;
    title: string;
    image_url: string;
    badge_text: string;
    description: string;
    is_active?: boolean;
}

export interface Destination {
    id?: string | number;
    name: string;
    title?: string;
    location: string;
    description: string;
    image_url: string;
    image?: string;
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
    price?: string | number;
}

export interface UserAdmin {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: string;
}

// Helper to handle tokens safely on client/server
const getAuthHeaders = (tokenParam?: string): Record<string, string> => {
    // Gunakan token dari parameter jika ada (biasanya dari cookie saat SSR)
    if (tokenParam) return { 'Authorization': `Bearer ${tokenParam}` };

    // Pada saat build SSR Astro, localStorage tidak ada.
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
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

            const id = isFormData ? data.get('id') : data.id;
            const method = id ? 'PUT' : 'POST';
            const endpoint = id ? `/api/admin/cms/promotions/${id}` : '/api/admin/cms/promotions';

            let cleanData: any;
            if (isFormData) {
                data.delete('id');

                const imageFile = data.get('image');
                if (imageFile instanceof File && imageFile.size === 0) {
                    data.delete('image');
                } else if (typeof imageFile === 'string' && !imageFile) {
                    data.delete('image');
                }
                cleanData = data;
            } else {
                cleanData = JSON.stringify(data);
            }

            const options: RequestInit = {
                method,
                headers: isFormData ? headers : { ...headers, 'Content-Type': 'application/json' },
                body: cleanData
            };

            // Menghapus Content-Type agar browser bisa set boundary multipart jika pakai FormData
            if (isFormData) {
                // @ts-ignore
                delete options.headers['Content-Type'];
            }

            return await apiFetch(endpoint, options);
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
    // BANNERS
    // ==========================================
    async getBanners(token?: string): Promise<Banner[]> {
        try {
            const response = await apiFetch('/api/admin/cms/banners', { 
                method: 'GET',
                headers: getAuthHeaders(token)
            });
            return response?.data || [];
        } catch (error) {
            console.error("Gagal mengambil data banner:", error);
            return [];
        }
    },

    async saveBanner(data: FormData): Promise<any> {
        try {
            const headers = getAuthHeaders();
            const id = data.get('id');
            const method = id ? 'PUT' : 'POST';
            const endpoint = id ? `/api/admin/cms/banners/${id}` : '/api/admin/cms/banners';

            data.delete('id');

            const imageFile = data.get('image');
            if (imageFile instanceof File && imageFile.size === 0) {
                data.delete('image');
            } else if (typeof imageFile === 'string' && !imageFile) {
                data.delete('image');
            }

            const options: RequestInit = {
                method,
                headers,
                body: data
            };

            // @ts-ignore
            delete options.headers['Content-Type'];

            return await apiFetch(endpoint, options);
        } catch (error) {
            console.error("Gagal menyimpan banner:", error);
            throw error;
        }
    },

    async deleteBanner(id: string | number): Promise<any> {
        try {
            return await apiFetch(`/api/admin/cms/banners/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Gagal menghapus banner:", error);
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

            data.delete('id'); // Hapus ID dari body payload

            // Hapus payload gambar kosong agar multer Backend tidak melempar error "File tidak didukung"
            const imageFile = data.get('image');
            if (imageFile instanceof File && imageFile.size === 0) {
                data.delete('image');
            } else if (typeof imageFile === 'string' && !imageFile) {
                data.delete('image');
            }

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
    async getFleetsAdmin(token?: string): Promise<Fleet[]> {
        try {
            // Admin menarik semua armada
            const response = await apiFetch('/api/admin/cms/fleets', {
                method: 'GET',
                headers: getAuthHeaders(token)
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

            data.delete('id'); // Hapus ID dari body payload

            // Hapus payload gambar kosong agar multer Backend tidak melempar error "File tidak didukung"
            const imageFile = data.get('image');
            if (imageFile instanceof File && imageFile.size === 0) {
                data.delete('image');
            } else if (typeof imageFile === 'string' && !imageFile) {
                data.delete('image');
            }

            const options: RequestInit = {
                method,
                headers,
                body: data
            };

            // Menghapus Content-Type agar browser bisa set boundary multipart
            // @ts-ignore
            delete options.headers['Content-Type'];

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
    async getUsersAdmin(token?: string): Promise<UserAdmin[]> {
        try {
            const response = await apiFetch('/api/admin/master/users', {
                method: 'GET',
                headers: getAuthHeaders(token)
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
    },

    async deleteUser(id: string): Promise<any> {
        try {
            return await apiFetch(`/api/admin/master/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Gagal menghapus user:", error);
            throw error;
        }
    }
};
