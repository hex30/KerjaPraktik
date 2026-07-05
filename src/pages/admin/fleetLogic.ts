import { adminContentService } from "@services/adminContentService";

export const setupFleetLogic = () => {
    const editButtons = document.querySelectorAll('.edit-fleet-btn');
    const deleteButtons = document.querySelectorAll('.delete-fleet-btn');
    const toggleButton = document.getElementById('toggle-fleets-btn');
    const extraFleetCards = document.querySelectorAll('.extra-fleet');
    
    const form = document.getElementById('fleet-form') as HTMLFormElement;
    const formTitle = document.getElementById('form-title');
    const formDesc = document.getElementById('form-desc');
    const resetBtn = document.getElementById('reset-form-btn');
    const submitBtn = document.getElementById('submit-fleet-btn');
    const section = document.getElementById('fleet-form-section');

    // Inputs
    const inputId = document.getElementById('fleet_id') as HTMLInputElement;
    const selectCarType = document.getElementById('fleet_car_type') as HTMLSelectElement;
    const inputPlateNumber = document.getElementById('fleet_plate_number') as HTMLInputElement;
    const inputSeatCapacity = document.getElementById('fleet_seat_capacity') as HTMLInputElement;
    const inputDescription = document.getElementById('fleet_description') as HTMLTextAreaElement;
    const selectStatus = document.getElementById('fleet_status') as HTMLSelectElement;
    const inputPrice = document.getElementById('fleet_price') as HTMLInputElement;
    const inputPriceDisplay = document.getElementById('fleet_price_display') as HTMLInputElement;

    // Toggle Grid Logic
    let isExpanded = false;
    if(toggleButton) {
        const toggleText = document.getElementById('toggle-text');
        const toggleIcon = toggleButton.querySelector('svg');

        toggleButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            extraFleetCards.forEach(fleet => {
                if (isExpanded) {
                    fleet.classList.remove('hidden');
                    fleet.classList.add('animate-fade-in');
                } else {
                    fleet.classList.add('hidden');
                    fleet.classList.remove('animate-fade-in');
                }
            });
            
            if(toggleText && toggleIcon) {
                if (isExpanded) {
                    toggleText.textContent = "Sembunyikan Armada";
                    toggleIcon.classList.add('rotate-180');
                } else {
                    toggleText.textContent = "Tampilkan Sisa Armada";
                    toggleIcon.classList.remove('rotate-180');
                }
            }
        });
    }

    // Submit Logic (Create / Update)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            try {
                if (submitBtn) {
                    submitBtn.textContent = "Menyimpan...";
                    submitBtn.setAttribute('disabled', 'true');
                }
                
                await adminContentService.saveFleet(formData);
                (window as any).showFeedbackModal('success', 'Berhasil', 'Data armada berhasil disimpan!', window.location.href);
            } catch (error: any) {
                (window as any).showFeedbackModal('error', 'Gagal', error.message || "Gagal menyimpan armada");
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = "Simpan Data Armada";
                    submitBtn.removeAttribute('disabled');
                }
            }
        });
    }

    // Delete Logic
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const card = btn.closest('.fleet-card') as HTMLElement;
            if(!card) return;
            
            const { id, plate_number } = card.dataset;
            const confirmed = await (window as any).showConfirmModal('Konfirmasi Hapus', `Apakah Anda yakin ingin menghapus armada Plat ${plate_number} secara permanen?`, 'danger');
            if (id && confirmed) {
                try {
                    await adminContentService.deleteFleet(id);
                    (window as any).showFeedbackModal('success', 'Berhasil', 'Armada berhasil dihapus!', window.location.href);
                } catch (err: any) {
                    (window as any).showFeedbackModal('error', 'Gagal', err.message || "Gagal menghapus armada");
                }
            }
        });
    });

    // Edit Logic
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.fleet-card') as HTMLElement;
            if (!card) return;

            const { id, plate_number, car_type, seat_capacity, description, status, price } = card.dataset;

            // Populate Form
            if (inputId) inputId.value = id || '';
            if (inputPlateNumber) inputPlateNumber.value = plate_number || '';
            if (selectCarType) selectCarType.value = car_type || '';
            if (inputSeatCapacity) inputSeatCapacity.value = seat_capacity || '';
            if (inputDescription) inputDescription.value = description || '';
            if (inputPrice) inputPrice.value = price ? Math.round(Number(price)).toString() : '';
            if (inputPriceDisplay && price) {
                const numPrice = Math.round(Number(price));
                // Format explicitly during load for correct display
                let number_string = numPrice.toString();
                let sisa = number_string.length % 3;
                let rupiah = number_string.substring(0, sisa);
                let ribuan = number_string.substring(sisa).match(/\d{3}/gi);
                if(ribuan){
                    let separator = sisa ? '.' : '';
                    rupiah += separator + ribuan.join('.');
                }
                inputPriceDisplay.value = rupiah;
            } else if (inputPriceDisplay) {
                inputPriceDisplay.value = '';
            }
            
            // Map status back to option values if they differ
            if (selectStatus) {
                const statusStr = status?.toLowerCase() || '';
                if (statusStr.includes('maint')) selectStatus.value = 'maintenance';
                else selectStatus.value = 'active';
            }

            // Change UI State
            if (formTitle) formTitle.textContent = "Edit Data Armada";
            if (formDesc) formDesc.textContent = `Anda sedang memperbarui data untuk armada Plat "${plate_number}". Klik simpan untuk menerapkan perubahan.`;
            
            // Highlight form section
            if (section) {
                section.classList.add('ring-4', 'ring-primary/20', 'ring-offset-0');
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Remove highlight after a few seconds
                setTimeout(() => {
                    section.classList.remove('ring-4', 'ring-primary/20', 'ring-offset-0');
                }, 2000);
            }
            
            // Update Reset button text
            const resetText = document.getElementById('reset-btn-text');
            if (resetText) resetText.textContent = "Batal Edit & Tambah Baru";
            if (resetBtn) resetBtn.classList.remove('hidden');
        });
    });

    resetBtn?.addEventListener('click', () => {
        if (inputId) inputId.value = '';
        if (inputPrice) inputPrice.value = '';
        if (formTitle) formTitle.textContent = "Tambah Armada Baru";
        if (formDesc) formDesc.textContent = "Lengkapi informasi unit kendaraan untuk ditampilkan pada sistem pemesanan pelanggan.";
        
        // Reset text button
        const resetText = document.getElementById('reset-btn-text');
        if (resetText) resetText.textContent = "Batal / Tambah Baru";
        
        // Sembunyikan tombol reset saat kembali ke mode Tambah Armada
        if (resetBtn) resetBtn.classList.add('hidden');
        
        // Reset text file name
        const uploadText = form.querySelector('.image-upload-text');
        if (uploadText) uploadText.textContent = "Pilih Gambar / Drag & Drop";
    });

    // UI/UX Update Image Name
    const imageInput = form.querySelector('.image-upload-input') as HTMLInputElement;
    const uploadText = form.querySelector('.image-upload-text');
    if (imageInput && uploadText) {
        imageInput.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                uploadText.textContent = target.files[0].name;
                uploadText.classList.add('text-primary');
            } else {
                uploadText.textContent = "Pilih Gambar / Drag & Drop";
                uploadText.classList.remove('text-primary');
            }
        });
    }
};
