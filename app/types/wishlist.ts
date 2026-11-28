export interface iWishlist {
    id: string;
    user_id: string;
    wallet_id?: string;
    name: string;
    target_amount: number;
    current_amount: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface iWishlistContribution {
    id: string;
    wishlist_id: string;
    user_id: string;
    amount: number;
    note?: string;
    created_at: string;
}