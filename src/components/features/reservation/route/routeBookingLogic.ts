import { authGuard } from "@utils/authGuard";
import { travelService } from "@services/travelService";

let selectedScheduleId = ""; // (Deprecated, will be removed later)
let selectedRouteId = "";
let selectedRawDate = "";

const formatters = {
    currency: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }),
    day: new Intl.DateTimeFormat("id-ID", { weekday: "long" }),
    shortDay: new Intl.DateTimeFormat("id-ID", { weekday: "short" }),
    date: new Intl.DateTimeFormat("id-ID", { day: "2-digit" }),
    month: new Intl.DateTimeFormat("id-ID", { month: "short" }),
};

const generateDates = async (routeId: string) => {
    try {
        const response =
            await travelService.getSchedulesAvailability(routeId);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Gagal mengambil jadwal:", error);
        return [];
    }
};

const createScheduleCard = (schedule: any) => {
    const dateObj = new Date(schedule.departure_time);
    const isFull = schedule.available_seats <= 0;

    if (isFull) {
        return "";
    }

    return `
        <label class="relative cursor-pointer snap-start shrink-0 group">
            <input type="radio" name="pilihan_jadwal" data-raw-date="${schedule.raw_date}" value="${schedule.id}" class="peer sr-only" ${isFull ? "disabled" : ""}>
            <div class="flex flex-col items-center justify-center min-w-[120px] p-4 border-2 border-slate-200 rounded-2xl text-primary transition-all peer-checked:text-black peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary hover:-translate-y-1 ${isFull ? "opacity-50 cursor-not-allowed grayscale" : ""}">
                <span class="text-[12px] text-slate-500 font-secondary mb-1 uppercase tracking-wider font-bold">
                    ${formatters.day.format(dateObj)}
                </span>
                <span class="text-4xl font-black leading-none my-1">${formatters.date.format(dateObj)}</span>
                <span class="text-sm text-slate-500 font-secondary mt-1 font-bold">${formatters.month.format(dateObj)}</span>
                <span class="text-xs ${isFull ? "text-red-500" : "text-green-600"} font-bold mt-2 bg-white px-2 py-0.5 rounded-full border shadow-sm">
                    ${isFull ? "Penuh" : `Sisa ${schedule.sisa_kursi} Kursi`}
                </span>
            </div>
        </label>
    `;
};

export const setupTravelFlow = () => {
    const step1 = document.getElementById("travel-step-1");
    const step2 = document.getElementById("travel-step-2");
    const form1 = document.getElementById(
        "form-reservasi-travel",
    ) as HTMLFormElement;
    const form2 = document.getElementById(
        "form-data-diri-travel",
    ) as HTMLFormElement;
    const dateContainer = document.getElementById("date-container-travel");
    const hiddenDate = document.getElementById(
        "tanggal_hidden_travel",
    ) as HTMLInputElement;
    const ruteRadios = document.querySelectorAll('input[name="rute"]');
    const btnBack = document.getElementById("btn-kembali-travel");

    // UX: Guest Overlay Setup
    const guestOverlay = document.getElementById("guest-overlay-route");
    const guestAlertCard = document.getElementById(
        "guest-alert-card-route",
    );
    const restrictedContent = document.getElementById(
        "restricted-content-route",
    );

    // Pindahkan modal ke luar dari struktur DOM komponen agar 'fixed' benar-benar berada di window (terbebas dari parent CSS transform/filter)
    if (guestAlertCard && guestAlertCard.parentElement !== document.body) {
        document.body.appendChild(guestAlertCard);
    }

    const setupGuestOverlay = () => {
        if (authGuard.isLoggedIn()) {
            guestOverlay?.classList.add("hidden");
            guestAlertCard?.classList.add("hidden");
            restrictedContent?.classList.remove("pointer-events-none");
        } else {
            guestOverlay?.classList.remove("hidden");
            // Alert Card disembunyikan secara default
            guestAlertCard?.classList.add("hidden");
            guestAlertCard?.classList.remove("flex");
            restrictedContent?.classList.add("pointer-events-none");
        }
    };
    setupGuestOverlay();

    // Tampilkan modal alert hanya saat overlay diblur di-klik
    if (guestOverlay) {
        guestOverlay.addEventListener("click", () => {
            if (guestAlertCard) {
                guestAlertCard.classList.remove("hidden");
                guestAlertCard.classList.add("flex");
                // Trigger animasi
                void guestAlertCard.offsetWidth;
                guestAlertCard.classList.remove("opacity-0");
                const inner = document.getElementById(
                    "guest-alert-card-inner-route",
                );
                inner?.classList.remove("scale-95");
            }
        });
    }

    // Tutup modal jika klik di luar card (di area backdrop)
    if (guestAlertCard) {
        guestAlertCard.addEventListener("click", (e) => {
            if (e.target === guestAlertCard) {
                guestAlertCard.classList.add("opacity-0");
                const inner = document.getElementById(
                    "guest-alert-card-inner-route",
                );
                inner?.classList.add("scale-95");
                setTimeout(() => {
                    guestAlertCard.classList.remove("flex");
                    guestAlertCard.classList.add("hidden");
                }, 300);
            }
        });
    }

    if (!step1 || !step2 || !form1 || !form2) return;

    // Guest Interceptor on Form interaction
    const checkGuest = (e: Event) => {
        if (!authGuard.isLoggedIn()) {
            e.preventDefault();
            e.stopPropagation();
            authGuard.requireAuth();
            return true;
        }
        return false;
    };

    // Route Selection Logic
    ruteRadios.forEach((radio) => {
        radio.addEventListener("change", async (e) => {
            const target = e.target as HTMLInputElement;
            selectedRouteId = target.value;
            if (!dateContainer) return;

            dateContainer.innerHTML = `
                <div class="w-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-sm font-medium animate-pulse">
                    Mengecek ketersediaan armada...
                </div>
            `;

            // Cek armada global
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
                    target.checked = false;
                    dateContainer.innerHTML = `
                        <div class="w-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500 text-sm font-medium">
                            Silakan pilih rute untuk melihat ketersediaan armada.
                        </div>
                    `;
                    return;
                }
            } catch (err) {
                console.error("Gagal mengecek armada:", err);
            }

            dateContainer.innerHTML = `
                <div class="w-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-sm font-medium animate-pulse">
                    Mencari jadwal tersedia...
                </div>
            `;

            hiddenDate.value = "";
            selectedScheduleId = "";
            selectedRouteId = target.value;

            // Mendapatkan origin dari atribut data-origin radio button yang diklik
            const routeOrigin = target.getAttribute("data-origin") || "";

            // Route name format yang digunakan oleh generateDates: "panawangan_jakarta" atau "jakarta_panawangan"
            let routeNameValue = "";
            if (routeOrigin.toLowerCase().includes("panawangan")) {
                routeNameValue = "panawangan_jakarta";
            } else {
                routeNameValue = "jakarta_panawangan";
            }

            try {
                const baseSchedules = await generateDates(target.value);

                if (baseSchedules.length === 0) {
                    dateContainer.innerHTML = `
                        <div class="w-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500 text-sm font-medium">
                            Maaf, tidak ada jadwal aktif untuk rute ini.
                        </div>
                    `;
                    return;
                }

                // Mapping backend properties to template usage
                const formattedSchedules = baseSchedules.map((s: any) => ({
                    id: s.schedule_id || `NEW-${s.date}`,
                    raw_date: s.date,
                    departure_time: s.departure_time,
                    available_seats: s.sisa_kursi,
                    sisa_kursi: s.sisa_kursi,
                }));

                dateContainer.innerHTML = formattedSchedules
                    .map(createScheduleCard)
                    .join("");
            } catch (error) {
                dateContainer.innerHTML = `
                    <div class="w-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-red-50 text-red-500 text-sm font-medium">
                        Gagal memuat jadwal. Silakan coba lagi.
                    </div>
                `;
            }
        });
    });

    let selectedRawDate = "";

    dateContainer?.addEventListener("change", async (e) => {
        if (checkGuest(e)) {
            // Restore checked state if needed, though radio might already be checked.
            // Better to prevent moving to step 2.
            const target = e.target as HTMLInputElement;
            target.checked = false; 
            return;
        }

        const target = e.target as HTMLInputElement;
        if (target && target.name === "pilihan_jadwal") {
            hiddenDate.value = target.value;
            selectedScheduleId = target.value;
            selectedRawDate = target.getAttribute("data-raw-date") || "";

            // Reset kursi
            const hiddenInput = document.getElementById(
                "input-selected-seats",
            ) as HTMLInputElement;
            if (hiddenInput) {
                hiddenInput.value = "";
                hiddenInput.dispatchEvent(
                    new Event("change", { bubbles: true }),
                );
            }

            try {
                // Panggil API riil ke backend
                const response = await travelService.getSeatsOccupancy(
                    selectedRouteId,
                    selectedRawDate,
                );
                const seatInfo = response.data || {};
                const lockedSeats = Array.isArray(
                    seatInfo.occupied_seats_list,
                )
                    ? seatInfo.occupied_seats_list
                    : [];
                const maxCapacity = seatInfo.max_capacity || 0;

                if (seatInfo.status === "full" || maxCapacity === 0) {
                    return (window as any).showFeedbackModal(
                        "error",
                        "Armada Penuh",
                        "Maaf, armada untuk jadwal ini sudah disewa penuh oleh layanan Charter/Paket atau sudah terisi penuh.",
                    );
                }

                // Kita bisa simpan status unit dari backend jika perlu untuk UI
                // const unitName = seatInfo.unit;

                const allSeats = document.querySelectorAll(".seat-btn");
                allSeats.forEach((btn) => {
                    const btnEl = btn as HTMLButtonElement;
                    const seatNumber = parseInt(btnEl.textContent || "0");

                    // Bersihkan pilihan sebelumnya
                    btnEl.setAttribute("data-selected", "false");

                    // Jika kursi tersebut di luar maxCapacity unit yang dialokasikan (misal unit Luxio max 10, tapi ada seat 11-14 di UI)
                    if (seatNumber > maxCapacity) {
                        btnEl.setAttribute("disabled", "true");
                        btnEl.classList.add(
                            "opacity-20",
                            "grayscale",
                            "cursor-not-allowed",
                            "hidden",
                        );
                    } else {
                        btnEl.classList.remove("hidden");
                        if (lockedSeats.includes(seatNumber)) {
                            // Jika kursi sudah dipesan
                            btnEl.setAttribute("disabled", "true");
                            btnEl.classList.add(
                                "opacity-40",
                                "grayscale",
                                "cursor-not-allowed",
                            );
                        } else {
                            // Jika kursi kosong
                            btnEl.removeAttribute("disabled");
                            btnEl.classList.remove(
                                "opacity-40",
                                "grayscale",
                                "cursor-not-allowed",
                            );
                        }
                    }
                });
            } catch (err) {
                console.error("Gagal mengambil data kursi riil", err);
            }
        }
    });

    // Luggage Alert Logic
    const beratBagasiInput = document.getElementById(
        "berat_bagasi",
    ) as HTMLInputElement;
    const dimensiBagasiSelect = document.getElementById(
        "dimensi_bagasi",
    ) as HTMLSelectElement;
    const luggageAlertCard = document.getElementById("luggage-alert-card");

    const checkLuggageAlert = () => {
        if (!beratBagasiInput || !dimensiBagasiSelect || !luggageAlertCard)
            return;
        const weight = parseInt(beratBagasiInput.value) || 0;
        const dimension = dimensiBagasiSelect.value;

        if (weight >= 60 || dimension === "super_besar") {
            luggageAlertCard.classList.remove("hidden");
        } else {
            luggageAlertCard.classList.add("hidden");
        }
    };

    if (beratBagasiInput && dimensiBagasiSelect) {
        beratBagasiInput.addEventListener("input", checkLuggageAlert);
        dimensiBagasiSelect.addEventListener("change", checkLuggageAlert);
    }

    // Navigation Logic
    form1.addEventListener("submit", (e) => {
        e.preventDefault();
        if (checkGuest(e)) return;
        if (!hiddenDate.value) {
            return (window as any).showFeedbackModal(
                "warning",
                "Pilih Jadwal",
                "Silakan pilih rute dan tanggal keberangkatan terlebih dahulu.",
            );
        }

        const selectedSeats = (
            document.getElementById(
                "input-selected-seats",
            ) as HTMLInputElement
        )?.value;
        if (!selectedSeats) {
            return (window as any).showFeedbackModal(
                "warning",
                "Pilih Kursi",
                "Silakan pilih minimal 1 kursi yang tersedia untuk melanjutkan.",
            );
        }

        step1.classList.add("hidden");
        step2.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    btnBack?.addEventListener("click", (e) => {
        if (checkGuest(e)) return;
        step2.classList.add("hidden");
        step1.classList.remove("hidden");
    });

    // Final Submission
    form2.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (checkGuest(e)) return;

        const btnSubmit = form2.querySelector(
            'button[type="submit"]',
        ) as HTMLButtonElement;
        const originalText = btnSubmit.textContent;

        btnSubmit.disabled = true;
        btnSubmit.textContent = "Sedang Memproses...";

        try {
            const formData1 = new FormData(form1);
            const data1 = Object.fromEntries(formData1.entries()) as Record<
                string,
                any
            >;

            const formData2 = new FormData(form2);
            const data2 = Object.fromEntries(formData2.entries()) as Record<
                string,
                any
            >;

            const seatValues =
                (
                    document.getElementById(
                        "input-selected-seats",
                    ) as HTMLInputElement
                )?.value || "";
            const firstSeat = parseInt(seatValues.split(",")[0]);

            const bookingPayload: any = {
                route_id: selectedRouteId,
                departure_date: selectedRawDate,
                seat_number: firstSeat,
                tujuan_kecamatan: data1.tujuan_kecamatan || "-",
                pickup_address: JSON.stringify({
                    kecamatan: data2.sub_district || "-",
                    desa: data2.village || "-",
                    dusun: data2.hamlet || "-",
                    rt_rw: `${data2.rt || "-"}/${data2.rw || "-"}`,
                    patokan: data2.landmark || "-",
                }),
                dropoff_address: JSON.stringify({
                    kecamatan: data1.tujuan_kecamatan || "-",
                    desa: data1.tujuan_desa || "-",
                    dusun: data1.tujuan_dusun || "-",
                    rt_rw: `${data1.tujuan_rt || "-"}/${data1.tujuan_rw || "-"}`,
                    patokan: data1.tujuan_patokan || "-",
                }),
                baggage_description: "Bawaan Penumpang Reguler",
                baggage_weight:
                    beratBagasiInput?.value &&
                    parseFloat(beratBagasiInput.value) > 0
                        ? parseFloat(beratBagasiInput.value)
                        : 1,
                baggage_dimension: dimensiBagasiSelect?.value || "kecil",
            };

            const token = localStorage.getItem("jwt_token");
            if (!token)
                throw new Error(
                    "Anda belum login (Token tidak ditemukan).",
                );

            await travelService.createTravelBooking(bookingPayload, token);

            const successMessage = `
                <div class="flex flex-col gap-3 text-left">
                    <p class="text-slate-600 text-sm mb-2 text-center">Pemesanan Anda telah berhasil dikirim ke sistem! Anda telah mengunci kursi ini.</p>
                    
                    <!-- Alert Card 2: Payment Timeout -->
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 items-start shadow-sm mt-1">
                        <div class="bg-amber-100 text-amber-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <h4 class="font-bold text-amber-800 text-sm">Batas Waktu Pembayaran</h4>
                            <p class="text-amber-700 text-[11px] font-secondary leading-tight">
                                Pesanan Anda harus segera dibayar dalam waktu <strong>10 menit</strong>. Jika melewati batas waktu, pesanan akan dibatalkan secara otomatis oleh sistem.
                            </p>
                        </div>
                    </div>
                </div>
            `;

            (window as any).showFeedbackModal(
                "success",
                "Pemesanan Berhasil",
                successMessage,
                "/user/booking-history",
            );
        } catch (error: any) {
            if (error.code === 'NEAREST_DATE_OFFER') {
                const confirmed = await (window as any).showConfirmModal(
                    "Pindah Jadwal",
                    `${error.message}\\n\\nApakah Anda setuju untuk memindahkan jadwal ke tanggal terdekat: ${error.nearest_date}?`,
                    "warning"
                );
                if (confirmed) {
                    const dateSpan = document.getElementById("selected-raw-date");
                    if (dateSpan) dateSpan.textContent = error.nearest_date;
                    
                    const schedSpan = document.getElementById("selected-schedule-id");
                    if (schedSpan) {
                        schedSpan.textContent = error.nearest_schedule_id || "";
                    }
                    
                    // Resubmit the form by calling the same process
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = originalText;
                    setTimeout(() => btnSubmit.click(), 100);
                    return;
                } else {
                    (window as any).showFeedbackModal(
                        "error",
                        "Pemesanan Dibatalkan",
                        "Pemesanan telah dibatalkan karena kursi tidak mencukupi untuk barang bawaan Anda."
                    );
                    return;
                }
            }

            (window as any).showFeedbackModal(
                "error",
                "Pemesanan Gagal",
                error.message ||
                    "Terjadi kesalahan saat memproses pesanan Anda.",
            );
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
};

