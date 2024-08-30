import HandleResponse from "@/helpers/serverResponse";
import { addStoreService, fetchAndSaveExternalStoresService, fetchStoreDetailsService, fetchStoresService, updateStoreFieldService, updateStoreService, updateStoreStatusService } from "./store.service";
import { Store } from "@/app/api/private/store/route";

export const fetchStoresController = async ({
    page,
    itemsPerPage,
    sortField,
    sortDirection,
    all,
    filters
}: {
    page: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    all: boolean;
    filters: {
        name?: string;
        status?: string;
        priority?: string;
        target?: string;
        category?: string;
        lastCheck?: string;
    };
}) => {
    try {
        const response = await fetchStoresService({
            page,
            itemsPerPage,
            sortField,
            sortDirection,
            all,
            filters
        });
        return response;
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null);
        } else {
            return new HandleResponse(500, "An unknown error occurred", null);
        }
    }
};

export const updateStoreController = async ({ id, storeData }: { id: string; storeData: Partial<Store> }) => {
    try {
        await updateStoreService({ id, storeData });
        return new HandleResponse(200, "Store updated successfully", null);
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null);
        } else {
            return new HandleResponse(500, "An unknown error occurred", null);
        }
    }
};

export const addStoreController = async ({ storeData }: { storeData: Store & { imageData?: string } }) => {
    try {
        await addStoreService({ storeData });
        return new HandleResponse(200, "Store added successfully", null);
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null);
        } else {
            return new HandleResponse(500, "An unknown error occurred", null);
        }
    }
};

export const updateStoreStatusController = async ({ id, status }: { id: string; status: string }) => {
    try {
        await updateStoreStatusService({ id, status });
        return new HandleResponse(200, "Store status updated successfully", null);
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null);
        } else {
            return new HandleResponse(500, "An unknown error occurred", null);
        }
    }
};

export const updateStoreFieldController = async ({
    id,
    field,
    value
}: {
    id: string;
    field: keyof Store;
    value: any;
}) => {
    try {
        const result = await updateStoreFieldService({ id, field, value });
        return new HandleResponse(200, "Store updated successfully", result);
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null);
        } else {
            return new HandleResponse(500, "An unknown error occurred", null);
        }
    }
};

export const fetchAndSaveExternalStoresController = async () => {
    try {
        const result = await fetchAndSaveExternalStoresService();
        return new HandleResponse(200, "Stores fetched and saved successfully", result);
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null);
        } else {
            return new HandleResponse(500, "An unknown error occurred", null);
        }
    }
};

export const fetchStoreDetailsController = async ({ storeWebsite }: { storeWebsite: string }) => {
    try {
        const result = await fetchStoreDetailsService(storeWebsite);

        // return new HandleResponse(200, "Store details fetched successfully", result);
        return result;
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null);
        } else {
            return new HandleResponse(500, "An unknown error occurred", null);
        }
    }
};
