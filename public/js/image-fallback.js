document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.onerror = function() {
      this.src = '/images/svg/No_image_available.svg';
    };
  });
});