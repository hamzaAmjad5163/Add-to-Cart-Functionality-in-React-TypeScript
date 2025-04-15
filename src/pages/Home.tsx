import { useState } from 'react';
import { FiShoppingCart, FiHeart, FiSearch, FiUser } from 'react-icons/fi';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isFavorite: boolean;
};

type CartItem = Product & {
  quantity: number;
};

const Home = () => {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: 'Minimal Chair',
      price: 120,
      image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86',
      category: 'Furniture',
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Ceramic Vase',
      price: 65,
      image: 'https://images.unsplash.com/photo-1581655353741-5b7fd51e5d4a',
      category: 'Decor',
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Wooden Side Table',
      price: 85,
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
      category: 'Furniture',
      isFavorite: false,
    },
    {
      id: 4,
      name: 'Linen Throw',
      price: 45,
      image: 'https://images.unsplash.com/photo-1625598519805-8b6a7a4f794d',
      category: 'Textiles',
      isFavorite: false,
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFavorite = (id: number) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, isFavorite: !product.isFavorite } : product
    );
    // In a real app, you would update state here
    console.log('Updated favorites:', updatedProducts);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-light tracking-tight">minim.</h1>
          
          <div className="relative w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <FiUser size={20} />
            </button>
            <button 
              className="p-2 text-gray-700 hover:text-gray-900 relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <FiShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light">Our Products</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
              Furniture
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
              Decor
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
              Textiles
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full ${product.isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'} bg-white bg-opacity-80`}
                >
                  <FiHeart size={18} fill={product.isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="p-4">
                <span className="text-xs text-gray-500">{product.category}</span>
                <h3 className="text-lg font-medium mt-1">{product.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-900 font-medium">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3 py-1 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium">Shopping Cart</h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-200">
                          {cart.map((item) => (
                            <li key={item.id} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">${item.price * item.quantity}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className="flex items-center border border-gray-200 rounded">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="font-medium text-gray-500 hover:text-gray-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium">
                      <p>Subtotal</p>
                      <p>${cartTotal.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <button
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-700"
                      >
                        Checkout
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="text-gray-900 font-medium hover:text-gray-700"
                        >
                          Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;