import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loaderContainer = document.querySelector('.loader-wrapper'); // <-- нове

let query = '';
let page = 1;
let totalHits = 0;
const perPage = 15;

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.currentTarget.elements.query.value.trim();
  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMore();
  hideLoader(); // раптом залишився
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({ message: 'No images found. Try again.' });
      return;
    }

    createGallery(data.hits);

    if (page * perPage < totalHits) {
      showLoadMore();
    }
  } catch (err) {
    iziToast.error({ message: 'Error fetching data.' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMore();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page, perPage);
    createGallery(data.hits);

    const totalPages = Math.ceil(totalHits / perPage);
    if (page < totalPages) {
      showLoadMore();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    // Scroll down
    scrollPage();
  } catch (error) {
    iziToast.error({ message: 'Something went wrong while loading more images.' });
  } finally {
    hideLoader();
  }
});

function showLoadMore() {
  loadMoreBtn.classList.remove('is-hidden');
}
function hideLoadMore() {
  loadMoreBtn.classList.add('is-hidden');
}

// 👇 Плавне прокручування
function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery-item')
    ?.getBoundingClientRect() || { height: 0 };

  if (cardHeight > 0) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
