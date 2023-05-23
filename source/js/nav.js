const headerToggle = document.querySelector ('.header__toggle');
const headerEl = document.querySelector ('.header');

headerEl.classList.remove('header--nojs');

headerToggle.addEventListener('click', function(){
  if (headerEl.classList.contains('header--nav-opened')) {
    headerEl.classList.remove('header--nav-opened');
    headerEl.classList.add('header--nav-closed');
  } else {
    headerEl.classList.add('header--nav-opened');
    headerEl.classList.remove('header--nav-closed');
  }
});
