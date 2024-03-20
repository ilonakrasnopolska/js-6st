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

//create and back element ul
function createTodoList() {
    let list = document.createElement('ul')
    list.classList.add('list-group')
    return list
}

//create element li
function createTodoListElement() {
    let item = document.createElement('li')
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
    return item
}


export {createAppDiv,
    createAppTitle,
    createAppButton,
    createTodoParagraph,
    createTodoList,
    createTodoListElement,
    }
