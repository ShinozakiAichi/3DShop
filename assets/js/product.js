function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

function renderProduct(product) {
  const title = document.getElementById('product-title');
  const description = document.getElementById('product-description');
  const details = document.getElementById('product-details');
  const gallery = document.getElementById('product-gallery');
  const buyButton = document.getElementById('buy-button');

  if (!product) {
    title.textContent = 'Товар не найден';
    description.textContent = 'Проверьте ссылку или вернитесь в каталог.';
    details.innerHTML = '';
    gallery.innerHTML = '';
    buyButton.remove();
    return;
  }

  title.textContent = product.title;
  description.textContent = product.description;
  buyButton.href = `https://t.me/YourBot?start=order_${product.id}`;

  gallery.innerHTML = product.images
    .map((src, index) => `<img src="${src}" alt="${product.title} — фото ${index + 1}">`)
    .join('');

  details.innerHTML = `
    <table class="table">
      <tr><td>Цена</td><td class="price">${product.price} ₽</td></tr>
      <tr><td>Категория</td><td>${product.category}</td></tr>
      <tr><td>Материал</td><td>${product.material}</td></tr>
      <tr><td>Размер</td><td>${product.size}</td></tr>
    </table>
  `;
}

ready(async () => {
  const productId = getProductId();
  const errorContainer = document.getElementById('product-error');

  if (!productId) {
    errorContainer.textContent = 'ID товара не указан.';
    return;
  }

  try {
    const items = await loadProducts();
    const product = items.find((item) => item.id === productId);
    renderProduct(product);
  } catch (error) {
    errorContainer.textContent = error instanceof Error ? error.message : 'Ошибка загрузки товара';
  }
});
