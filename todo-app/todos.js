const SERVER_URL = 'http://localhost:3000'

//create variable for create form func
const todoItemForm = createTodoItemForm()
//create variable for create list func
const todoList = createTodoList()

//create array for obj
let taskObjArr = []

//key for local storage
let keyName = ''

//checker for true or false
let checker = false

//func add task to server
async function addDataToServer(obj) {
  let response = await fetch(SERVER_URL + '/api/todos', { //request to server
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })

  let data = await response.json()

  return data
}

//func get task from server
async function getDataFromServer(owner) {
  let response = await fetch(`${SERVER_URL}/api/todos/?owner=${owner}`, { //request to server
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  })

  let data = await response.json()

  return data
}

//func delete task from server
async function deleteDataFromServer(id) {
  let response = await fetch(`${SERVER_URL}/api/todos/${id}`, { //request to server
    method: "DELETE",
    headers: { 'Content-Type': 'aplication/json' }
  })
  if (response.status == 404) {
    console.log('so sorry');
  }
  const data = await response.json()
  return data
}

//func mark task as done at server
async function doneDataAtServerTrue(id) {
  console.log(id);

  const response = await fetch(`${SERVER_URL}/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    // { name?: string, owner?: string, done?: boolean }
    body: JSON.stringify({
      done: true
    })
  })

  const data = await response.json()
  console.log(data);
}

//func mark task as undone at server
async function doneDataAtServerFalse(id) {
  const response = await fetch(`${SERVER_URL}/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    // { name?: string, owner?: string, done?: boolean }
    body: JSON.stringify({
      done: false
    })
  })

  const data = await response.json()
  console.log(data);
}

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

//create and back element ul 
function createTodoList() {
  let list = document.createElement('ul')
  list.classList.add('list-group')
  return list
}

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

  if (obj.done == true) { item.classList.add('list-group-item-success') }

  //add event listener for buttons
  doneButton.addEventListener('click', async function () {
    item.classList.toggle('list-group-item-success') //add class if user click at btn
    
    obj.done = !obj.done

    // change done status at server
    obj.done ? await doneDataAtServerTrue(obj.id) : await doneDataAtServerFalse(obj.id)

    renderTodoList(taskObjArr, keyName)
  })
   

  deleteButton.addEventListener('click', async function () {
    if (confirm('Are you sure?')) {

      console.log(taskObjArr);

      await deleteDataFromServer(obj.id)

      renderTodoList(taskObjArr, keyName) //render task 
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
async function createTodoApp(container, title = `To-do list`, listName) {

  //create variable for create title func
  let todoAppTitle = createAppTitle(title)

  renderTodoList(taskObjArr, listName) //call load table from server

  //append everything to container
  container.append(todoAppTitle, todoItemForm.form, todoList)

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
  todoItemForm.form.addEventListener('submit', async function (e) {
    //This line is to prevent the default browser action 
    //In this case, we don't want the page to reload when the form is submitted
    e.preventDefault()

    //create new obj
    let newObj = {
      userId: getNewId(taskObjArr),
      name: todoItemForm.input.value,
      done: false,
      owner: listName,
    }

    addDataToServer(newObj)

    //add to array
    taskObjArr.push(newObj)

    renderTodoList(taskObjArr, listName) //render task 

    // Resetting the input value and disabling the button again
    todoItemForm.form.reset()
    todoItemForm.button.disabled = true

  })

}

//creates a global variable createTodoApp for available globally in the context of the browser window
window.createTodoApp = createTodoApp

// render 
async function renderTodoList(taskArr, listName) {
  todoList.innerHTML = ''; //render list 

  // loadDataFromServer(listName) //get task from server
  let serverObjs = await getDataFromServer(listName)

  if (serverObjs) {
    taskArr = [...serverObjs]; // Обновляем данные в переменной arrayOfStudent

    taskArr.forEach((obj, index) => {
      const todoItem = createTodoItem(obj, listName) //create new li

      // update id 
      obj.userId = index + 1;

      //update id at txt content
      todoItem.txtBox.childNodes[0].textContent = `${obj.userId}.`;
      todoList.appendChild(todoItem.item)
    }
    )
  }
}