export type CartResponse = {
  success: boolean;
  message: string;
  data: cartListType;
};

export type CartItem = {
  id: number;
  room_type: number;
  room_type_name: string;
  quantity: number;
  added_at: string;
};

export type cartListType ={
    id: number;
    user: number;
    items: CartItem[];
    created_at: string;
    updated_at: string;
  };
