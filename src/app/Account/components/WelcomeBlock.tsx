import React, { JSX } from "react";
import { signOutUser } from "@/utils/index";
import { useRouter } from "next/navigation";

interface WelcomeBlockProps {
  firstName?: string;
  lastName?: string;
}

function WelcomeBlock({ firstName, lastName }: WelcomeBlockProps): JSX.Element {
  const router = useRouter();

  return (
    <div
      className="p-6 mb-8 flex justify-center"
      style={{ backgroundColor: "#e8e7e749" }}
    >
      <div className="w-3/4 text-center">
        <h2
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          WELCOME, {firstName ?? ""} {lastName ?? ""}
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          In your My Star account, you can manage your personal details and view
          your orders in one place. Feel free to explore your profile, update
          your addresses, bonuses, manage your wish list, and more.
        </p>
        <button
          onClick={() => signOutUser(router)}
          className="bg-black text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
}

export default WelcomeBlock;
