import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import iconSvgError from './img/allert.svg';
import iconSvgWarning from './img/warning.svg';
import getResponseData from './js/pixabay-api.js';
import addGalleryElements from './js/render-functions.js';

const galleryList = document.querySelector('.gallery');
const loaderElement = document.querySelector('.loader');
const requestForm = document.querySelector('.search-form');
const loadMoreButton = document.getElementById('loadMoreBtn');
const goToTopButton = document.querySelector('.go-top-button');
const searchField = document.querySelector('.search-field');

let page = 1;
let responsePhrase = '';

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

loadMoreButton.addEventListener('click', loadMoreImages);

function checkMaxLengthRequestWords(event) {
  if (event.target.value.trim().length > 100) {
    iziToast.show(owerMaxLengthInputMessg);
    event.target.value = event.target.value.trim().slice(0, 100);
  }
}
function searchImages(event) {
  event.preventDefault();
  if (event.currentTarget.requestField.value.trim().length === 0) {
    return;
  }
  loaderElement.classList.remove('visually-hidden');
  galleryList.innerHTML = '';
  responsePhrase = '';
  page = 1;
  loadMoreButton.classList.add('visually-hidden');

  const responseUrl = event.currentTarget.requestField.value.trim();
  responsePhrase = responseUrl;
  requestForm.reset();

  getResponseData(responseUrl, {})
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.show(errFindImagesMessage);
        return;
      }
      addGalleryElements(galleryList, data);
      gallery.refresh();
      loadMoreButton.classList.remove('visually-hidden');
      page++;
    })
    .catch(() => {
      iziToast.show(errFindImagesMessage);
    })
    .finally(() => {
      loaderElement.classList.add('visually-hidden');
    });
}

function loadMoreImages() {
  loaderElement.classList.remove('visually-hidden');
  window.scroll({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
  getResponseData(responsePhrase, { page })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.show(errFindImagesMessage);
        return;
      }

      addGalleryElements(galleryList, data);
      gallery.refresh();

      if (data.totalHits === galleryList.childNodes.length) {
        loadMoreButton.classList.add('visually-hidden');
        iziToast.show(allImagesLoadded);
      }
      const elementFormeasurement = document.querySelector('.gallery-item');
      const elementGeometry = elementFormeasurement.getBoundingClientRect();
      const scrollLongitude = elementGeometry.height * 2;
      window.scrollBy(0, scrollLongitude);
      page++;
    })
    .catch(() => {
      iziToast.show(errFindImagesMessage);
    })
    .finally(() => {
      loaderElement.classList.add('visually-hidden');
    });
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    goToTopButton.classList.remove('visually-hidden');
  } else {
    goToTopButton.classList.add('visually-hidden');
  }
});

goToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  setTimeout(() => {
    searchField.focus();
  }, 500);
});
