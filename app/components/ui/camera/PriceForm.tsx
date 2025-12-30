"use client";

import QuantityButtons from "@/app/components/shared/QuantityButtons";
import NumericKeypad from "@/app/components/shared/NumericKeypad";
import React, { useState, useMemo } from "react";

interface PriceFormProps {
  totalPrice?: number;
  onSubmit?: (data: { totalPrice: number; quantity: number; pricePerItem: number }) => void;
}

const PriceForm = ({ totalPrice: initialTotalPrice = 8000, onSubmit }: PriceFormProps) => {
  const [totalPrice, setTotalPrice] = useState<number>(initialTotalPrice);
  const [quantity, setQuantity] = useState<number>(1);
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const [isFirstInput, setIsFirstInput] = useState<boolean>(false);

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

  const handleNumberClick = (num: string) => {
    if (isFirstInput) {
      setIsFirstInput(false);
      setTotalPrice(parseInt(num));
    } else {
      setTotalPrice((prev) => prev * 10 + parseInt(num));
    }
  };

  const handleBackspace = () => {
    setTotalPrice((prev) => Math.floor(prev / 10));
  };

  const handleDoubleZero = () => {
    setTotalPrice((prev) => prev * 100);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-8">
      {/* 상인이 제안한 전체 가격 */}
      <div className="flex-col gap-1 animate-fade-in-up">
        <label className="text-20 text-gray-003">상인이 제안한 전체 가격</label>
        <button
          type="button"
          onClick={() => {
            setShowKeypad(!showKeypad);
            setIsFirstInput(true);
          }}
          className="text-left text-40 font-bold hover:opacity-80 transition-opacity"
        >
          {totalPrice.toLocaleString()}원
        </button>
      </div>

      {/* 숫자 키패드 오버레이 */}
      {showKeypad && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => {
            setShowKeypad(false);
            setIsFirstInput(false);
          }}
        >
          <div
            className="fixed bottom-0 left-0 right-0 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <NumericKeypad
              onNumberClick={handleNumberClick}
              onBackspace={handleBackspace}
              onDoubleZero={handleDoubleZero}
            />
          </div>
        </div>
      )}

      {/* 구매할 상품의 갯수 */}
      <div className="flex-col gap-1 space-between animate-fade-in-up-delay-1">
        <label className="text-20 text-gray-003">구매할 상품의 갯수</label>
        <div className="flex-row items-center gap-2 justify-between font-bold">
          <span className="text-40">{quantity}개</span>
          <QuantityButtons onIncrement={handleIncrement} onDecrement={handleDecrement} />
        </div>
      </div>

      {/* 상인이 제안한 개당 가격 */}
      <div className="flex-col gap-1 animate-fade-in-up-delay-2">
        <label className="text-20 text-gray-003">상인이 제안한 개당 가격</label>
        <div className="text-40 font-bold">{pricePerItem.toLocaleString()}원</div>
      </div>
    </form>
  );
};

export default PriceForm;
