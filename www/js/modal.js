// Get the modal and trigger elements
const modalHtml = document.querySelector('link[rel="import"]').import;
// ...
const modal = modalHtml.getElementById('modal');
// const trigger = document.getElementById('modal-trigger');

// Add event listener to trigger button
trigger.addEventListener('click', () => {
  modal.style.display = 'block'; // Show the modal
});

// Add event listener to close button
document.querySelector('.close').addEventListener('click', () => {
  modal.style.display = 'none'; // Hide the modal
});

// Add event listener to modal container (for clicking outside)
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none'; // Hide the modal
  }
});