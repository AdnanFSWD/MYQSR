import { useMutation } from '@tanstack/react-query';
import { checkoutApi } from '../api/checkoutApi';
import type { CheckoutPayload, CheckoutResponseData } from '../api/checkoutApi';

export const useCheckout = (options?: {
  onSuccess?: (data: CheckoutResponseData) => void;
  onError?: (error: any) => void;
}) => {
  return useMutation<CheckoutResponseData, any, CheckoutPayload>({
    mutationFn: checkoutApi.checkoutOrder,
    onSuccess: (data) => {
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
