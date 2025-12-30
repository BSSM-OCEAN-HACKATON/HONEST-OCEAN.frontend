import { useQuery } from '@tanstack/react-query'
import { getMerchantRecordList } from '@/app/lib/api/merchantRecordList'
import type { MerchantRecordListResponse } from '@/app/types/api'

export function useMerchantRecordList(page: number = 1, size: number = 100) {
  return useQuery<MerchantRecordListResponse>({
    queryKey: ['merchantRecordList', page, size],
    queryFn: () => getMerchantRecordList(page, size),
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh하게 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  })
}
