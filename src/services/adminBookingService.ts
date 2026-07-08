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
    booking_status: string;
    payment_proof_url: string | null;
    payment_method?: string | null;
    price: number | null;
    schedule_id?: string;
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
    booking_status: string;
    payment_proof_url: string | null;
    payment_method?: string | null;
    price: number | null;
    schedule_id?: string;
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
    kecamatan: "-",
    desa: "-",
    dusun: "-",
    rt_rw: "-",
    patokan: "-"
});

const parseAddressDetail = (data: any): AddressDetail => {
    if (!data) return fallbackAddress();
    
    let parsedData = data;
    if (typeof data === 'string') {
        try {
            parsedData = JSON.parse(data);
            if (typeof parsedData === 'string') {
                parsedData = JSON.parse(parsedData);
            }
        } catch (e) {
            return {
                ...fallbackAddress(),
                patokan: data
            };
        }
    }
    
    if (typeof parsedData === 'object' && parsedData !== null) {
        return {
            ...fallbackAddress(),
            ...parsedData
        };
    }
    
    return {
        ...fallbackAddress(),
        patokan: String(data)
    };
};

export const adminBookingService = {
    async getTravelBookings(token?: string): Promise<TravelBookingAdmin[]> {
        try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await apiFetch('/api/admin/master/travel-bookings', { method: 'GET', headers });
            if (!response?.data) return [];
            
            // Group by booking_code
            const grouped: { [code: string]: any[] } = {};
            response.data.forEach((item: any) => {
                const code = item.booking_code || item.id || 'N/A';
                if (!grouped[code]) {
                    grouped[code] = [];
                }
                grouped[code].push(item);
            });

            const result: TravelBookingAdmin[] = [];

            Object.keys(grouped).forEach((code) => {
                const items = grouped[code];
                const first = items[0];

                const totalPrice = items.reduce((sum, it) => sum + parseFloat(it.price || 0), 0);
                const seats = items.map(it => it.seat_number).sort((a, b) => a - b).join(', ');
                
                // Compile combined passenger details
                const passengerList = items.map(it => {
                    const name = it.passenger_name || 'Tanpa Nama';
                    const seat = it.seat_number || '-';
                    const luggage = it.baggage_weight ? `${it.baggage_weight}Kg (${it.baggage_dimension})${it.is_baggage_charge ? ' [+Charge]' : ''}` : '-';
                    return `${name} (Kursi ${seat}, Bagasi: ${luggage})`;
                }).join('\n');

                result.push({
                    id: first.id || 'N/A',
                    booking_code: code !== 'N/A' && code.startsWith('TRV') ? code : undefined,
                    user: {
                        name: first.customer_name || 'Tanpa Nama',
                        phone: first.customer_phone || '-',
                        address_detail: parseAddressDetail(first.address_detail),
                        destination_detail: parseAddressDetail(first.destination_detail),
                        seat_number: seats,
                        luggage: passengerList,
                    },
                    origin: first.origin || 'N/A',
                    destination: first.destination || 'N/A',
                    date: first.departure_date || first.created_at || new Date().toISOString(),
                    time: first.departure_time || '-',
                    status: first.booking_status || 'PENDING',
                    booking_status: first.booking_status,
                    payment_proof_url: first.payment_proof_url || null,
                    payment_method: first.payment_method || null,
                    price: totalPrice,
                    schedule_id: first.schedule_id || null,
                    is_group: items.length > 1
                } as any);
            });

            return result;
        } catch (error) {
            console.error("Gagal mengambil data pemesanan travel:", error);
            return [];
        }
    },

    async getCharterBookings(token?: string): Promise<CharterBookingAdmin[]> {
        try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await apiFetch('/api/charter/history', { method: 'GET', headers });
            if (!response?.data) return [];

            return response.data.map((item: any) => ({
                id: item.id || 'N/A',
                user: {
                    name: item.customer_name || 'Tanpa Nama',
                    phone: item.customer_phone || '-',
                    address_detail: parseAddressDetail(item.pickup_address),
                    destination_detail: parseAddressDetail(item.destination),
                    departure_date: item.start_date || '-',
                    return_date: item.end_date || '-'
                },
                origin: item.origin || 'N/A',
                destination: item.destination || 'N/A',
                date: item.created_at || new Date().toISOString(),
                fleet: item.car_type || 'Armada Belum Dipilih',
                status: item.status || 'PENDING',
                booking_status: item.status || 'PENDING',
                payment_proof_url: item.payment_proof_url || null,
                payment_method: item.payment_method || null,
                price: item.offered_price || null,
                schedule_id: null
            }));
        } catch (error) {
            console.error("Gagal mengambil data sewa charter:", error);
            return [];
        }
    },

    async getPackageShipments(token?: string): Promise<PackageShipmentAdmin[]> {
        try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await apiFetch('/api/admin/master/package-shipments', { method: 'GET', headers });
            if (!response?.data) return [];

            return response.data.map((item: any) => ({
                id: item.id || item.waybill_number || 'N/A',
                sender: {
                    name: item.sender_name || 'Tanpa Nama',
                    phone: item.sender_phone || '-',
                    address_detail: parseAddressDetail(item.sender_address_detail)
                },
                receiver: {
                    name: item.receiver_name || 'Tanpa Nama',
                    phone: item.receiver_phone || '-',
                    address_detail: parseAddressDetail(item.receiver_address_detail)
                },
                origin: item.origin || 'N/A',
                destination: item.destination || 'N/A',
                weight: item.weight ? `${item.weight} Kg` : '-',
                type: item.dimension || 'Reguler',
                status: item.status || 'PENDING',
                transaction_status: item.transaction_status || null,
                payment_method: item.payment_method || null,
                payment_proof_url: item.payment_proof_url || null,
                is_super_besar: item.dimension === 'besar', // Asumsi mapping
                price: item.price || null
            }));
        } catch (error) {
            console.error("Gagal mengambil data paket:", error);
            return [];
        }
    },

    async getMasterFleets(token?: string): Promise<any[]> {
        try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await apiFetch('/api/admin/master/fleets', { method: 'GET', headers });
            return response?.data || [];
        } catch (error) {
            console.error("Gagal mengambil data fleets:", error);
            return [];
        }
    },

    async getMasterDrivers(token?: string): Promise<any[]> {
        try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await apiFetch('/api/admin/master/users', { method: 'GET', headers });
            if (!response?.data) return [];
            // Filter hanya user yang memiliki role 'driver'
            return response.data.filter((u: any) => u.role === 'driver');
        } catch (error) {
            console.error("Gagal mengambil data drivers:", error);
            return [];
        }
    },

    async getAssignments(phase: string = 'pending', token?: string): Promise<any[]> {
        try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await apiFetch(`/api/admin/assignments?phase=${phase}`, { method: 'GET', headers });
            return response?.data || [];
        } catch (error) {
            console.error("Gagal mengambil data assignments:", error);
            return [];
        }
    }
};
