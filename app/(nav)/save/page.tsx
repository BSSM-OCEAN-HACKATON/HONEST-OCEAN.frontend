"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { useTabBarGradient } from "@/app/components/ui/tabBar/TabBarGradientContext";
import Button from "@/app/components/shared/Button";
import ProductComparisonTable from "@/app/components/shared/ProductComparisonTable";
import { getMerchantRecordList } from "@/app/lib/api/merchantRecordList";
import { getMerchantPrice } from "@/app/lib/utils/merchantPriceStorage";
import type { RecordDetail } from "@/app/types/api";
import type { ProductComparisonTable as ProductComparisonTableType } from "@/app/types/product";

export default function SavePage() {
  const { setEnabled, setChildren } = useTabBarGradient();
  const [isSelecting, setIsSelecting] = useState(false);
  const [records, setRecords] = useState<RecordDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectProducts = useCallback(() => {
    console.log("구매할 상품 선택하기 클릭");
    setIsSelecting(true);
  }, []);

  const handleFindRoute = useCallback(() => {
    // TODO: 길 찾기 로직 구현
    console.log("길 찾기");
  }, []);

  const handleCancel = useCallback(() => {
    console.log("취소하기 클릭");
    setIsSelecting(false);
  }, []);

  const buttonContent = useMemo(() => {
    if (isSelecting) {
      return (
        <div className="flex gap-2 w-full">
          <Button
            text="길 찾기"
            onClick={handleFindRoute}
            variant="primary"
            fullWidth={true}
          />
          <Button
            text="취소하기"
            onClick={handleCancel}
            variant="secondary"
            fullWidth={true}
          />
        </div>
      );
    } else {
      return (
        <Button
          text="구매할 상품 선택하기"
          onClick={handleSelectProducts}
          variant="primary"
        />
      );
    }
  }, [isSelecting, handleSelectProducts, handleFindRoute, handleCancel]);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true);
        const response = await getMerchantRecordList(1, 100);
        setRecords(response.data.record);
        console.log('상인 기록 목록:', response.data.record);
      } catch (error) {
        console.error('상인 기록 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    setChildren(buttonContent);
    setEnabled(true);

    return () => {
      setEnabled(false);
      setChildren(null);
    };
  }, [setEnabled, setChildren, buttonContent]);

  // API 데이터를 ProductComparisonTable 형태로 변환
  const comparisonTables = useMemo<ProductComparisonTableType[]>(() => {
    // seafoodType별로 그룹화
    const groupedRecords = records.reduce((acc, record) => {
      const type = record.stats.seafoodType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(record);
      return acc;
    }, {} as Record<string, RecordDetail[]>);

    // 각 그룹을 ProductComparisonTable로 변환
    return Object.entries(groupedRecords).map(([type, typeRecords]) => ({
      title: type,
      showTitle: true,
      rows: typeRecords.map((record) => {
        // 이미지 URL 검증 (http://, https://, / 로 시작하는지 확인)
        const isValidImageUrl = record.image &&
          (record.image.startsWith('http://') ||
           record.image.startsWith('https://') ||
           record.image.startsWith('/'));

        // 로컬 스토리지에서 상인이 제안한 가격 조회
        const merchantPrice = getMerchantPrice(record.recordId);
        const actualMerchantPrice = merchantPrice !== null ? merchantPrice : record.stats.marketPrice;
        const marketPrice = record.stats.marketPrice;

        // 표준가(시장가) 대비 상인 제시가 차이 계산 (%)
        const priceDifferencePercent = marketPrice > 0
          ? Math.round(((actualMerchantPrice - marketPrice) / marketPrice) * 100)
          : 0;

        // 차이를 표시할 문자열 생성
        const priceDifferenceText = priceDifferencePercent === 0
          ? '동일'
          : priceDifferencePercent > 0
          ? `+${priceDifferencePercent}%`
          : `${priceDifferencePercent}%`;

        return {
          imageUrl: isValidImageUrl ? record.image : '/fish/Go.webp', // 유효하지 않으면 기본 이미지
          estimatedWeight: `${record.merchantWeight}kg`,
          // 로컬 스토리지에 저장된 상인 가격이 있으면 사용, 없으면 시장 가격 사용
          merchantPrice: actualMerchantPrice.toString(),
          priceDifference: priceDifferenceText,
        };
      }),
    }));
  }, [records]);

  if (isLoading) {
    return (
      <div className="flex-col min-h-screen gap-6 items-center justify-center">
        <p className="text-gray-003">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex-col min-h-screen gap-6 pb-[200px] pt-9">
      <div className="flex-col gap-2">
        <h2 className="font-bold text-24 text-gray-003">
          오늘 본 해산물
        </h2>
        <div className="bg-gray-002 flex items-center gap-1 px-3 py-2 rounded-[12px]">
          <div className="size-4 shrink-0">
            <Image
              src="/icon/search/search.svg"
              alt="검색"
              width={16}
              height={16}
              className="text-gray-secondary"
              unoptimized
            />
          </div>
          <input
            type="text"
            placeholder="가성비 좋은 해산물..."
            className="flex-1 bg-transparent font-regular text-16 text-gray-secondary outline-none placeholder:text-gray-secondary"
          />
        </div>
      </div>
      {comparisonTables.map((table, index) => (
        <ProductComparisonTable
          key={index}
          title={table.title}
          showTitle={table.showTitle && index === 0}
          rows={table.rows}
          tableIndex={index}
          isSelecting={isSelecting}
        />
      ))}
    </div>
  );
}
