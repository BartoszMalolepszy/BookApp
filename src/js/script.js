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

  //ćwiczenie 2 - dodanie podówjnego kliknięcia do nowej tablicy favbooks
  const favoriteBooks = [];

  //>>dodanie nasłuchiwacza pętlą na każdą pozycję z książki
  function initAction() {
    console.log('initAction start');
    const bookImages = booksList.querySelectorAll('.book__image');

    for (let bookImage of bookImages) {
      bookImage.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const bookId = bookImage.getAttribute('data-id');
        console.log('zadziałał addEventListener na elemencie bookImage');
        if (!favoriteBooks.includes(bookId)) {
          bookImage.classList.add('favorite');
          favoriteBooks.push(bookId);
          console.log('dodano książkę do ulubiomnych');
        } else if (favoriteBooks.includes(bookId)) {
          const indexOfBook = favoriteBooks.indexOf(bookId);
          favoriteBooks.splice(indexOfBook, 1);
          bookImage.classList.remove('favorite');
          console.log('usunięto książkę z ulubionych');
        }
      });
    }
  }

  initAction();


  //>>nasłuchiwanie całego kontenera w event delegation; dbclick --> target

  //https://developer.mozilla.org/en-US/docs/Web/API/Element?retiredLocale=pl
}
