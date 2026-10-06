import './dropdown.js';
import './dropup-menu.js';
import './sidebar.js';
import './figure.js';
import './banners.js';
import './inline-news.js';
import './adaptive-table.js';
import './adaptive-agenda.js';
import { initSectionNav } from './section-nav.js';
import { resizeToFullCover } from "./common";

homePageCover = undefined;
function resizeHeaderCover() {
  if ( ! homePageCover ) {
    return
  }
  resizeToFullCover(homePageCover);
}

window.addEventListener('DOMContentLoaded', () => {
  homePageCover = document.querySelector('#home-page-cover');
  resizeHeaderCover();
  const allFullwebSections = document.querySelectorAll('.fullweb-section');
  allFullwebSections.forEach((ele) => {
    resizeToFullCover(ele);
  });
  initSectionNav();
});

window.addEventListener('resize', () => {
  resizeHeaderCover();
  const allFullwebSections = document.querySelectorAll('.fullweb-section');
  allFullwebSections.forEach((ele) => {
    resizeToFullCover(ele);
  });
});
