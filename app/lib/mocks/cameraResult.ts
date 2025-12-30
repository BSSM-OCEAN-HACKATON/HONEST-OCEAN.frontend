import type { ResultData } from '@/app/types/camera'

export const mockCameraResultData: ResultData = {
  appropriatePrice: 7000,
  priceDifference: 35,
  riskLevel: '높음',
  servings: '1인분',
  estimatedWeight: '115g',
  isProhibited: true, // 금지체장 여부
  comparisons: [
    {
      imageUrl: 'http://localhost:3845/assets/0290102799cfa74d3afcb3b79ae44a54e5c2a286.png',
      title: '붉은 대게 전문점',
      description: '가격 대비 가장 양이 많아요'
    },
    {
      imageUrl: 'http://localhost:3845/assets/681affa9dd4b508f1fcea147ed31f0f6b68382b6.png',
      title: '등붉은 대게 전문점',
      description: '가격은 가장 높지만 신선도 높아요'
    },
    {
      imageUrl: 'http://localhost:3845/assets/ad587fabb06d9e765c38c434b534d106fb0bbbbc.png',
      title: '푸른박스 대게점',
      description: '신선도와 가격 모두 낮아요'
    }
  ]
}

