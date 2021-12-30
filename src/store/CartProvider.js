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
    const novoitem = state.items.reduce((acc, current) => {
      if (current.id === action.id && current.amount !== 1) {
        return [...acc, { ...current, amount: current.amount - 1 }];
      } else if (current.id === action.id && current.amount === 1) {
        return [...acc];
      } else {
        return [...acc, current];
      }
    }, []);

    const atualizado = novoitem.reduce((acc, current) => {
      return acc + current.amount * current.price;
    }, 0);

    return { items: novoitem, totalAmount: atualizado };
  }

  if (action.type === "CLEAR") {
    return defaultCartState;
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: "CLEAR" });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    clearCart: clearCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
