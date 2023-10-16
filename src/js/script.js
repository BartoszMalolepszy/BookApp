/* global Handlebars, utils, dataSource */ //eslint-disable-line

//ćwiczenie 1 - dodanie referencji i wyświetlenie na stronie w oparciu o szablon

const select = {
  listOfBooks: '.books-list',
  form: '.filters',
  bookImage: '.book__image',
};

const templates = {
  bookTemplate: Handlebars.compile(
    document.querySelector('#template-book').innerHTML
  ),
};

class BooksList {
  constructor() {
    const thisBooksList = this;

    thisBooksList.favoriteBooks = [];
    thisBooksList.filters = [];
    thisBooksList.dom = [];

    thisBooksList.initData();
    thisBooksList.render();
    thisBooksList.getElements();
    thisBooksList.initActions();
  }

  initData() {
    const thisBooksList = this;

    thisBooksList.data = dataSource.books;
  }

  render() {
    // for every book render HTML, DOM element and add it to book list
    const thisBooksList = this;

    for (let book of thisBooksList.data) {
      console.log('pojdyńcza ksiązka w render:', book);
      console.log('rating tej książki:', book.rating);
      book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
      book.ratingWidth = book.rating * 10;

      const generatedHTML = templates.bookTemplate(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      thisBooksList.dom.booksList = document.querySelector(select.listOfBooks);
      thisBooksList.dom.booksList.appendChild(generatedDOM);
    }
  }

  getElements() {
    const thisBooksList = this;

    thisBooksList.dom = {};
    thisBooksList.dom.booksList = document.querySelector(select.listOfBooks);
    thisBooksList.dom.form = document.querySelector('.filters');
  }

  initActions() {
    const thisBooksList = this;

    thisBooksList.dom.booksList.addEventListener('dblclick', function (event) {
      // add event listener to whole book list
      const clickedBook = event.target.closest('a');

      event.preventDefault();

      let bookId = clickedBook.getAttribute('data-id');

      if (!thisBooksList.favoriteBooks.includes(bookId)) {
        // add books to favorite list
        clickedBook.classList.add('favorite');
        thisBooksList.favoriteBooks.push(bookId);
        console.log(thisBooksList.favoriteBooks);
      } else {
        const indexOfBook = thisBooksList.favoriteBooks.indexOf(bookId);
        thisBooksList.favoriteBooks.splice(indexOfBook, 1);
        clickedBook.classList.remove('favorite');
        console.log(thisBooksList.favoriteBooks);
      }
    });

    thisBooksList.dom.form.addEventListener('click', function (event) {
      // filters, display on website book by checkbox
      if (
        event.target.tagName == 'INPUT' &&
        event.target.type == 'checkbox' &&
        event.target.name == 'filter'
      ) {
        console.log(event.target.value); // show clicked input value

        if (event.target.checked) {
          // if clicked add it to filters array
          thisBooksList.filters.push(event.target.value);
        } else {
          // if not, delete
          thisBooksList.filters.splice(
            thisBooksList.filters.indexOf(event.target.value),
            1
          );
        }
      }
      console.log('filters', thisBooksList.filters);

      thisBooksList.filterBooks();
    });
  }

  filterBooks() {
    // filter books according to chosen option
    const thisBooksList = this;

    for (let book of thisBooksList.data) {
      let shouldBeHidden = false;

      for (let filter of thisBooksList.filters) {
        // does chosen filter fits to each book details?
        if (!book.details[filter]) {
          shouldBeHidden = true; // if it doesnt fit, stop loop and...
          break;
        }
      }

      const toggledClassToBooks = document.querySelector(
        '.book__image[data-id="' + book.id + '"]'
      ); // find book with corect id

      if (shouldBeHidden) {
        toggledClassToBooks.classList.add('hidden'); // ... and this book class hidden
      } else {
        toggledClassToBooks.classList.remove('hidden'); // remove class hidden when filter fits to book
      }
    }
  }

  determineRatingBgc(rating) {
    // determine rating color
    if (rating < 6) {
      return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
}

const app = new BooksList();
console.log(app);

/* const booksList = document.querySelector('.books-list');
const booksTemplate = Handlebars.compile(
  document.querySelector('#template-book').innerHTML
);

function render() {
  for (let book of dataSource.books) {
    console.log('pojdyńcza ksiązka w render:', book);
    console.log('rating tej książki:', book.rating);
    book.ratingBgc = determineRatingBgc(book.rating);
    book.ratingWidth = book.rating * 10;

    const generatedHTML = booksTemplate(book);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    booksList.appendChild(generatedDOM);
  }
}
const determineRatingBgc = (rating) => {
  if (rating < 6) {
    return 'linear - gradient(to bottom, #fefcea 0 %, #f1da36 100 %)';
  } else if (rating > 6 && rating <= 8) {
    return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
  } else if (rating > 8 && rating <= 9) {
    return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
  } else if (rating > 9) {
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
}
function init() {
  render();
  initAction();
}

init();
*/
