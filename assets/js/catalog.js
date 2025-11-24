let products = [];

function createOption(value, text) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  return option;
}

function populateFilters(items) {
  const categorySelect = document.getElementById('filter-category');
  const materialSelect = document.getElementById('filter-material');
  const categories = ['Все', ...new Set(items.map((item) => item.category))];
  const materials = ['Все', ...new Set(items.map((item) => item.material))];

  categories.forEach((category) => categorySelect.appendChild(createOption(category, category)));
  materials.forEach((material) => materialSelect.appendChild(createOption(material, material)));
}

function matchesSearch(item, query) {
  if (!query) return true;
  const haystack = `${item.title} ${item.description}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function withinPrice(item, min, max) {
  const aboveMin = min ? item.price >= min : true;
  const belowMax = max ? item.price <= max : true;
  return aboveMin && belowMax;
}

function applyFilters() {
  const category = document.getElementById('filter-category').value;
  const material = document.getElementById('filter-material').value;
  const minPrice = Number(document.getElementById('filter-min-price').value);
  const maxPrice = Number(document.getElementById('filter-max-price').value);
  const sort = document.getElementById('sort').value;
  const search = document.getElementById('search').value.trim();

  let result = products
    .filter((item) => (category === 'Все' ? true : item.category === category))
    .filter((item) => (material === 'Все' ? true : item.material === material))
    .filter((item) => withinPrice(item, minPrice || null, maxPrice || null))
    .filter((item) => matchesSearch(item, search));

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    title: (a, b) => a.title.localeCompare(b.title, 'ru'),
    newest: (a, b) => b.id - a.id,
  };
  result = result.sort(sorters[sort]);

  renderProducts(result);
}

function renderProducts(list) {
  const container = document.getElementById('catalog');
  if (!container) return;

  if (!list.length) {
    container.innerHTML = '<p class="card">Ничего не найдено. Попробуйте изменить фильтры.</p>';
    return;
  }

  container.innerHTML = list
    .map(
      (item) => {
        const hasMultipleImages = Array.isArray(item.images) && item.images.length > 1;
        const coverImage = item.images?.[0];

        return `
        <article class="card product-card">
          ${
            hasMultipleImages
              ? `<div class="gallery-wrapper"><img class="product-image" src="${coverImage}" alt="${item.title}"></div>`
              : `<img class="product-image" src="${coverImage}" alt="${item.title}">`
          }
          <div class="product-meta">
            <span class="badge">${item.category}</span>
            <span class="price">${item.price} ₽</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.description.slice(0, 90)}...</p>
          <div class="controls">
            <a class="button secondary" href="product.html?id=${item.id}">Подробнее</a>
            <a class="button" href="${buildOrderLink(item)}" target="_blank">Купить</a>
          </div>
        </article>
      `;
      }
    )
    .join('');
}

function bindEvents() {
  ['filter-category', 'filter-material', 'filter-min-price', 'filter-max-price', 'sort'].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('change', applyFilters);
  });

  const search = document.getElementById('search');
  search.addEventListener('input', () => {
    window.clearTimeout(search.dataset.timerId);
    const timerId = window.setTimeout(applyFilters, 200);
    search.dataset.timerId = timerId;
  });
}

ready(async () => {
  try {
    products = await loadProducts();
    populateFilters(products);
    bindEvents();
    applyFilters();
  } catch (error) {
    const container = document.getElementById('catalog');
    container.innerHTML = `<p class="card">${error instanceof Error ? error.message : 'Ошибка загрузки данных'}</p>`;
  }
});
