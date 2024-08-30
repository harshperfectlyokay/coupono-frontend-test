"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaEdit, FaPause, FaPencilAlt, FaPlay } from "react-icons/fa";
import StoreModal from "./editStoreModel";
import EditEachStoreModal from "./EditEachStoreModal";
import Pagination from "./pagination";
import SortableHeader from "./sortColumns";
import TextBox from "./textBox";
import DropDown from "./dropDownMenu";
import DatePicker from "./DatePicker";
import ExportStoresModal from "./modals/ExportStoresModal";
import {
  fetchStoresFromAPI,
  toggleStoreStatus,
} from "@/app/app-service/storeService";

interface Store {
  _id: string;
  name: string;
  store_website: string;
  store_logo: string;
  store_description: string;
  store_affiliate_link: string;
  store_category: number;
  slug: string;
  status: string;
  store_priority_score: number;
  store_search_target: string;
  store_best_discount: number;
  store_tags: string;
  store_facebook: string;
  store_instagram: string;
  store_twitter: string;
  store_youtube: string;
  store_tiktok: string;
  store_email: string;
  store_phone_number: string;
  store_address: string;
  store_help_desk: string;
  store_contact_page: string;
  store_country: string;
  store_last_updated: Date;
  store_last_checked: Date;
  store_saving_tips: string;
  store_how_to_use_coupon: string;
  store_faq: string;
  store_payment_modes: string;
  store_program_platform: number;
}
interface Filters {
  name: string;
  status: string;
  priority: string;
  target: string;
  category: string;
  lastCheck: Date | null;
}

type StoreColumn = {
  key: keyof Store;
  displayName: string;
};

const StoreTable: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    name: "",
    status: "",
    priority: "",
    target: "",
    category: "",
    lastCheck: null,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [isEditModalOpen, setIsEditModalOpen] = useState<Boolean>(false);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [editField, setEditField] = useState<keyof Store | undefined>(
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const itemsPerPage = 25;

  const columns: StoreColumn[] = [
    { key: "_id", displayName: "ID" },
    { key: "store_logo", displayName: "Logo" },
    { key: "name", displayName: "Name" },
    { key: "status", displayName: "Status" },
    { key: "store_priority_score", displayName: "Priority" },
    { key: "store_search_target", displayName: "Search Target" },
    { key: "store_category", displayName: "Category" },
    { key: "store_program_platform", displayName: "Program" },
    { key: "store_tags", displayName: "Tags" },
    { key: "store_last_checked", displayName: "Last Checked" },
  ];

  const handleMouseEnter = (index: any) => setHoveredRowIndex(index);
  const handleMouseLeave = () => setHoveredRowIndex(null);

  async function fetchStores(
    page: number,
    sortField: string,
    sortDirection: "asc" | "desc" | null
  ) {
    setLoading(true);
    try {
      const { data } = await fetchStoresFromAPI(
        page,
        itemsPerPage,
        sortField,
        sortDirection,
        filters
      );
      console.log(data);
      setStores(data.stores);
      setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
      setCategories(data.categories);
    } catch (error) {
      console.log("Error occurred while getting stores:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleStatus = async (store: Store) => {
    try {
      const newStatus = store.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      const result = await toggleStoreStatus(store._id, newStatus);

      if (result.status === 200) {
        setStores((prevStores) =>
          prevStores.map((str) =>
            str._id === store._id ? { ...str, status: newStatus } : str
          )
        );
      }
    } catch (error) {
      console.error("Error updating store status: ", error);
    }
  };

  useEffect(() => {
    fetchStores(currentPage, sort.field, sort.direction);
  }, [currentPage, sort]);

  const openModal = (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStore(undefined);
  };

  const openEditModal = (field: keyof Store, store: Store) => {
    setEditField(field);
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditField(undefined);
    setSelectedStore(undefined);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSort({ field, direction });
  };

  const handleNameChange = (value: string) => {
    setFilters((prev) => ({ ...prev, name: value }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const handlePriorityChange = (value: string) => {
    setFilters((prev) => ({ ...prev, priority: value }));
  };

  const handleTargetChange = (value: string) => {
    setFilters((prev) => ({ ...prev, target: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const handleLastCheckChange = (date: Date | null) => {
    setFilters((prev) => ({ ...prev, lastCheck: date }));
  };
  const applyFilters = () => {
    fetchStores(currentPage, sort.field, sort.direction);
  };
  const exportToExcel = async (selectedColumns: string[]) => {
    const res = await fetch(`/api/private/store?all=true`);
    const data = await res.json();
    console.log(data.stores.length);
    setAllStores(data.stores);
    console.log(allStores.length);
    if (allStores.length > 0) {
      const filteredStores = allStores.map((store: Store) => {
        const result: Record<string, any> = {};
        selectedColumns.forEach((column) => {
          const columnInfo = columns.find((col) => col.displayName === column);
          if (columnInfo) {
            const value = store[columnInfo.key];

            if (
              columnInfo.key === "store_last_checked" &&
              value instanceof Date
            ) {
              result[columnInfo.displayName] = value.toLocaleDateString();
            } else {
              result[columnInfo.displayName] = value;
            }
          }
        });
        return result;
      });

      const ws = XLSX.utils.json_to_sheet(filteredStores);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Stores");
      XLSX.writeFile(wb, "stores.xlsx");
      // console.log("done")
    }
  };

  return (
    <div className="container px-2 py-4 mx-auto">
      <div className="flex flex-wrap space-y-2 space-x-2 py-2">
        <TextBox title="Name" onChange={handleNameChange} />
        <DropDown
          title="Status"
          options={[
            { value: "", displayName: "Select" },
            { value: "ACTIVE", displayName: "ACTIVE" },
            { value: "PAUSED", displayName: "PAUSED" },
          ]}
          onChange={handleStatusChange}
        />
        <DropDown
          title="Priority"
          options={[
            { value: "", displayName: "Select" },
            { value: "0", displayName: "LOW" },
            { value: "0.5", displayName: "MODERATE" },
            { value: "1", displayName: "HIGH" },
          ]}
          onChange={handlePriorityChange}
        />
        <DropDown
          title="Target"
          options={[
            { value: "", displayName: "Select" },
            { value: "organic-paid", displayName: "Organic & Paid" },
            { value: "organic", displayName: "Organic" },
            { value: "paid", displayName: "Paid" },
          ]}
          onChange={handleTargetChange}
        />
        <DropDown
          title="Category"
          options={[
            ...categories?.map((category: any) => ({
              value: category.id,
              displayName: category.name,
            })),
          ]}
          onChange={handleCategoryChange}
        />
        <DatePicker title="Last Check" onChange={handleLastCheckChange} />
        <button className="btn-primary" onClick={applyFilters}>
          Apply Filters
        </button>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="btn-primary"
        >
          Export
        </button>
      </div>
      <div className="overflow-x-auto sm:w-full">
        {loading && (
          <table className="max-w-min md:min-w-full">
            <thead>
              <tr className="bg-gray-300 text-white text-left">
                <th className="px-4 py-2 border">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
                <th className="px-4 py-2 border">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
                <th className="px-4 py-2 border">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="bg-slate-100 border animate-pulse">
                  <td className="text-sm px-4 py-4">
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="bg-gray-300 h-12 w-48 rounded"></div>
                  </td>
                  <td className="text-sm px-4 py-4">
                    <div className="bg-gray-300 h-4 w-48 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && stores?.length > 0 && (
          <>
            <table id="userTable" className="max-w-min md:min-w-full">
              <thead>
                <tr className="bg-stone-700 text-white text-left">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Logo</th>
                  <SortableHeader
                    title="Name"
                    sortField="name"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Status"
                    sortField="status"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Priority"
                    sortField="store_priority_score"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Target"
                    sortField="store_search_target"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Category"
                    sortField="store_category"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Program"
                    sortField="store_program_platform"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Tags"
                    sortField="store_tags"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Last Check"
                    sortField="store_last_checked"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores &&
                  stores.map((store, index) => (
                    <tr
                      key={index}
                      className="bg-slate-100 hover:bg-white border"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <td className="text-sm px-4 py-4">{store._id}</td>
                      <td className="px-4 py-4">
                        <img
                          src={store.store_logo || undefined}
                          alt={`${store.name} logo`}
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {store.name}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={12}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() => openEditModal("name", store)}
                          />
                        )}
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {store.status}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() => openEditModal("status", store)}
                          />
                        )}
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {store.store_priority_score}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() =>
                              openEditModal("store_priority_score", store)
                            }
                          />
                        )}
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {store.store_search_target}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() =>
                              openEditModal("store_search_target", store)
                            }
                          />
                        )}
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {store.store_category}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() =>
                              openEditModal("store_category", store)
                            }
                          />
                        )}
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {store.store_program_platform}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() =>
                              openEditModal("store_program_platform", store)
                            }
                          />
                        )}
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {store.store_tags}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() => openEditModal("store_tags", store)}
                          />
                        )}
                      </td>
                      <td className="text-sm text-center px-2 py-4 w-30 h-36 overflow-hidden truncate relative">
                        {new Date(
                          store.store_last_checked
                        ).toLocaleDateString()}
                        {hoveredRowIndex === index && (
                          <FaPencilAlt
                            size={14}
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            onClick={() =>
                              openEditModal("store_last_checked", store)
                            }
                          />
                        )}
                      </td>
                      <td className="flex gap-2 justify-center p-3.5">
                        <button
                          onClick={() => openModal(store)}
                          title="Edit Store"
                          className="btn btn-edit"
                        >
                          <FaEdit size={20} />
                        </button>
                        {store.status === "ACTIVE" ? (
                          <button
                            onClick={() => toggleStatus(store)}
                            title="Pause Status"
                            className="btn btn-edit"
                          >
                            <FaPause size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleStatus(store)}
                            title="Pause Status"
                            className="btn btn-edit"
                          >
                            <FaPlay size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
        {isEditModalOpen && (
          <EditEachStoreModal
            onClose={closeEditModal}
            store={selectedStore}
            field={editField}
            options={categories.map((categories: any) => ({
              value: categories.id,
              displayName: categories.name,
            }))}
          />
        )}
        {isModalOpen && (
          <StoreModal onClose={closeModal} store={selectedStore} />
        )}
        {!loading && stores && stores.length === 0 && (
          <h2 className="text-center p-2 text-lg font-medium text-opacity-80 text-black">
            No Stores in database
          </h2>
        )}
        {isExportModalOpen && (
          <ExportStoresModal
            onClose={() => setIsExportModalOpen(false)}
            onExport={exportToExcel}
            columns={columns.map((col) => col.displayName)}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        entryCount={stores.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StoreTable;
