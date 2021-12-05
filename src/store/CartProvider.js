import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const newItem = () => {
      if (
        state.items.filter((meal) => meal.id === action.item.id).length === 1
      ) {
        return state.items.map((meal) => {
          if (meal.id === action.item.id) {
            return {
              ...meal,
              amount: meal.amount + action.item.amount,
            };
          } else {
            return meal;
          }
        });
      } else {
        return [...state.items, action.item];
      }
    };

    const updatedTotalAmount = newItem().reduce((acc, curr) => {
      return acc + curr.amount * curr.price;
    }, 0);

    return { items: newItem(), totalAmount: updatedTotalAmount };
  }

  if (action.type === "REMOVE") {
    const newItem = state.items
      .map((meal) => {
        if (meal.id === action.id && meal.amount !== 1) {
          return { ...meal, amount: meal.amount - 1 };
        }
        if (meal.id === action.id && meal.amount === 1) {
          return " ";
        }
        if (meal.id !== action.id) {
          return meal;
        }
      })
      .filter((meal) => meal !== " ");

    const updatedTotalAmount = state.items.reduce((acc, current) => {
      return acc + current.amount * current.price;
    }, 0);

    return { items: newItem, totalAmount: updatedTotalAmount };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemHandler = (item) => {
    console.log(item);
    console.log(cartState);
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
