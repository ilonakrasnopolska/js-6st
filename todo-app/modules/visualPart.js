import {createTodoListElement,
  createAppDiv,
  createTodoParagraph,
  createAppButton,
  createTodoList
} from "./htmlElements.js";

import {
  changeDoneOfObjOnLocalStorage,
  resetDataFromLocalStorage,
  switchTodoItemDone,
  saveDataToLocalStorage,
  deleteDataFromServer,
  getDataFromServer,
  clearAllTasksOnServer
} from "./helpers.js";

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

  button.disabled = true // For block button
  button.type = 'submit'

  // check if FORM input has text and save the btn DISABLED or different
  input.addEventListener('input', function () {
    button.disabled = !input.value.trim()
  })

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
export const todoItemForm = createTodoItemForm()
//create variable for create list func
export const todoList = createTodoList()

//func create btn reset all list
export function createResetListButton(keyName, getTodoList, storageType) {
  const resetBtnBox = createAppDiv('reset')
  const resetTodoListBtn = createAppButton('reset-btn', 'Reset')
  let isDeletingTasks = false; // Флаг, указывающий на выполнение процесса удаления задач
  if (getTodoList.length === 0) {
    resetTodoListBtn.disabled = true
  }
  resetBtnBox.append(resetTodoListBtn)
  resetTodoListBtn.addEventListener('click', async function(){
      if (storageType === 'LS') {
        resetDataFromLocalStorage(getTodoList, keyName)
        resetTodoListBtn.disabled = true
        renderTodoList(keyName, getTodoList, storageType)
      }
      else {
        if (confirm('Are you sure?')) {

          await clearAllTasksOnServer(keyName)

          getTodoList = await getDataFromServer(keyName)
          console.log(getTodoList)

          // Отображаем пустой список
          renderTodoList(keyName, getTodoList, storageType);
    }
      }
  })
  return {resetBtnBox,
  resetTodoListBtn}
}


//create and back the elements of list(ul) -- list-item(li)
export function createTodoItem(obj, keyName, getTodoList, storageType = 'LS') {

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

  if (obj.done === true) {
    item.classList.add('list-group-item-success')
  }

  //add event listener for buttons
  doneButton.addEventListener('click', async function() {
    item.classList.toggle('list-group-item-success')
    for (let element of getTodoList) {
      if (obj.id === element.id) {
        obj.done = !obj.done
        if (storageType === 'LS') {
          changeDoneOfObjOnLocalStorage({getTodoList, obj, key: keyName}) // for localstorage
        }
        if (storageType === 'SS') {
          await switchTodoItemDone({obj, item}) // for server storage
        }
          renderTodoList(keyName, getTodoList, storageType)
        console.log(getTodoList)
      }
    }
  })

  deleteButton.addEventListener('click',  async function() {
    if (confirm('Are you sure?')) {
      const index = getTodoList.findIndex(item => item.id === obj.id)
      if (index !== -1) {
        getTodoList.splice(index, 1)
        getTodoList.forEach((item, id) => {
          if (storageType === 'LS')
            item.id = id + 1
        })

        storageType === 'LS'
            ? saveDataToLocalStorage(keyName, getTodoList)   // for localstorage
            :  await deleteDataFromServer(obj)         // for server storage
            renderTodoList(keyName, getTodoList, storageType)
      }
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


export function renderTodoList(listName, arrayObjs, STORAGE_TYPE) {
  todoList.innerHTML = '' //render list

  if (arrayObjs) {
    for (let i = 0; i < arrayObjs.length; i++) {
      const todoItem = createTodoItem(arrayObjs[i], listName, arrayObjs, STORAGE_TYPE) //create new li
      if (STORAGE_TYPE === 'LS') {
        //update id at txt content
        todoItem.txtBox.childNodes[0].textContent = `${i + 1}.`
      }
        todoList.appendChild(todoItem.item)
    }
  }
}






