-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  benefits TEXT[] DEFAULT '{}',
  image_url TEXT,
  image_alt TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Only admins can modify products" 
ON public.products FOR ALL USING (false);

-- Create policies for cart_items
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can manage their own cart items" 
ON public.cart_items FOR ALL USING (user_id = auth.uid()::text);

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE USING (user_id = auth.uid()::text);

-- Create policies for order_items
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()::text
  )
);

-- Create indexes for better performance
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_products_category ON public.products(category);

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, category, benefits, image_url, image_alt, stock_quantity, rating, reviews_count) VALUES
('Ashwagandha Premium Capsules', 'Pure Ashwagandha root extract for stress relief and enhanced vitality', 899.00, 1299.00, 'herbs', ARRAY['Stress Relief', 'Energy Boost', 'Immunity Support'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop', 'Ashwagandha capsules in a bottle', 100, 4.8, 2847),
('Triphala Churna Organic', 'Traditional blend of three fruits for optimal digestive wellness', 399.00, NULL, 'digestive', ARRAY['Digestive Health', 'Natural Detox', 'Weight Management'], 'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=400&h=300&fit=crop', 'Organic Triphala powder', 85, 4.6, 1523),
('Brahmi Memory Booster', 'Enhance cognitive function and mental clarity naturally', 749.00, 999.00, 'brain', ARRAY['Memory Enhancement', 'Focus', 'Mental Clarity'], 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', 'Brahmi extract capsules', 60, 4.7, 981),
('Turmeric Curcumin Complex', 'High potency turmeric with black pepper for maximum absorption', 649.00, NULL, 'inflammation', ARRAY['Anti-inflammatory', 'Joint Health', 'Immunity'], 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop', 'Turmeric curcumin supplements', 120, 4.9, 3247),
('Arjuna Heart Care Tablets', 'Traditional heart tonic for cardiovascular wellness and strength', 549.00, NULL, 'heart', ARRAY['Heart Health', 'Blood Pressure', 'Circulation'], 'https://images.unsplash.com/photo-1584362917165-526a968579a8?w=400&h=300&fit=crop', 'Arjuna heart care tablets', 75, 4.5, 756),
('Neem Blood Purifier', 'Natural blood purifier and comprehensive skin health supplement', 429.00, NULL, 'skin', ARRAY['Blood Purification', 'Skin Health', 'Natural Detox'], 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop', 'Neem capsules for skin health', 90, 4.4, 1247),
('Giloy Immunity Booster', 'Powerful immune system support with premium Guduchi extract', 599.00, 799.00, 'immunity', ARRAY['Immunity', 'Fever Relief', 'Antioxidant Power'], 'https://images.unsplash.com/photo-1550572017-edd951aa8ed3?w=400&h=300&fit=crop', 'Giloy immunity supplement', 110, 4.6, 1834),
('Amla Vitamin C Natural', 'Rich source of natural Vitamin C for comprehensive health', 379.00, NULL, 'immunity', ARRAY['Vitamin C', 'Hair Health', 'Radiant Skin'], 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=400&h=300&fit=crop', 'Amla vitamin C supplements', 95, 4.5, 2156),
('Moringa Superfood Powder', 'Nutrient-dense superfood for sustained energy and vitality', 699.00, NULL, 'superfood', ARRAY['Natural Energy', 'Complete Nutrition', 'Plant Protein'], 'https://images.unsplash.com/photo-1599590621497-d0c71a8fc4b6?w=400&h=300&fit=crop', 'Moringa superfood powder', 65, 4.7, 892),
('Tulsi Holy Basil Extract', 'Sacred herb for respiratory health and natural stress relief', 449.00, 599.00, 'respiratory', ARRAY['Respiratory Health', 'Stress Relief', 'Immunity'], 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop', 'Tulsi holy basil extract', 80, 4.8, 1567),
('Spirulina Blue Green Algae', 'Pure spirulina for comprehensive detox and energy enhancement', 899.00, NULL, 'superfood', ARRAY['Natural Detox', 'Energy Boost', 'Complete Protein'], 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop', 'Spirulina supplements', 70, 4.6, 743),
('Shatavari Women\'s Health', 'Traditional herb for women\'s reproductive health and wellness', 649.00, NULL, 'women', ARRAY['Hormonal Balance', 'Women\'s Health', 'Natural Vitality'], 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop', 'Shatavari women health supplement', 50, 4.7, 1298);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();