import { authGuard } from "@utils/authGuard";
import { packageService } from "@services/packageService";
import { travelService } from "@services/travelService";

export const setupPackageListener = async () => {
    // Cek armada global
    let isFleetAvailable = true;
    try {
        const fleetCheck =
            await travelService.checkFleetsAvailability();
        if (
            fleetCheck &&
            fleetCheck.data &&
            fleetCheck.data.available === false
        ) {
            isFleetAvailable = false;
            if (
                typeof (window as any).showGlobalFleetAlert ===
                "function"
            ) {
                (window as any).showGlobalFleetAlert();
            }
        }
    } catch (err) {
        console.error("Gagal mengecek armada:", err);
    }

    const form = document.getElementById(
        "form-package-detail",
    ) as HTMLFormElement;
    const dimensionSelect = document.getElementById(
        "dimensi_paket",
    ) as HTMLSelectElement;
    const weightInput = document.getElementById(
        "berat_paket",
    ) as HTMLInputElement;

    if (!form) return;

    const dateInput = document.getElementById(
        "departure_date",
    ) as HTMLInputElement;
    if (dateInput) {
        const now = new Date();
        if (now.getHours() >= 14) {
            now.setDate(now.getDate() + 1);
        }
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const minDate = `${year}-${month}-${day}`;
        dateInput.min = minDate;
        if (!dateInput.value || dateInput.value < minDate) {
            dateInput.value = minDate;
        }

        // VALIDASI KETERSEDIAAN SAAT TANGGAL DIPILIH
        dateInput.addEventListener("change", async (e) => {
            const target = e.target as HTMLInputElement;
            if (!target.value) return;

            try {
                const check = await packageService.checkAvailability(
                    target.value,
                );
                if (check && check.available === false) {
                    if (typeof window !== 'undefined' && (window as any).showFeedbackModal) {
                        (window as any).showFeedbackModal("warning", "Tanggal Penuh", "Mohon maaf, armada pada tanggal ini sudah disewa sepenuhnya. Silakan pilih tanggal lain.");
                    } else {
                        alert(
                            "Mohon maaf, armada pada tanggal ini sudah disewa sepenuhnya. Silakan pilih tanggal lain.",
                        );
                    }
                    target.value = ""; // Kosongkan kembali
                }
            } catch (error) {
                console.error(
                    "Gagal mengecek ketersediaan tanggal:",
                    error,
                );
            }
        });
    }

    // UX: Guest Overlay Setup
    const guestOverlay = document.getElementById(
        "guest-overlay-package",
    );
    const guestAlertCard = document.getElementById(
        "guest-alert-card-package",
    );
    const restrictedContent = document.getElementById(
        "restricted-content-package",
    );

    const luggageAlertCard = document.getElementById(
        "luggage-alert-card-package",
    );

    const checkLuggageAlert = () => {
        if (!weightInput || !dimensionSelect || !luggageAlertCard)
            return;
        const weight = parseInt(weightInput.value) || 0;
        const dimension = dimensionSelect.value;

        if (weight >= 60 || dimension === "super_besar") {
            luggageAlertCard.classList.remove("hidden");
        } else {
            luggageAlertCard.classList.add("hidden");
        }
    };

    if (weightInput && dimensionSelect) {
        weightInput.addEventListener("input", checkLuggageAlert);
        dimensionSelect.addEventListener("change", checkLuggageAlert);
    }

    if (
        guestAlertCard &&
        guestAlertCard.parentElement !== document.body
    ) {
        document.body.appendChild(guestAlertCard);
    }

    const setupGuestOverlay = () => {
        if (authGuard.isLoggedIn() && isFleetAvailable) {
            guestOverlay?.classList.add("hidden");
            guestAlertCard?.classList.add("hidden");
            restrictedContent?.classList.remove("pointer-events-none");
        } else {
            guestOverlay?.classList.remove("hidden");
            restrictedContent?.classList.add("pointer-events-none");

            if (!authGuard.isLoggedIn()) {
                if (guestAlertCard) {
                    guestAlertCard.classList.remove("hidden");
                    guestAlertCard.classList.add("flex");
                    void guestAlertCard.offsetWidth;
                    guestAlertCard.classList.remove("opacity-0");
                    const inner = document.getElementById(
                        "guest-alert-card-inner-package",
                    );
                    inner?.classList.remove("scale-95");
                }
            } else {
                guestAlertCard?.classList.add("hidden");
                guestAlertCard?.classList.remove("flex");
            }
        }
    };
    setupGuestOverlay();

    if (guestOverlay) {
        guestOverlay.addEventListener("click", () => {
            if (!authGuard.isLoggedIn()) {
                if (guestAlertCard) {
                    guestAlertCard.classList.remove("hidden");
                    guestAlertCard.classList.add("flex");
                    void guestAlertCard.offsetWidth;
                    guestAlertCard.classList.remove("opacity-0");
                    const inner = document.getElementById(
                        "guest-alert-card-inner-package",
                    );
                    inner?.classList.remove("scale-95");
                }
            } else if (!isFleetAvailable) {
                if (
                    typeof (window as any).showGlobalFleetAlert ===
                    "function"
                ) {
                    (window as any).showGlobalFleetAlert();
                }
            }
        });
    }

    if (guestAlertCard) {
        guestAlertCard.addEventListener("click", (e) => {
            if (e.target === guestAlertCard) {
                guestAlertCard.classList.add("opacity-0");
                const inner = document.getElementById(
                    "guest-alert-card-inner-package",
                );
                inner?.classList.add("scale-95");
                setTimeout(() => {
                    guestAlertCard.classList.remove("flex");
                    guestAlertCard.classList.add("hidden");
                }, 300);
            }
        });
    }

    // Guest Interceptor (fallback)
    const checkGuest = (e: Event) => {
        if (!authGuard.isLoggedIn()) {
            e.preventDefault();
            e.stopPropagation();
            if (guestAlertCard) {
                guestAlertCard.classList.remove("hidden");
                guestAlertCard.classList.add("flex");
                void guestAlertCard.offsetWidth;
                guestAlertCard.classList.remove("opacity-0");
                const inner = document.getElementById(
                    "guest-alert-card-inner-package",
                );
                inner?.classList.remove("scale-95");
            }
            return true;
        }
        if (!isFleetAvailable) {
            e.preventDefault();
            e.stopPropagation();
            if (
                typeof (window as any).showGlobalFleetAlert ===
                "function"
            ) {
                (window as any).showGlobalFleetAlert();
            }
            return true;
        }
        return false;
    };

    const checkDoubleCharge = () => {
        const isLarge =
            dimensionSelect.value === "besar" ||
            dimensionSelect.value === "super_besar";
        const isHeavy = parseInt(weightInput.value) > 60;

        let notice = document.getElementById("double-charge-notice");

        if (isLarge || isHeavy) {
            if (!notice) {
                notice = document.createElement("div");
                notice.id = "double-charge-notice";
                notice.className =
                    "mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 animate-fade-in";
                notice.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                    <p class="text-sm font-bold text-amber-900">Double Charge Notice</p>
                    <p class="text-xs text-amber-700 mt-1 leading-relaxed">
                        Paket dengan dimensi besar atau berat di atas 60kg akan dikenakan biaya tambahan setara 1 kursi penumpang.
                    </p>
                </div>
            `;
                const submitContainer = form.querySelector(".pt-2");
                if (submitContainer && submitContainer.parentNode) {
                    submitContainer.parentNode.insertBefore(
                        notice,
                        submitContainer,
                    );
                } else {
                    form.appendChild(notice);
                }
            }
        } else if (notice) {
            notice.remove();
        }
    };

    dimensionSelect?.addEventListener("change", (e) => {
        if (checkGuest(e)) {
            dimensionSelect.value = "";
            return;
        }
        checkDoubleCharge();
    });

    weightInput?.addEventListener("input", (e) => {
        if (checkGuest(e)) {
            weightInput.value = "";
            return;
        }
        checkDoubleCharge();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Cek armada global saat submit (fallback)
        try {
            const fleetCheck =
                await travelService.checkFleetsAvailability();
            if (
                fleetCheck &&
                fleetCheck.data &&
                fleetCheck.data.available === false
            ) {
                if (
                    typeof (window as any).showGlobalFleetAlert ===
                    "function"
                ) {
                    (window as any).showGlobalFleetAlert();
                }
                return; // Berhenti
            }
        } catch (err) {
            console.error("Gagal mengecek armada:", err);
        }

        if (checkGuest(e)) return;

        const submitBtn = form.querySelector(
            'button[type="submit"]',
        ) as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Memproses Pengiriman...";
        }

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const isDouble =
                dimensionSelect.value === "besar" ||
                dimensionSelect.value === "super_besar" ||
                parseInt(weightInput.value) >= 60;

            const payload = {
                receiver_kecamatan: data.sub_district_penerima || "-",
                sender_name: data.nama_pengirim as string,
                sender_phone: data.telp_pengirim as string,
                pickup_address: JSON.stringify({
                    kecamatan: data.sub_district_pengirim || "-",
                    desa: data.village_pengirim || "-",
                    dusun: data.pengirim_hamlet || "-",
                    rt_rw: `${data.pengirim_rt || "-"}/${data.pengirim_rw || "-"}`,
                    patokan: data.landmark_pengirim || "-",
                }),
                receiver_name: data.nama_penerima as string,
                receiver_phone: data.telp_penerima as string,
                receiver_address: JSON.stringify({
                    kecamatan: data.sub_district_penerima || "-",
                    desa: data.village_penerima || "-",
                    dusun: data.penerima_hamlet || "-",
                    rt_rw: `${data.penerima_rt || "-"}/${data.penerima_rw || "-"}`,
                    patokan: data.landmark_penerima || "-",
                }),
                package_description: data.deskripsi_paket as string,
                weight: Number(data.berat_paket),
                dimension: data.dimensi_paket as
                    | "kecil"
                    | "sedang"
                    | "besar"
                    | "super_besar",
                seat_qty: isDouble ? 2 : 1,
                departure_date: data.departure_date as string,
            };

            // dokumentasi: Mengirim payload pengiriman paket ke API Backend
            await packageService.createPackageShipment(payload);

            (window as any).showFeedbackModal(
                "success",
                "Pesanan Paket Berhasil",
                `Pesanan paket berhasil dicatat. ${isDouble ? "Biaya tambahan (2 kursi) berlaku." : ""}`,
                "/user/booking-history",
            );
        } catch (error: any) {
            console.error("Submit Package Error:", error);
            (window as any).showFeedbackModal(
                "error",
                "Pesanan Gagal",
                error.message ||
                    "Gagal mengirim pesanan paket. Server sedang gangguan.",
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Pesan Pengiriman Sekarang";
            }
        }
    });
};

