"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaPause, FaPlay } from "react-icons/fa";
import CategoryModal from "./editCategoryModel";
import SortableHeader from "./sortColumns";
import Pagination from "./pagination";

interface Category {
  _id: String;
  category_name: string;
  category_slug: string;
  category_count: number;
  category_status: string;
  category_image?: string;
  category_description?: string;
  category_manager?: string;
}

const CategoryTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc" | null;
  }>({
    field: "",
    direction: null,
  });
  // const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const itemsPerPage = 25;

  async function fetchCategories(
    page: number,
    sortField: string,
    sortDirection: "asc" | "desc" | null,
    search: string
  ) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/category?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortDirection=${sortDirection}&search=${search}`
      );
      const data = await res.json();
      setCategories(data.categories);
      setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
      setLoading(false);
    } catch (error) {
      console.log("error occured while getting categories :", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCategories(currentPage, sort.field, sort.direction , searchText);
  }, [currentPage, sort]);

  const handleSearch = () => {
    fetchCategories(currentPage, sort.field, sort.direction, searchText);
    setSearchText("")
  };

  const openModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  // const handleDeleteClick = (category: Category) => {
  //   setSelectedCategory(category);
  //   setIsConfirmationVisible(true);
  // };

  // const handleDelete = async (id: String) => {
  //   if (!id) {
  //     return;
  //   }

  //   try {
  //     console.log(id);
  //     const response = await fetch("/api/category", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       console.log("Category Deleted Successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error Deleting Category: ", error);
  //   }
  // };

  const toggleStatus = async (category: Category) => {
    try {
      const newStatus =
        category.category_status === "active" ? "paused" : "active";
      const response = await fetch("/api/category", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: category._id, status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state to reflect the change
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === category._id
              ? { ...cat, category_status: newStatus }
              : cat
          )
        );
      }
    } catch (error) {
      console.error("Error updating category status: ", error);
    }
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSort({ field, direction });
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container px-2 py-4 mx-auto">
      <div className="overflow-x-auto sm:w-full">
      <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>
        </div>
        {loading && <h1 className="animate-pulse">Loading...</h1>}
        {!loading && categories?.length > 0 && (
          <>
            <table id="userTable" className="max-w-min md:min-w-full">
              <thead>
                <tr className="bg-stone-700 text-white text-left">
                  {/* <th className="px-4 py-2 border ">Name</th> */}
                  <SortableHeader
                    title="Name"
                    sortField="category_name"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-38"
                  />
                  <SortableHeader
                    title="Slug"
                    sortField="category_slug"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-38"
                  />
                  <SortableHeader
                    title="Description"
                    sortField="category_description"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-38"
                  />
                  <SortableHeader
                    title="Manager"
                    sortField="category_manager"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  <SortableHeader
                    title="Stores Count"
                    sortField="category_count"
                    currentSort={sort}
                    onSortChange={handleSortChange}
                    className="w-32"
                  />
                  {/* <th className="px-4 py-2 border ">Slug</th>
                <th className="px-4 py-2 border ">Description</th>
                <th className="px-4 py-2 border ">Manager</th>
                <th className="px-4 py-2 border ">Stores Count</th> */}
                  <th className="px-4 py-2 border ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories &&
                  categories.map((category, index) => (
                    <tr
                      key={index}
                      className="bg-slate-100 hover:bg-white border"
                    >
                      <td className="px-4 py-2">{category.category_name}</td>
                      <td className="px-4 py-2">{category.category_slug}</td>
                      <td className="px-4 py-2">
                        {category.category_description}
                      </td>
                      <td className="px-4 py-2">{category.category_manager}</td>
                      <td className="px-4 py-2">{category.category_count}</td>
                      <td className="flex space-x-2 px-4 py-2 justify-items-center">
                        {" "}
                        <FaEdit
                          size={20}
                          className="cursor-pointer"
                          onClick={() => openModal(category)}
                        />
                        {category.category_status === "active" ? (
                          <FaPlay
                            size={16}
                            className="cursor-pointer"
                            onClick={() => toggleStatus(category)}
                          />
                        ) : (
                          <FaPause
                            size={16}
                            className="cursor-pointer"
                            onClick={() => toggleStatus(category)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              entryCount={categories.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
        {/* {selectedCategory && (
          <Confirmation
            isShow={isConfirmationVisible}
            setIsShow={setIsConfirmationVisible}
            externalMethod={handleDelete}
            argument={selectedCategory._id}
            content={{
              title: "Delete Category",
              body: `Are you sure you want to delete the category "${selectedCategory.category_name}"?`,
            }}
            w="400px"
          />
        )} */}
        {isModalOpen && (
          <CategoryModal onClose={closeModal} category={selectedCategory} />
        )}
        {!loading && categories && categories.length === 0 && (
          <h2 className="text-center p-2 text-lg font-medium text-opacity-80 text-black">
            No Categories in database
          </h2>
        )}
      </div>
    </div>
  );
};

export default CategoryTable;
