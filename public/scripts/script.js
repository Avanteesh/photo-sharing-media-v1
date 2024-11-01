const addToFavouriteForm = document.querySelector(".add-to-favourite-form");
const addToFavBtn = document.querySelector("#add-to-favourite-btn");
const createNewPostBtn = document.querySelector(".add-post-btn");
const newPostDialog = document.querySelector(".new-post-embedder");
const imageInputNew = document.querySelector(".new-post-input");
const cancelNewPostBtn = document.querySelector("#new-post-canceller");
const postImageViewer = document.querySelector(".post-image-viewer");
const newPostForm = document.querySelector(".new-post-form");

function dateFormatted()  {
  const curr = new Date();
  let [month,day,hour,minutes,seconds] = [
    (curr.getMonth()+1) < 10?`${curr.getMonth()}`:`${curr.getMonth()+1}`,
    curr.getDate() < 10?`0${curr.getDate()}`:`${curr.getDate()}`,
    curr.getHours() < 10?`0${curr.getHours()}`:`${curr.getHours()}`,
    curr.getMinutes() < 10? `0${curr.getMinutes()}`:`${curr.getMinutes()}`,
    curr.getSeconds() < 10? `0${curr.getSeconds()}`:`${curr.getSeconds()}`
  ];
  return `${curr.getFullYear()}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}
    
function addToFavouritePost()  {
  if (addToFavBtn !== null)  {
    addToFavBtn.className = 'bi bi-star-fill';
    addToFavBtn.style.color = '#fa3c52';
    addToFavouriteForm.submit();
  }
} 

newPostForm.onsubmit = function()  {
  setTimeout(function()  {
    newPostDialog.close();
    location.reload();
  }, 300);
}

function updateCursorDialogClose()  {
  cancelNewPostBtn.style.cursor = 'pointer';
  cancelNewPostBtn.className = 'bi bi-x-circle-fill';
  setTimeout(function() {
    cancelNewPostBtn.className = 'bi bi-x-circle';
  }, 800);
}

function fetchImageFile(event)  {
  const reader = new FileReader();
  const file = Array.from(imageInputNew.files).at(0);
  document.querySelector(".image-viewer").style.display = 'grid';
  reader.addEventListener("load", function() {
    postImageViewer.src = reader.result;
    document.querySelector(".image-buffer").value = reader.result;
  }, false);
  if (file) 
    reader.readAsDataURL(file);
}

function newPostFormOpen()  {
  newPostDialog.showModal();
}

function confirmCloseDialog()   {
  if (window.confirm("are you sure you want to close? The post will be discarded"))  
    newPostDialog.close();
}

setInterval(function() {
  document.querySelector(".date-now").value = dateFormatted();   
}, 1000);
    
    
cancelNewPostBtn.onmouseover = updateCursorDialogClose;
imageInputNew.onchange = fetchImageFile;
createNewPostBtn.onclick = newPostFormOpen;
cancelNewPostBtn.onclick = confirmCloseDialog;

