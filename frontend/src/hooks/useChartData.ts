import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

interface UseChartDataOptions {
  endpoint: string;
  params?: Record<string, any>;
  enabled?: boolean;
}

export function useChartData<T = any>({ endpoint, params, enabled = true }: UseChartDataOptions) {
  return useQuery<T, Error>({
    queryKey: ['chartData', endpoint, params],
    queryFn: async () => {
      const formattedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const response = await apiClient.get<any>(formattedEndpoint, { params });
      if (response.data && typeof response.data.success !== 'undefined') {
        if (!response.data.success) {
          throw new Error(response.data.message || 'API request failed');
        }
        return response.data.data as T;
      }
      return response.data as T;
    },
    enabled: enabled && !!endpoint,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
