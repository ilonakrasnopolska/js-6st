import {getCurrentStorage} from "./switch-storage/switchStorageType.js";

export async function createTodoApp(container, title = 'TODO-LIST', owner) {

    const storageModule = await getCurrentStorage()

    storageModule.initializeTodoApp(container, title, owner)

}

