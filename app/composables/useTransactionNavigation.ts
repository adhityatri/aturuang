import type { iTransaction } from '~/types/transactions';

export const useTransactionNavigation = () => {
  const router = useRouter();

  const navigateToTransactionDetail = (transaction: iTransaction) => {
    router.push({
      name: "transaction-detail",
      query: {
        id: transaction.id,
      },
    });
  };

  return { navigateToTransactionDetail };
};