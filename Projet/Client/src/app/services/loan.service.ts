import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseHttpService } from './baseHttpService';
import { Loan } from '../model/loan';

@Injectable()
export class LoanService extends BaseHttpService {
  public loan(bookId, copyId, userId): Observable<void> {
    const now = new Date();
    return this.http.post<void>(`${this.baseUrl}/loans`,
        {bookId, copyId, userId, loanDate: `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}`})
        .pipe(
        map(() => null),
        catchError((err) => { console.log(err); return null; })
    );
  }

  public getAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.baseUrl}/loans`);
  }

  public return(loanId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/loans/${loanId}`)
        .pipe(map(() => null));
  }

}
