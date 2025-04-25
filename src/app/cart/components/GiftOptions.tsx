"use client";

import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { GiftOptionsForm } from "@/app/types/order";
import CheckboxField from "@/app/components/FormComponents/CheckboxField";
import TextareaToggle from "@/app/components/FormComponents/TextareaToggle";

interface GiftOptionsProps {
  register: UseFormRegister<GiftOptionsForm>;
  watch: UseFormWatch<GiftOptionsForm>;
}

export default function GiftOptions({ register, watch }: GiftOptionsProps) {
  const giftMessageChecked = watch("giftMessage", false);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold text-lg mb-4">Gift Options</h2>

      <div className="flex items-center justify-between mb-3">
        <CheckboxField
          label="Add gift packaging"
          id="giftPackaging"
          register={register("giftPackaging")}
        />
        <p className="text-sm font-semibold">50 ₴</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <CheckboxField
          label="Add free gift receipt"
          id="giftReceipt"
          register={register("giftReceipt")}
        />
        <p className="text-sm font-semibold">Free</p>
      </div>

      <div className="flex items-center justify-between">
        <CheckboxField
          label="Add gift message"
          id="giftMessage"
          register={register("giftMessage")}
        />
        <p className="text-sm font-semibold">Free</p>
      </div>

      {giftMessageChecked && (
        <TextareaToggle
          registration={register("giftMessageText")}
          maxLength={300}
        />
      )}
    </div>
  );
}
