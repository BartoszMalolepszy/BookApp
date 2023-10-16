/* global Handlebars, utils, dataSource */ //eslint-disable-line

//ćwiczenie 1 - dodanie referencji i wyświetlenie na stronie w oparciu o szablon

const select = {
  listOfBooks: '.books-list',
  form: '.filters',
  bookTemplate: '#template-book',
};

const templates = {
  bookTemplate: Handlebars.compile(
    document.querySelector(select.bookTemplate).innerHTML
  ),
};

class BooksList {
  constructor() {
    const thisBooksList = this;

    thisBooksList.favoriteBooks = [];
    thisBooksList.filters = [];

    thisBooksList.initData();
    thisBooksList.getElements();
    thisBooksList.render();
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

      thisBooksList.dom.booksList.appendChild(generatedDOM);
    }
  }

  getElements() {
    const thisBooksList = this;

    thisBooksList.dom = {};
    thisBooksList.dom.booksList = document.querySelector(select.listOfBooks);
    thisBooksList.dom.form = document.querySelector(select.form);
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
          const indexOfFilter = thisBooksList.filters.indexOf(event.target.value);
          thisBooksList.filters.splice(indexOfFilter, 1);
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

      const filteredBook = document.querySelector(
        '.book__image[data-id="' + book.id + '"]'
      ); // find book with corect id

      if (shouldBeHidden) {
        filteredBook.classList.add('hidden'); // ... and this book class hidden
      } else {
        filteredBook.classList.remove('hidden'); // remove class hidden when filter fits to book
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
