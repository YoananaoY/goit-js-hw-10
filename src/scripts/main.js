import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

import { fetchBreeds, fetchCatByBreed, fetchImageCatByBreed } from './cat-api';

const refs = {
  selectCat: document.querySelector('.breed-selector'),
  sectionUserChoiceCat: document.querySelector('.cat-info'),
  loader: document.querySelector('span.loader'),
};

const catDescription = {
  breed: '',
  description: '',
  temperament: '',
  url: '',
};

fetchBreeds()
  .then(data => {
    createSelectorCat(data);
    toggleClassListTheLoader();
    createNewSlimSelect();
  })
  .catch(onFetchError);

function toggleClassListTheLoader() {
  refs.loader.classList.toggle('loader');
}

function createNewSlimSelect() {
  new SlimSelect({
    select: '#selectElement',
    events: {
      afterChange: newVal => {
        toggleClassListTheLoader();
        resetSectionUserChoiceCat();
        createSectionUserChoiceCat(newVal[0].value);
      },
    },
  });
}

async function createSectionUserChoiceCat(catId) {
  try {
    const catByBreed = await fetchCatByBreed(catId);
    updatecatDescriptionObj(catByBreed);
    const catUrlID = await fetchImageCatByBreed(catByBreed.reference_image_id);
    toggleClassListTheLoader();
    createMarkupUserChoiceCat(catUrlID.url);
  } catch (error) {
    onFetchError();
  }
}

function updatecatDescriptionObj(obj) {
  catDescription.breed = obj.name;
  catDescription.description = obj.description;
  catDescription.temperament = obj.temperament;
}

function resetSectionUserChoiceCat() {
  refs.sectionUserChoiceCat.innerHTML = '';
}

function createMarkupUserChoiceCat(url) {
  refs.sectionUserChoiceCat.innerHTML = `<img src="${url}" alt="cat breed ${catDescription.breed} " width="300">
   <div class="wrapper-description">
     <h2 class="cat-info-title">${catDescription.breed}</h2>
     <p class="cat-info-description">${catDescription.description}</p>
     <p class="cat-info-characteristic"><span class="cat-info-characteristic-title">Temperament: </span>${catDescription.temperament}</p>
   </div>`;
}

function createSelectorCat(arr) {
  const markup = createMarkupSelectCat(arr);
  refs.selectCat.innerHTML = markup;
}

function createMarkupSelectCat(arr) {
  let str = `<option value=""></option>`;
  for (const key of arr) {
    str += `<option value="${key.id}">${key.name}</option>`;
  }
  return str;
}

function onFetchError(error) {
  Notify.failure('Oops! Something went wrong! Try reloading the page!', {
    width: '350px',
    position: 'center-top',
    fontSize: '16px',
  });
  console.log(error);
}
