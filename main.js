import { drowRectsOfStorage, setDefaultGridConfig, setGridConfig, drowAllRectangles } from "./module/gridFuction.mjs"
import { insertRectProps, insetAllRectsProps, insertRectInSystem, saveStateInStorage } from "./module/supportFuction.mjs"
import { giveState } from "./module/state.mjs"
import { giveConfig, ObjTools } from "./module/objectTools.mjs"

const button = document.getElementById("btn-drow-rectangle")
const tools = document.getElementById("tools")
const createRectInputs = document.querySelectorAll(".left-panel .create-rectangle .inputs > input[type=\"number\"]")
const grid = document.getElementById("grid")
const btnMenu = document.getElementById("icon-menu")
const menu = document.getElementById("menu")
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

    if(element.id === "select" || element.parentElement.id === "select"){
        grid.addEventListener("mousedown", handleMoveRect)
        element.tagName === "svg" && element.classList.add("active")
        element.tagName === "path" && element.parentElement.classList.add("active")
    }else{
        grid.removeEventListener("mousedown", handleMoveRect)
    }

    if(element.id === "hand" || element.parentElement.id === "hand"){
        grid.addEventListener("mousedown", handleMoveGrid)
        grid.style.cursor = "grab"
        element.tagName === "svg" && element.classList.add("active")
        element.tagName === "path" && element.parentElement.classList.add("active")
    }else{
        grid.removeEventListener("mousedown", handleMoveGrid)
        grid.style.cursor = "auto"
    }

    if(element.id === "zoom-in" || element.parentElement.id === "zoom-in"){
        handleIncrementZoom()
    }
    if(element.id === "zoom-out" || element.parentElement.id === "zoom-out"){
        handleDecrementZoom()
    }
})

const config = giveConfig()
const objConfig = new ObjTools(config)

const handleIncrementZoom = () => {
    objConfig.incrementZoom()
    setGridConfig(objConfig)
}

const handleDecrementZoom = () => {
    objConfig.decrementZoom()
    setGridConfig(objConfig)
}

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

    
    const zoom = objConfig.grid.zoom
    console.log(zoom)

    let columClick = clickX / zoom
    let rowClick = clickY / zoom

    if(!Number.isInteger(columClick)){
        columClick = Math.floor(columClick) + 1
    }
    if(!Number.isInteger(rowClick)){
        rowClick = Math.floor(rowClick) + 1
    }

    const handleMovingRect = (e) => {
        let columnMove = e.layerX / zoom
        let rowMove = e.layerY / zoom

        if(!Number.isInteger(columnMove)){
            columnMove = Math.floor(columnMove) + 1
        }
        if(!Number.isInteger(rowMove)){
            rowMove = Math.floor(rowMove) + 1
        }

        const movingX = positionX + columnMove - columClick
        const movingY = positionY + rowMove - rowClick
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

window.addEventListener("keydown", (e) => {
    const svgSelect = document.getElementById("select")
    const svgHand = document.getElementById("hand")

    if(e.key === "v"){
        grid.removeEventListener("mousedown", handleMoveGrid)
        grid.style.cursor = "auto"
        svgHand.classList.remove("active")

        svgSelect.classList.add("active")
        grid.addEventListener("mousedown", handleMoveRect)
    }

    if(e.key === "m"){
        grid.removeEventListener("mousedown", handleMoveRect)
        svgSelect.classList.remove("active")

        svgHand.classList.add("active")
        grid.addEventListener("mousedown", handleMoveGrid)
        grid.style.cursor = "grab"
    }

    if(e.key === "+")handleIncrementZoom()
    if(e.key === "-")handleDecrementZoom()
})

const resetPositionCss = (element) => {
    element.style.top = "auto"
    element.style.bottom = "auto"
    element.style.left = "auto"
    element.style.right = "auto"
}

btnMenu.addEventListener("click", (e) => {
    e.stopPropagation()
    menu.classList.toggle("visible")
    resetPositionCss(menu)
    menu.style.top = "58px"
    menu.style.right = "20px"
})

window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    menu.classList.toggle("visible")
    
    const espacioDerecha = window.innerWidth - e.clientX
    const espacioAbajo = window.innerHeight - e.clientY

    resetPositionCss(menu)
    if(espacioDerecha > menu.clientWidth)
        menu.style.left = e.clientX + "px"
    else
        menu.style.right = espacioDerecha + "px"
    
    if(espacioAbajo > menu.clientHeight)
        menu.style.top = e.clientY + "px"
    else
        menu.style.bottom = espacioAbajo + "px"
})

window.addEventListener("click", () => {
    menu.classList.remove("visible")
})

button.addEventListener("click", insertRectInSystem)

const linesX = document.getElementById("lines-x")
const linesY = document.getElementById("lines-y")
linesX.addEventListener("mousemove", (e) => e.stopPropagation())
linesY.addEventListener("mousemove", (e) => e.stopPropagation())