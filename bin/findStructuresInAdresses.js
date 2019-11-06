#!/usr/bin/env node

const csv = require('csv-string');
const { promises } = require('fs');
const { depleteString } = require('../lib/strings');
const { isIn } = require('../lib/rnsr');
const RNSR = require('../data/RNSR.json');

async function getTSV() {
    const tsv = await promises.readFile(`${__dirname}/../data/2014_AdressesCorpusTest.tsv`, {
        encoding: 'utf8',
    });
    const data = csv.parse(tsv, '\t');
    return data;
}

getTSV()
    .then((rnsrAddresses) => {
        console.log('found\texpected\taddress');
        // console.log(rnsrAddresses);
        // rnsrAddresses = rnsrAddresses.slice(1, 101);
        const addressesNb = rnsrAddresses.length;
        const found = rnsrAddresses.reduce((alreadyFound, rnsrAddress) => {
            const depletedAddress = depleteString(rnsrAddress[1]);
            const isInAddress = isIn(depletedAddress);
            const rnsrIds = RNSR.structures.structure
                .filter(isInAddress)
                .map((s) => s.num_nat_struct);
            const isFound = rnsrIds.includes(rnsrAddress[0]);
            if (!isFound) {
                console.log(`${rnsrIds}\t${rnsrAddress[0]}\t${depletedAddress}`);
            }
            return alreadyFound + (isFound ? 1 : 0);
        }, 0);
        const recall = found / addressesNb;
        console.log('recall:', recall);
        console.log('found:', found);
        console.log('total:', addressesNb);
    });
