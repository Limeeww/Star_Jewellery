"use client";

import React from "react";

interface GenericListFormProps<T> {
  label?: string;
  items: T[];
  onChange: (newItems: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    onChangeItem: (newItem: T) => void
  ) => React.ReactNode;
  createNewItem: () => T;
  addButtonLabel?: string;
  removeButtonLabel?: string;
}

export default function GenericListForm<T>({
  label,
  items = [],
  onChange,
  renderItem,
  createNewItem,
  addButtonLabel = "Add",
  removeButtonLabel = "Remove",
}: GenericListFormProps<T>) {
  const handleAdd = () => {
    onChange([...items, createNewItem()]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, newItem: T) => {
    const newItems = [...items];
    newItems[index] = newItem;
    onChange(newItems);
  };

  return (
    <div className="my-4 w-full">
      {label && <h5 className="text-sm font-semibold mb-2">{label}</h5>}
      {items?.map((item, idx) => (
        <div key={idx} className="flex items-center mb-2 w-full">
          {renderItem(item, idx, (newItem) => handleItemChange(idx, newItem))}
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="text-red-500 text-xl flex items-center justify-center ml-2 mt-2 w-8 h-8 rounded-full hover:bg-red-100 transition"
            title={removeButtonLabel}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 px-3 py-1 bg-black hover:bg-gray-800 text-white text-sm"
      >
        {addButtonLabel}
      </button>
    </div>
  );
}
