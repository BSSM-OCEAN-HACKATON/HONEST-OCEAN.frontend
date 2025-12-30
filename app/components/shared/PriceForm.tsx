"use client";

import Button from "@/app/components/shared/Button";
import QuantityButtons from "@/app/components/shared/QuantityButtons";
import React, { useState, useMemo } from "react";

interface PriceFormProps {
  totalPrice?: number;
  onSubmit?: (data: { totalPrice: number; quantity: number; pricePerItem: number }) => void;
}

const PriceForm = ({ totalPrice = 8000, onSubmit }: PriceFormProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const pricePerItem = useMemo(() => {
    return quantity > 0 ? Math.floor(totalPrice / quantity) : 0;
  }, [totalPrice, quantity]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        totalPrice,
        quantity,
        pricePerItem,
      });
    } else {
      // TODO: 폼 제출 로직 구현
      console.log("전체 가격:", totalPrice);
      console.log("수량:", quantity);
      console.log("개당 가격:", pricePerItem);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-8">
      {/* 상인이 제안한 전체 가격 */}
      <div className="flex-col gap-1">
        <label className="text-20 text-gray-003">상인이 제안한 전체 가격</label>
        <div className="text-40 font-bold">{totalPrice.toLocaleString()}원</div>
      </div>

      {/* 구매할 상품의 갯수 */}
      <div className="flex-col gap-1 space-between">
        <label className="text-20 text-gray-003">구매할 상품의 갯수</label>
        <div className="flex-row items-center gap-2 justify-between font-bold">
          <span className="text-40">{quantity}개</span>
          <QuantityButtons onIncrement={handleIncrement} onDecrement={handleDecrement} />
        </div>
      </div>

      {/* 상인이 제안한 개당 가격 */}
      <div className="flex-col gap-1">
        <label className="text-20 text-gray-003">상인이 제안한 개당 가격</label>
        <div className="text-40 font-bold">{pricePerItem.toLocaleString()}원</div>
      </div>

      <Button text="완료했어요" onClick={() => {}} />
    </form>
  );
};

export default PriceForm;
