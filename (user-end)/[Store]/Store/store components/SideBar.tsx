"use client";
import { StoreType } from "@/app/(user-end)/types/store";
import Link from "next/link";
import React, { useState } from "react";

interface SideBarProps{
  MyStore: StoreType | null;
}

const Sidebar: React.FC<SideBarProps> = ({MyStore}) => {
  const [rating, setRating] = useState<number>(0); // State to track the rating

  // Function to handle star click
  const handleRating = (index: number) => {
    setRating(index);
    // console.log(`Rating selected: ${index}`);
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg space-y-6">
      {/* Coupon Highlights */}
      <div>
        <h2 className="text-lg font-semibold">Coupon Highlights</h2>
        <ul className="mt-2 space-y-1">
          <li>
            Best Discount: <span className="font-medium">{MyStore?.store_best_discount}</span>
          </li>
          <li>
            Coupon Codes: <span className="font-medium">{MyStore?.store_coupons_count}</span>
          </li>
          <li>
            Deals: <span className="font-medium">{MyStore?.store_deals_count}</span>
          </li>
          <li>
            Total Offers: <span className="font-medium">{MyStore?.store_total_offer_count}</span>
          </li>
        </ul>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-lg font-semibold">Top Instacart Discount FAQs</h2>
        <div className="mt-2 space-y-4">
          <div>
            <h3 className="font-medium">
              Are there any Instacart codes available right now?
            </h3>
            <p className="text-gray-600">
              Yes, as of August 9, 2024, there are 11 promo codes and 15 total
              promotions available.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              How many Instacart promo codes are valid to use for August of
              2024?
            </h3>
            <p className="text-gray-600">
              There are 11 coupons you can use to save on your current Instacart
              purchase.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              What is the most used Instacart discount code shoppers have used
              in August 2024?
            </h3>
            <p className="text-gray-600">
              Save $10 Off | CouponFollow Exclusive is the top coupon that can
              be applied right now for Instacart shoppers.
            </p>
          </div>
        </div>
      </div>

      {/* Curated By */}
      <div className="p-4 border border-gray-300 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Moderated By</h3>
        <p className="text-card-button">Imran Khan</p>
        <p className="text-gray-600">Contributor</p>
      </div>

      {/* Rating */}
      <div className="p-4 border border-gray-300 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Rate Instacart</h3>
        <div className="flex items-center mt-2">
          <div className="flex xl:space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                onClick={() => handleRating(i + 1)}
                className={`w-6 h-6 cursor-pointer ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.62a1 1 0 00.95.69h3.813c.969 0 1.371 1.24.588 1.81l-3.08 2.23a1 1 0 00-.364 1.118l1.175 3.62c.3.921-.755 1.688-1.539 1.118l-3.08-2.23a1 1 0 00-1.176 0l-3.08 2.23c-.784.57-1.838-.197-1.539-1.118l1.175-3.62a1 1 0 00-.364-1.118l-3.08-2.23c-.784-.57-.381-1.81.588-1.81h3.813a1 1 0 00.95-.69l1.175-3.62z" />
              </svg>
            ))}
          </div>
        </div>

        <div className="mt-2 text-gray-600">{MyStore?.store_average_rating}/5 (194 votes)</div>
      </div>

      {/* Can't find a code */}
      <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg shadow-md">
        <div className="text-lg font-semibold">Can't find a code?</div>
        <div className="flex justify-self-center w-1/2 py-1 text-white rounded-md bg-card-button hover:bg-card-button-hover md:w-1/4 lg:w-full text-center">
          <Link href="#">Request Code from Instacart</Link>
        </div>
      </div>

      {/* Connect with Instacart */}
      <div className="border border-gray-300 rounded-lg shadow-md">
        <div className="border-b">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Connect with Instacart</h3>
            <p className="text-gray-600">
              You are viewing current instacart.com coupons and discount
              promotions for August 2024. For more about Instacart visit
              Instacart Wikipedia page, and for its current promotions connect
              with them on X @instacart, Facebook, Pinterest or Instagram.
            </p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold">About {MyStore?.store_name}</h3>
          <p className="text-gray-600">
            {MyStore?.store_description}
          </p>
          <Link href="#" className="mt-2 block text-blue-600">
            Visit instacart.com
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
