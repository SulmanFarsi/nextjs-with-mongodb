declare interface CustomResponse<TData, TErrors> {
    success: boolean;
    data?: TData,
    errors?: Partial<Record<TErrors, string[]>>;
    message: string;
}


type RegisterFormFields = "email" | "password" | "password_confirmation" | "username";