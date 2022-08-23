// ---------------- MODEL ----------------
// List with objects containing both the title and due date
let todos;

// localStorage.removeItem('todos');

// We get whatever is in local storage that has the key 'todos'
let savedTodos= localStorage.getItem('todos');

// Since we got a string from above (since local storage can only save and retrieve strings),
// we need to convert it back to an array
savedTodos = JSON.parse(savedTodos);

// Check if what is in savedTodos is an array. If it is the case, then we had previously
// saved it. If there was nothing saved (first time using the app), then they wouldn't
// return an array, but something else, like a blank element

let saved = false;
if (Array.isArray(savedTodos)) {
  saved = true;
}

// We check if we have saved the array in local storage before. If not, we save the default array
if (saved === true) {
  todos = savedTodos;
} else {
  todos =[{
  title: 'Get groceries',
  dueDate: '2021-10-04',
  id: '1',
  isDone: false,
  isEditing: false,
  titleEdit: '',
  dateEdit: ''
}, {
  title: 'Wash car',
  dueDate: '2021-10-03',
  id: '2',
  isDone: false,
  isEditing: false,
  titleEdit: '',
  dateEdit: ''
}, {
  title: 'Make dinner',
  dueDate: '2021-10-02',
  id: '3',
  isDone: false,
  isEditing: false,
  titleEdit: '',
  dateEdit: ''
}];
}



// Function that creates the todo with a given text and date
const createTodo = (title, dueDate) => {

  //IMPORTANT: Even though we now use closures instead of id's for the onclick
  // events of buttons of to todos that we create, note that we still have to keep
  // the id of each todo, so that we can use forEach when we want to remove or edit
  // a todo. But this is the only id we need for new todos.

  // We create the id as the current time in miliseconds. This is so that we can
  // delete an element with the id
  // Note that we add ''+ to convert the number to a string, so that we can comapre
  // it later correctly (otherwise we'd be comparing strings to numbers)
  const id = '' + new Date().getTime();

  todos.push({
    title: title,
    dueDate: dueDate,
    id: id,
    isDone: false,
    isEditing: false,
    titleEdit: '',
    dateEdit: ''
  });
}


// This function removes the todos that are marked as done
// Here we use the arrow function. if object.isDone is true, that means the
  // task is checked, and because we want to filter it out, we need to return
  // "false", and we achiebe that by negating
const removeDoneTodos = () => todos = todos.filter(object => !object.isDone);


// This function removes all the todos
const removeAllTodos = () => todos = [];


// This function sets the property isDone, which represents the ticked checkBox
const setisDoneToTrue = todo => {
  todos.forEach(object => {
    if (object.id === todo.id) {object.isDone = !object.isDone}
  });
}
  

// Function that deletes the todo corresponding to the delete botton that we just clicked
const removeTodo = idToDelete => todos = todos.filter(todo => !(todo.id === idToDelete));


// This function sets the property isEditing
const setisEditing = todoToEdit => {
  todos.forEach(object => {
    if (object.id === todoToEdit.id) {object.isEditing = true}
  });
}


// This function updates the properties title and dueDate
const udpateProperties = (todoToUdpate, inputBoxEdit, datePickerEdit) => {
  todos.forEach(object => {
    if (object.id == todoToUdpate.id) {
      object.title = inputBoxEdit.value;
      object.dueDate = datePickerEdit.value;
      object.isEditing = false;
    }
  });
}


// This function saves the todos array
// localStorage can only save strings, so we convert our todos array into a string
const saveTodos = () => localStorage.setItem('todos', JSON.stringify(todos));





// ---------------- CONTROLLER ----------------
// Function that responds to the click event of the Add Todo button.
// It retrieves the text and date an adds a new todo
const onAddTodo = () => {

  // Here we get the HTML element by an id, so we can work with it in javascript
  const textbox = document.getElementById('todo-title');
  const title = textbox.value;
  
  const datePicker = document.getElementById('date-picker');
  const dueDate = datePicker.value;
  
  createTodo(title, dueDate)

  // We erase the text in the input of the task we just created, so that the user
  // doesn't have to erase it when he wants to add another task
  textbox.value = '';

  // We render the updated list (in render() we also save to local data at the end)
  render();
}


// This function responds to the button "Delete done Todos", by deleting the todos
// that are marked as done
const onDeleteDoneTodos = () => {
  removeDoneTodos();

  // We render the updated list (in render() we also save to local data at the end)
  render();
}


// This function responds to the button "Delete all Todos", by deleting all todos
const onDeleteAllTodos = () => {
  removeAllTodos();

  // We render the updated list (in render() we also save to local data at the end)
  render();
}


// This function responds to the click of the checkbox, by setting the property
// isDone of the given object in todos to true or false
const onCheckBox = todo => {
  // We return a function because we are using closures
  return () => {
    setisDoneToTrue(todo);

    // We save the updated todo list, so that the property isDone is saved
    saveTodos();
  }
}


// This function responds to the button "Delete done Todos", by deleting the todos
// that are marked as done
const onDelete = todoToDelete => {
  // We are now using closures, so we passed the todo (todoToDelete) corresponding
  // the button we just clicked, and now we can access the todo list id directly,
  // first fetching the id of the button
  return () => {            
    removeTodo(todoToDelete.id);

    // We render the updated list (in render() we also save to local data at the end)
    render();
  }
}


// This function responds to the button "Edit", by setting the property
// idEditing to true, which we use in an if statement in render()
const onEdit = todoToEdit => {
  // We return a function because we are using closures
  return () => {
    setisEditing(todoToEdit);

    // We render the updated list (in render() we also save to local data at the end)
    render();
  }
}


// This function resonds to the button "Update", by taking the new task name
// and date, and saving it
const onUpdate = (todoToUdpate, inputBoxEdit, datePickerEdit) => {
  // We return a function because we are using closures
  return () => {
    udpateProperties(todoToUdpate, inputBoxEdit, datePickerEdit)
    
    // We render the updated list (in render() we also save to local data at the end)
    render();            
  }
}


// This function responds to the Enter key (only for the uppermost input bar),
// by adding the todo (same as clicking "Add Todo")
const clickPress = event  => {
  if (event.key === 'Enter') {
    onAddTodo();
  }
}



// ------------------ VIEW ------------------
// This function prints in the page the todos array,
// also adding the Delete button and the checkbox
const render = () => {

  // We retreave the div where all the todos will be appended
  const todoList = document.getElementById('todo-list');

  // We wipe out our list from the page (without deleting the array itself)
  todoList.innerHTML = '';
  
  // We create a div for each todo in the array and append them one after the other so
  // that they show up in the page
  todos.forEach(todo => {    
    // Create a Flexbox where all the elements of the new todo will be appended
    const todosLineFlexBox = document.createElement('div');
    todosLineFlexBox.className = 'todosLineFlexBox';

    // Create 2 more divs to divide the flexbox, so that we can use flexbox
    // to put the Edit and Delete buttons to the far right, so that it looks cleaner.
    // A left section where we will save the checkbox and the Text
    const todosLineBoxLeft = document.createElement('div');
    todosLineBoxLeft.className = 'todosLineBoxLeft';
    todosLineFlexBox.appendChild(todosLineBoxLeft);

    // A right section where we will save Edit and Delete botton
    const todosLineBoxRight = document.createElement('div');
    todosLineBoxRight.className = 'todosLineBoxRight';
    todosLineFlexBox.appendChild(todosLineBoxRight);
    

    // Create a div for the text
    const todosText = document.createElement('div');
    todosText.className = 'todosText';
    todosLineBoxLeft.appendChild(todosText);


    if (todo.isEditing !== true) {
    // Create the text
    todosText.innerText = todo.title + ' ' + todo.dueDate + ' ';           

    // Create the checkbox
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.style = 'margin-right: 10px';
      checkBox.onclick = onCheckBox(todo);
      // Important: when we create the checkbox, we look at the isDone property of the object,
      // because we want to check the box if we have just loaded the local data
      checkBox.checked = todo.isDone;

      todosLineBoxLeft.prepend(checkBox);
    

    // Create the Edit button
      const editButton = document.createElement('button');
      editButton.innerText = 'Edit';
      editButton.onclick = onEdit(todo);

      todosLineBoxRight.appendChild(editButton);


    // Create Delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.onclick = onDelete(todo);

      // We append it not to the todoList as a whole, but to the element itself, since
      // we want the button to appear at the end of the line, after the date
      todosLineBoxRight.appendChild(deleteButton);


    } else {
      const inputBoxEdit = document.createElement('input');
      inputBoxEdit.placeholder = 'Edit task';
      inputBoxEdit.style = 'margin-right: 10px';
      todosLineBoxLeft.appendChild(inputBoxEdit);

      const datePickerEdit = document.createElement('input');
      datePickerEdit.type = 'date';
      datePickerEdit.style = 'margin-right: 22px';
      todosLineBoxLeft.appendChild(datePickerEdit);

      const updateButton = document.createElement('button');
      updateButton.innerText = 'Update';
      updateButton.onclick = onUpdate(todo, inputBoxEdit, datePickerEdit);
      todosLineBoxRight.appendChild(updateButton);
    }

    // We append the todo line with everything (checkbox, title, date and Delte button)
    // to the div todoList, which is a box where all the the todosLine are added
    todoList.appendChild(todosLineFlexBox);
  });

  // We save the updated todo list every time we finish rendering
  saveTodos();
}

// Before, this render() was placed at the beginning, after definind the array of
// todos, to be able to render them whent he user loads the page for the first time.
// But after converting the functions to arrow functions, since then we have defined
// a variable for the function, this one has to be declared before we call it.
// And since render() was before these arrow functions, I got an error saying the functions
// were not defined. So I have moved this render() to the end of the code, after all the
// functions, since when we first load the page, no functions are called, because we have
// not interacted yet with the page. So the code then ends up at this last render(), so we
// can visualize the intitial array of todos
render();