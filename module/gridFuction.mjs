import {ObjTools, defaultConfig} from "./objectTools.mjs"
import { quitRectOfSystem } from "./supportFuction.mjs"

const drowLinesX = (numLines, space) => {
    const divLinesX = document.getElementById("lines-x")
    divLinesX.innerHTML = ""
    let _space = 0

    for(let i = 1; i <= numLines; i++){
        const divLine = document.createElement("div")
        divLine.classList.add("line")
        divLine.classList.add("line-x")
        divLine.style.top = `${_space}px`
        divLinesX.appendChild(divLine)
        _space = _space + space
    }
}

const drowLinesY = (numLines, space) => {
    const divLinesY = document.getElementById("lines-y")
    divLinesY.innerHTML = ""
    let _space = 0

    for(let i = 1; i <= numLines; i++){
        const divLine = document.createElement("div")
        divLine.classList.add("line")
        divLine.classList.add("line-y")
        divLine.style.left = `${_space}px`
        divLinesY.appendChild(divLine)
        _space = _space + space
    }
}

const setDefaultGridConfig = () => {
    setGridConfig(defaultConfig)
}

const setGridConfig  = config => {
    const divGrid = document.getElementById("grid")
    const objTools = new ObjTools(config)

    divGrid.style = `--width-column: ${objTools.grid.widthColumn}px; --height-row: ${objTools.grid.heightRow}px; --num-columns: ${objTools.grid.numColumns}; --num-rows: ${objTools.grid.numRows};`
    drowLinesY(objTools.lines.numLinesX, objTools.square.width)
    drowLinesX(objTools.lines.numLinesY, objTools.square.height)
}

const drowRectangle = obj => {
    const grid = document.getElementById("grid")
    const rectangle = document.createElement("div")
    rectangle.style.gridColumn = `${obj.positionX + 1} / ${obj.positionX + 1 + obj.width}`
    rectangle.style.gridRow = `${obj.positionY + 1} / ${obj.positionY + 1 + obj.height}`
    rectangle.style.background = obj.background
    // rectangle.style.opacity = ".85"

    rectangle.setAttribute("id", `identify-${obj.id}`)
    grid.appendChild(rectangle)
}

const removeRectangle = id => {
    const rectangle = document.getElementById(`identify-${id}`)
    rectangle.remove()
}

const drowAllRectangles = array => {
    const divGrid = document.getElementById("grid")
    const divLines = document.getElementById("lines")
    
    divGrid.innerHTML = ""
    divGrid.appendChild(divLines)
    array.forEach(element => {
        if(element.visible) drowRectangle(element)
    });
}

const drowRectsOfStorage = () => {
    let array = localStorage.getItem("rectangles")
    array = JSON.parse(array)
    drowAllRectangles(array)
    return array
}


export {
    drowLinesX,
    drowLinesY,
    setGridConfig,
    setDefaultGridConfig,
    drowRectangle,
    drowRectsOfStorage,
    removeRectangle,
    drowAllRectangles
}