
//func for get set info to local storage
function saveDataToLocalStorage(key, objArr) {
  localStorage.setItem(key, JSON.stringify(objArr))
}

//create array for obj
let taskObjArr = []

//key for local storage
let keyName = ''

//checker for true or false
let checker = false

//func create new id
function getNewId(arr) {
  let max = 0;
  for (const item of arr) {
    if (parseInt(item.id) > max) max = parseInt(item.id);
  }
  return max + 1;
}

//create and back div of app
function createAppDiv(divClass) {
  let appDiv = document.createElement('div')
  appDiv.classList.add(divClass)
  return appDiv
}

//create and back the new title of app
function createAppTitle(title) {
  let appTitle = document.createElement('h2')
  appTitle.innerHTML = title
  return appTitle
}

//create and back the btn of app
function createAppButton(btnClass, text) {
  let appBtn = document.createElement('button')
  appBtn.classList.add(btnClass)
  appBtn.textContent = text
  return appBtn
}

//create and back element p 
function createTodoParagraph(className, text) {
  let paragraph = document.createElement('p')
  paragraph.classList.add(className)
  paragraph.textContent = text
  return paragraph
}

//create and back the form with input and button
function createTodoItemForm() {
  let form = document.createElement('form')
  let input = document.createElement('input')
  let buttonWrapper = document.createElement('div')
  let button = document.createElement('button')

  form.classList.add('input-group', 'mb-3')
  input.classList.add('form-control')
  input.placeholder = 'Enter the name of the new task'
  buttonWrapper.classList.add('input-group-append')
  button.classList.add('btn', 'btn-primary')
  button.textContent = 'Add task'

  button.disabled = true; // For block button

  buttonWrapper.append(button)
  form.append(input)
  form.append(buttonWrapper)

  return {
    form,
    input,
    button
  }
}

//create variable for create form func
let todoItemForm = createTodoItemForm()

//create and back element ul 
function createTodoList() {
  let list = document.createElement('ul')
  list.classList.add('list-group')
  return list
}

//create variable for create list func
let todoList = createTodoList()

//create and back element li 
function createTodoListElement() {
  let li = document.createElement('li')
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
  return li
}

//create and back the elements of list(ul) -- list-item(li)
function createTodoItem(obj, keyName) {

  //create li
  let item = createTodoListElement()

  //add class at txt in li
  let txtBox = createAppDiv('d-flex')

  //add txt at li
  let txt1 = createTodoParagraph('text', `${obj.id}.`)
  let txt2 = createTodoParagraph('text', obj.name)
  let txt3 = createTodoParagraph('text', obj.done)

  //create buttons and div for button group
  let buttonGroup = createAppDiv('btn-group', 'btn-box')
  let doneButton = createAppButton('btn', 'Done')
  let deleteButton = createAppButton('btn', 'Remove')

  //add class and txt at button
  buttonGroup.classList.add('btn-group-sm', 'btn-box')
  doneButton.classList.add('btn-success')
  deleteButton.classList.add('btn-danger')

  //add button in div button group
  buttonGroup.append(doneButton, deleteButton)

  //add event listener for buttons
  doneButton.addEventListener('click', function () {
    item.classList.toggle('list-group-item-success') //add class if user click at btn
    // find object[id]
    let id = parseInt(txtBox.childNodes[0].textContent)

    let objIndex = taskObjArr.findIndex(obj => obj.id === id);
    if (objIndex !== -1) {

      //change txt content at li for done status checker
      checker = !checker;
      // Update checker if class list contains 
      txt3.textContent = checker ? 'true' : 'false';

      //change done status at object
      taskObjArr[objIndex].done = checker;

      saveDataToLocalStorage(keyName, taskObjArr) //send list to local storage
    }
  })

  deleteButton.addEventListener('click', function () {
    if (confirm('Are you sure?')) {

      let idToRemove = parseInt(txtBox.childNodes[0].textContent);

      // Find the index of the object in taskObjArr with the matching ID
      let objIndex = taskObjArr.findIndex(obj => obj.id === idToRemove);
      if (objIndex !== -1) {

        taskObjArr.splice(objIndex, 1); //remove obj at array 

        renderTodoList(taskObjArr, keyName) //render task 

        saveDataToLocalStorage(keyName, taskObjArr) //send list to local storage

      } //remove from array

    }
  })

  //add div with buttons at li 
  txtBox.append(txt1, txt2, txt3)
  item.append(txtBox, buttonGroup)


  //For the application to access the element itself and the buttons to handle the click event
  return {
    item,
    txtBox,
    doneButton,
    deleteButton,
  }
}

//create of app
function createTodoApp(container, title = `To-do list`, listName) {

  //key for user
  keyName = listName

  //create variable for create title func
  let todoAppTitle = createAppTitle(title)

  //append everything to container
  container.append(todoAppTitle, todoItemForm.form, todoList)

  //to get empty object at local storage
  const data = localStorage.getItem(listName)

  //if array not empty to do parse
  if (data !== "" && data !== null) {
    taskObjArr = JSON.parse(data)
  }

  //append content from local storage to list 
  for (const itemList of taskObjArr) {
    let todoItem = createTodoItem(itemList, listName)  //create and add at ul new list-item 
    todoList.append(todoItem.item)
  }

  //add event listener for form input if value = '' disabled button
  todoItemForm.input.addEventListener('input', function () {
    if (todoItemForm.input.value.trim() !== '') {
      todoItemForm.button.disabled = false; // Enable the button if there's text in the input
    } else {
      todoItemForm.button.disabled = true; // Disable the button if the input is empty
    }
  })

  //The browser generates a submit event when pressing enter or clicking the task creation button
  todoItemForm.form.addEventListener('submit', function (e) {
    //This line is to prevent the default browser action 
    //In this case, we don't want the page to reload when the form is submitted
    e.preventDefault()

    //create new obj
    let newObj = {
      id: getNewId(taskObjArr),
      name: todoItemForm.input.value,
      done: false,
    }

    //add to array
    taskObjArr.push(newObj)
    
    renderTodoList(taskObjArr, keyName) //render task 
    
    saveDataToLocalStorage(listName, taskObjArr) //send list to local storage

    // Resetting the input value and disabling the button again
    todoItemForm.form.reset()
    todoItemForm.button.disabled = true

  })

}

//creates a global variable createTodoApp for available globally in the context of the browser window
window.createTodoApp = createTodoApp

// render 
function renderTodoList(taskArr, listName) {
  todoList.innerHTML = ''; //render list 

  taskArr.forEach((obj, index) => {
    const todoItem = createTodoItem(obj, listName); //create new li

    // update id 
    obj.id = index + 1;

    //update id at txt content
    todoItem.txtBox.childNodes[0].textContent = `${obj.id}.`;

    saveDataToLocalStorage(listName, taskObjArr) //send list to local storage

    return todoList.appendChild(todoItem.item);
  });
}