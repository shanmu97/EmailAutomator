import React from 'react';

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  ...props
}) => (
  <div className="mb-4">
    {label && (
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-black dark:placeholder-gray-400 dark:text-black"
      {...props}
    />
  </div>
);

export default Input;
