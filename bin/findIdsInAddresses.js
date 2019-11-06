#!/usr/bin/env node

const csv = require('csv-string');
const { promises } = require('fs');
const { intersection } = require('ramda');
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
        rnsrAddresses = rnsrAddresses.slice(1);
        let expectedNb = 0;
        const found = rnsrAddresses.reduce((alreadyFound, rnsrAddress) => {
            const depletedAddress = depleteString(rnsrAddress[1]);
            const isInAddress = isIn(depletedAddress);
            const rnsrIds = RNSR.structures.structure
                .filter(isInAddress)
                .map((s) => s.num_nat_struct);
            const expectedIds = rnsrAddress[0].split(' ; ');
            expectedNb += expectedIds.length;
            // const isFound = rnsrIds.includes(rnsrAddress[0]);
            const foundIds = intersection(rnsrIds, expectedIds);
            if (foundIds.length < expectedIds.length) {
                console.log(`${rnsrIds}\t${expectedIds}\t${depletedAddress}`);
            }
            return alreadyFound + foundIds.length;
        }, 0);
        const recall = found / expectedNb;
        console.log('recall:', recall);
        console.log('found:', found);
        console.log('total:', expectedNb);
    });
