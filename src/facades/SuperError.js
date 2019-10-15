
class SuperError extends Error {
    constructor(error) {
        super(error.message);
        this.name = error.name;
        this.date = new Date();
    }
}

module.exports = SuperError;
