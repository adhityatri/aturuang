interface categories {
  name: string;
  type: string;
}

export interface iTransaction {
  id: number;
  created_at: string;
  amount: number;
  total_amount?: number;
  notes: string;
  categories: categories;
  category_name?: string;
  category_type?: string;
  wallet_id?: string;
}

export interface iGroupedTransaction {
  title: string;
  value: iTransaction[];
}

export interface iSumTransactionByMonth {
  month: string;
  total_amount: number;
  amountFormatted?: string;
}
