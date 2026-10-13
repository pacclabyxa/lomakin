import { useReducer, useCallback, useMemo } from 'react';

const initialCart = { items: [] };

// Reducer — чистая функция: не трогаем state напрямую, а всегда возвращаем новый объект.
function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id
      );

      // Если товар уже в корзине — увеличиваем количество, иначе добавляем новую позицию с qty: 1.
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, qty: 1 }],
      };
    }

    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.id),
      };

    case 'clear':
      return initialCart;

    default:
      // Неизвестное действие — просто возвращаем state без изменений.
      return state;
  }
}

// Кастомный хук: прячем всю возню с корзиной здесь, чтобы App не разрастался и логику можно было переиспользовать.
export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const add = useCallback((product) => dispatch({ type: 'add', product }), []);
  const remove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  // Считаем итоги один раз на изменение cart.items, а не при каждом рендере App.
  const totalCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.qty, 0),
    [cart.items]
  );

  const totalPrice = useMemo(
    () =>
      cart.items.reduce(
        (sum, item) => sum + item.product.price * item.qty,
        0
      ),
    [cart.items]
  );

  return { cart, add, remove, clear, totalCount, totalPrice };
}