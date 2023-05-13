// Get the footer element
const footer = document.querySelector('footer');

// Get the current Y position of the footer element
const footerY = footer.getBoundingClientRect().y;

// Get the height of the viewport
const viewportHeight = window.innerHeight;

// If the footer is not at the bottom of the viewport or below it, set it to the bottom of the page
if (footerY < viewportHeight) {
    footer.style.position = 'absolute';
    footer.style.bottom = '0';
}
