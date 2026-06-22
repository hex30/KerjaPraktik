import { apiFetch } from './api';

export interface AddressDetail {
    kecamatan: string;
    desa: string;
    dusun: string;
    rt_rw: string;
    patokan: string;
}

export interface TravelBookingAdmin {
    id: string;
    user: {
        name: string;
        phone: string;
        address_detail: AddressDetail;
        destination_detail: AddressDetail;
        seat_number?: string;
        luggage?: string;
    };
    origin: string;
    destination: string;
    date: string;
    time?: string;
    status: string;
    price: number | null;
}

export interface CharterBookingAdmin {
    id: string;
    user: {
        name: string;
        phone: string;
        address_detail: AddressDetail;
        destination_detail: AddressDetail;
        departure_date: string;
        return_date: string;
    };
    origin: string;
    destination: string;
    date: string;
    fleet: string;
    status: string;
    price: number | null;
}

export interface PackageShipmentAdmin {
    id: string;
    sender: {
        name: string;
        phone: string;
        address_detail: AddressDetail;
    };
    receiver: {
        name: string;
        phone: string;
        address_detail: AddressDetail;
    };
    origin: string;
    destination: string;
    weight: string;
    type: string;
    status: string;
    is_super_besar: boolean;
    price: number | null;
}

// Fallback object to render cleanly if Backend sends flat strings instead of nested JSON.
// Menerapkan Standard Professional FE: Kita menuntut BE mengirimkan struktur yang benar.
const fallbackAddress = (): AddressDetail => ({
    kecamatan: "DATA BE BELUM SESUAI",
    desa: "-",
    dusun: "-",
    rt_rw: "-",
    patokan: "-"
});

export const adminBookingService = {
    async getTravelBookings(): Promise<TravelBookingAdmin[]> {
        try {
            const response = await apiFetch('/api/admin/master/travel-bookings', { method: 'GET' });
            if (!response?.data) return [];
            
            return response.data.map((item: any) => ({
                id: item.id || 'N/A',
                user: {
                    name: item.customer_name || 'Tanpa Nama',
                    phone: item.customer_phone || '-',
                    // Standard FE: Menuntut objek address_detail riil dari BE
                    address_detail: item.address_detail || fallbackAddress(),
                    destination_detail: item.destination_detail || fallbackAddress(),
                    seat_number: item.seat_number || '-',
                    luggage: item.luggage || '-'
                },
                origin: item.origin || 'N/A',
                destination: item.destination || 'N/A',
                date: item.departure_date || item.created_at || new Date().toISOString(),
                time: item.departure_time || '-',
                status: item.status || 'PENDING',
                price: item.total_price || null
            }));
        } catch (error) {
            console.error("Gagal mengambil data pemesanan travel:", error);
            return [];
        }
    },

    async getCharterBookings(): Promise<CharterBookingAdmin[]> {
        try {
            const response = await apiFetch('/api/charter/history', { method: 'GET' });
            if (!response?.data) return [];

            return response.data.map((item: any) => ({
                id: item.id || 'N/A',
                user: {
                    name: item.customer_name || 'Tanpa Nama',
                    phone: item.customer_phone || '-',
                    address_detail: item.address_detail || fallbackAddress(),
                    destination_detail: item.destination_detail || fallbackAddress(),
                    departure_date: item.start_date || '-',
                    return_date: item.end_date || '-'
                },
                origin: item.origin || 'N/A',
                destination: item.destination || 'N/A',
                date: item.created_at || new Date().toISOString(),
                fleet: item.car_type || 'Armada Belum Dipilih',
                status: item.status || 'PENDING',
                price: item.total_price || null
            }));
        } catch (error) {
            console.error("Gagal mengambil data sewa charter:", error);
            return [];
        }
    },

    async getPackageShipments(): Promise<PackageShipmentAdmin[]> {
        try {
            const response = await apiFetch('/api/admin/master/package-shipments', { method: 'GET' });
            if (!response?.data) return [];

            return response.data.map((item: any) => ({
                id: item.id || item.waybill_number || 'N/A',
                sender: {
                    name: item.sender_name || 'Tanpa Nama',
                    phone: item.sender_phone || '-',
                    address_detail: item.sender_address_detail || fallbackAddress()
                },
                receiver: {
                    name: item.receiver_name || 'Tanpa Nama',
                    phone: item.receiver_phone || '-',
                    address_detail: item.receiver_address_detail || fallbackAddress()
                },
                origin: item.origin || 'N/A',
                destination: item.destination || 'N/A',
                weight: item.weight ? `${item.weight} Kg` : '-',
                type: item.dimension || 'Reguler',
                status: item.status || 'PENDING',
                is_super_besar: item.dimension === 'besar', // Asumsi mapping
                price: item.total_price || null
            }));
        } catch (error) {
            console.error("Gagal mengambil data paket:", error);
            return [];
        }
    }
};
