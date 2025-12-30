"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { useTabBarGradient } from "@/app/components/ui/tabBar/TabBarGradientContext";
import Button from "@/app/components/shared/Button";
import ProductComparisonTable from "@/app/components/shared/ProductComparisonTable";

export default function SavePage() {
  const { setEnabled, setChildren } = useTabBarGradient();
  const [isSelecting, setIsSelecting] = useState(false);

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

  useEffect(() => {
    setChildren(buttonContent);
    setEnabled(true);

    return () => {
      setEnabled(false);
      setChildren(null);
    };
  }, [setEnabled, setChildren, buttonContent]);

  const comparisonTables = [
    {
      title: "대게",
      showTitle: true,
      rows: [
        {
          imageUrl: "/images/crab1.jpg",
          estimatedWeight: "115g",
          merchantPrice: "7000",
          hygiene: "좋음",
        },
        {
          imageUrl: "/images/crab2.jpg",
          estimatedWeight: "115g",
          merchantPrice: "6750",
          hygiene: "좋음",
        },
        {
          imageUrl: "/images/crab2.jpg",
          estimatedWeight: "115g",
          merchantPrice: "6750",
          hygiene: "좋음",
        },
      ],
    },
    {
      title: "대게",
      showTitle: true,
      rows: [
        {
          imageUrl: "/images/crab1.jpg",
          estimatedWeight: "115g",
          merchantPrice: "7000",
          hygiene: "좋음",
        },
        {
          imageUrl: "/images/crab2.jpg",
          estimatedWeight: "115g",
          merchantPrice: "6750",
          hygiene: "좋음",
        },
        {
          imageUrl: "/images/crab2.jpg",
          estimatedWeight: "115g",
          merchantPrice: "6750",
          hygiene: "좋음",
        },
      ],
    },
    {
      title: "대게",
      showTitle: true,
      rows: [
        {
          imageUrl: "/images/crab1.jpg",
          estimatedWeight: "115g",
          merchantPrice: "7000",
          hygiene: "좋음",
        },
        {
          imageUrl: "/images/crab2.jpg",
          estimatedWeight: "115g",
          merchantPrice: "6750",
          hygiene: "좋음",
        },
      ],
    },
    
  ];

  return (
    <div className="flex-col min-h-screen gap-6">
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
