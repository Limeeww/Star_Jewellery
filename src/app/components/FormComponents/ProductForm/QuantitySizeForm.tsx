"use client";

import React from "react";
import { QuantitySize } from "@/types/product";

interface Props {
  quantitySize: QuantitySize[];
  onChange: (newQuantitySize: QuantitySize[]) => void;
}

export default function QuantitySizeForm({ quantitySize, onChange }: Props) {
  const handleChange = (
    index: number,
    field: keyof QuantitySize,
    value: number
  ) => {
    const updated = [...quantitySize];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleAdd = () => {
    const updated = [...quantitySize, { size: 0, quantity: 0 }];
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = quantitySize.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <h5 className="text-sm font-semibold mt-4 mb-1">Sizes & Quantities</h5>

      {quantitySize.map((qs, index) => (
        <div key={index} className="flex items-center gap-4 mb-2">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-600">Size</label>
              <input
                type="number"
                min={1}
                value={qs.size}
                onChange={(e) =>
                  handleChange(index, "size", parseInt(e.target.value))
                }
                className="border p-1 rounded w-20"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600">Quantity</label>
              <input
                type="number"
                min={0}
                value={qs.quantity}
                onChange={(e) =>
                  handleChange(index, "quantity", parseInt(e.target.value))
                }
                className="border p-1 rounded w-20"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-red-500 text-xl ml-2 mt-4 flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-100 transition"
            title="Delete Size"
          >
            🗑
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
      >
        Add Size & Quantity
      </button>
    </div>
  );
}
