export const SERVER_URL = 'http://localhost:3000'

//func create new id
function getNewId(arr) {
  return arr.length + 1
}

//func for set info to local storage
function saveDataToLocalStorage(key, objArr) {
    localStorage.setItem(key, JSON.stringify(objArr))
}

//func for get info from local storage
function getDataFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : []
}

//func for change done in obj
function changeDoneOfObjOnLocalStorage({todos, obj, key}) {
  todos = JSON.parse(localStorage.getItem(key))
  todos.forEach(todo => {
    if (todo.id === obj.id) {
      todo.done = !todo.done
    }
  })
  localStorage.setItem(key, JSON.stringify(todos))
}

//func reset all list
function  resetDataFromLocalStorage(array, owner) {
  if (confirm('Are you sure?')) {
    console.log(array, 'до удаления с local')
    array.forEach((obj) => {
      array.splice(obj, )
    })
    saveDataToLocalStorage(owner, array)
    console.log(array, 'после удаления с local')
  }
}


// 6 server functions...GET, DELETE, doneTrue, doneFalse, ADD


//func get task from server
async function getDataFromServer(owner) {
  let response = await fetch(`${SERVER_URL}/api/todos/?owner=${owner}`, { //request to server
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  })

  return await response.json()
}

//func add task to server
async function addDataToServer(obj) {
  let response = await fetch(SERVER_URL + '/api/todos', { //request to server
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })

  return await response.json()
}

//func delete task from server
async function deleteDataFromServer(obj) {
  console.log(obj)
  let response = await fetch(`${SERVER_URL}/api/todos/${obj.id}`, { //request to server
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.status === 404) {
    console.log('so sorry')
  }
  return await response.json()
}

//func clear all task on server
async function clearAllTasksOnServer(keyName) {
  try {
    // Получаем текущий список задач с сервера
    const currentTasks = await getDataFromServer(keyName);

    // Отправляем запросы на удаление каждой задачи
    await Promise.all(currentTasks.map(async task => {
      await deleteDataFromServer(task);
    }));

    console.log('All tasks cleared on the server');
  } catch (error) {
    console.error('Error while clearing all tasks on the server:', error);
  }
}


//func mark task as done at server
async function switchTodoItemDone({obj, item}) {
  //add class if user click at btn
  item.classList.toggle('list-group-item-success')
  const response = await fetch(`${SERVER_URL}/api/todos/${obj.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    // { name?: string, owner?: string, done?: boolean }
    body: JSON.stringify({
      done: obj.done
    })
  })
  await response.json()
}


export {getNewId,
    saveDataToLocalStorage,
  getDataFromLocalStorage,
  changeDoneOfObjOnLocalStorage,
  resetDataFromLocalStorage
}

export {getDataFromServer,
  addDataToServer,
  deleteDataFromServer,
  switchTodoItemDone,
  clearAllTasksOnServer
}