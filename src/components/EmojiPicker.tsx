"use client";
import { useState, useRef, useEffect } from "react";
import { XIcon } from "./icons";

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🙏", "🎉", "🔥"];

const EMOJI_CATEGORIES = {
  "Smileys": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
  "Gestures": ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤝", "💪", "🙏", "✍️", "💅", "🤳"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  "Reactions": ["😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬"],
  "Objects": ["🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🎮", "🎯", "🎲", "🧩", "♟️", "🎭", "🎨", "🧵", "🧶", "🎼", "🎵", "🎶", "🎤", "🎧"],
  "Symbols": ["🔥", "⭐", "💫", "✨", "💥", "💢", "💯", "✔️", "✅", "❌", "❗", "❓", "⚠️", "🚫", "💤", "💨", "🕐", "⏰", "⏱️", "⏲️", "🔔", "🔕"],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  quickReaction?: boolean;
}

export function EmojiPicker({ onEmojiSelect, onClose, quickReaction = false }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("Smileys");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (quickReaction) {
    return (
      <div
        ref={pickerRef}
        className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 flex gap-1 animate-scaleIn z-50"
      >
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-lg transition-all hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleIn z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-900">Emoji Picker</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <XIcon size={18} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-1 p-2 border-b border-gray-200 overflow-x-auto">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeCategory === category
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-3 h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => {
                onEmojiSelect(emoji);
                onClose();
              }}
              className="w-9 h-9 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-lg transition-all hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-1">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onEmojiSelect(emoji);
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-200 rounded-lg transition-all hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
