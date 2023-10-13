/* global Handlebars, utils, dataSource */ //eslint-disable-line

//ćwiczenie 1 - dodanie referencji i wyświetlenie na stronie w oparciu o szablon

('use strict');
const booksList = document.querySelector('.books-list');
const booksTemplate = Handlebars.compile(
  document.querySelector('#template-book').innerHTML
);

function render() {
  for (let book of dataSource.books) {
    book.ratingBgc = determineRatingBgc(book.rating);
    book.ratingWidth = book.rating * 10;

    const generatedHTML = booksTemplate(book);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    booksList.appendChild(generatedDOM);
  }
}
const determineRatingBgc = (book) => {
  if (book.rating < 6) {
    return 'linear - gradient(to bottom, #fefcea 0 %, #f1da36 100 %)';
  } else if (book.rating > 6 && book.rating <= 8) {
    return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
  } else if (book.rating > 8 && book.rating <= 9) {
    return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
  } else if (book.rating > 9) {
    return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
  }
};

//ćwiczenie 2 - dodanie podwójnego kliknięcia do nowej tablicy favbooks
const favoriteBooks = [];

const filters = [];
const filtersForm = document.querySelector('.filters');

//>>dodanie nasłuchiwacza pętlą na każdą pozycję z książki
function initAction() {
  console.log('initAction start');
  // const bookImages = booksList.querySelectorAll('.book__image');

  booksList.addEventListener('dblclick', function (event) {
    event.preventDefault();
    const clickedElement = event.target.offsetParent;
    const bookImage = clickedElement;
    const bookId = bookImage.getAttribute('data-id');
    console.log('zadziałał addEventListener na elemencie bookImage');
    if (
      !clickedElement.classList.contains('favorite') &&
      clickedElement.classList.contains('book__image')
    ) {
      bookImage.classList.add('favorite');
      favoriteBooks.push(bookId);
      console.log('dodano książkę do ulubionych');
    } else if (clickedElement.classList.contains('favorite')) {
      clickedElement.classList.remove('favorite');
      const indexOfBook = favoriteBooks.indexOf(bookId);
      favoriteBooks.splice(indexOfBook, 1);
      console.log('usunięto książkę z ulubionych');
    }
  });
  // Listener for filters
  console.log(filtersForm);

  filtersForm.addEventListener('click', function (event) {
    if (
      event.target.tagName == 'INPUT' &&
      event.target.type == 'checkbox' &&
      event.target.name == 'filter'
    ) {
      console.log(event.target.value);

      if (event.target.checked) {
        filters.push(event.target.value);
      } else {
        filters.splice(filters.indexOf(event.target.value), 1);
      }
    }
    console.log('filters', filters);
    filterBooks();
  });
}
// Zamknięcie funkcji initAction

function filterBooks() {
  // filter books according to chosen option
  for (let book of dataSource.books) {
    let shouldBeHidden = false;

    for (let filter of filters) {
      // does chosen filter fits to each book details?
      if (!book.details[filter]) {
        shouldBeHidden = true; // if it doesnt fit, stop loop and...
        break;
      }
    }

    const filteredBooks = document.querySelector(
      '.book__image[data-id="' + book.id + '"]'
    ); // ...find book with corect id...

    if (shouldBeHidden) {
      filteredBooks.classList.add('hidden'); //  this book class hidden
    } else if (!shouldBeHidden) {
      filteredBooks.classList.remove('hidden'); // remove class hidden when filter fits to book
    }
  }

  function init() {
    render();
    initAction();
  }
  init();
}
