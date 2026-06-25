const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/assignments/index.astro', 'utf8');

// Replace block 1
const block1Target = `<div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Unit Teralokasi</span>
                        <div class="flex items-center gap-3">`;
const block1Replacement = `<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Unit Teralokasi</span>
                        <button type="button" class="change-fleet-btn absolute top-4 right-4 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md" data-date={item.departure_date.split('T')[0]} data-target={\`fleet-select-container-\${item.id}\`} data-info={\`fleet-info-\${item.id}\`}>Ganti Unit</button>
                        <div class="flex items-center gap-3" id={\`fleet-info-\${item.id}\`}>`;
file = file.replace(block1Target, block1Replacement);

// Replace form target
const formTarget = `<form class="assignment-form flex flex-col gap-3 pt-2" data-id={item.id} data-type={item.type}>`;
const formReplacement = `</div>
                        <div id={\`fleet-select-container-\${item.id}\`} class="hidden mt-3">
                            <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pilih Unit Pengganti (Opsional)</label>
                            <select name="fleet_id" form={\`form-\${item.id}\`} class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all fleet-select">
                                <option value="">Mencari unit kosong...</option>
                            </select>
                        </div>
                    </div>

                    <form id={\`form-\${item.id}\`} class="assignment-form flex flex-col gap-3 pt-2" data-id={item.id} data-type={item.type}>`;
file = file.replace(formTarget, formReplacement);

const scriptTarget = `                try {
                    const response = await apiFetch(\`/api/admin/assignments/\${type}/\${id}/assign\`, {
                        method: "PUT",
                        body: JSON.stringify(data)
                    });

                    if (response?.status === "success") {
                        alert("Supir berhasil ditugaskan!");
                        window.location.reload();
                    } else {
                        throw new Error(response?.message || "Gagal menugaskan supir");
                    }
                } catch (error: any) {
                    alert(error.message || "Terjadi kesalahan sistem.");
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            });
        });
    });
</script>`;

const scriptReplacement = `                try {
                    const response = await apiFetch(\`/api/admin/assignments/\${type}/\${id}/assign\`, {
                        method: "PUT",
                        body: JSON.stringify(data)
                    });

                    if (response?.status === "success") {
                        alert("Penugasan berhasil disimpan!");
                        window.location.reload();
                    } else {
                        throw new Error(response?.message || "Gagal menugaskan");
                    }
                } catch (error: any) {
                    alert(error.message || "Terjadi kesalahan sistem.");
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            });
        });

        // Ganti Unit Logic
        const changeBtns = document.querySelectorAll(".change-fleet-btn");
        changeBtns.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const target = e.target;
                const date = target.dataset.date;
                const containerId = target.dataset.target;
                const infoId = target.dataset.info;
                
                if (!containerId || !infoId || !date) return;
                
                const container = document.getElementById(containerId);
                const info = document.getElementById(infoId);
                if (!container || !info) return;

                if (container.classList.contains("hidden")) {
                    container.classList.remove("hidden");
                    info.classList.add("hidden");
                    target.textContent = "Batal Ganti";
                    target.classList.replace("bg-primary/10", "bg-red-100");
                    target.classList.replace("text-primary", "text-red-600");
                    
                    const select = container.querySelector("select");
                    try {
                        const response = await apiFetch(\`/api/admin/assignments/available-fleets?start_date=\${date}\`);
                        if (response?.status === 'success') {
                            const fleets = response.data;
                            if (fleets.length === 0) {
                                select.innerHTML = '<option value="">-- Tidak ada unit kosong --</option>';
                            } else {
                                select.innerHTML = '<option value="">-- Pilih Unit Pengganti --</option>' + fleets.map((f) => 
                                    \`<option value="\${f.id}">\${f.car_type} - \${f.plate_number} (Kapasitas: \${f.capacity})</option>\`
                                ).join('');
                            }
                        } else {
                            select.innerHTML = '<option value="">Gagal memuat unit</option>';
                        }
                    } catch (err) {
                        select.innerHTML = '<option value="">Error memuat unit</option>';
                    }
                } else {
                    container.classList.add("hidden");
                    info.classList.remove("hidden");
                    target.textContent = "Ganti Unit";
                    target.classList.replace("bg-red-100", "bg-primary/10");
                    target.classList.replace("text-red-600", "text-primary");
                    const select = container.querySelector("select");
                    select.value = "";
                }
            });
        });
    });
</script>`;
file = file.replace(scriptTarget, scriptReplacement);

fs.writeFileSync('src/pages/admin/assignments/index.astro', file, 'utf8');
console.log('File updated successfully.');
