import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {ElementRef} from '@angular/core';

import {PdbService} from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    entryid: string;
    currentExpType: string;

    baseUrl: string;
    pdbeExpApiUrl: string;
    moleculeApiUrl: string;
    summaryApiUrl: string;
    nmrResApiUrl: string;
    xrayValApiUrl: string;
    xrayRefApiUrl: string;
    sasBaseUrl: string;
    sasValApiUrl: string;
    sasExpApiUrl: string;

    expData: any;
    moleculeData: any;
    summaryData: any;
    apiNmrResData: any;
    xrayValidationData: any;
    xrayRefinedData: any;
    formattedXrayExp: any;
    sasValidationData: any;
    sasExperimentalData: any;

    sourceOrganisms: Array<string>;
    expressionSystems: Array<string>;

    samIcon: string;
    valIcon: string;
    expIcon: string;

    samDisplay: string;
    valDisplay: string;
    expDisplay: string;

    constructor(private dataService: PdbService, elm: ElementRef) {
        this.baseUrl = 'https://www.ebi.ac.uk'
        this.sasBaseUrl = 'https://www.sasbdb.org/rest-api/entry/';
        this.sasValApiUrl = this.sasBaseUrl + 'validation/';
        this.sasExpApiUrl = this.sasBaseUrl + 'experiment/';
        this.entryid = elm.nativeElement.getAttribute('entryid');
        this.pdbeExpApiUrl = this.baseUrl + '/pdbe/api/pdb/entry/experiment/';
        this.moleculeApiUrl = this.baseUrl + '/pdbe/api/pdb/entry/molecules/';
        this.summaryApiUrl = this.baseUrl + '/pdbe/api/pdb/entry/summary/';
        this.nmrResApiUrl = this.baseUrl + '/pdbe/api/pdb/entry/nmr_resources/';
        this.xrayValApiUrl = this.baseUrl + '/pdbe/api/validation/key_validation_stats/entry/';
        this.xrayRefApiUrl = this.baseUrl + '/pdbe/api/validation/xray_refine_data_stats/entry/';
        this.sourceOrganisms = new Array<string>();
        this.expressionSystems = new Array<string>();
        this.formattedXrayExp = {};
        this.valIcon = '8';
        this.expIcon = '8';
        this.samIcon = '8';
        this.samDisplay = 'block';
        this.valDisplay = 'block';
        this.expDisplay = 'block';
    }

    setExpType(value): void {
        this.currentExpType = value;
    }

    getExpData(): void {
        this.dataService.getApiData(this.entryid, this.pdbeExpApiUrl)
            .then(data => this.expData = data)
            .then(() => this.checkExpTypes(this.expData))
            .then(() => this.createFormattedExpData(this.expData));
    }

    getSummaryData(): void {
        this.dataService.getApiData(this.entryid, this.summaryApiUrl)
            .then(data => this.summaryData = data);
    }

    getMoleculeData(): void {
        this.dataService.getApiData(this.entryid, this.moleculeApiUrl)
            .then(data => this.moleculeData = data)
    }

    getNmrResData(): void {
        this.dataService.getApiData(this.entryid, this.nmrResApiUrl)
            .then(data => this.apiNmrResData = data);
    }

    getXrayValData(): void {
        this.dataService.getApiData(this.entryid, this.xrayValApiUrl)
            .then(data => this.xrayValidationData = data);
    }

    getXrayRefData(): void {
        this.dataService.getApiData(this.entryid, this.xrayRefApiUrl)
            .then(data => this.xrayRefinedData = data);
    }

    getSasValData(): void {
        this.dataService.getApiData(this.entryid + '.json', this.sasValApiUrl).then(data => this.sasValidationData = data);
    }

    getSasExpData(): void {
        this.dataService.getApiData(this.entryid + '.json', this.sasExpApiUrl).then(data => this.sasExperimentalData = data);
    }

    clicked(val): void {
        if (val == 'validation') {
            this.valIcon = this.changeIcon(this.valIcon);
            this.valDisplay = this.changeDisplay(this.valIcon);
        } else if (val == 'sample') {
            this.samIcon = this.changeIcon(this.samIcon);
            this.samDisplay = this.changeDisplay(this.samIcon);
        } else if (val == 'experiment') {
            this.expIcon = this.changeIcon(this.expIcon);
            this.expDisplay = this.changeDisplay(this.expIcon);
        }
    }

    changeIcon(val): string {
        if (val == '8') {
            return '9';
        } else if (val == '9') {
            return '8';
        } else {
            return '9';
        }
    }

    changeDisplay(val): string {
        if (val == 8) {
            return 'block';
        } else if (val == 9) {
            return 'none';
        } else {
            return 'none';
        }
    }

    createFormattedExpData(apiData): void {
        for (let entry in apiData) {
            for (let exp in apiData[entry]) {
                if (apiData[entry][exp].experimental_method_class == 'x-ray') {
                    this.formattedXrayExp['a'] = apiData[entry][exp].cell.a;
                    this.formattedXrayExp['b'] = apiData[entry][exp].cell.b;
                    this.formattedXrayExp['c'] = apiData[entry][exp].cell.c;
                    this.formattedXrayExp['alpha'] = apiData[entry][exp].cell.alpha;
                    this.formattedXrayExp['beta'] = apiData[entry][exp].cell.beta;
                    this.formattedXrayExp['gamma'] = apiData[entry][exp].cell.gamma;
                    this.formattedXrayExp['spacegroup'] = apiData[entry][exp].spacegroup;
                    for (let diffrn in apiData[entry][exp].diffraction_experiment) {
                        if (!this.formattedXrayExp['beam_info']) {
                            this.formattedXrayExp['beam_info'] = apiData[entry][exp].diffraction_experiment[diffrn].beam_source_type;
                        } else {
                            this.formattedXrayExp['beam_info'] += ', ' + apiData[entry][exp].diffraction_experiment[diffrn].beam_source_type;
                        }
                    }
                }
            }
        }
    }

    checkExpTypes(apiData): void {
        for (let entry in apiData) {
            let first = true;
            for (let exp in apiData[entry]) {
                let expType = apiData[entry][exp]['experimental_method_class'];
                if (first) {
                    this.currentExpType = expType;
                    first = false;
                }
                if (expType == 'nmr') {
                    this.getNmrResData();
                } else if (expType == 'x-ray') {
                    this.getXrayValData();
                    this.getXrayRefData();
                } else if (expType == 'em') {
                    this.getXrayValData();
                } else if (expType == 'sas') {
                    this.getSasValData();
                    this.getSasExpData();
                }
            }
        }
    }

    ngOnInit(): void {
        this.getSummaryData();
        this.getMoleculeData();
        this.getExpData();
    }

}