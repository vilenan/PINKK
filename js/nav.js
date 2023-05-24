const burger = document.querySelector ('.burger');
const menu = document.querySelector ('.navigation');
const body = document.querySelector('.page__body');
const header = document.querySelector('.header');
const headerHeight = header.offsetHeight;
console.log(headerHeight);

document.querySelector(':root').style.setProperty('--header-height', `${headerHeight}px`);

burger.addEventListener('click', function(){
    burger.classList.toggle('burger--active');
    menu.classList.toggle('navigation--active');
    body.classList.toggle('no-scroll');
});
