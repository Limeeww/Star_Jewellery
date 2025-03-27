import React from "react";
import { UseFormRegister } from "react-hook-form";
import { GiftOptionsForm } from "../../types/order";
import CheckboxField from "../FormComponents/CheckboxField";

interface GiftOptionsProps {
  register: UseFormRegister<GiftOptionsForm>;
}

function GiftOptions({ register } : GiftOptionsProps) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg mb-4">Gift Options</h2>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <CheckboxField label="Add gift packaging" id="giftPackaging" register={register("giftPackaging")} />
                    <p className="text-sm font-semibold">€3.50</p>
                </div>
                <div className="flex items-center justify-between">
                    <CheckboxField label="Add gift message" id="giftMessage" register={register("giftMessage")} />
                    <p className="text-sm font-semibold">Free</p>
                </div>
                <div className="flex items-center justify-between">
                    <CheckboxField label="Add free gift receipt" id="giftReceipt" register={register("giftReceipt")} />
                    <p className="text-sm font-semibold">Free</p>
                </div>
            </div>
        </div>
    );
}

export default GiftOptions;
