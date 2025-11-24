function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

function renderGallery(product) {
  const gallery = document.getElementById('product-gallery');

  if (!gallery) return;
  if (!product.images || !product.images.length) {
    gallery.innerHTML = '';
    return;
  }

  const [cover] = product.images;

  gallery.innerHTML = `
    <div class="main-image">
      <img class="gallery-image product-image" src="${cover}" alt="${product.title} — фото 1">
    </div>
    <div class="thumbs">
      ${product.images
        .map(
          (src, index) =>
            `<img class="thumbnail product-image${index === 0 ? ' active' : ''}" src="${src}" alt="${product.title} — миниатюра ${index + 1}" data-index="${index}">`
        )
        .join('')}
    </div>
  `;

  const mainImage = gallery.querySelector('.gallery-image');
  const thumbnails = gallery.querySelectorAll('.thumbnail');

  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const imageIndex = Number(thumb.dataset.index) + 1;

      if (mainImage) {
        mainImage.src = thumb.getAttribute('src');
        mainImage.alt = `${product.title} — фото ${imageIndex}`;
      }

      thumbnails.forEach((node) => node.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
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
  buyButton.href = buildOrderLink(product);
  buyButton.target = '_blank';

  renderGallery(product);

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
