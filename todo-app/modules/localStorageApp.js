//import functions which create html elements
import {
    createAppTitle
} from './htmlElements.js';

//import create form and item for creating task
import {
    todoItemForm,
    todoList,
    renderTodoList,
    createResetListButton
} from './visualPart.js'

//import function for local storage
import {
    getNewId,
    saveDataToLocalStorage,
    getDataFromLocalStorage
} from './helpers.js'

//import switch type btn
import  {getSwitchStorageTypeBtn} from './switch-storage/switchStorageTypeBtn.js'

//create array for local storage
let localArray = []

//create of app
async function initializeTodoApp(container ,title = 'TODO-LIST', owner = 'my') {
    const STORAGE_TYPE = 'LS'
    console.log('STORAGE_TYPE:', STORAGE_TYPE)

    //create variable for create title func
    let todoAppTitle = createAppTitle(title)
    //switch storage btn
    let switchStorageTypeBtn = getSwitchStorageTypeBtn(STORAGE_TYPE)


    // check if we have any stored string(ARRAY data) & parse it back to readable ARRAY
    localArray = getDataFromLocalStorage(owner)
    if (!localArray) return

    //create reset btn
    let resetBtn = createResetListButton(owner, localArray, STORAGE_TYPE)

    //append everything to container
    container.append(todoAppTitle, todoItemForm.form, switchStorageTypeBtn, resetBtn.resetBtnBox, todoList)

    renderTodoList(owner, localArray, STORAGE_TYPE)

    //The browser generates a submit event when pressing enter or clicking the task creation button
    todoItemForm.form.addEventListener('submit', async function (e) {
        //This line is to prevent the default browser action
        //In this case, we don't want the page to reload when the form is submitted
        e.preventDefault()

        if (!todoItemForm.input.value) {
            return
        }

            //create new obj
            const newTask = {
                owner,
                name: todoItemForm.input.value.trim(),
                done: false,
                id: getNewId(localArray)
            }

            localArray.push(newTask)
            resetBtn.resetTodoListBtn.disabled = false

            saveDataToLocalStorage(owner, localArray)
            renderTodoList(owner, localArray, STORAGE_TYPE)

        // Resetting the input value and disabling the button again
        todoItemForm.form.reset()
        todoItemForm.button.disabled = true
    })
}

export {initializeTodoApp}