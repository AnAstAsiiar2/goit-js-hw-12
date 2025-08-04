import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMore,
  hideLoadMore,
  scrollPage,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

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
  hideLoader();
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

    scrollPage();
  } catch (error) {
    iziToast.error({ message: 'Something went wrong while loading more images.' });
  } finally {
    hideLoader();
  }
});


