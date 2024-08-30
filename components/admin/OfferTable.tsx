"use client";

import { useEffect, useState } from "react";
import {
  FaCheck,
  FaClone,
  FaPencilAlt,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import Pagination from "./pagination";
import SortableHeader from "./sortColumns";
import EditEachOfferModal from "./EditEachOfferModal";
import DatePicker from "./DatePicker";
import DropDown from "./dropDownMenu";
import { cloneOfferServicefromAPI, deleteOfferServicefromAPI, fetchOffersfromAPI } from "@/app/app-service/offerService";


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
interface Filters {
  addedBy: string;
  store: string;
  type: string;
  tags: string;
  status: string;
  lastCheck: Date | null;
}

const OfferTable: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    addedBy: "",
    store: "",
    type: "",
    tags: "",
    status: "",
    lastCheck: null,
  });
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [storeOptions, setStoreOptions] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  const [isEditModalOpen, setIsEditModalOpen] = useState<Boolean>(false);
  const [editField, setEditField] = useState<keyof Offer | undefined>(
    undefined
  );
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc" | null;
  }>({
    field: "",
    direction: null,
  });
  const itemsPerPage = 25;

  const handleMouseEnter = (index: any) => setHoveredRowIndex(index);
  const handleMouseLeave = () => setHoveredRowIndex(null);

  useEffect(() => {
    fetchOffers(currentPage, sort.field, sort.direction);
  }, [currentPage, sort]);

  async function fetchOffers(
    page: number,
    sortField: string,
    sortDirection: "asc" | "desc" | null
  ) {
    setLoading(true);
    try {
      const {data} = await fetchOffersfromAPI(
        page,
        itemsPerPage,
        sortField,
        sortDirection,
        filters
      );
      console.log("data at table - " , data)
      setOffers(data.offers);
      setStoreOptions(data.offerOfStore);
      setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
    } catch (error) {
      console.log("Unable to fetch offer")
    } finally {
      setLoading(false);
    }
  }

  const openModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(undefined);
  };

  const handleLastCheckChange = (date: Date | null) => {
    setFilters((prev) => ({ ...prev, lastCheck: date }));
  };

  const openEditModal = (field: keyof Offer, offer: Offer) => {
    setEditField(field);
    setSelectedOffer(offer);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditField(undefined);
    setSelectedOffer(undefined);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSort({ field, direction });
  };

  const handleAddedByChange = (value: string) => {
    setFilters((prev) => ({ ...prev, addedBy: value }));
  };

  const handleStoreChange = (value: string) => {
    setFilters((prev) => ({ ...prev, store: value }));
  };

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, type: value }));
  };

  const handleTagsChange = (value: string) => {
    setFilters((prev) => ({ ...prev, tags: value }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const applyFilters = () => {
    fetchOffers(currentPage, sort.field, sort.direction);
  };


  const cloneOffer = async (offerToClone: Offer) => {
    try {
      const result = await cloneOfferServicefromAPI(offerToClone);
      if (result.status === 200) {
        setOffers((prevOffers) => {
          const originalIndex = prevOffers.findIndex(
            (offer) => offer._id === offerToClone._id
          );
  
          if (originalIndex === -1) {
            return [result.data, ...prevOffers];
          }
  
          const updatedOffers = [...prevOffers];
          updatedOffers.splice(originalIndex + 1, 0, result.data);
  
          return updatedOffers;
        });
      } else {
        console.error("Failed to clone offer:", result.message);
      }
    } catch (error) {
      console.error("An error occurred while cloning the offer:", error);
    }
  };

  const deleteOffer = async (offerId: any) => {
    try {
      const result = await deleteOfferServicefromAPI(offerId);

      if (result.status === 200) {
        setOffers((prevOffers) =>
          prevOffers.filter((offer) => offer._id !== offerId)
        );
      } else {
        console.error("Failed to delete offer:", result);
      }
    } catch (error) {
      console.error("An error occurred while deleting the offer:", error);
    }
  };

  return (
    <div className="container px-1 py-4 mx-auto">
      <div className="flex flex-wrap space-y-2 space-x-2 py-2">
        <DropDown
          title="Added By"
          options={[
            { value: "", displayName: "Select" },
            { value: "superAdmin", displayName: "Super Admin" },
          ]}
          onChange={handleAddedByChange}
        />
        <DropDown
          title="Stores"
          options={[
            ...storeOptions?.map((store: any) => ({
              value: store.id,
              displayName: store.name,
            })),
          ]}
          onChange={handleStoreChange}
        />
        <DropDown
          title="Type"
          options={[
            { value: "", displayName: "" },
            { value: "DEAL", displayName: "DEAL" },
            { value: "COUPON", displayName: "CODE" },
          ]}
          onChange={handleTypeChange}
        />
        <DropDown
          title="Tags"
          options={[
            { value: "", displayName: "" },
            { value: "sitewide", displayName: "Sitewide" },
            { value: "select-products", displayName: "Select Products" },
            { value: "clearance", displayName: "Clearance" },
            { value: "exclusive", displayName: "Exclusive" },
            { value: "flash-sale", displayName: "Flash Sale" },
            { value: "free-gift", displayName: "Free Gift" },
            { value: "free-shipping", displayName: "Free Shipping" },
            { value: "new-users", displayName: "New Users" },
            { value: "bogo", displayName: "BOGO" },
            { value: "autumn", displayName: "Autumn" },
            { value: "back-to-school", displayName: "Back to School" },
            { value: "black-friday", displayName: "Black Friday" },
            { value: "christmas", displayName: "Christmas" },
            { value: "cyber-monday", displayName: "Cyber Monday" },
            { value: "diwali", displayName: "Diwali" },
            { value: "easter", displayName: "Easter" },
            { value: "fall", displayName: "Fall" },
            { value: "fathers-day", displayName: "Fathers Day" },
            { value: "halloween", displayName: "Halloween" },
            { value: "independence-day", displayName: "Independence Day" },
            { value: "labor-day", displayName: "Labor Day" },
            { value: "members-only", displayName: "Members Only" },
            { value: "memorial-day", displayName: "Memorial Day" },
            { value: "mothers-day", displayName: "Mothers Day" },
            { value: "new-year", displayName: "New Year" },
            { value: "presidents-day", displayName: "Presidents Day" },
            { value: "spring", displayName: "Spring" },
            { value: "summer", displayName: "Summer" },
            { value: "thanksgiving", displayName: "Thanksgiving" },
            { value: "valentines-day", displayName: "Valentines Day" },
            { value: "veterans-day", displayName: "Veterans Day" },
            { value: "winter", displayName: "Winter" },
            { value: "womens-day", displayName: "Womens Day" },
            { value: "tocheck", displayName: "tocheck" },
          ]}
          onChange={handleTagsChange}
        />
        <DropDown
          title="Status"
          options={[
            { value: "", displayName: "" },
            { value: "ACTIVE", displayName: "ACTIVE" },
            { value: "PENDING", displayName: "PENDING" },
            { value: "INACTIVE", displayName: "INACTIVE" },
          ]}
          onChange={handleStatusChange}
        />

        <DatePicker title="Last Check" onChange={handleLastCheckChange} />
        <button className="btn-primary" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>
      <div className="overflow-x-auto sm:w-full">
        {loading && <h1 className="animate-pulse">Loading...</h1>}
        {!loading && offers?.length > 0 && (
          <>
            <table
              id="offersTable"
              className="w-full overflow-x-auto table-fixed"
            >
              <thead>
                <tr className="bg-stone-700 text-white text-left">
                  <th className="px-1 py-2 border w-16">ID</th>
                  <SortableHeader
                    title="Date"
                    sortField="offer_added_date"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-16"
                  />
                  <SortableHeader
                    title="Added By"
                    sortField="offer_addedBy"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-24"
                  />
                  <SortableHeader
                    title="Store"
                    sortField="offer_store_id"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-16"
                  />
                  <SortableHeader
                    title="Type"
                    sortField="offer_type"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-16"
                  />
                  <SortableHeader
                    title="Title"
                    sortField="offer_title"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                  <SortableHeader
                    title="Description"
                    sortField="offer_description"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-24"
                  />
                  <SortableHeader
                    title="Min Order"
                    sortField="offer_minimum_order"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-24"
                  />
                  <SortableHeader
                    title="Benefit"
                    sortField="offer_benefit"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-16"
                  />
                  <SortableHeader
                    title="Code"
                    sortField="offer_code"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-24"
                  />
                  <SortableHeader
                    title="Status"
                    sortField="offer_status"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-18"
                  />
                  <SortableHeader
                    title="Expired"
                    sortField="offer_isExpired"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                  <SortableHeader
                    title="Verified"
                    sortField="offer_isVerified"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                  <SortableHeader
                    title="Expiry Date"
                    sortField="offer_end_date"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                  <SortableHeader
                    title="Tags"
                    sortField="offer_tags"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                  <SortableHeader
                    title="Link"
                    sortField="offer_link"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                  <SortableHeader
                    title="Working %"
                    sortField="offer_working_percent"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                  <SortableHeader
                    title="Use %"
                    sortField="offer_use_percent"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-16"
                  />
                  <SortableHeader
                    title="Last Used"
                    sortField="offer_last_used_date"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-20"
                  />
                </tr>
              </thead>
              <tbody>
                {offers &&
                  offers.map((offer, index) => (
                    <tr
                      key={index}
                      className="bg-slate-100 hover:bg-white border"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <td
                        className="text-sm w-16 h-48 overflow-hidden truncate relative"
                        title={offer?._id ? offer._id : ""}
                      >
                        {offer._id ? offer._id : ""}

                        {hoveredRowIndex === index && (
                          <div className="absolute bottom-1 left-1 right-1 flex justify-center space-x-2">
                            <button
                              className="text-blue-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                cloneOffer(offer);
                              }}
                            >
                              <FaClone size={16} />
                            </button>
                            <button
                              className="text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteOffer(offer._id);
                              }}
                            >
                              <FaTrashAlt size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td
                        className="text-sm text-center w-16 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_added_date", offer)}
                      >
                        {offer.offer_added_date
                          ? new Date(
                              offer.offer_added_date
                            ).toLocaleDateString()
                          : "N/A"}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={12}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm w-24 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_addedBy", offer)}
                      >
                        {offer.offer_addedBy}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={12}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm px-1 py-4 w-16 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_store_id", offer)}
                      >
                        {offer.offer_store_id}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm text-center px-1 py-4 w-16 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_type", offer)}
                      >
                        {offer.offer_type === "COUPON" ? "Code" : "Deal"}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="w-20 h-48 px-1 py-4 overflow-hidden truncate relative text-center"
                        onClick={() => openEditModal("offer_title", offer)}
                      >
                        <div className="h-full overflow-hidden text-ellipsis">
                          <p
                            className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-normal break-words"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {offer.offer_title}
                          </p>
                        </div>
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="w-24 h-48 px-1 py-4 overflow-hidden truncate relative text-center"
                        onClick={() =>
                          openEditModal("offer_description", offer)
                        }
                      >
                        <div className="h-full overflow-hidden text-ellipsis">
                          <p
                            className="text-sm overflow-hidden text-ellipsis whitespace-normal break-words"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {offer.offer_description}
                          </p>
                        </div>
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm text-center px-1 py-4 w-24 h-48 overflow-hidden truncate relative"
                        onClick={() =>
                          openEditModal("offer_minimum_order", offer)
                        }
                      >
                        {offer.offer_minimum_order}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm text-center px-1 py-4 w-16 h-48 overflow-hidden  truncate relative"
                        onClick={() => openEditModal("offer_benefit", offer)}
                      >
                        {offer.offer_benefit}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm text-center px-1 py-4 w-24 h-48 overflow-hidden truncate relative"
                        onClick={() => {
                          if (offer.offer_type === "COUPON")
                            openEditModal("offer_code", offer);
                        }}
                      >
                        {offer.offer_code}
                        {hoveredRowIndex === index &&
                          offer.offer_type === "COUPON" && (
                            <FaPencilAlt
                              size={14}
                              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            />
                          )}
                      </td>
                      <td
                        className="text-sm text-center px-1 py-4 w-18 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_status", offer)}
                      >
                        {offer.offer_status}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm text-center px-1 py-4 w-20 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_isExpired", offer)}
                      >
                        {offer.offer_isExpired === 0 ? (
                          <FaTimes size={14} className="text-red-500" />
                        ) : (
                          <FaCheck size={14} className="text-green-500" />
                        )}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm text-center px-1 py-4 w-20 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_isVerified", offer)}
                      >
                        {offer.offer_isVerified === 0 ? (
                          <FaTimes size={14} className="text-red-500" />
                        ) : (
                          <FaCheck size={14} className="text-green-500" />
                        )}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm px-1 py-4 w-20 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_end_date", offer)}
                      >
                        {offer.offer_end_date
                          ? new Date(offer.offer_end_date).toLocaleDateString()
                          : "N/A"}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm px-1 py-4 w-20 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_tags", offer)}
                      >
                        {offer.offer_tags}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td
                        className="text-sm px-1 py-4 w-20 h-48 overflow-hidden truncate relative"
                        onClick={() => openEditModal("offer_link", offer)}
                      >
                        {offer.offer_link}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                          />
                        )}
                      </td>
                      <td className="text-sm px-1 py-4 w-20 h-48 overflow-hidden truncate relative">
                        {offer.offer_working_percent}
                      </td>
                      <td className="text-sm px-1 py-4 w-16 h-48 overflow-hidden truncate relative">
                        {offer.offer_use_percent}
                      </td>
                      <td className="text-sm px-1 py-4 w-20 h-48 overflow-hidden truncate relative">
                        {offer.offer_last_used_date}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
        {isEditModalOpen && (
          <EditEachOfferModal
            onClose={closeEditModal}
            Offer={selectedOffer}
            field={editField}
            options={storeOptions.map((store: any) => ({
              value: store.id,
              displayName: store.name,
            }))}
          />
        )}

        {!loading && offers && offers.length === 0 && (
          <h2 className="text-center p-2 text-lg font-medium text-opacity-80 text-black">
            No Offers in database
          </h2>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        entryCount={offers.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OfferTable;
