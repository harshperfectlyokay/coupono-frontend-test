import React, { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { updateOfferFieldfromAPI } from "@/app/app-service/offerService";

interface Offer {
  _id?: string;
  offer_user_id?: string | null;
  offer_store_id?: string | null;
  offer_added_date?: Date;
  offer_updated_date?: string;
  offer_status?: string;
  offer_type?: string;
  offer_benefit?: string;
  offer_title?: string;
  offer_description?: string;
  offer_minimum_order?: number;
  offer_code?: string;
  offer_start_date?: string;
  offer_end_date?: Date;
  offer_link?: string;
  offer_category_id?: string;
  offer_tags?: string;
  offer_last_used_date?: string;
  offer_use_count?: string;
  offer_view_count?: string;
  offer_use_percent?: string;
  offer_working_percent?: string;
  offer_addedBy?: string;
  offer_isExpired?: number;
  offer_isChecked?: string;
  offer_isHidden?: string;
  offer_lastUpdate?: string;
  offer_addedOn?: string;
  offer_checkedBy?: string;
  offer_isVerified?: number;
}

interface Option {
  value: string | number;
  displayName: string;
}

interface EditEachOfferModalProps {
  onClose: () => void;
  Offer?: Offer;
  field?: keyof Offer;
  options?: Option[];
}

const EditEachOfferModal: React.FC<EditEachOfferModalProps> = ({
  onClose,
  Offer,
  field,
  options,
}) => {
  const [fieldValue, setFieldValue] = useState(
    Offer ? Offer[field as keyof Offer] : ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // const handleSave = async (fieldValue: any) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`/api/private/offer/update`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // body: JSON.stringify({ [field as string]: fieldValue }),
  //       body: JSON.stringify({
  //         id: Offer?._id,
  //         field: field,
  //         value: fieldValue,
  //       }),
  //     });

  //     const result = await response.json();
  //     if (result.success) {
  //       if (Offer && field) {
  //         const optionsMap = new Map(
  //           options?.map((option) => [option.value, option.displayName])
  //         );

  //         if (field === "offer_store_id" && optionsMap) {
  //           const formattedFieldValue =
  //             typeof fieldValue === "number"
  //               ? fieldValue.toString()
  //               : fieldValue;

  //           if (field === "offer_store_id" && optionsMap) {
  //             const displayName = optionsMap.get(formattedFieldValue);
  //             if (displayName) {
  //               fieldValue = displayName;
  //             }
  //           }
  //           (Offer as any)[field] =
  //             optionsMap.get(formattedFieldValue) || formattedFieldValue;
  //         } else {
  //           (Offer as any)[field] = fieldValue;
  //         }
  //       }
  //       onClose();
  //     } else {
  //       console.error("Error updating store: ", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating store: ", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSave = async (fieldValue: any) => {
    try {
      setIsLoading(true);
      if (Offer?._id && field) {
        const result = await updateOfferFieldfromAPI(Offer._id, field, fieldValue);
      if (result.status === 200 ) {
        if (Offer && field) {
          const optionsMap = new Map(
            options?.map((option) => [option.value, option.displayName])
          );
  
          if (field === "offer_store_id" && optionsMap) {
            const formattedFieldValue =
              typeof fieldValue === "number"
                ? fieldValue.toString()
                : fieldValue;
  
            const displayName = optionsMap.get(formattedFieldValue);
            if (displayName) {
              fieldValue = displayName;
            }
            (Offer as any)[field] =
              optionsMap.get(formattedFieldValue) || formattedFieldValue;
          } else {
            (Offer as any)[field] = fieldValue;
          }
        }
        onClose();
      } else {
        console.error("Error updating store: ", result.message);
      }
    }
    } catch (error) {
      console.error("Error updating store: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleValue = async () => {
    const toggledValue = fieldValue === 0 ? 1 : 0;
    setFieldValue(toggledValue);
    console.log(toggledValue)
    await handleSave(toggledValue);
  };

  useEffect(() => {
    if (field === "offer_isExpired" || field === "offer_isVerified") {
      toggleValue();
      onClose();
    }
  }, [field]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSave(fieldValue);
    }
  };

  const renderInputField = () => {
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [field]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center">
          <Spinner thickness={5} size={25} />
        </div>
      );
    }
    switch (field) {
      case "offer_type":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(e.target.value);
              handleSave(e.target.value);
            }}
          >
            <option value="DEAL">Deal</option>
            <option value="COUPON">Code</option>
          </select>
        );
      case "offer_status":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(e.target.value);
              handleSave(e.target.value);
            }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="PENDING">PENDING</option>
          </select>
        );

      case "offer_store_id":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(String(e.target.value));
              handleSave(String(e.target.value));
            }}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayName}
              </option>
            ))}
          </select>
        );

      case "offer_addedBy":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(e.target.value);
              handleSave(e.target.value);
            }}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Guest">Guest</option>
          </select>
        );

      // Date input cases
      case "offer_added_date":
      case "offer_end_date":
        return (
          <input
            type="date"
            className="w-full p-2 border rounded mb-4"
            value={new Date(fieldValue as Date).toISOString().substr(0, 10)}
            onChange={(e) => {
              const dateValue = new Date(e.target.value);
              setFieldValue(dateValue);
              handleSave(dateValue);
            }}
          />
        );

      case "offer_description":
        return (
          <>
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={fieldValue as string}
              onChange={(e) => setFieldValue(e.target.value)}
              ref={textareaRef}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleSave(fieldValue)}
              >
                Save
              </button>
            </div>
          </>
        );

      case "offer_code":
      case "offer_title":
      case "offer_minimum_order":
      case "offer_benefit":
      case "offer_link":
      case "offer_tags":
        return (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={fieldValue as string}
              onChange={(e) => setFieldValue(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleSave(fieldValue)}
              >
                Save
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (field === "offer_isExpired" || field === "offer_isVerified") {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-1/2 relative">
        <button
          className="absolute top-0 right-0 m-2 text-xl text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl mb-4">Edit {field?.replace("_", " ")}</h2>
        {renderInputField()}
      </div>
    </div>
  );
};

export default EditEachOfferModal;
