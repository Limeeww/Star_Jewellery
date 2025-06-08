"use client";
import { useState } from "react";
import ActionButton from "../ActionButton";
import InputField from "../InputField";

export default function JewelryAssistantChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allowedKeywords = [
    "jewelry",
    "hi",
    "hello",
    "help",
    "morning",
    "ring",
    "earrings",
    "jewelry",
    "gift",
    "stone",
    "gold",
    "silver",
    "bracelet",
    "pendants",
    "necklace",
    "gemstone",
    "diamond",
    "pearl",
    "ruby",
    "sapphire",
    "emerald",
    "gift",
    "fashion",
    "style",
    "accessories",
    "trends",
    "price",
    "present",
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const isJewelryRelated = allowedKeywords.some((word) =>
      input.toLowerCase().includes(word)
    );

    if (!isJewelryRelated) {
      setMessages((prev) => [
        ...prev,
        `You: ${input}`,
        "Assistant: Sorry, I can only help to find your perfect jewelry.",
      ]);
      setInput("");
      return;
    }

    setMessages((prev) => [...prev, `You: ${input}`]);
    setLoading(true);

    const res = await fetch("/api/assistant", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });
    console.log(">> Статус ответа OpenAI:", res);

    const data = await res.json();
    setMessages((prev) => [...prev, `Assistant: ${data.reply}`]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="border p-2 h-96 overflow-y-scroll bg-white">
        {messages.map((msg, i) => (
          <p key={i} className="mb-1">
            {msg}
          </p>
        ))}
        {loading && <p>Assistant is writing...</p>}
      </div>
      <div className="flex mt-4 gap-2 items-center">
        <InputField
          value={input}
          onChange={setInput}
          placeholder="Ask about jewelry..."
        />
        <ActionButton
          text={"Send"}
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2"
        />
      </div>
    </div>
  );
}
