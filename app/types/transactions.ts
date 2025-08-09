interface categories {
    name: string;
    type: string;
}

export interface iTransaction {
  id: number;
  created_at: string;
  amount: number;
  notes: string;
  categories: categories;
}

export interface iGroupedTransaction {
  title: string;
  value: iTransaction[]; 
}