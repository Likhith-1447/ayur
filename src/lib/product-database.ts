import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type CartItem = Tables<"cart_items"> & { product: Product };
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;

// Product functions
export const getProducts = async (category?: string): Promise<Product[]> => {
  let query = supabase.from("products").select("*").gt("stock_quantity", 0);
  
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data;
};

// Cart functions
export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  if (!userId) {
    console.error("User ID is required");
    return [];
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      product:products(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }

  return data || [];
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<CartItem | null> => {
  if (!userId || !productId) {
    console.error("User ID and Product ID are required");
    return null;
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id)
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      console.error("Error updating cart item:", error);
      return null;
    }

    return data;
  } else {
    // Add new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert([{ user_id: userId, product_id: productId, quantity }])
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      console.error("Error adding to cart:", error);
      return null;
    }

    return data;
  }
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
): Promise<boolean> => {
  if (!cartItemId || quantity < 1) {
    console.error("Valid cart item ID and quantity are required");
    return false;
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);

  if (error) {
    console.error("Error updating cart item quantity:", error);
    return false;
  }

  return true;
};

export const removeFromCart = async (cartItemId: string): Promise<boolean> => {
  if (!cartItemId) {
    console.error("Cart item ID is required");
    return false;
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) {
    console.error("Error removing from cart:", error);
    return false;
  }

  return true;
};

export const clearCart = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.error("User ID is required");
    return false;
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error clearing cart:", error);
    return false;
  }

  return true;
};

// Order functions
export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  shippingAddress: any
): Promise<Order | null> => {
  if (!userId || !cartItems.length) {
    console.error("User ID and cart items are required");
    return null;
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
      },
    ])
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    return null;
  }

  // Create order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: Number(item.product.price),
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    return null;
  }

  return order;
};

export const updateOrderPayment = async (
  orderId: string,
  paymentId: string,
  paymentStatus: string
): Promise<boolean> => {
  const { error } = await supabase
    .from("orders")
    .update({
      payment_id: paymentId,
      payment_status: paymentStatus,
      status: paymentStatus === "paid" ? "confirmed" : "pending",
    })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order payment:", error);
    return false;
  }

  return true;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  if (!userId) {
    console.error("User ID is required");
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
};