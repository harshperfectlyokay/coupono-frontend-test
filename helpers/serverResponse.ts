import { HandleResponseType } from './../app/types/index';
import { NextResponse } from "next/server";

// Define the type for the response parameter


// Update the function to use TypeScript types
export const handleNextResponse = <T>(res: HandleResponse<T>) => {
    return NextResponse.json(
        {
            message: res.message,
            data: res.data, // This will be of type T or null
            status: res.status
        },
        { status: res.status }
    );
};

// Define the HandleResponse class with TypeScript types
export default class HandleResponse<T = null> {
    status: number;
    message: string;
    data: T;

    constructor(status: number = 500, message: string = "Internal Server Error", data: T = null as unknown as T) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    toString(): string {
        return JSON.stringify({
            status: this.status,
            message: this.message,
            data: this.data
        });
    }

    toObject(): { status: number; message: string; data: T } {
        return {
            status: this.status,
            message: this.message,
            data: this.data
        };
    }
}


// Type alias for the object structure returned by toObject



// Type alias for the object structure returned by toObject (plain object, no methods)





