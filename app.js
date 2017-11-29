const csv = require('csvtojson');
const fs = require('fs');
let destArr = '';
let city = process.argv[2];
const csvFilePath='./data/' + city + '.csv';
let appendToFile = process.argv[3];

const sourceHeader = {
    office: 0,
    agentName: 1,
    origination: 2,
    associationDate: 3,
    reportedEarnings: 4,
    poweredbyzip: 5,
    cbmoveEmail: 6
}

csv({
    noheader: false,
    headers: ['email', 'firstname', 'middlename', 'lastname', 'city', 'company']
})
.fromFile(csvFilePath)
.on('header', (header)=> {
    destArr += 'email' + ',';
    destArr += 'firstName' + ',';
    destArr += 'middlename' + ',';
    destArr += 'lastname' + ',';
    destArr += 'city' + ',';
    destArr += 'company';
    destArr += '\n';
})
.on('csv', (csvRow, rowIndex)=> {
    let email = `${csvRow[sourceHeader.cbmoveEmail]}@cbmove.com`;
    let name = createName(splitName(csvRow[sourceHeader.agentName]));
    
    destArr += email + ',';
    destArr += name + ',';
    destArr += city + ',';
    destArr += ('CBRB - ' + csvRow[sourceHeader.office]);
    destArr += '\n';
})
.on('done', (error)=> {
    console.log(destArr);
    console.log('end');

    let filename = './data/' + city + '-' + new Date().getDate() + '-' + (new Date().getMonth()+1) + '-' + new Date().getFullYear() + '.csv';
    
    if(appendToFile == '-A') {
        fs.appendFile(filename, destArr, (err) => {
            if(err) throw err;
            console.log('CSV file appended...' + filename);
        });
    } else {
        fs.writeFile(filename, destArr, (err) => {
            if(err) throw err;
            console.log('CSV file Saved...' + filename);
        });
    }
});

function splitName(name) {

    return name.split(' ');
}

function createName(name) {
    let fname = name[0];
    let mname = name[1];
    let lname = name[2];

    //agent does not have a middle name
    if(lname === undefined) {
        lname = mname;
        mname = '';
    }
    return [fname, mname, lname];
}

console.log('Creating ' + process.argv[2] + '...');