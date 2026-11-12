
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

const getCartKey = (item) =>
  `${item.type || "dish"}-${item._id}`;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("velvetCart");

      if (!savedCart) return [];

      return JSON.parse(savedCart).map((item) => {
        const normalizedItem = {
          ...item,
          type: item.type || "dish",
        };

        return {
          ...normalizedItem,
          cartKey: getCartKey(normalizedItem),
        };
      });
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "velvetCart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add a normal dish
  const addToCart = (dish) => {
    if (!dish || !dish._id || !dish.available) return;

    const cartKey = `dish-${dish._id}`;

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => (item.cartKey || getCartKey(item)) === cartKey
      );

      if (existingItem) {
        return previousItems.map((item) =>
          (item.cartKey || getCartKey(item)) === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousItems,
        {
          ...dish,
          type: "dish",
          cartKey,
          quantity: 1,
        },
      ];
    });
  };

  // Add a combo offer
  const addComboToCart = (combo) => {
    if (
      !combo ||
      !combo._id ||
      combo.active === false ||
      !Number.isFinite(Number(combo.offerPrice))
    ) {
      return;
    }

    const cartKey = `combo-${combo._id}`;

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => (item.cartKey || getCartKey(item)) === cartKey
      );

      if (existingItem) {
        return previousItems.map((item) =>
          (item.cartKey || getCartKey(item)) === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousItems,
        {
          _id: combo._id,
          type: "combo",
          cartKey,
          name: combo.name,
          description: combo.description,
          image: combo.image,
          category: "Combo Offer",
          price: Number(combo.offerPrice),
          offerPrice: Number(combo.offerPrice),
          dishes: combo.dishes,
          quantity: 1,
          active: combo.active,
          available: true,
        },
      ];
    });
  };

  // Increase quantity
  // Defaults to dish to preserve existing DishCard functionality
  const increaseQuantity = (id, type = "dish") => {
    const cartKey = `${type}-${id}`;

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        (item.cartKey || getCartKey(item)) === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id, type = "dish") => {
    const cartKey = `${type}-${id}`;

    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          (item.cartKey || getCartKey(item)) === cartKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove an item
  const removeFromCart = (id, type = "dish") => {
    const cartKey = `${type}-${id}`;

    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => (item.cartKey || getCartKey(item)) !== cartKey
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        addComboToCart,
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

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};
