import { ICustomError, ICustomErrorMessage } from '../interface';

export class CustomError extends Error implements ICustomError {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    formatMessage(): ICustomErrorMessage {
        return {
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}
