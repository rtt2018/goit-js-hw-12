import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import iconSvgError from './img/allert.svg';
import iconSvgWarning from './img/warning.svg';
import getRequestURL from './js/pixabay-api.js';
import addGalleryElements from './js/render-functions.js';

const galleryList = document.querySelector('.gallery');
const loaderElement = document.querySelector('.loader');
const requestForm = document.querySelector('.search-form');

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

requestForm.addEventListener('input', checkMaxLengthRequestWords);

requestForm.addEventListener('submit', searchImages);

function checkMaxLengthRequestWords(event) {
  if (event.target.value.trim().length > 100) {
    iziToast.show(owerMaxLengthInputMessg);
    event.target.value = event.target.value.trim().slice(0, 100);
  }
}
function searchImages(event) {
  // 1. Показуємо лоадер
  // 2. Відсилаємо запит
  // 3. Отримуємо респонз від беку
  // 4. Ховаємо лоадер
  // 5. Обробляємо результат
  //   5.1 Якщо результат прийшов без зображень, то виводимо повідомленння
  //   5.2 Якщо зображення знайдено, додаємо елементи у галерею
  // 6.Робимо релоад сімпллайтбоксу
  // 7. Очищуємо все

  event.preventDefault();
  if (event.currentTarget.requestField.value.trim().length === 0) {
    return;
  }
  loaderElement.classList.remove('visually-hidden');
  galleryList.innerHTML = '';

  const responseUrl = getRequestURL(
    event.currentTarget.requestField.value.trim()
  );
  requestForm.reset();

  fetch(responseUrl, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.show(errFindImagesMessage);
        return;
      }
      addGalleryElements(galleryList, data);
      gallery.refresh();
    })
    .catch(() => {
      iziToast.show(errFindImagesMessage);
    })
    .finally(() => {
      loaderElement.classList.add('visually-hidden');
    });
}
