import React from 'react';

export const ProductCard = React.memo(function ProductCard({
  product,
  qty,
  onAdd,
  onRemove,
}) {
  // После клика в консоли должна быть ОДНА строка, а не 5000.
  console.log('render', product.id);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px', width: '200px' }}>
      <h3>{product.title}</h3>
      <p>{product.price} ₽</p>
      <p style={{ color: product.inStock ? 'green' : 'red' }}>
        {product.inStock ? 'В наличии' : 'Нет в наличии'}
      </p>

      {qty > 0 ? (
        // Если товар уже в корзине — показываем количество и кнопку «Убрать»
        <div>
          <span>В корзине: {qty}</span>
          <button onClick={() => onRemove(product.id)} style={{ marginLeft: '10px' }}>
            Убрать
          </button>
        </div>
      ) : (
        // Иначе — кнопка добавления. Товар без наличия добавить нельзя.
        <button
          onClick={() => onAdd(product)}
          disabled={!product.inStock}
          style={{ width: '100%' }}
        >
          В корзину
        </button>
      )}
    </div>
  );
});