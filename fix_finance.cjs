const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/finance.astro', 'utf8');

c = c.replace(/fetch\(\`${API_BASE}\/api\/admin\/cashflow\/transactions\?limit=10\`\, \{ headers \}\)/g, 'fetch(`${API_BASE}/api/admin/cashflow/transactions?limit=200`, { headers })');

c = c.replace(/const financialSummary = \[([\s\S]*?)\];/g, `const financialSummary = [
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
];`);

c = c.replace(/<!-- Filter & Actions -->[\s\S]*?<!-- Summary Cards -->/g, '<!-- Summary Cards -->');
c = c.replace(/<!-- Projections -->[\s\S]*?<\/section>/g, '</section>');
c = c.replace(/transactions\.map\(\(tx: any\) => \(/g, 'transactions.map((tx: any, index: number) => (');
c = c.replace(/<tr class="group hover:bg-slate-50\/50 transition-colors whitespace-nowrap md:whitespace-normal">/g, '<tr class={`group hover:bg-slate-50/50 transition-colors whitespace-nowrap md:whitespace-normal ${index >= 10 ? \'hidden tx-hidden\' : \'\'}`}>');
c = c.replace(/<\/tbody>\s*<\/table>\s*<\/div>/g, '</tbody></table></div>\n            {transactions.length > 10 && (<div class="mt-6 flex justify-center"><button id="toggle-tx-btn" class="text-xs font-bold text-primary bg-primary/5 px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">Lihat Seluruh Data Bulan Ini</button></div>)}');

c = c.replace(/\/\/ Filter Actions[\s\S]*?\}\s*\n\s*setupExpenseTracker/g, `// Toggle Transaction Table
        const toggleBtn = document.getElementById('toggle-tx-btn');
        if (toggleBtn) {
            let isExpanded = false;
            toggleBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                document.querySelectorAll('.tx-hidden').forEach(el => {
                    if (isExpanded) el.classList.remove('hidden');
                    else el.classList.add('hidden');
                });
                toggleBtn.textContent = isExpanded ? 'Tutup Data Lengkap' : 'Lihat Seluruh Data Bulan Ini';
            });
        }
    }
    setupExpenseTracker`);
c = c.replace(/if \(txRes\.ok\) transactions = \(await txRes\.json\(\)\)\.data\.data \|\| \[\];/g, 'if (txRes.ok) transactions = (await txRes.json()).data || [];');

fs.writeFileSync('src/pages/admin/finance.astro', c);
