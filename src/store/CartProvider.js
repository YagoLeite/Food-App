import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // const existingCartItemIndex = state.items.findIndex(
    //   (meal) => meal.id === action.item.id
    // );
    // const existingCartItem = state.items[existingCartItemIndex];
    // let updatedItems;

    // if (existingCartItem) {
    //   const updateItem = {
    //     ...existingCartItem,
    //     amount: existingCartItem.amount + action.item.amount,
    //   };
    //   updatedItems = [...state.items];
    //   updatedItems[existingCartItemIndex] = updateItem;
    // } else {
    //   updatedItems = [...state.items, action.item];
    // }

    // return { items: updatedItems, totalAmount: updatedTotalAmount };
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
    return { items: newItem(), totalAmount: updatedTotalAmount };
  }

  if (action.type === "REMOVE") {
    return state.items
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
    // return state.items.filter((item) => item.id !== action.id);
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
