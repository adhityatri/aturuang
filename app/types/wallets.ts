export interface iWallets {
  id: string;
  name: string;
  amount: number;
  created_at: string;
}

export type WalletMemberRole = "editor" | "viewer";

export interface iWalletMember {
  id: string;
  wallet_id: string;
  user_id: string;
  email: string;
  role: WalletMemberRole;
  created_at: string;
}
