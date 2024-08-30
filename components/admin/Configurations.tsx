"use client";
import React, { useState } from "react";

const Configuration = () => {
  const [toggleSmtp, setToggleSmtp] = useState(false);
  const [toggleKeys, setToggleKeys] = useState(false);

  return (
    <div className="rounded-sm border border-strokedark bg-boxdark shadow-default">
      <div className="flex flex-wrap w-full xl:border-l-2 border-stroke dark:border-strokedark">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <form>
            <div className="w-full p-4 mb-8 bg-white rounded-lg shadow-[0px_20px_95px_0px_rgba(201,203,204,0.30)] dark:bg-boxdark dark:bg-dark-2 dark:shadow-[0px_20px_95px_0px_rgba(0,0,0,0.30)] lg:px-6 xl:px-8">
              <button
                className={`faq-btn outline-none flex w-full text-left`}
                onClick={(e) => {
                  e.preventDefault();
                  setToggleSmtp(!toggleSmtp);
                }}
              >
                <div className="flex items-center justify-center w-full max-w-[40px] h-10 mr-5 rounded-lg bg-primary/5 text-primary dark:bg-white/5">
                  <svg
                    className={`duration-200 ease-in-out fill-primary stroke-primary ${toggleSmtp ? "rotate-180" : ""}`}
                    width="17"
                    height="10"
                    viewBox="0 0 17 10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                      fill=""
                      stroke=""
                    />
                  </svg>
                </div>

                <div className="w-full">
                  <h4 className="mt-1 text-lg font-semibold text-black dark:text-white">
                    {toggleSmtp ? "Hide " : "Show "}SMTP Settings
                  </h4>
                </div>
              </button>

              <div className={`duration-200 ease-in-out ${toggleSmtp ? "block" : "hidden"}`}>
                List of smtp settings
              </div>
            </div>
            <div className="w-full p-4 mb-8 bg-white rounded-lg shadow-[0px_20px_95px_0px_rgba(201,203,204,0.30)] dark:bg-boxdark dark:bg-dark-2 dark:shadow-[0px_20px_95px_0px_rgba(0,0,0,0.30)] lg:px-6 xl:px-8">
              <button
                className={`faq-btn outline-none flex w-full text-left`}
                onClick={(e) => {
                  e.preventDefault();
                  setToggleKeys(!toggleKeys);
                }}
              >
                <div className="flex items-center justify-center w-full max-w-[40px] h-10 mr-5 rounded-lg bg-primary/5 text-primary dark:bg-white/5">
                  <svg
                    className={`duration-200 ease-in-out fill-primary stroke-primary ${toggleKeys ? "rotate-180" : ""}`}
                    width="17"
                    height="10"
                    viewBox="0 0 17 10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                      fill=""
                      stroke=""
                    />
                  </svg>
                </div>

                <div className="w-full">
                  <h4 className="mt-1 text-lg font-semibold text-black dark:text-white">
                    {toggleKeys ? "Hide " : "Show "}Keys
                  </h4>
                </div>
              </button>

              <div className={`duration-200 ease-in-out ${toggleKeys ? "block" : "hidden"}`}>
                List of keys settings
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
