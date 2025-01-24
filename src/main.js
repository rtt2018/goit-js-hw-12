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
let questionPhrase = '';
const per_page = 15;

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

requestForm.addEventListener('submit', event => {
  loadImages(event, true);
});

loadMoreButton.addEventListener('click', event => {
  loadImages(event, false);
});

async function loadImages(event, isSubmit) {
  if (isSubmit) {
    event.preventDefault();
  }

  if (isSubmit && event.currentTarget.requestField.value.trim().length === 0) {
    return;
  }

  if (isSubmit) {
    loaderElement.classList.remove('visually-hidden');
    galleryList.innerHTML = '';
    questionPhrase = '';
    page = 1;
    loadMoreButton.classList.add('visually-hidden');

    questionPhrase = event.currentTarget.requestField.value.trim();
    requestForm.reset();
  } else {
    loaderElement.classList.remove('visually-hidden');
    window.scroll({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }

  try {
    const { hits, totalHits } = await getResponseData(questionPhrase, {
      per_page,
      page,
    });

    if (hits.length === 0) {
      iziToast.show(errFindImagesMessage);
      return;
    }

    addGalleryElements(galleryList, hits);
    gallery.refresh();

    loadMoreButton.classList.remove('visually-hidden');

    //if (data.totalHits === galleryList.childNodes.length) {
    if (Math.ceil(totalHits / per_page) === page) {
      loadMoreButton.classList.add('visually-hidden');
      iziToast.show(allImagesLoadded);
    }

    if (!isSubmit) {
      const elementFormeasurement = document.querySelector('.gallery-item');
      const elementGeometry = elementFormeasurement.getBoundingClientRect();
      const scrollLongitude = elementGeometry.height * 2;
      window.scrollBy(0, scrollLongitude);
    }

    page++;
  } catch (error) {
    iziToast.show(errFindImagesMessage);
  } finally {
    loaderElement.classList.add('visually-hidden');
  }
}

function checkMaxLengthRequestWords(event) {
  if (event.target.value.trim().length > 100) {
    iziToast.show(owerMaxLengthInputMessg);
    event.target.value = event.target.value.trim().slice(0, 100);
  }
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
