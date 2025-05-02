// MultiEmailInput.js
import React, { useRef, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MultiEmailInput = ({ label, emails, setEmails }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  const addEmail = (email) => {
    email = email.trim();
    if (email && emailRegex.test(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addEmail(input);
    } else if (e.key === "Backspace" && !input && emails.length) {
      setEmails(emails.slice(0, -1));
    }
  };

  const removeEmail = (idx) => {
    setEmails(emails.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
          {label}
        </label>
      )}
      <div
        className="flex flex-wrap items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-2.5 min-h-[48px] focus-within:ring-2 focus-within:ring-blue-500"
        onClick={() => inputRef.current.focus()}
      >
        {emails.map((email, idx) => (
          <span
            key={email}
            className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-1 mb-1"
          >
            {email}
            <button
              type="button"
              className="ml-1 text-blue-500 hover:text-red-500"
              onClick={() => removeEmail(idx)}
              aria-label="Remove email"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-900 dark:text-gray-900"
          placeholder="Type email and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addEmail(input)}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Enter, comma, or space to add each email.
      </p>
    </div>
  );
};

export default MultiEmailInput;
