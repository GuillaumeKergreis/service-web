const {v4: uuid} = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');

class LoanRepository {
    constructor(db, bookRepository, copyRepository, userRepository) {
        this.db = db;
        this.bookRepository = bookRepository;
        this.copyRepository = copyRepository;
        this.userRepository = userRepository;
    }

    checkLoan(loan) {
        if (!loan.loanDate) {
            throw new ValidationError('The loan must have a loan date.');
        } else if (!loan.bookId) {
            throw new ValidationError('The loan must have a book id.');
        } else if (!loan.copyId) {
            throw new ValidationError('The loan must have a copy id.');
        } else if (!loan.userId) {
            throw new ValidationError('The loan must have a user id.');
        } else if (!this.bookRepository.get(loan.bookId)) {
            throw new ValidationError('Invalid book id.');
        } else if (!this.copyRepository.get(loan.bookId, loan.copyId)) {
            throw new ValidationError('Invalid copy id.');
        } else if (!this.userRepository.get(loan.userId)) {
            throw new ValidationError('Invalid user id.');
        } else if (_.some(this.getAll(), {copyId: loan.copyId})) {
            throw new ValidationError('This copy is already loaned.');
        }
    }

    getAll() {
        return this.db.getData("/loans");
    }

    add(loan) {
        this.checkLoan(loan);
        loan.id = uuid();
        this.db.push("/loans[]", loan);

        return loan;
    }

    get(id) {
        const loans = this.getAll();
        return _.find(loans, {id});
    }

    delete(id) {
        const path = this.getIdPath(id);
        if (path != null) {
            this.db.delete(path);
        }
    }

    getIdPath(id) {
        const loans = this.getAll();
        const index = _.findIndex(loans, {id});
        if (index === -1) {
            return null;
        }

        return '/loans[' + index + ']';
    }
}

module.exports = LoanRepository;
