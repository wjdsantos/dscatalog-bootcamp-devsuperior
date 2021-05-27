export type UsersResponse = {
    content: User[];
    totalPages: number;
}

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
