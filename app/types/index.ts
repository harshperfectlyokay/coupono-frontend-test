import { ObjectId } from "mongodb";

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export type HandleResponseType<T> = {
  status: number;
  message: string;
  data: T | null;
}
