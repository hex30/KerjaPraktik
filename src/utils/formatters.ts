export const formatRupiah = (angka: number | string): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(angka) || 0);
};

export const formatAddress = (addressData: any): { label: string, value: string }[] => {
    if (!addressData) return [{ label: 'Detail', value: 'Sesuai Titik Tujuan/Penjemputan' }];
    
    let addr = addressData;
    if (typeof addressData === 'string') {
        try {
            addr = JSON.parse(addressData);
            if (typeof addr === 'string') addr = JSON.parse(addr);
        } catch (e) {
            return [{ label: 'Alamat Lengkap', value: addressData }];
        }
    }
    
    if (typeof addr === 'object' && addr !== null) {
        let parts = [];
        if (addr.dusun) parts.push({ label: 'Dusun', value: addr.dusun });
        if (addr.desa) parts.push({ label: 'Desa', value: addr.desa });
        if (addr.kecamatan) parts.push({ label: 'Kecamatan', value: addr.kecamatan });
        if (addr.rt_rw) parts.push({ label: 'RT/RW', value: addr.rt_rw });
        if (addr.patokan) parts.push({ label: 'Patokan', value: addr.patokan });
        
        return parts.length > 0 ? parts : [{ label: 'Alamat Lengkap', value: typeof addressData === 'string' ? addressData : JSON.stringify(addressData) }];
    }

    return [{ label: 'Alamat Lengkap', value: String(addressData) }];
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
};

export const formatRupiahInput = (angka: string): string => {
    let number_string = angka.replace(/[^,\d]/g, '').toString();
    let split = number_string.split(',');
    let sisa = split[0].length % 3;
    let rupiah = split[0].substring(0, sisa);
    let ribuan = split[0].substring(sisa).match(/\d{3}/gi);
    if(ribuan){
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    return rupiah ? (split[1] != undefined ? rupiah + ',' + split[1] : rupiah) : '';
};
