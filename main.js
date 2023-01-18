import { drowRectsOfStorage, setDefaultGridConfig, drowAllRectangles } from "./module/gridFuction.mjs"
import { insertRectProps, insetAllRectsProps, insertRectInSystem, saveStateInStorage } from "./module/supportFuction.mjs"
import { giveState } from "./module/state.mjs"

const button = document.getElementById("btn-drow-rectangle")
const tools = document.getElementById("tools")
const createRectInputs = document.querySelectorAll(".left-panel .create-rectangle .inputs > input[type=\"number\"]")
const grid = document.getElementById("grid")
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

    if(element.id === "select" || element.parentElement.id === "select"){
        grid.addEventListener("mousedown", handleMoveRect)
    }else{
        grid.removeEventListener("mousedown", handleMoveRect)
    }

    if(element.id === "hand" || element.parentElement.id === "hand"){
        grid.addEventListener("mousedown", handleMoveGrid)
        grid.style.cursor = "grab"
    }else{
        grid.removeEventListener("mousedown", handleMoveGrid)
        grid.style.cursor = "auto"
    }
})

const handleMoveGrid = evt => {
    let grid
    if(evt.target.id === "grid") grid = evt.target
    if(evt.target.parentElement.id === "grid") grid = evt.target.parentElement
    
    const clickX = evt.clientX
    const clickY = evt.clientY
    let speed = 3
    let scrollLeft = grid.scrollLeft
    let scrollTop = grid.scrollTop

    const handleMove = e => {
        const diffX = e.clientX - clickX
        const diffY = e.clientY - clickY
        grid.scrollLeft = scrollLeft + speed*(-diffX)
        grid.scrollTop = scrollTop + speed*(-diffY)
    }

    grid.addEventListener("mousemove", handleMove)
    grid.addEventListener("mouseup", () => {
        grid.removeEventListener("mousemove", handleMove)
    })
}

grid.addEventListener("mousedown", handleMoveGrid)

const handleMoveRect = event => {
    const clickX = event.layerX
    const clickY = event.layerY
    const state = giveState()

    if(!event.target.id.includes("identify")) return
    
    const rectElement = event.target
    const rectangleId = rectElement.id.split("-")[1]
    const rectangle = state.find((objRect) => objRect.id == rectangleId)
    const positionX = rectangle.positionX
    const positionY = rectangle.positionY

    const handleMovingRect = (e) => {
        const movingX = positionX + e.layerX - clickX
        const movingY = positionY + e.layerY - clickY
        rectangle.positionX = movingX >= 0 ?  movingX : 0
        rectangle.positionY = movingY >= 0 ? movingY : 0

        drowAllRectangles(state)
        saveStateInStorage()
        insetAllRectsProps(state)
    }

    grid.addEventListener("mousemove", handleMovingRect)
    grid.addEventListener("mouseup", () => {
        grid.removeEventListener("mousemove", handleMovingRect)
    })
}

button.addEventListener("click", insertRectInSystem)

const linesX = document.getElementById("lines-x")
const linesY = document.getElementById("lines-y")
linesX.addEventListener("mousemove", (e) => e.stopPropagation())
linesY.addEventListener("mousemove", (e) => e.stopPropagation())