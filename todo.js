// Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListener();

function eventListener() {
  // Tüm event listenerlar
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
  if (confirm("Tümünü silmek istediğinizden emin msiiniz?")) {
    //arayüzden temizleme
    // todoList.innerHTML = "";  yavaş olduğu için küçük projede kullanılabilir sadece

    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
  }
}

function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      //bulamadı senaryosu

      listItem.setAttribute("style", "display: none !important");
    } else {
      listItem.setAttribute("style", "display: block !important");
    }
  });
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function deleteTodoFromStorage(deletetodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deletetodo) {
      todos.splice(index, 1); //arrayın değerini silmek için
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}
function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("info", "Todo başarıyla silindi");
  }
}
function addTodo(e) {
  const newTodo = todoInput.value.trim();
  let todos = getTodosFromStorage();
  if (newTodo === "") {
    // <div class="alert alert-warning" role="alert">
    //                 This is a warning alert—check it out!
    //               </div>

    showAlert("warning", "Lütfen todo alanını boş bırakmayınız...");
  } else if (todos.includes(newTodo)) {
    showAlert("dark", "Aynı tododan daha önce girilmiştir!.");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo başarıyla eklendi...");
  }

  e.preventDefault();
}
function getTodosFromStorage() {
  //Storageden todoları alma fonksiyonu
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  return todos;
}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  localStorage.setItem("todos", JSON.stringify(todos));
}
function showAlert(type, message) {
  const alert = document.createElement("div");

  alert.className = `alert alert-${type}`;

  alert.textContent = message;

  firstCardBody.appendChild(alert);

  //setTimeout

  setTimeout(function () {
    alert.remove();
  }, 2000);
}

function addTodoToUI(newTodo) {
  // String degereini list item olarak uıya geçiriyor
  // List item oluşturma
  const listItem = document.createElement("li");
  //Link oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";

  //Text Node ekleme
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  todoList.appendChild(listItem);
  todoInput.value = "";
}
