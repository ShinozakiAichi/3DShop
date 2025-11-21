const TELEGRAM_CONTACT = 'https://t.me/KNBmodel';
const PRODUCTS_URL = '/data/products.json';

function ready(fn) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    fn();
    return;
  }
  document.addEventListener('DOMContentLoaded', fn);
}

async function loadProducts() {
  const response = await fetch(PRODUCTS_URL);
  if (!response.ok) {
    throw new Error(`Не удалось загрузить каталог: ${response.status}`);
  }
  return response.json();
}

function initModal() {
  const backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) return;

  const closeModal = () => backdrop.classList.remove('visible');
  const openModal = () => backdrop.classList.add('visible');

  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      closeModal();
    }
  });

  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });
}

ready(initModal);
