"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import SelectField from "../../components/FormComponents/SelectField";
import SubmitButton from "../../components/FormComponents/SubmitButton";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ProductVariant } from "../../types/product";

export interface FormValues {
  size: string;
  inserts: string;
  materialColor: string;
}

interface Props {
  sizeOptions: { label: string; value: string }[];
  insertOptions: { label: string; value: string }[];
  materialColorOptions: { label: string; value: string }[];
  variant: ProductVariant;
  onAddToCart: (data: FormValues) => void;
  onInsertChange?: (value: string) => void;
  onColorChange?: (value: string) => void;
}

export default function VariantSelector({
  sizeOptions,
  insertOptions,
  materialColorOptions,
  variant,
  onAddToCart,
  onInsertChange,
  onColorChange,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      size: "",
      inserts: variant.insert,
      materialColor: variant.materialColor,
    },
  });

  return (
    <form onSubmit={handleSubmit(onAddToCart)} className="space-y-6">
      <div className="flex space-x-4">
        <Controller
          name="size"
          control={control}
          rules={{ required: "Size is required" }}
          render={({ field, fieldState }) => (
            <SelectField
              label="Available Sizes"
              id="size"
              value={field.value}
              onChange={field.onChange}
              options={sizeOptions}
              placeholder="Select size"
              className="w-1/2"
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="inserts"
          control={control}
          rules={{ required: "Insert is required" }}
          render={({ field, fieldState }) => (
            <SelectField
              label="Inserts"
              id="inserts"
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                onInsertChange?.(val);
              }}
              options={insertOptions}
              placeholder="Select insert"
              className="w-1/2"
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Controller
        name="materialColor"
        control={control}
        rules={{ required: "Color is required" }}
        render={({ field, fieldState }) => (
          <SelectField
            label="Material Color"
            id="materialColor"
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              onColorChange?.(val);
            }}
            options={materialColorOptions}
            placeholder="Select Material Color"
            className="w-full"
            error={fieldState.error?.message}
          />
        )}
      />

      <SubmitButton
        label={
          <>
            <AiOutlineShoppingCart className="inline mr-2 text-lg" />
            Add to basket
          </>
        }
        isLoading={false}
        className="w-full"
      />
    </form>
  );
}
