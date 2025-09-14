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
}

export interface iGroupedTransaction {
  title: string;
  value: iTransaction[];
}
