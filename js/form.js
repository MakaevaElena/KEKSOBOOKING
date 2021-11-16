import { GLOSSARY_TYPES } from './data.js';
import { sendData } from './api.js';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_ROOMS = '100';
const MIN_GUESTS = '0';
const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const title = adForm.querySelector('#title');
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');
const price = adForm.querySelector('#price');
const type = adForm.querySelector('#type');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');

const doFormDisable = (form) => {
  form.classList.add(`${form.classList[0]}--disabled`);

  const formChildren = Array.from(form.children);
  formChildren.forEach((element) => {
    element.setAttribute('disabled', 'disabled');
  });
};

const doFormActive = (form) => {
  form.classList.remove(`${form.classList[0]}--disabled`);

  const formChildren = Array.from(form.children);
  formChildren.forEach((element) => {
    element.removeAttribute('disabled', 'disabled');
  });
};

doFormDisable(adForm);
doFormDisable(mapFilters);

const onSelectMinPrice = () => {
  price.min = GLOSSARY_TYPES[type.value].price;
  price.placeholder = GLOSSARY_TYPES[type.value].price;
};
type.addEventListener('change', onSelectMinPrice);

title.addEventListener('input', () => {
  title.setCustomValidity('');
  title.style = '';
  if (title.value.length > MAX_TITLE_LENGTH) {
    title.setCustomValidity(`Заголовок должен быть меньше ${MAX_TITLE_LENGTH}`);
  }
  if (title.value.length < MIN_TITLE_LENGTH) {
    title.setCustomValidity(`Заголовок должен быть больше ${MIN_TITLE_LENGTH}`);
  }
  title.reportValidity();
});

type.addEventListener('change', () => {
  price.style = '';
  if (Number(price.value) < Number(GLOSSARY_TYPES[type.value].price)) {
    price.setCustomValidity(`Цена должна быть не менее ${Number(GLOSSARY_TYPES[type.value].price)}`);
  }
  if (Number(price.value) > Number(price.max)) {
    price.setCustomValidity(`Цена должна быть не более ${Number(price.max)}`);
  }
  price.setCustomValidity('');
  price.reportValidity();
});

const compareCapacityAndRoomNumber = () => {
  roomNumber.setCustomValidity('');
  roomNumber.style = '';
  capacity.setCustomValidity('');
  capacity.style = '';

  if (Number(roomNumber.value) < Number(capacity.value) && roomNumber.value !== MAX_ROOMS) {
    roomNumber.setCustomValidity('количество комнат недостаточно');
    roomNumber.style = 'border: 2px solid red';
  }
  if (roomNumber.value === MAX_ROOMS && capacity.value !== MIN_GUESTS) {
    roomNumber.setCustomValidity('вариант 100 комнат только "не для гостей"');
  }
  if (capacity.value === MIN_GUESTS && roomNumber.value !== MAX_ROOMS) {
    capacity.setCustomValidity('выберите количество гостей');
  }
  roomNumber.reportValidity();
  capacity.reportValidity();
};

roomNumber.addEventListener('change', () => { compareCapacityAndRoomNumber(); });
capacity.addEventListener('change', () => { compareCapacityAndRoomNumber(); });

timeOut.addEventListener('change', () => {
  timeIn.value = timeOut.value;
});
timeIn.addEventListener('change', () => {
  timeOut.value = timeIn.value;
});

const onSuccessMessageEscape = (evt) => {
  const popupSuccess = document.querySelector('.success');
  evt.preventDefault();
  if (evt.key === 'Escape') {
    popupSuccess.remove();
  }
  popupSuccess.remove();
  document.removeEventListener('keydown', onSuccessMessageEscape);
  document.removeEventListener('click', onSuccessMessageEscape);
};

const onErrorMessageEscape = (evt) => {
  const popupError = document.querySelector('.error');
  evt.preventDefault();
  if (evt.key === 'Escape') {
    popupError.remove();
  }
  popupError.remove();
  document.removeEventListener('keydown', onErrorMessageEscape);
  document.removeEventListener('click', onErrorMessageEscape);
};

const successMesage = document.querySelector('#success')
  .content;
const createSuccessMesage = () => {
  const successPopUp = successMesage.cloneNode(true);
  document.addEventListener('keydown', onSuccessMessageEscape);
  document.addEventListener('click', onSuccessMessageEscape);
  document.body.appendChild(successPopUp);
};

const errorMesage = document.querySelector('#error')
  .content;
const createErrorMesage = () => {
  const errorPopUp = errorMesage.cloneNode(true);
  document.addEventListener('keydown', onErrorMessageEscape);
  document.addEventListener('click', onErrorMessageEscape);
  document.body.appendChild(errorPopUp);
};

const setUserFormSubmit = (callback) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    sendData(
      () => {
        createSuccessMesage();
        callback();
      },
      () => createErrorMesage(),
      new FormData(evt.target),
    );
  });
};

export { setUserFormSubmit, adForm, mapFilters, doFormActive };
