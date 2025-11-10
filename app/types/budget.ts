export type iBudget = {
  id: string;
  user_id: string;
  amount: number;
  created_at: string;
  monthly_start: string;
};

export type iBudgetCreate = {
  amount: number;
  user_id: string;
  monthly_start: string;
};
