import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Expenses } from '../data/expenses';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private expensesUrl = 'http://localhost:3000/api/expense';
  private expensesForSpecificPatientUrl = 'http://localhost:3000/api/expenseforspecificpatient';
  private deleteexpenses = 'http://localhost:3000/api/expensedelete';
  private updateexpenses = 'http://localhost:3000/api/expenseupdate';
  private expensesByDateForSpecificPatientUrl = 'http://localhost:3000/api/expensebydateforspecificpatient';
  private expenseByDateForAllPatientUrl = 'http://localhost:3000/api/expensebydateforallpatient';

  constructor(private http: HttpClient) { }

  /** POST: add a new expense to the server */
    addExpense (expense: Expenses): Observable<Expenses> {

		console.log( expense );

		return this.http.post<Expenses>(this.expensesUrl, expense, httpOptions).pipe(
		tap((patient: Expenses) => this.log(`added Expense for w/ Patient Name =${expense.expenseFor}`)),
		catchError(this.handleError<Expenses>('addExpenses'))
		);
	}

	getExpenses (): Observable<Expenses[]> {
		console.log('In getExpenses Service');
	  	return this.http.get<Expenses[]>(this.expensesUrl)
	}

	getExpenseBySpecificPatient ( patientID: string ): Observable<Expenses[]> {
		console.log('In getExpenses Service');
		let params = new HttpParams();
		params = params.append('expenseFor', patientID);

	  	return this.http.get<Expenses[]>(this.expensesForSpecificPatientUrl, {params: params});
	}

	getExpensebyDateForSpecificpatient( patientID: string, startDate: string, endDate: string ): Observable<Expenses[]> {
		console.log('In getExpenses Service');
		let params = new HttpParams();
	    params = params.append('id', patientID);
	    params = params.append('startDate', startDate);
	    params = params.append('endDate', endDate);

	  	return this.http.get<Expenses[]>(this.expensesByDateForSpecificPatientUrl, {params: params});
    }

    getExpensebyDateForAllPatient( startDate: string, endDate: string ): Observable<Expenses[]> {
		console.log('In getIncomebyDateForAllPatient Service');
		let params = new HttpParams();	    
	    params = params.append('startDate', startDate);
	    params = params.append('endDate', endDate);

	  	return this.http.get<Expenses[]>(this.expenseByDateForAllPatientUrl, {params: params});
    }


	deleteExpense ( expenseID: string ): Observable<Expenses[]> {
		console.log('In deleteExpense Service');
		let params = new HttpParams();
		params = params.append('id', expenseID);

	  	return this.http.delete<Expenses[]>(this.deleteexpenses, {params: params});
	}

	updateExpense ( expense: Expenses, expenseId: string ): Observable<Expenses[]> {
		console.log('In deleteExpense Service');
		let params = new HttpParams();
		params = params.append('id', expenseId );
	  	return this.http.put<Expenses[]>(this.updateexpenses, expense, {params: params} );
	}


	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	  //this.messagesService.addMessage(`HeroService: ${message}`);
	  console.log( `ExpensesService: ${message}` );
	}


	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {

	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead

	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}
}
