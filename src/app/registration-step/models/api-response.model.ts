export class ApiResponse<T> {
    constructor(
      public obj: T,
      public status: string,
      public errorMessage: string
    ) {}
}
  