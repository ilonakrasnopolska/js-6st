//create button for reload list - local storage or api
import {saveStorageType, switchStorageType} from "./switchStorageType.js";
//create func for create btn switch type
import {createAppDiv, createAppButton} from "../htmlElements.js";

export function getSwitchStorageTypeBtn(initialStorageType = 'LS') {
    let switchStorageBlock = createAppDiv('reload')
    let switchStorageTypeBtn = createAppButton('reload__list-btn', '')
    switchStorageTypeBtn.id = 'reload-btn'

    function updateBtnText() {
        switchStorageTypeBtn.innerHTML = `${storageType === 'SS' ? 'LOCAL' : 'SERVER'}_DATA STORAGE`
        switchStorageTypeBtn.classList.add(`${storageType === 'SS' ? 'LOCAL' : 'api-storage'}`)
    }

    let storageType = initialStorageType
    console.log('initialStorageType:',storageType)
    updateBtnText()

    switchStorageTypeBtn.addEventListener('click', function () {

        if (storageType === 'LS') {
            storageType = switchStorageType()
            updateBtnText()
            console.log('switched to:',storageType)
            saveStorageType(storageType)
            location.reload() // Reload the page

        } else {
            storageType = switchStorageType()
            updateBtnText()
            console.log('switched to:',storageType)
            saveStorageType(storageType)
            location.reload() // Reload the page
        }
    })
    switchStorageBlock.append(switchStorageTypeBtn)
  return switchStorageBlock
}
