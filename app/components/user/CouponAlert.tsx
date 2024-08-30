// CouponAlert.js
"use client";

import Link from "next/link";

const CouponAlert = () => {
  return (
    <div className="bg-gray-900 text-white p-8 rounded-b-lg shadow-lg w-full text-center mx-auto mt-4">
      {/* <div className="mb-4">
        <Image
          src="/ebay-logo.png"
          alt="eBay Logo"
          className="mx-auto mb-4 w-16 h-auto"
        />
      </div> */}
      <h2 className="text-lg font-bold mb-4">
        Get coupon alerts for eBay and never miss another deal!
      </h2>
      <div className="flex justify-center items-center mb-4">
        <input
          type="email"
          placeholder="Enter email address"
          className="w-2/3 p-2 border border-gray-300 rounded-l-lg text-gray-900"
        />
        <button className="bg-blue-100 text-blue-600 border border-blue-100 border- px-4 py-2 rounded-r-lg font-semibold">
          Get Alerts
        </button>
      </div>
      <p className="text-sm text-gray-400">
        No spam, just savings. Read our{" "}
        <Link href="#" className="underline">
          Privacy Policy
        </Link>{" "}
        for more info.
      </p>
    </div>
  );
};

export default CouponAlert;
