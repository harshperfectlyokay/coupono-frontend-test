import React from 'react';

interface Content {
  title: string;
  body: string;
}

interface ConfirmationProps {
  isShow: boolean;
  setIsShow: (show: boolean) => void;
  externalMethod: (arg: any) => Promise<void>;
  argument: any;
  content: Content;
  w?: string;
}

const Confirmation: React.FC<ConfirmationProps> = ({ isShow, setIsShow, externalMethod, argument, content, w }) => {
  // Handle the confirmation click
  const handleConfirm = async () => {
    await externalMethod(argument);
    setIsShow(false);
  };
  return (
    <div
      className={`fixed ${w && `w-[${w}]`} top-20 ${!isShow ? 'right-full hidden' : 'md:right-[40px] sm:right-1 block'} z-99 px-5 border-2 border-white bg-black text-white shadow-lg rounded-md`}
    >
      <div className="relative">
        <div className="border-b-2 p-4 text-xl font-semibold">
          <span className="mr-4">{content?.title}</span>
        </div>
        <div className="p-4 text-md">
          <p>{content?.body}</p>
          <div className="mt-4 flex items-center justify-end space-x-4">
            <button
              className="btn-green"
              onClick={handleConfirm}
            >
              Yes
            </button>
            <button
              className="btn-red"
              onClick={() => setIsShow(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="border-t-2 p-2 min-h-[40px] border-y-bodydark2"></div>
      </div>
    </div>
  );
};

export default Confirmation;
