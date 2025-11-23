import type { iTransaction } from "~/types/transactions";

// Generate a signature for the current transactions state
export const useSignature = (transactions: iTransaction[]) => {
  const relevantTransactions = transactions.slice(0, 50);
  const signature = JSON.stringify(
    relevantTransactions.map(
      (transaction) =>
        `${transaction.id}: ${transaction.amount}:${transaction.created_at}:${transaction.category_name}`
    )
  );
  return signature;
};
