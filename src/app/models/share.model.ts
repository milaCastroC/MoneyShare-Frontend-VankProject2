export interface Share {
  id_share: number;
  id_creator: number;
  type: 'share_expense' | 'share_goal' | 'share_debt';
  code: string;
  name: string;
  description?: string;
  amount: number;
  paid_amount: number;
  status: 'active' | 'completed' | 'expired';
  start_date: string; // o Date si vas a manejar objetos Date
  due_date?: string;  // o Date
  split_equally: boolean;
}
