export interface ResponseModel<T> {
  isSuccess: boolean;
  message: string;
  result: T;
}
