// src/app/components/FormComponents/CollectionForm/ProductIdsForm.tsx
"use client";

import React from "react";
import GenericListForm from "@/app/components/FormComponents/GenericListForm";
import InputField from "@/app/components/FormComponents/InputField";

interface Props {
  productIds: number[];
  onChange: (ids: number[]) => void;
}

export default function CollectionProductIdForm({
  productIds,
  onChange,
}: Props) {
  return (
    <GenericListForm
      label="Product IDs"
      items={productIds}
      onChange={onChange}
      createNewItem={() => 0}
      addButtonLabel="Add Product ID"
      removeButtonLabel="Delete"
      renderItem={(id: number, idx: number, setId: (n: number) => void) => (
        <InputField
          type="number"
          value={id}
          onChange={(val) => setId(Number(val) || 0)}
          placeholder="0"
        />
      )}
    />
  );
}
