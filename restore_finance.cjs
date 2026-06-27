const fs = require('fs');

const astroContent = `---
// File: src/pages/admin/finance.astro
import AdminLayout from "@layouts/AdminLayout.astro";
import StatCard from "@features/admin/dashboard/StatCard.astro";
import InputGroup from "@ui/InputGroup.astro";

// Data Keuangan Dinamis (Server-Side)
const token = Astro.cookies.get("token")?.value;
const API_BASE = import.meta.env.PUBLIC_API_URL || "http://localhost:5000";
const headers = { 'Authorization': \`Bearer \${token}\` };

let summary = {
    total_income: 0,
    today_income: 0,
    last_month_income: 0,
    driver_salary: 0,
    total_expense: 0
};
let transactions = [];
let driverExpenses = [];
const currentFilter = Astro.url.searchParams.get('filter') || 'monthly';

try {
    const [sumRes, txRes, expRes] = await Promise.all([
        fetch(\`\${API_BASE}/api/admin/cashflow/summary?filter=\${currentFilter}\`, { headers }),
        fetch(\`\${API_BASE}/api/admin/cashflow/transactions?limit=200\`, { headers }),
        fetch(\`\${API_BASE}/api/admin/cashflow/expenses?status=pending\`, { headers })
    ]);
    
    if (sumRes.ok) summary = (await sumRes.json()).data;
    if (txRes.ok) transactions = (await txRes.json()).data || [];
    if (expRes.ok) driverExpenses = (await expRes.json()).data || [];
} catch(e) {
    console.error("Failed to load finance data:", e);
}

// Hitung growth
let growth = 0;
if (summary.last_month_income > 0) {
    growth = ((summary.total_income - summary.last_month_income) / summary.last_month_income) * 100;
}

const financialSummary = [
    {
        title: "Total Pendapatan (Bulan Ini)",
        value: \`Rp \${summary.total_income.toLocaleString('id-ID')}\`,
        icon: \`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>\`,
        trend: { value: \`\${Math.abs(growth).toFixed(1)}%\`, isUp: growth >= 0 },
        color: "emerald" as const
    },
    {
        title: "Pendapatan Bulan Lalu",
        value: \`Rp \${summary.last_month_income.toLocaleString('id-ID')}\`,
        icon: \`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>\`,
        color: "amber" as const
    },
    {
        title: "Pendapatan Hari Ini",
        value: \`Rp \${summary.today_income.toLocaleString('id-ID')}\`,
        icon: \`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 3v.75m0 3v.75m0 3V15m15 0v.75m0 3v.75m0 3V18.75M6.75 4.5v.75m0 3v.75m0 3v.75m0 3V15m15 0v.75m0 3v.75m0 3V18.75m-15-15h15c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H4.5c-.621 0-1.125-.504-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125z" /></svg>\`,
        color: "sky" as const
    }
];
---

<AdminLayout title="Laporan Keuangan">
    <div class="flex flex-col gap-10">
        
        <!-- Summary Cards -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialSummary.map((stat) => (
                <div id={stat.title.includes("Total") ? "stat-total-income" : "stat-today-income"}>
                    <StatCard {...stat} />
                </div>
            ))}
            <!-- 40% Driver Salary Indicator -->
            <div
                class="bg-primary p-6 rounded-2xl text-white flex flex-col justify-between shadow-lg shadow-primary/20"
            >
                <div>
                    <span
                        class="text-[9px] font-black uppercase tracking-widest text-white/60"
                        >Estimasi Alokasi</span
                    >
                    <h3 class="text-lg font-black mt-1">Gaji Supir (40%)</h3>
                </div>
                <div class="mt-4">
                    <span class="text-2xl font-black" id="stat-driver-salary">Rp {summary.driver_salary.toLocaleString('id-ID')}</span>
                    <p class="text-[10px] text-white/70 mt-1">
                        * 40% dari total pendapatan armada
                    </p>
                </div>
            </div>
        </section>

        <!-- Driver Expense Verification -->
        <section class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-xl font-black text-slate-900">Verifikasi Pengeluaran Supir</h2>
                    <p class="text-xs text-slate-400 mt-1">ACC atau Tolak nota pengeluaran operasional supir.</p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">
                            <th class="pb-4 px-4">Supir</th>
                            <th class="pb-4 px-4">Item Pengeluaran</th>
                            <th class="pb-4 px-4">Jumlah</th>
                            <th class="pb-4 px-4">Nota</th>
                            <th class="pb-4 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        {driverExpenses.length === 0 ? (
                            <tr class="text-center py-10">
                                <td colspan="5" class="py-10 text-slate-400 text-sm font-secondary">Tidak ada pengajuan operasional supir.</td>
                            </tr>
                        ) : driverExpenses.map((exp: any) => (
                            <tr class="group hover:bg-slate-50/50 transition-colors whitespace-nowrap md:whitespace-normal">
                                <td class="py-5 px-4 font-bold text-slate-900 text-sm">{exp.driver_name}</td>
                                <td class="py-5 px-4 text-xs text-slate-600">
                                    {exp.category}
                                    <span class="block text-[10px] text-slate-400 mt-1">{new Date(exp.created_at).toLocaleDateString('id-ID')}</span>
                                </td>
                                <td class="py-5 px-4 font-main font-black text-slate-900">Rp {Number(exp.amount).toLocaleString('id-ID')}</td>
                                <td class="py-5 px-4">
                                    {exp.proof_url ? (
                                        <a href={exp.proof_url} target="_blank" class="text-[10px] font-bold text-primary underline">Lihat Foto</a>
                                    ) : (
                                        <span class="text-[10px] text-slate-400">-</span>
                                    )}
                                </td>
                                <td class="py-5 px-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button data-id={exp.id} class="acc-btn px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-all">ACC</button>
                                        <button data-id={exp.id} class="tolak-btn px-4 py-2 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-200 transition-all">Tolak</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Masukan Data Pengeluaran Form -->
        <section id="input-expense" class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm scroll-mt-28">
            <header class="mb-10">
                <h2 class="text-2xl font-black text-slate-900 tracking-tight">Masukan Data Pengeluaran</h2>
                <p class="text-sm text-slate-400 mt-2 font-secondary">Catat pengeluaran operasional kantor dan pemeliharaan secara mandiri.</p>
            </header>

            <form id="expense-form" class="flex flex-col gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <!-- Block 1: Utama -->
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2">
                            <label class="font-secondary text-sm font-bold text-primary">Jenis Pengeluaran</label>
                            <select name="type" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/10 transition-all">
                                <option value="Perawatan Kendaraan">🛠 Perawatan Kendaraan</option>
                                <option value="Pajak Kendaraan">📑 Pajak Kendaraan</option>
                                <option value="Pajak Izin Berusaha">🏢 Pajak Izin Berusaha</option>
                            </select>
                        </div>
                        <InputGroup label="Penanggung Jawab" id="expense_pic" name="pic" placeholder="Nama Lengkap..." required={true} />
                    </div>

                    <!-- Block 2: Nominal -->
                    <div class="flex flex-col gap-6">
                        <InputGroup label="Nominal (Rp)" id="expense_amount" name="amount" type="number" placeholder="Contoh: 150000" required={true} />
                        <InputGroup label="Tanggal Pengeluaran" id="expense_date" name="date" type="date" required={true} />
                    </div>

                    <!-- Block 3: Bukti & Keterangan -->
                    <div class="flex flex-col gap-6">
                        <InputGroup label="Keterangan Detail" id="expense_detail" name="detail" placeholder="Ganti oli rutin armada B 1234 XY" />
                        <div class="flex flex-col gap-2">
                            <label class="font-secondary text-sm font-bold text-primary">Upload Bukti/Nota (Opsional)</label>
                            <input type="file" name="proof" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4 border-t border-slate-50">
                    <button type="submit" class="bg-primary text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        Simpan & Update Laporan
                    </button>
                </div>
            </form>
        </section>

        <!-- Transaction Table -->
        <section class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-black text-slate-900">Riwayat Transaksi</h2>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[700px]">
                    <thead>
                        <tr class="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">
                            <th class="pb-4 px-4">ID Transaksi</th>
                            <th class="pb-4 px-4">Tanggal</th>
                            <th class="pb-4 px-4">Keterangan</th>
                            <th class="pb-4 px-4">Kategori</th>
                            <th class="pb-4 px-4">Metode</th>
                            <th class="pb-4 px-4 text-right">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        {transactions.length === 0 ? (
                            <tr class="text-center py-10">
                                <td colspan="6" class="py-10 text-slate-400 text-sm font-secondary">Belum ada transaksi.</td>
                            </tr>
                        ) : transactions.map((tx: any, index: number) => (
                            <tr class={\`group hover:bg-slate-50/50 transition-colors whitespace-nowrap md:whitespace-normal \${index >= 10 ? 'hidden tx-hidden' : ''}\`}>
                                <td class="py-4 px-4 font-bold text-slate-900 text-sm">{tx.id.substring(0, 8).toUpperCase()}</td>
                                <td class="py-4 px-4 text-xs text-slate-500">{new Date(tx.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                                <td class="py-4 px-4 text-sm font-medium text-slate-700 max-w-xs truncate" title={tx.description}>{tx.description || '-'}</td>
                                <td class="py-4 px-4">
                                    <span class="text-[9px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{tx.category.replace('_', ' ')}</span>
                                </td>
                                <td class={\`py-4 px-4 text-xs font-bold \${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}\`}>
                                    {tx.type === 'income' ? 'MASUK' : 'KELUAR'}
                                </td>
                                <td class={\`py-4 px-4 text-right font-main font-black \${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}\`}>
                                    {tx.type === 'income' ? '+' : '-'} Rp {Number(tx.amount).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {transactions.length > 10 && (
                <div class="mt-6 flex justify-center">
                    <button id="toggle-tx-btn" class="text-xs font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
                        Lihat Seluruh Data Bulan Ini
                    </button>
                </div>
            )}
        </section>

    </div>
</AdminLayout>

<script>
    function setupExpenseTracker() {
        const form = document.getElementById('expense-form') as HTMLFormElement;
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Menyimpan...';
                submitBtn.disabled = true;

                try {
                    const formData = new FormData(form);
                    
                    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
                    const API_BASE = "http://localhost:5000";

                    const response = await fetch(\`\${API_BASE}/api/admin/cashflow/expense\`, {
                        method: 'POST',
                        headers: {
                            'Authorization': \`Bearer \${token}\`
                        },
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert('Berhasil: ' + data.message);
                        form.reset();
                        window.location.reload();
                    } else {
                        throw new Error(data.message || 'Gagal menyimpan pengeluaran');
                    }
                } catch (error: any) {
                    alert('Error: ' + error.message);
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }

        const handleApproval = async (id: string, status: 'approved' | 'rejected') => {
            if(!confirm(\`Apakah Anda yakin ingin \${status === 'approved' ? 'MENYETUJUI' : 'MENOLAK'} pengeluaran ini?\`)) return;

            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
                const API_BASE = "http://localhost:5000";

                const response = await fetch(\`\${API_BASE}/api/admin/cashflow/expense/\${id}/status\`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': \`Bearer \${token}\`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status })
                });

                if (response.ok) {
                    alert('Status pengeluaran berhasil diperbarui.');
                    window.location.reload();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal memperbarui status');
                }
            } catch (error: any) {
                alert('Error: ' + error.message);
            }
        };

        document.querySelectorAll('.acc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.id as string;
                handleApproval(id, 'approved');
            });
        });

        document.querySelectorAll('.tolak-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.id as string;
                handleApproval(id, 'rejected');
            });
        });

        // Toggle Transaction Table
        const toggleBtn = document.getElementById('toggle-tx-btn');
        if (toggleBtn) {
            let isExpanded = false;
            toggleBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                document.querySelectorAll('.tx-hidden').forEach(el => {
                    if (isExpanded) {
                        el.classList.remove('hidden');
                    } else {
                        el.classList.add('hidden');
                    }
                });
                toggleBtn.textContent = isExpanded ? 'Tutup Data Lengkap' : 'Lihat Seluruh Data Bulan Ini';
            });
        }
    }

    setupExpenseTracker();
    document.addEventListener('astro:page-load', setupExpenseTracker);
</script>
`;

fs.writeFileSync('src/pages/admin/finance.astro', astroContent);
