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
} from './visualPart.js';

//import function for local storage
import {getDataFromServer,
    addDataToServer,
} from './helpers.js';

//import switch type btn
import  {getSwitchStorageTypeBtn} from './switch-storage/switchStorageTypeBtn.js';

//create array
let serverArray = []

//create of app
async function initializeTodoApp(container ,title = 'TODO-LIST', owner = 'my') {
    //create storage type
    const STORAGE_TYPE = 'SS'

    //create title
    let todoAppTitle = createAppTitle(title)

    //create switch storage btn
    let switchStorageTypeBtn = getSwitchStorageTypeBtn(STORAGE_TYPE)

    //get data from server
    serverArray = await getDataFromServer(owner)

    if (!serverArray) return

    //create reset btn
    let resetBtn = createResetListButton(owner, serverArray, STORAGE_TYPE)

    //append everything to container
    container.append(todoAppTitle, todoItemForm.form, switchStorageTypeBtn, resetBtn.resetBtnBox, todoList)

    //render list
    renderTodoList(owner, serverArray, STORAGE_TYPE)


    //The browser generates a submit event when pressing enter or clicking the task creation button
    todoItemForm.form.addEventListener('submit', async function (e) {
        //This line is to prevent the default browser action
        //In this case, we don't want the page to reload when the form is submitted
        e.preventDefault()

        if (!todoItemForm.input.value) {
            return
        }

            //create new obj
            const todoItem = {
                name: todoItemForm.input.value.trim(),
                owner,
                done: false
            }

            await addDataToServer(todoItem)

            // Request updated data from the server
            serverArray = await getDataFromServer(owner)
            await renderTodoList(owner, serverArray, STORAGE_TYPE)
           //unblocked btn
           resetBtn.resetTodoListBtn.disabled = false

        // Resetting the input value and disabling the button again
        todoItemForm.form.reset()
        todoItemForm.button.disabled = true
    })
}


export {initializeTodoApp}