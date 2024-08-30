// import { ObjectId } from "mongodb";

export type Offer = {
    _id: string;
    id: number;
    offer_user_id: number;
    offer_store_id: number;
    offer_added_date: Date;
    offer_updated_date?: Date;  // Optional
    offer_status: string;  
    offer_type: string;  
    offer_benefit: string;  
    offer_title: string;  
    offer_description?: string;  // Optional
    offer_minimum_order?: number;  // Optional
    offer_code?: string;  // Optional
    offer_start_date?: Date;  // Optional
    offer_end_date?: Date;  // Optional
    offer_link?: string;  // Optional 
    offer_category_id?: number;  // Optional
    offer_tags?: string;  // Optional
    offer_last_used_date?: Date;  // Optional
    offer_use_count?: number;  // Optional
    offer_view_count?: number;  // Optional
    offer_use_percent?: number;  // Optional
    offer_working_percent?: number;  // Optional
  };
  