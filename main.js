import { drowRectsOfStorage, setDefaultGridConfig } from "./module/gridFuction.mjs"
import { insertRectProps, insertRectInSystem } from "./module/supportFuction.mjs"
import { giveState } from "./module/state.mjs"

const button = document.getElementById("btn-drow-rectangle")
const tools = document.getElementById("tools")
const createRectInputs = document.querySelectorAll(".left-panel .create-rectangle .inputs > input[type=\"number\"]")
setDefaultGridConfig()

if( localStorage.getItem("rectangles") ) {
    const _rectanglesInGrid =  drowRectsOfStorage()
    const state = giveState()
    _rectanglesInGrid.forEach(element => {
        insertRectProps(element)
        state.push(element)
    })
}

createRectInputs.forEach(input => {
    input.addEventListener("keypress", (event) => {
        if(event.keyCode === 13) insertRectInSystem()
    })
})

tools.addEventListener("click", (event) => {
    const tools = document.querySelectorAll(".tools > svg")
    const element = event.target
    tools.forEach(element => element.classList.remove("active"))
    element.tagName === "svg" && element.classList.add("active")
    element.tagName === "path" && element.parentElement.classList.add("active")
})

button.addEventListener("click", insertRectInSystem)