import { adminContentService } from "@services/adminContentService";
import { formatRupiahInput } from "@utils/formatters";

export const setupPromoForm = () => {
    const minTrxInputs = document.querySelectorAll('input[name="min_transaction"]');
    minTrxInputs.forEach((input) => {
        input.addEventListener("input", function (this: HTMLInputElement) {
            const cleanValue = this.value.replace(/\D/g, "");
            this.value = cleanValue ? formatRupiahInput(cleanValue) : "";
        });
    });

    const resetBtn = document.getElementById("reset-promo-btn");
    const form = document.getElementById(
        "promo-home-form",
    ) as HTMLFormElement;

    // Event listener handled globally by AdminLayout

    // Custom Alert Logic
    const alertModal = document.getElementById("promo-alert-modal");
    const alertCard = document.getElementById("promo-alert-card");
    const alertIcon = document.getElementById("promo-alert-icon");
    const alertTitle = document.getElementById("promo-alert-title");
    const alertMessage = document.getElementById("promo-alert-message");
    const alertClose = document.getElementById("promo-alert-close");

    let onAlertCloseCallback: (() => void) | null = null;

    const showAlert = (
        type: "success" | "error",
        title: string,
        message: string,
        cb?: () => void,
    ) => {
        if (
            !alertModal ||
            !alertIcon ||
            !alertTitle ||
            !alertMessage ||
            !alertClose
        )
            return;

        if (type === "success") {
            alertIcon.className =
                "w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-green-100 text-green-500";
            alertIcon.innerHTML = "✓";
            alertClose.className =
                "mt-4 w-full py-3 rounded-xl font-bold transition-all text-white bg-green-500 hover:bg-green-600";
            alertClose.textContent = "Selesai";
        } else {
            alertIcon.className =
                "w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-red-100 text-red-500";
            alertIcon.innerHTML = "✕";
            alertClose.className =
                "mt-4 w-full py-3 rounded-xl font-bold transition-all text-white bg-red-500 hover:bg-red-600";
            alertClose.textContent = "Tutup";
        }

        alertTitle.textContent = title;
        alertMessage.textContent = message;
        onAlertCloseCallback = cb || null;

        alertModal.classList.remove("hidden");
        void alertModal.offsetWidth;
        alertModal.classList.remove("opacity-0");
        alertCard?.classList.remove("scale-95");
    };

    if (alertClose) {
        alertClose.addEventListener("click", () => {
            alertModal?.classList.add("opacity-0");
            alertCard?.classList.add("scale-95");
            setTimeout(() => {
                alertModal?.classList.add("hidden");
                if (onAlertCloseCallback) onAlertCloseCallback();
            }, 300);
        });
    }

    // Target Service Checkbox Logic
    const targetServiceCBs = document.querySelectorAll(
        ".target-service-cb",
    ) as NodeListOf<HTMLInputElement>;
    targetServiceCBs.forEach((cb) => {
        cb.addEventListener("change", (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value === "all" && target.checked) {
                targetServiceCBs.forEach((other) => {
                    if (other.value !== "all") other.checked = false;
                });
            } else if (target.value !== "all" && target.checked) {
                const allCb = Array.from(targetServiceCBs).find(
                    (c) => c.value === "all",
                );
                if (allCb) allCb.checked = false;
            }
        });
    });

    // Handle Form Reset
    if (resetBtn && form) {
        resetBtn.addEventListener("click", () => {
            form.reset();
            (form.querySelector(".promo-id") as HTMLInputElement).value =
                "";
            document
                .querySelector("#promo-home-form .delete-promo-btn")
                ?.classList.add("hidden");

            // reset checkboxes to default (all checked)
            targetServiceCBs.forEach((cb) => {
                cb.checked = cb.value === "all";
            });
        });
    }

    // Handle Submit
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const f = e.target as HTMLFormElement;
            const submitBtn = f.querySelector(".submit-promo-btn");

            const formData = new FormData(f);
            const maxDiscountRaw = formData.get("max_discount") as string;
            if (maxDiscountRaw) {
                formData.set(
                    "max_discount",
                    maxDiscountRaw.replace(/\./g, ""),
                );
            }
            const fileInput = f.querySelector(
                'input[type="file"]',
            ) as HTMLInputElement;
            const hasFile =
                fileInput && fileInput.files && fileInput.files.length > 0;

            try {
                if (submitBtn) {
                    submitBtn.textContent = "Menyimpan...";
                    submitBtn.setAttribute("disabled", "true");
                }

                const targetServices = Array.from(
                    formData.getAll("target_service"),
                );
                const finalTargetService = targetServices.includes("all")
                    ? "all"
                    : targetServices.join(",") || "all";
                formData.delete("target_service");
                formData.set("target_service", finalTargetService);

                if (hasFile) {
                    formData.set(
                        "is_active",
                        f.querySelector('input[name="is_active"]:checked')
                            ? "true"
                            : "false",
                    );
                    if (formData.has("discount")) {
                        formData.set(
                            "discount_percentage",
                            formData.get("discount") as string,
                        );
                        formData.delete("discount");
                    }
                    await adminContentService.savePromotion(formData);
                } else {
                    const jsonPayload = {
                        id: formData.get("id"),
                        tagline: formData.get("tagline"),
                        description: formData.get("description"),
                        discount_percentage: formData.get("discount"),
                        max_discount: formData.get("max_discount"),
                        promo_type: "home",
                        target_service: finalTargetService,
                        is_active: f.querySelector(
                            'input[name="is_active"]:checked',
                        )
                            ? true
                            : false,
                    };
                    await adminContentService.savePromotion(jsonPayload);
                }

                showAlert(
                    "success",
                    "Berhasil",
                    `Promo berhasil disimpan!`,
                    () => {
                        window.location.reload();
                    },
                );
            } catch (error: any) {
                showAlert(
                    "error",
                    "Gagal",
                    error.message || "Gagal menyimpan promo",
                );
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = "Simpan Promo";
                    submitBtn.removeAttribute("disabled");
                }
            }
        });
    }

    // Handle Deletes
    const deleteBtns = document.querySelectorAll(".delete-promo-btn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const f = (e.target as HTMLElement).closest(
                "form",
            ) as HTMLFormElement;
            const id = f.querySelector(".promo-id") as HTMLInputElement;
            if (id && id.value) {
                const confirmed = await (window as any).showConfirmModal(
                    "Konfirmasi Hapus",
                    "Yakin ingin menghapus promo ini secara permanen?",
                    "danger"
                );
                if (confirmed) {
                    try {
                        const originalText = btn.textContent;
                        btn.textContent = "Menghapus...";
                        await adminContentService.deletePromotion(id.value);
                        showAlert(
                            "success",
                            "Berhasil",
                            "Promo berhasil dihapus!",
                            () => {
                                window.location.reload();
                            },
                        );
                    } catch (error: any) {
                        showAlert(
                            "error",
                            "Gagal",
                            error.message || "Gagal menghapus promo",
                        );
                        btn.textContent = "Hapus Promo";
                    }
                }
            }
        });
    });

    // Handle Edit Populate
    const editButtons = document.querySelectorAll(".edit-promo-btn");
    editButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const data = JSON.parse(btn.getAttribute("data-promo") || "{}");
            const f = document.getElementById(
                "promo-home-form",
            ) as HTMLFormElement;

            // Populate
            (f.querySelector(".promo-id") as HTMLInputElement).value =
                data.id || "";
            (f.querySelector(".tagline-input") as HTMLInputElement).value =
                data.tagline || "";
            (
                f.querySelector(".description-input") as HTMLInputElement
            ).value = data.description || "";

            const radio = f.querySelector(
                `input[type="radio"][value="${data.target_service || "all"}"]`,
            ) as HTMLInputElement;
            if (radio) radio.checked = true;

            (
                f.querySelector(".discount-input input") as HTMLInputElement
            ).value = data.discount || data.discount_percentage || "";

            const maxDiscountReal = f.querySelector(
                ".max-discount-real",
            ) as HTMLInputElement;
            const maxDiscountDisplay = f.querySelector(
                ".max-discount-display",
            ) as HTMLInputElement;

            if (maxDiscountReal && maxDiscountDisplay) {
                const rawVal = data.max_discount || "";
                if (rawVal) {
                    const numVal = Math.round(Number(rawVal));
                    maxDiscountReal.value = numVal.toString();
                    // Format display value
                    let number_string = numVal.toString();
                    let sisa = number_string.length % 3;
                    let rupiah = number_string.substring(0, sisa);
                    let ribuan = number_string
                        .substring(sisa)
                        .match(/\d{3}/gi);
                    if (ribuan) {
                        let separator = sisa ? "." : "";
                        rupiah += separator + ribuan.join(".");
                    }
                    maxDiscountDisplay.value = rupiah;
                } else {
                    maxDiscountReal.value = "";
                    maxDiscountDisplay.value = "";
                }
            }

            (
                f.querySelector(".is-active-input") as HTMLInputElement
            ).checked = data.isActive === true || data.is_active === true;

            f.querySelector(".delete-promo-btn")?.classList.remove(
                "hidden",
            );
            f.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Image upload UI
    document.querySelectorAll(".image-upload-input").forEach((input) => {
        input.addEventListener("change", (e) => {
            const target = e.target as HTMLInputElement;
            const uploadText =
                target.parentElement?.querySelector(".image-upload-text");
            if (target.files && target.files.length > 0 && uploadText) {
                uploadText.textContent = target.files[0].name;
                uploadText.classList.add("text-primary");
            } else if (uploadText) {
                uploadText.textContent = "Pilih Gambar / Drag & Drop";
                uploadText.classList.remove("text-primary");
            }
        });
    });
};
