const pagination = document.querySelector(".pagination .page-item.active a");

function handlePageMove(event) {
  event.preventDefault();
}

if (pagination) {
  pagination.addEventListener("click", handlePageMove);
}
