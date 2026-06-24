const fs = require('fs');
const path = require('path');

const baseDir = 'd:\\ProjekKp\\KerjaPraktik';
const newDir = path.join(baseDir, 'dokumentasi file');

if (!fs.existsSync(newDir)){
    fs.mkdirSync(newDir);
}

const filesToMove = [
    { old: 'HaveDone.md', new: 'HaveDone (done).md' },
    { old: 'report_fe.md', new: 'report_fe (done).md' },
    { old: 'report fe.md', new: 'report fe (done).md' },
    { old: 'updates.md', new: 'updates (done).md' },
    { old: 'INTEGRATION_ANALYSIS.md', new: 'INTEGRATION_ANALYSIS (done).md' },
    { old: 'issue.md', new: 'issue (done).md' },
    { old: 'GEMINI.md', new: 'GEMINI.md' },
    { old: 'PRD.md', new: 'PRD.md' },
    { old: 'To Do.md', new: 'To Do.md' },
    { old: 'implementation_plan.md', new: 'implementation_plan.md' }
];

filesToMove.forEach(file => {
    const oldPath = path.join(baseDir, file.old);
    const newPath = path.join(newDir, file.new);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Moved ${file.old} to ${file.new}`);
    }
});

const gitignorePath = path.join(baseDir, '.gitignore');
let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';
if (!gitignoreContent.includes('dokumentasi file/')) {
    fs.writeFileSync(gitignorePath, gitignoreContent + '\n# Dokumentasi internal\ndokumentasi file/\n');
    console.log('Added dokumentasi file/ to .gitignore');
}

console.log('Done!');
