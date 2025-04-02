"use client";

import { JSX, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineStar,
  AiOutlineSend,
  AiOutlineCreditCard,
} from "react-icons/ai";
import SideModal from "../../components/SideModal/SideModal"; 
import { ReactNode } from "react";
import { IoIosArrowForward } from "react-icons/io";
interface InfoItem {
  title: string;
  icon: JSX.Element;
  text: ReactNode;
}

const infoItems: InfoItem[] = [
  {
    title: "Care",
    icon: <AiOutlineHeart size={20} />,
    text: (
      <>
        <p>
          To maintain the{" "}
          <span className="text-red-500 font-semibold">brilliance</span> of your
          exquisite jewelry, handle it with care. Use specialized cleaning
          solutions and store each piece separately in a soft pouch.
        </p>
        <p>
          Avoid exposure to harsh chemicals and water. Remember, salt water is
          especially damaging – give your treasures the attention they deserve!
        </p>
      </>
    ),
  },
  {
    title: "Warranty",
    icon: <AiOutlineStar size={20} />,
    text: (
      <>
        <p>
          Every piece of our{" "}
          <span className="text-blue-500 font-bold">SOVA jewelry</span> comes
          with an 18-month warranty, ensuring top quality and authenticity.
        </p>
        <p>
          <strong>Exchange:</strong> If you need a different size or wish to
          adjust the gold color (choose from red, white, or yellow), we offer
          hassle-free exchanges within the same model.
        </p>
        <p>
          <span className="text-green-500">Note:</span> Precious stone items are
          subject to an expert examination prior to exchange. Returns are not
          accepted per current Ukrainian legislation.
        </p>
      </>
    ),
  },
  {
    title: "Shipping",
    icon: <AiOutlineSend size={20} />,
    text: (
      <>
        <p>
          Enjoy international delivery by Ukrposhta – your jewelry will arrive
          safely within{" "}
          <span className="text-purple-500 font-semibold">10-40 days</span>.
        </p>
        <p>
          Orders are fully prepaid and not eligible for exchanges or returns.
          Benefit from <span className="text-purple-500">free delivery</span>{" "}
          and an extra 10% discount at checkout to cover customs fees.
        </p>
        <p>
          Please note that an additional tax of approximately 21.5% may apply in
          your country.
        </p>
      </>
    ),
  },
  {
    title: "Payment",
    icon: <AiOutlineCreditCard size={20} />,
    text: (
      <>
        <p>
          Secure your purchase using{" "}
          <span className="text-indigo-500 font-bold">Visa</span> or{" "}
          <span className="text-indigo-500 font-bold">MasterCard</span>.
        </p>
        <p>
          Payments are processed safely through the Plata by MONO system
          directly on our website.
        </p>
      </>
    ),
  },
];

const InfoBlocks = () => {
  const [selectedItem, setSelectedItem] = useState<InfoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: InfoItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mx-auto">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b border-gray-200 py-3 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => openModal(item)}
        >
          <div className="flex items-center space-x-2 text-gray-800">
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </div>
          <button
            type="button"
            className="text-sm px-4 py-1 hover:bg-gray-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              openModal(item);
            }}
          >
            <IoIosArrowForward size={16} className="text-gray-500" />
          </button>
        </div>
      ))}

      <SideModal isOpen={isModalOpen} onClose={closeModal}>
        {selectedItem && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedItem.title}</h2>
            <div className="text-sm leading-relaxed space-y-4">
              {selectedItem.text}
            </div>
          </div>
        )}
      </SideModal>
    </div>
  );
};

export default InfoBlocks;
