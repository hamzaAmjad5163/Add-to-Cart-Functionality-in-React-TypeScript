// src/hooks/useProduct.ts
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getProduct } from '@/services/localProductService'; 

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  longDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stockStatus: string;
  vendorName: string;
  vendorId: string;
  shippingInfo: string;
  deliveryTime: string;
  specifications: Array<{ name: string; value: string }>;
}

export const useProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch from an API
      // const response = await fetch(`/api/products/${id}`);
      // const data = await response.json();
      
      // For our localStorage implementation:
      const productData = getProduct(id!);
      if (!productData) {
        throw new Error('Product not found');
      }
      
      // Transform the data to match our Product interface
      const transformedProduct: Product = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        description: productData.shortDescription,
        longDescription: productData.description,
        images: productData.gallery || [],
        rating: 4.5, // Default value
        reviewCount: 123, // Default value
        stockStatus: productData.stock > 0 ? 'In Stock' : 'Out of Stock',
        vendorName: productData.vendor,
        vendorId: '1', // Default value
        shippingInfo: 'Free shipping on orders over $50',
        deliveryTime: '3-5 business days',
        specifications: [
          { name: 'Material', value: 'Various' },
          { name: 'Category', value: productData.category },
        ],
      };
      
      setProduct(transformedProduct);
      if (transformedProduct.images.length > 0) {
        setMainImage(transformedProduct.images[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: isWishlisted 
        ? `${product?.name} has been removed from your wishlist`
        : `${product?.name} has been added to your wishlist`,
    });
  };
  
  const addToCart = () => {
    if (!product) return;
    
    // Get existing cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images[0] || '',
        quantity,
      });
    }
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast({
      title: 'Added to cart',
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} added to your cart`,
    });
  };

  return {
    id,
    product,
    loading,
    error,
    mainImage,
    quantity,
    isWishlisted,
    setMainImage,
    incrementQuantity,
    decrementQuantity,
    toggleWishlist,
    addToCart,
    fetchProduct,
  };
};