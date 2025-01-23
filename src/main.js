import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import iconSvgError from './img/allert.svg';
import iconSvgWarning from './img/warning.svg';
import getResponseData from './js/pixabay-api.js';
import addGalleryElements from './js/render-functions.js';

// Оголошую константи, потрібні для роботи
const galleryList = document.querySelector('.gallery');
const loaderElement = document.querySelector('.loader');
const requestForm = document.querySelector('.search-form');
const loadMoreButton = document.getElementById('loadMoreBtn');
const goToTopButton = document.querySelector('.go-top-button');
const searchField = document.querySelector('.search-field');

let page = 1; // Номер сторінки для пагінації
let responsePhrase = ''; // У цю змінну записую пошукову фразу для передачі у запит на бек

// Параметри повідомлень, які будуть виводитися iziToast
const errFindImagesMessage = {
  message:
    'Sorry, there are no images matching <br> your search query. Please, try again!',
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  position: 'topRight',
  iconUrl: iconSvgError,
};

const owerMaxLengthInputMessg = {
  message:
    'Перевищено максимально допустиму кількість символів!<br> Допустимо 100 символів.',
  messageColor: '#fff',
  backgroundColor: '#ffa000',
  position: 'topRight',
  iconUrl: iconSvgWarning,
  displayMode: 'once',
};

const allImagesLoadded = {
  message: "We're sorry, but you've reached the end of search results.",
  messageColor: '#fff',
  backgroundColor: '#ffa000',
  position: 'topRight',
  iconUrl: iconSvgWarning,
  displayMode: 'once',
};

// Створюю об'єкт галереї
let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

gallery.on('show.simplelightbox', function () {});

gallery.on('error.simplelightbox', function (e) {
  console.log(e);
});

// Додаю лістенери до елементів

// Лістенер для перевірки максимальної довжини введеної пошукової фрази
requestForm.addEventListener('input', checkMaxLengthRequestWords);

// Лістенер на сабміт форми
requestForm.addEventListener('submit', searchImages);

// Лістенер завантаження наступної сторінки результатів (пагінація)
loadMoreButton.addEventListener('click', loadMoreImages);

// Функція перевірки максимальної довжини введеної фрази
function checkMaxLengthRequestWords(event) {
  if (event.target.value.trim().length > 100) {
    iziToast.show(owerMaxLengthInputMessg);
    event.target.value = event.target.value.trim().slice(0, 100);
  }
}

// Функція отримання результатів при сабміті пошукової форми
function searchImages(event) {
  event.preventDefault();

  // Якщо поле пусте, то не відсилаємо запит
  if (event.currentTarget.requestField.value.trim().length === 0) {
    return;
  }

  // Показуюлоадер - сердечко <3
  loaderElement.classList.remove('visually-hidden');
  // Очищую галерею
  galleryList.innerHTML = '';
  // Очищую пошукову фразу
  responsePhrase = '';
  // Встановлюю номерсторінки, яка має бути по замовчуванні, передаю її тільки при пагінації
  page = 1;
  // Приховую кнопку Зававнтажити ше
  loadMoreButton.classList.add('visually-hidden');

  // Читаю пошукову фразу
  const responseUrl = event.currentTarget.requestField.value.trim();
  responsePhrase = responseUrl;
  requestForm.reset();

  // Роблю запит
  getResponseData(responseUrl, {})
    .then(data => {
      // Якщо масив даних порожній, то виводжу повідомлення і ретурнюся
      if (data.hits.length === 0) {
        iziToast.show(errFindImagesMessage);
        return;
      }
      // Створюю елементи галереї
      addGalleryElements(galleryList, data);
      gallery.refresh();
      //Ховаю кнопку
      loadMoreButton.classList.remove('visually-hidden');
      // Якщо кількість елементів у галереї рівна кількості максхітсів у запиті,
      // то ховаю кнопку і виводжу повідомлення.
      // Потрібно, якщо на ппершій сторінці менше 15 зображень
      if (data.totalHits === galleryList.childNodes.length) {
        loadMoreButton.classList.add('visually-hidden');
        iziToast.show(allImagesLoadded);
      }
      page++; // Збільшую лічильник торінок
    })
    .catch(() => {
      iziToast.show(errFindImagesMessage);
    })
    .finally(() => {
      loaderElement.classList.add('visually-hidden'); // Ховаю лоадер
    });
}

// Функція пагінації - натискання на кнопку завантажити більше
function loadMoreImages() {
  // Показую лоадер
  loaderElement.classList.remove('visually-hidden');
  // Скролю, щоб лоадер було видно
  window.scroll({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
  // Відсилаю запит Аксіосом, передаю номер сторінки page як параметр, який буде доадний у параметри запиту
  getResponseData(responsePhrase, { page })
    .then(data => {
      // Як і при сабміті при нуловій довжині данх виводжу повідомлення і ретьорн
      if (data.hits.length === 0) {
        iziToast.show(errFindImagesMessage);
        return;
      }
      // Додаю нові елементи галереї і оновлюю лайтбокс
      addGalleryElements(galleryList, data);
      gallery.refresh();

      // Якщо кількість елементів у галереї рівна кількості максхітсів у запиті,
      // то ховаю кнопку і виводжу повідомлення
      if (data.totalHits === galleryList.childNodes.length) {
        loadMoreButton.classList.add('visually-hidden');
        iziToast.show(allImagesLoadded);
      }
      // Беру елемент галереї, визначаю висоту і скролю вниз на дві висоти елемента
      const elementFormeasurement = document.querySelector('.gallery-item');
      const elementGeometry = elementFormeasurement.getBoundingClientRect();
      const scrollLongitude = elementGeometry.height * 2;
      window.scrollBy(0, scrollLongitude);
      page++; // Збільшую лічильник сторінки
    })
    .catch(() => {
      iziToast.show(errFindImagesMessage);
    })
    .finally(() => {
      loaderElement.classList.add('visually-hidden');
    });
}

// Показую кнопку Піднятися на початок, якщо на сторінці є скролл
window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    goToTopButton.classList.remove('visually-hidden');
  } else {
    goToTopButton.classList.add('visually-hidden');
  }
});

// Обробка натискання на кнопку Піднятися вгору і фокус на полі введення запиту
goToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  setTimeout(() => {
    searchField.focus();
  }, 500);
});
