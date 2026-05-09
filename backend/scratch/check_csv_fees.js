const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../../dataset/Indian_Engineering_Colleges_Dataset.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');
const lines = csvData.split('\n');

let maxFee = 0;
let minFee = Infinity;

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (!row || row.length < 4) continue;

    const ugFeeStr = row[3].replace(/"/g, '').replace(/,/g, '').trim();
    const ugFee = parseInt(ugFeeStr);
    
    if (!isNaN(ugFee)) {
        if (ugFee > maxFee) maxFee = ugFee;
        if (ugFee < minFee) minFee = ugFee;
    }
}

console.log('Max UG Fee in CSV:', maxFee);
console.log('Min UG Fee in CSV:', minFee);
