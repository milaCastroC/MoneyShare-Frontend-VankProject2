export interface Expense {
    id_expense: number;
    id_share: number;
    id_user: number;
    amount: number;
    category?: string;
    date: string; // o Date
    description?: string;
}
