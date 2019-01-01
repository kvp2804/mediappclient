import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Incomesors } from './incomesors';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Income } from '../../data/income';
import { IncomeCategories } from './incomecategories';
import { PatientsService } from '../../services/patients.service';
import { IncomeService } from '../../services/income.service';
import { Patients } from '../../data/patients';
import * as XLSX from 'xlsx';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSort, MatTableDataSource} from '@angular/material';
import {IncomeForView} from './incomeforview';

@Component({
  selector: 'app-searchincome',
  templateUrl: './searchincome.component.html',
  styleUrls: ['./searchincome.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchincomeComponent implements OnInit {

  incomesorSelectControl = new FormControl();
  incomesors : Incomesors[] = [];
  incomeSearchForm: FormGroup;
  income : Income[];
	displayedColumns: string[] = ['incomeDate', 'incomeFor', 'incomeCategory', 'amount', 'description', 'delete'];
  displayedColumnsToTableHeaderMapping = {
    'incomeDate':'Income Date',
    'incomeFor':'Patient Name',
    'incomeCategory':'Income Category',
    'amount':'Amount',
    'description':'Description'
    };
	dataSourceFromServer: Income[];
  dataSourceRaw: IncomeForView[];
	EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  dataSource = new MatTableDataSource(this.dataSourceRaw);
  @ViewChild(MatSort) sort: MatSort;
  filteredIncomesorOptions: Observable<Incomesors[]>;

  categories: IncomeCategories[] = [
      {category: 'Cash'},
      {category: 'Bank Transfer'},
      {category: 'Donations'},
      {category: 'MISC'}
    ];

  constructor( private fb: FormBuilder, private patientService: PatientsService, private incomeService: IncomeService ) {
  	this.incomeSearchForm = fb.group({
      searchPatientId:[null],
      searchStartDate: [null],
      searchEndDate: [null]
	})

  };

  ngOnInit() {

    this.getPatientData();


  this.filteredIncomesorOptions = this.incomesorSelectControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  AutoCompleteDisplay(incomesor: any): string {
    if (incomesor == undefined) { return }
    return incomesor.displayValue;
  }

  private _filter(value: string): Incomesors[] {
    const filterValue = value.toLowerCase();

    return this.incomesors.filter(function(el) {
      return el.displayValue.toLowerCase().includes(filterValue);
  });
  }

  getPatientData() {
    console.log('In getPatients');
    this.patientService.getPatients().subscribe(patients => this.populateIncomesordata(patients));
  };

  populateIncomesordata(patients: Patients[]){

    for(var i = 0; i<patients.length; i++) {

      let incomesor: Incomesors = {
        value: patients[i]._id,
        displayValue: patients[i].patientFirstName + " " + patients[i].patientLastName
      };

      this.incomesors.push( incomesor );
      console.log("Patient ID = " + this.incomesors[i].value);
      console.log("Name = " + this.incomesors[i].displayValue);

    }
  };

  getIncomeData() {
  	console.log('In getIncomeData');
  	this.incomeService.getIncome().subscribe(dataSourceFromServer => this.dataSourceFromServer = dataSourceFromServer);
  	console.log(this.dataSource);
  } ;

  onRefresh() {
  	console.log('In onRefresh');
  	this.incomeService.getIncome().subscribe(dataSourceFromServer => this.populateIncomeData( dataSourceFromServer ));
  } ;

  populateIncomeData(incomeFromServer: Income[]){

    console.log(incomeFromServer);

    this.dataSourceRaw = [];
    for(var i = 0; i<incomeFromServer.length; i++) {

      var patientName;
        if( incomeFromServer[i].incomeFor == null )
        {
          patientName = "";
        }
        else
        {
           patientName = incomeFromServer[i].incomeFor.patientFirstName + " " + incomeFromServer[i].incomeFor.patientLastName
        }

      this.dataSourceRaw[i] = {
          incomeFor: patientName,
          dateOfEntry: incomeFromServer[i].dateOfEntry,
          incomeDate: incomeFromServer[i].incomeDate,
          description: incomeFromServer[i].description,
          incomeCategory: incomeFromServer[i].incomeCategory,
          amount: incomeFromServer[i].amount,
          _id: incomeFromServer[i]._id
      }
    }

    this.dataSource = new MatTableDataSource(this.dataSourceRaw);
    this.dataSource.sort = this.sort;

    console.log(JSON.stringify(this.dataSourceRaw));
    console.log(this.dataSource);

  };

  onDelete( incomeID: string ){
  	this.incomeService.deleteIncome( incomeID ).subscribe();
  }

  onUpdate( income ){
    var newIncome = new Income();
    newIncome.description = income.description;
    newIncome.amount= income.amount;
    newIncome.incomeCategory = income.incomeCategory;
    this.incomeService.updateIncome( newIncome, income._id ).subscribe();
  }

  onIncomeSearch() {
  	var whichServiceToExecute = new String();
    var searchByEndDate = this.incomeSearchForm.get('searchEndDate').value;
    var incomesor = this.incomesorSelectControl.value;

  	if( incomesor == null || incomesor == "" )
  	{
  		if( this.incomeSearchForm.get('searchStartDate').value == null )
	  	{
	  		whichServiceToExecute = 'NoExecution';
	  	}
	  	else
	  	{
	  		if( this.incomeSearchForm.get('searchEndDate').value == null )
	  		{
	  			searchByEndDate = Date.now();
	  		}
	  		whichServiceToExecute = 'SearchIncomeForAllPatientsSpecificDates';
	  	}
  	}
  	else
  	{
  		if( this.incomeSearchForm.get('searchStartDate').value == null )
	  	{
	  		whichServiceToExecute = 'SearchIncomeByPatientAllDates';
	  	}
	  	else
	  	{
	  		if( this.incomeSearchForm.get('searchEndDate').value == null )
	  		{
	  			searchByEndDate = Date.now();
	  		}

	  		whichServiceToExecute = 'SearchIncomeByPatientSpecificDates';
	  	}
  	}

  	if( whichServiceToExecute === "SearchIncomeByPatientSpecificDates" )
  	{
      console.log("In SearchIncomeByPatientSpecificDates");
  		this.incomeService.getIncomebyDateForSpecificpatient(incomesor.value, this.incomeSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSourceFromServer => this.populateIncomeData( dataSourceFromServer ));
  	}
  	else if( whichServiceToExecute === "SearchIncomeByPatientAllDates")
  	{
      console.log("In SearchIncomeByPatientAllDates");
      console.log(incomesor.value);

  		this.incomeService.getIncomeBySpecificPatient(incomesor.value)
        .subscribe(dataSourceFromServer => this.populateIncomeData( dataSourceFromServer ));
  	}
  	else if( whichServiceToExecute === "SearchIncomeForAllPatientsSpecificDates")
  	{
      console.log("In SearchIncomeForAllPatientsSpecificDates");
  		this.incomeService.getIncomebyDateForAllPatient(this.incomeSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSourceFromServer => this.populateIncomeData( dataSourceFromServer ));
  	}
 }

  exportToExcel() {
      this.export("expenses");
   }


   export(excelFileName: string) {
    var excelOutputJson = [];
    for(var i = 0; i< this.dataSourceRaw.length; i++){
      var data=this.dataSourceRaw[i];
      var output={};
      for(var j = 0; j < this.displayedColumns.length; j++){
        if (this.displayedColumns[j] !== "delete") {
          var actualColumnHeader = this.displayedColumnsToTableHeaderMapping[this.displayedColumns[j]];
          output[actualColumnHeader] = data[this.displayedColumns[j]];
        }
      }
      excelOutputJson.push(output);
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelOutputJson);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, excelFileName + '_income_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }

}
