export class ApiResponse<T = unknown> {
    statusCode: number;
    message: string;
    success: boolean;
    data: T;

    constructor(statusCode: number, message = 'Success', data: T) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode >= 200 && statusCode < 400;
        this.data = data;
    }
}
