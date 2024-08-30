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


export const fetchOffersfromAPI = async (
    page: number,
    itemsPerPage: number,
    sortField: string,
    sortDirection: "asc" | "desc" | null,
    filters: any,
) => {
    try {
        const filterParams = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
            if (value && value !== "select") {
                filterParams.append(key, value.toString());
            }
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/private/offer?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortDirection=${sortDirection}&${filterParams.toString()}`
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch offers: ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error occurred while getting offers:", error);
        throw error;
    }
};


export const cloneOfferServicefromAPI = async (offerToClone: Offer) => {
    const clonedOffer: Offer = { ...offerToClone, _id: undefined };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/private/offer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clonedOffer),
        });

        if (!response.ok) {
            throw new Error(`Failed to clone offer: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error occurred while cloning the offer:", error);
        throw error;
    }
};


export const deleteOfferServicefromAPI = async (offerId: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/private/offer`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offerId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete offer: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error occurred while deleting the offer:", error);
        throw error;
    }
};

export const updateOfferFieldfromAPI = async (id: string | null, field: string, value: any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/private/offer/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                field: field,
                value: value,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update offer: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error occurred while updating offer:", error);
        throw error;
    }
};


export const saveOffertoAPI = async (payload: any) => {
    try {
      const response = await fetch("/api/private/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error adding offer:", error);
      throw error;
    }
  };