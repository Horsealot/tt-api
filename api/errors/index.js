class CustomError extends Error {
    constructor(message) {
        super(message);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);
    }
}

class UnauthorizedError extends CustomError {
    constructor(reason) {
        super(`Unauthorized`);
        this.data = {reason};
    }
}

class NotFoundError extends CustomError {
    constructor(reason) {
        super(`NotFound`);
        this.data = {reason};
    }
}

class AuthError extends CustomError {
    constructor(reason) {
        super(`Authentication failed`);
        this.data = {reason};
    }
}

module.exports = {
    AuthError,
    NotFoundError,
    UnauthorizedError
};
