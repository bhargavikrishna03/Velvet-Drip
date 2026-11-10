
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

  // Load cart data from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("velvetCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // Save cart data whenever cartItems changes
  useEffect(() => {
    localStorage.setItem(
      "velvetCart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add dish to cart
  const addToCart = (dish) => {
    if (!dish || !dish._id || !dish.available) return;

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => item._id === dish._id
      );

      if (existingItem) {
        return previousItems.map((item) =>
          item._id === dish._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousItems,
        {
          ...dish,
          quantity: 1,
        },
      ];
    });
  };

  // Increase dish quantity
  const increaseQuantity = (id) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease dish quantity
  const decreaseQuantity = (id) => {
    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove a dish completely
  const removeFromCart = (id) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item._id !== id
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total quantity of all dishes
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate total cart price
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access cart context
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};
