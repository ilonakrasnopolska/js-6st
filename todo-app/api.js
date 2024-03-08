export const SERVER_URL = 'http://localhost:3000'

//func get task from server
async function getDataFromServer(owner) {
  let response = await fetch(`${SERVER_URL}/api/todos/?owner=${owner}`, { //request to server
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  })

  let data = await response.json()

  return data
}

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

//func delete task from server
async function deleteDataFromServer(id) {
  let response = await fetch(`${SERVER_URL}/api/todos/${id}`, { //request to server
    method: "DELETE",
    headers: { 'Content-Type': 'aplication/json' }
  })
  if (response.status == 404) {
    console.log('so sorry')
  }
  const data = await response.json()
  return data
}

//func mark task as done at server
async function doneDataAtServerTrue(id) {
  console.log(id)

  const response = await fetch(`${SERVER_URL}/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    // { name?: string, owner?: string, done?: boolean }
    body: JSON.stringify({
      done: true
    })
  })

  const data = await response.json()
  console.log(data)
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
  console.log(data)
}

export {getDataFromServer, addDataToServer, deleteDataFromServer, doneDataAtServerFalse, doneDataAtServerTrue}