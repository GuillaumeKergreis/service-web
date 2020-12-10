import {Component, OnInit} from '@angular/core';
import {forkJoin, from, Observable, of} from 'rxjs';
import {LoanService} from '../services/loan.service';
import {Loan} from '../model/loan';
import {concatMap, switchMap, tap, toArray} from 'rxjs/operators';
import {BookService} from '../services/book.service';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {Book} from '../model/book';

@Component({
    selector: 'app-loan-list',
    templateUrl: './loan-list.component.html',
    styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
    public loans$: Observable<{ user: User, book: Book, loan: Loan; }[]>;

    constructor(private loanService: LoanService, private bookService: BookService, private userService: UserService) {
    }

    ngOnInit() {
        this.init();
    }

    public init() {
        this.loans$ = this.loanService.getAll().pipe(switchMap(loans =>
            from(loans).pipe(concatMap(loan => forkJoin({
                user: this.userService.get(loan.userId),
                book: this.bookService.get(loan.bookId),
                loan: of(loan)
            })), toArray())
        ));
    }

    returnLoan(loan: Loan) {
        this.loanService.return(loan.id)
            .pipe(tap(() => this.init()))
            .subscribe();
    }

}
