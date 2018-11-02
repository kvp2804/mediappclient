import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Income } from '../data/income';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  private incomesUrl = 'http://localhost:3000/api/income';
  private incomesForSpecificPatientUrl = 'http://localhost:3000/api/incomeforspecificpatient';
  private deleteincomes = 'http://localhost:3000/api/incomedelete';
  private updateincomes = 'http://localhost:3000/api/incomeupdate';
  private incomeByDateForSpecificPatientUrl = 'http://localhost:3000/api/incomebydateforspecificpatient';
  private incomeByDateForAllPatientUrl = 'http://localhost:3000/api/incomebydateforallpatient';
  constructor(private http: HttpClient) { }

  /** POST: add a new income to the server */
    addIncome (income: Income): Observable<Income> {

		console.log( income );

		return this.http.post<Income>(this.incomesUrl, income, httpOptions).pipe(
		tap((patient: Income) => this.log(`added income for Patient Name = ${income.incomeFor}`)),
		catchError(this.handleError<Income>('addIncome'))
		);
	}

	getIncome (): Observable<Income[]> {
		console.log('In getIncome Service');
	  	return this.http.get<Income[]>(this.incomesUrl)
	}

	getIncomeBySpecificPatient ( patientID: string ): Observable<Income[]> {
		console.log('In getIncomeBySpecificPatient Service');
		let params = new HttpParams();
		params = params.append('incomeFor', patientID);

	  	return this.http.get<Income[]>(this.incomesForSpecificPatientUrl, {params: params});
	}

	getIncomebyDateForSpecificpatient( patientID: string, startDate: string, endDate: string ): Observable<Income[]> {
		console.log('In getIncomebyDateForSpecificpatient Service');
		let params = new HttpParams();
	    params = params.append('id', patientID);
	    params = params.append('startDate', startDate);
	    params = params.append('endDate', endDate);

	  	return this.http.get<Income[]>(this.incomeByDateForSpecificPatientUrl, {params: params});
    }

    getIncomebyDateForAllPatient( startDate: string, endDate: string ): Observable<Income[]> {
		console.log('In getIncomebyDateForAllPatient Service');
		let params = new HttpParams();	    
	    params = params.append('startDate', startDate);
	    params = params.append('endDate', endDate);

	  	return this.http.get<Income[]>(this.incomeByDateForAllPatientUrl, {params: params});
    }

	deleteIncome ( incomeID: string ): Observable<Income[]> {
		console.log('In deleteExpense Service');
		let params = new HttpParams();
		params = params.append('id', incomeID);

	  	return this.http.delete<Income[]>(this.deleteincomes, {params: params});
	}

	updateIncome ( income: Income, incomeId: string ): Observable<Income[]> {
		console.log('In deleteExpense Service');
		let params = new HttpParams();
		params = params.append('id', incomeId );
	  	return this.http.put<Income[]>(this.updateincomes, income, {params: params} );
	}


	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	  //this.messagesService.addMessage(`HeroService: ${message}`);
	  console.log( `IncomeService: ${message}` );
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
