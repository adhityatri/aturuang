export type debtType = "debt" | "receivable";
export type debtStatus = "unpaid" | "partial" | "paid";

export interface iDebt {
  id: string;
  user_id: string;
  type: debtType;
  counterparty: string;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: debtStatus;
  due_date: string | null;
  note: string | null;
  wallet_id: string | null;
  transaction_id: number | null;
  created_at: string;
  updated_at: string;
}

export type iDebtCreate = {
  type: debtType;
  counterparty: string;
  amount: number;
  due_date?: string | null;
  note?: string | null;
  wallet_id?: string | null;
};

export type iDebtUpdate = Partial<
  Pick<iDebt, "counterparty" | "amount" | "due_date" | "note">
>;

export interface iDebtPayment {
  id: string;
  debt_id: string;
  user_id: string;
  amount: number;
  paid_at: string;
  note: string | null;
  created_at: string;
}

export type iDebtPaymentCreate = {
  amount: number;
  paid_at?: string | null;
  note?: string | null;
};

export const debtTypeLabel: Record<debtType, string> = {
  debt: "Utang",
  receivable: "Piutang",
};

export const debtStatusLabel: Record<debtStatus, string> = {
  unpaid: "Belum Dibayar",
  partial: "Cicilan",
  paid: "Lunas",
};
