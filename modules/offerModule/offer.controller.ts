import HandleResponse from "@/helpers/serverResponse";
import { addOfferService, deleteOfferService, fetchAndSaveExternalOffersService, fetchOffersDetailsService, fetchOffersService, updateOfferFieldService, updateOfferService } from "./offer.service";
import { Offer } from "@/app/api/private/offer/route";



export const fetchOffersController = async (params: {
  page: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  addedBy?: string;
  store?: string;
  type?: string;
  tags?: string;
  status?: string;
  lastCheck?: string;
}) => {
  try {
    const response = await fetchOffersService(params);
    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      return new HandleResponse(500, error.message, null);
    } else {
      return new HandleResponse(500, "An unknown error occurred", null);
    }
  }
};

export const updateOfferController = async (offerData: Offer & { _id: string }) => {
  try {
    const response = await updateOfferService(offerData);
    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      return new HandleResponse(500, error.message, null);
    } else {
      return new HandleResponse(500, "An unknown error occurred", null);
    }
  }
};

export const addOfferController = async (offerData: Offer) => {
  try {
    const response = await addOfferService(offerData);
    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      return new HandleResponse(500, error.message, null);
    } else {
      return new HandleResponse(500, "An unknown error occurred", null);
    }
  }
};

export const deleteOfferController = async (offerId: string) => {
  try {
    const response = await deleteOfferService(offerId);
    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      return new HandleResponse(500, error.message, null);
    } else {
      return new HandleResponse(500, "An unknown error occurred", null);
    }
  }
};

export const updateOfferFieldController = async ({
  id,
  field,
  value
}: {
  id: string;
  field: keyof Offer;
  value: any;
}) => {
  try {
    const result = await updateOfferFieldService({ id, field, value });
    return new HandleResponse(200, "Offer updated successfully", result);
  } catch (error: any) {
    if (error instanceof Error) {
      return new HandleResponse(500, error.message, null);
    } else {
      return new HandleResponse(500, "An unknown error occurred", null);
    }
  }
};

export const fetchAndSaveExternalOffersController = async () => {
  try {
    const result = await fetchAndSaveExternalOffersService();
    return new HandleResponse(200, "Offers fetched and saved successfully", result);
  } catch (error: any) {
    if (error instanceof Error) {
      return new HandleResponse(500, error.message, null);
    } else {
      return new HandleResponse(500, "An unknown error occurred", null);
    }
  }
};


export const fetchOffersDetailsController = async ({
  storeWebsite,
  status,
  page,
  itemsPerPage,
  upto,
}: {
  storeWebsite: string;
  status: string;
  page: number;
  itemsPerPage: number;
  upto: boolean;
}) => {
  try {
    const result = await fetchOffersDetailsService(storeWebsite, status, page, itemsPerPage, upto);
    return result;
  } catch (error: any) {
    if (error instanceof Error) {
      return new HandleResponse(500, error.message, null);
    } else {
      return new HandleResponse(500, "An unknown error occurred", null);
    }
  }
};