import React, { useState, useMemo, useRef, useEffect, useTransition } from 'react';
import { products } from './data';
import { useCart } from './useCart';
import { ProductCard } from './ProductCard';

export default function App() {
  // Держим два значения для поиска:
  // query — то, что видит пользователь в поле (обновляем мгновенно),
  // filter — то, по чему реально фильтруем список (обновляем в transition).
  // Это нужно для шага 4, чтобы ввод не «подтормаживал» на 5000 товарах.
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Вся логика корзины уехала в хук
  const { cart, add, remove, clear, totalCount, totalPrice } = useCart();

  // Автофокус на поле поиска при первом рендере.
  // Пустой массив зависимостей — эффект сработает один раз, после монтирования.
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Пользователь печатает — сразу обновляем query (срочно), а фильтр отдаём в startTransition (несрочно, можно прервать).
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      setFilter(value);
    });
  };

  // Кэшируем результат и пересчитываем только когда меняется фильтр или чекбокс.
  const visibleProducts = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(q);
      const matchesStock = onlyInStock ? p.inStock : true;
      return matchesSearch && matchesStock;
    });
  }, [filter, onlyInStock]);

  // Делаем словарь { [id]: qty }, и карточка получает только своё число.
  const qtyById = useMemo(() => {
    const map = {};
    cart.items.forEach((item) => {
      map[item.product.id] = item.qty;
    });
    return map;
  }, [cart.items]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Шапка: сводка корзины и кнопка очистки */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>Магазин</h1>
        <div>
          <strong>
            Корзина: {totalCount} шт. · {totalPrice} ₽
          </strong>
          <button onClick={clear} style={{ marginLeft: '10px' }}>
            Очистить
          </button>
        </div>
      </header>

      {/* Поиск и фильтр «только в наличии» */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск по названию..."
          value={query}
          onChange={handleSearchChange}
          style={{ padding: '8px', width: '300px' }}
        />
        <label>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
          />
          Только в наличии
        </label>
        <span>Найдено: {visibleProducts.length}</span>
        {/* Индикатор от useTransition — виден, пока список пересчитывается */}
        {isPending && <span style={{ color: 'orange' }}>Обновляем список...</span>}
      </div>

      {/* Сетка карточек. key — стабильный id, не индекс массива */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            qty={qtyById[product.id] || 0}
            onAdd={add}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  );
}