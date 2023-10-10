/* global Handlebars, utils, dataSource */ //eslint-disable-line

//ćwiczenie 1 - dodanie referencji i wyświetlenie na stronie w oparciu o szablon
{
  ('use strict');
  const booksList = document.querySelector('.books-list');
  const booksTemplate = Handlebars.compile(
    document.querySelector('#template-book').innerHTML
  );

  function render() {
    for (let book of dataSource.books) {
      const generatedHTML = booksTemplate(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      booksList.appendChild(generatedDOM);
    }
  }
  render();

  //ćwiczenie 2 - dodanie podówjego kliknięcia do nowej tablicy favbooks
  const favoriteBooks = [];

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
    const filters = [];
    const filtersForm = document.querySelectorAll('.filters');

    filtersForm.addEventListener('click', function (event) {
      if (
        event.target.tagName == 'INPUT' &&
        event.target.type == 'checkbox' &&
        event.target.name == 'filter'
      ) {
        console.log(filtersForm.target.value); //

        if (event.target.checked) {
          // if clicked add it to filters array
          filters.push(event.target.value);
        } else if (!event.target.checked) {
          // if not, delete
          filters.splice(filters.indexOf(event.target.value), 1);
        }
      }
      console.log('filters', filters);
    });
  } // Dodane zamknięcie funkcji initAction

  //adding filters

  initAction();

  //>>nasłuchiwanie całego kontenera w event delegation; dbclick --> target

  //https://developer.mozilla.org/en-US/docs/Web/API/Element?retiredLocale=pl
}
