"use client";
import React from 'react';
import { StoreType } from "../../(user-end)/types/store";

// Define the props interface for the component
interface EmailAlertCardProps {
  MyStore: StoreType | null;
}

const EmailAlertCard: React.FC<EmailAlertCardProps> = ({ MyStore }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Email submitted!'); // Placeholder for actual submission logic
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-2 mt-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <span className="text-lg font-semibold text-gray-800 pb-2 md:pb-0">
          Get {MyStore?.store_name} Coupons
        </span>
        <form
          onSubmit={handleSubmit}
          className="flex justify-end"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-l-md p-2 text-gray-800 w-3/4"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailAlertCard;
