import React, { useState, useEffect } from "react";

interface CategoryModalProps {
  onClose: () => void;
  category?: {
    _id: String;
    category_name: string;
    category_slug: string;
    category_count: number;
    category_status?: string;
    category_image?: string;
    category_description?: string;
    category_manager?: string;
    imageData? : Buffer | undefined;
  };
}

const CategoryModal: React.FC<CategoryModalProps> = ({ onClose, category }) => {
  const [name, setName] = useState(category?.category_name);
  const [slug, setSlug] = useState(category?.category_slug);
  const [description, setDescription] = useState(
    category?.category_description || ""
  );
  const [image, setImage] = useState<ArrayBuffer | undefined>(undefined);
  const [manager, setManager] = useState('');

  useEffect(() => {
    if (name) {
      setSlug(generateSlug(name));
    }
  }, [name]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleImageUpload = async (event : React.ChangeEvent<HTMLInputElement>) => {
    console.log("image upload");
    try
    {
      const file = event.target.files?.[0];
      const imageBuffer = await file?.arrayBuffer();
      setImage(imageBuffer)
    } catch (error)
    {
      console.error(`Error saving category image for ${category?.category_name}:`, error);
    }
  };

  const handleEdit = async () => {
    if (!name || !slug) {
      console.error("Name and slug are required");
      return;
    }

    let base64Image = null;
    if (image) {
      base64Image = await new Promise((resolve, reject) => {
        const blob = new Blob([image], { type: "image/jpg" }); 
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    const payload = {
      id: category?._id,
      category_name: name,
      category_slug: slug,
      count: category?.category_count,
      category_description: description,
      category_image: image,
      category_manager: manager,
      imageData : base64Image
    };

    try {
      const response = await fetch("/api/category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Category updated successfully");
        onClose();
      } else {
        console.error("Failed to update category:", result.message);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
        <h2 className="text-2xl mb-4">Edit Category</h2>

        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Slug</label>
          <input
            className="w-full p-2 border rounded"
            value={slug}
            readOnly
            // onChange={(e) => setSlug(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Upload Image</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={handleImageUpload}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Manager</label>
          <select
            className="w-full p-2 border rounded"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
          >
            <option value="" disabled>
              Select Manager
            </option>
            {/* {managers.map((mgr) => (
              <option key={mgr.id} value={mgr.id}>
                {mgr.name}
              </option>
            ))} */}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleEdit}
          >
            Update
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
