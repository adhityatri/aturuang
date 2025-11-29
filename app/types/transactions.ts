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
  wallet_name?: string;
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

export interface aiReceiptItem {
  description: string;
  amount: number;
  category: string;
}

export interface aiTransaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: string;
  items?: aiReceiptItem[];
}

export interface aiReceiptResponse {
  items: aiReceiptItem[];
  date: string;
  merchantName: string;
  global_category: string;
  type: string;
}
