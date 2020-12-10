const {v4: uuid} = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');

const checkCopy = function (copy) {
    if (!copy.submissionDate) {
        throw new ValidationError('The copy must have a submission date.');
    }
}

class CopyRepository {
    constructor(db, bookRepository) {
        this.db = db;
        this.bookRepository = bookRepository;
    }

    getAll(bookId) {
        const bookPath = this.bookRepository.getIdPath(bookId);
        if (bookPath == null) {
            throw new ValidationError('This book does not exists')
        }

        return this.db.getData(bookPath + '/copies');
    }

    getIdPath(bookId, id) {
        const copies = this.getAll(bookId);
        const index = _.findIndex(copies, {id});
        if (index === -1) {
            return null;
        }

        const bookPath = this.bookRepository.getIdPath(bookId);
        return bookPath + '/copies[' + index + ']';
    }

    add(bookId, copy) {
        checkCopy(copy);
        copy.id = uuid();
        const bookPath = this.bookRepository.getIdPath(bookId)
        this.db.push(bookPath + '/copies[]', copy)

        return copy
    }

    get(bookId, id) {
        const copies = this.getAll(bookId);
        return _.find(copies, {id});
    }

    update(bookId, id, copy) {
        if (copy.id !== id) {
            throw new ValidationError('You cannot change the copy identifier.');
        }

        checkCopy(copy);
        const path = this.getIdPath(bookId, id);
        if (path == null) {
            throw new ValidationError('This copy does not exists');
        }

        this.db.push(path, copy);

        return copy;
    }

    delete(bookId, id) {
        const path = this.getIdPath(bookId, id);
        if (path != null) {
            this.db.delete(path);
        }
    }
}

module.exports = CopyRepository;
