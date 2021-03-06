class LoanController {
    constructor(loanRepository) {
        this.loanRepository = loanRepository;
    }

    getAll(req, res) {
        const loans = this.loanRepository.getAll();
        res.json(loans);
    }

    create(req, res) {
        const loan = this.loanRepository.add(req.body);
        res.location('/loans/' + loan.id);
        res.status(201).send(loan);
    }

    get(req, res) {
        const loan = this.loanRepository.get(req.params.loanId);
        if (loan == null) {
            res.status(404).send(null);
        } else {
            res.status(200).send(loan);
        }
    }

    getByUserId(req, res) {
        const loans = this.loanRepository.getByUserId(req.params.userId);
        res.status(200).send(loans);
    }

    getBookAvailableCopies(req, res) {
        const copies = this.loanRepository.getBookAvailableCopies(req.params.bookId);
        res.status(200).send(copies);
    }

    delete(req, res) {
        this.loanRepository.delete(req.params.loanId);
        res.status(204).send(null);
    }
}

module.exports = LoanController;
