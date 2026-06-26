const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/index.astro', 'utf8');

c = c.replace(/<span class="text-\[10px\] font-bold text-slate-400">Baru Saja<\/span>/g, '');
c = c.replace(/href="\/admin\/route"/g, 'href="/admin/bookings/route"');
c = c.replace(/href="\/admin\/charter"/g, 'href="/admin/bookings/charter"');

fs.writeFileSync('src/pages/admin/index.astro', c);
console.log('Fixed index.astro!');
