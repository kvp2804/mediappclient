import { Component, OnInit } from '@angular/core';
import { ExpenseCategories, ExpenseSource } from './expensecategories';
import {FormBuilder, FormGroup, Validators, FormControl, NgForm} from '@angular/forms';
import { PatientsService } from '../../services/patients.service';
import { Expensors } from './expensors';
import { Patients } from '../../data/patients';
import { ExpensesService } from '../../services/expenses.service';
import { Expenses } from '../../data/expenses';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-addexpenseentry',
  templateUrl: './addexpenseentry.component.html',
  styleUrls: ['./addexpenseentry.component.css']
})
export class AddexpenseentryComponent implements OnInit {

  expensorSelectControl = new FormControl('', Validators.required);
	 categories: ExpenseCategories[] = [
	    {category: 'Cash Advances'},
	    {category: 'Medicines'},
	    {category: 'Meals and snacks'},
	    {category: 'Fees'},
		{category: 'Inventory'},
		{category: 'MISC'}
  	];

  	sources: ExpenseSource[] = [
	    { source: 'Peti Cash' },
	    { source: 'Cash' },
	    { source: 'Journal Entries' },
	    { source: 'Bank Transfer' }
  	];

  	expensors : Expensors[] = [];

    expenseData: FormGroup;
    filteredExpensorOptions: Observable<Expensors[]>;

  constructor(private fb: FormBuilder, private patientService: PatientsService, private expenseService: ExpensesService) {
  		this.expenseData = fb.group({
		  	dateOfExpense: [null, Validators.required],
			description: [null, Validators.required],
			expenseCategory: [null, Validators.required],
			expenseSource: [null, Validators.required],
			amount: [null, Validators.required]
		});
   }
	ngOnInit(){

    this.getPatientData();

    this.filteredExpensorOptions = this.expensorSelectControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  };


  AutoCompleteDisplay(expensor: any): string {
    if (expensor == undefined) { return }
    return expensor.Name;
  }

  private _filter(value: string): Expensors[] {
    if (typeof value === "string") {
      const filterValue = value.toLowerCase();
      return this.expensors.filter(function(el) {
        return el.Name.toLowerCase().includes(filterValue);
    });
    }

  }


	getPatientData() {
	  	console.log('In getPatients');
	  	this.patientService.getPatients().subscribe(patients => this.populateExpensordata(patients));

	  	/*var patients: Patients[] = [
	    {_id: '1111', patientFirstName: 'KK', patientLastName: 'PP', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' },
	    {_id: '1112', patientFirstName: 'KK1', patientLastName: 'PP1', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' },
	    {_id: '1113', patientFirstName: 'KK2', patientLastName: 'PP2', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' },
	    {_id: '1114', patientFirstName: 'KK3', patientLastName: 'PP3', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' }

  	];
	  	this.populateExpensordata( patients );*/
  	};


  	onFormSubmit( ){
    var newExpense = new Expenses();
     var expensor = this.expensorSelectControl.value;
	  	newExpense.expenseFor =  expensor.id;
	  	newExpense.dateOfEntry = new Date(Date.now());
	  	newExpense.expenseDate = this.expenseData.get('dateOfExpense').value;
	  	newExpense.description = this.expenseData.get('description').value;
	  	newExpense.amount= this.expenseData.get('amount').value;
	  	newExpense.expenseCategory = this.expenseData.get('expenseCategory').value;
	  	newExpense.expenseSource = this.expenseData.get('expenseSource').value;

		this.expenseService.addExpense( newExpense ).subscribe(expense => newExpense = expense);
		console.log('Before');

    this.expenseData.reset();
    this.expensorSelectControl.reset();
		console.log('After');
  	}

  	populateExpensordata(patients: Patients[]){

  		for(var i = 0; i<patients.length; i++) {

  			let expensor: Expensors = {
  				id: patients[i]._id,
  				Name: patients[i].patientFirstName + " " + patients[i].patientLastName
  			};

  			this.expensors.push( expensor );
  			console.log(this.expensors[i].id);
  			console.log(this.expensors[i].Name);

  		}
  	};


}
