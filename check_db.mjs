import fs from 'fs';

fetch('http://localhost:5000/api/admin/cms/fleets').then(res => res.json()).then(data => {
    fs.writeFileSync('d:\\ProjekKp\\fleets_dump.json', JSON.stringify(data, null, 2));
    console.log("Done fetching fleets");
}).catch(console.error);

fetch('http://localhost:5000/api/admin/cms/promotions').then(res => res.json()).then(data => {
    fs.writeFileSync('d:\\ProjekKp\\promos_dump.json', JSON.stringify(data, null, 2));
    console.log("Done fetching promos");
}).catch(console.error);
