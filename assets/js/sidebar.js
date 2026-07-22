import { resizeToFullCover } from "./common";

const sidebarMask = document.createElement('div');
sidebarMask.style.position = 'fixed';
sidebarMask.style.margin = '0';
sidebarMask.style.minWidth = '100%';
sidebarMask.style.zIndex = '-1';
var sidebarMenuState = 0;

async function toggleSidebarMenu(sbm) {
  if (sidebarMenuState === 0) {
    sbm.classList.add('unfolding');
    sbm.appendChild(sidebarMask);
    resizeToFullCover(sidebarMask);
    sidebarMenuState = 1;
  } else {
    sbm.classList.remove('unfolding');
    sbm.removeChild(sidebarMask);
    sidebarMenuState = 0;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const sidebarMenu = document.querySelector('#sidebar #sidebar-menu');
  const sidebarBtn = document.querySelector('#sidebar-btn');
  const allLinks = document.querySelectorAll('#sidebar #sidebar-menu a:not(.dropup-menu-btn)');
  sidebarMenu.style.zIndex = 10;
  sidebarBtn.addEventListener('click', () => {
    toggleSidebarMenu(sidebarMenu);
  });
  allLinks.forEach((ele) => {
    ele.addEventListener('click', () => {
      toggleSidebarMenu(sidebarMenu);
    });
  });
  sidebarMask.addEventListener('click', () => {
    toggleSidebarMenu(sidebarMenu);
  });
});

window.addEventListener('resize', () => {
  if (sidebarMenuState === 1) {
    resizeToFullCover(sidebarMask);
  }
});
