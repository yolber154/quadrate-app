import {giveState, resetState} from './state.mjs'
import {drowRectangle, removeRectangle, drowAllRectangles} from './gridFuction.mjs'

function sprt_random(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

const cssRandomColorHSL = (Hue, Saturation, Luminositi) => {
    Hue = Hue || [0, 360]
    Saturation = Saturation || [0, 100]
    Luminositi = Luminositi || [0, 100]

    let mensageError = "Argumento invalido: se esperaban parametros de tipo array"

    if( !(Array.isArray(Hue)) ) throw new Error(mensageError)
    if( !(Array.isArray(Saturation)) ) throw new Error(mensageError)
    if( !(Array.isArray(Luminositi)) ) throw new Error(mensageError)

    mensageError = new Error("El argumento no está dentro de los valores validos")

    const isBadHue = Hue.some(Element => Element < 0 || Element > 360)
    const isBadSaturation = Saturation.some(Element => Element < 0 || Element > 100)
    const isBadLuminositi = Luminositi.some(Element => Element < 0 || Element > 100)

    if(isBadHue || isBadSaturation || isBadLuminositi) throw new Error(mensageError)

    Hue = sprt_random(...Hue)
    Saturation = sprt_random(...Saturation)
    Luminositi = sprt_random(...Luminositi)

    return [Hue, Saturation, Luminositi]
}

const hslToHex = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const hexToHSL = (hex) =>  {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      let r = parseInt(result[1], 16);
      let g = parseInt(result[2], 16);
      let b = parseInt(result[3], 16);
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if(max == min){
        h = s = 0; // achromatic
      }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
    h = h*360
    s = s*100
    l = l*100
    var HSL = new Object();
    HSL['h']=h;
    HSL['s']=s;
    HSL['l']=l;
    return [h, s, l];
}

const sprt_a = (id) => {
    const width = document.querySelector(`.width-${id}`).value
    const height = document.querySelector(`.height-${id}`).value
    const positionX = document.querySelector(`.x-${id}`).value
    const positionY = document.querySelector(`.y-${id}`).value
    const color = document.querySelector(`.color-${id}`).value

    if(width < 0 || height < 0 || positionX < 0 || positionY < 0) return 

    let state = giveState()
    const obj = state.find(element => element.id === id)

    const colorHSL = hexToHSL(color)
    const [colorH, colorS, colorL] = colorHSL

    obj.width = Number(width)
    obj.height = Number(height)
    obj.positionX = Number(positionX)
    obj.positionY = Number(positionY)
    obj.backgroundHSL = colorHSL
    obj.background = `hsla( ${colorH}, ${colorS}%, ${colorL}%, .9 )`

    drowAllRectangles(state)
    insetAllRectsProps(state)
    saveStateInStorage()
}

const removeElement = id => {
    const element = document.getElementById(id)
    element.remove()
}

const saveStateInStorage = () => {
    const state = giveState()
    const stateStringified = JSON.stringify(state)
    localStorage.setItem("rectangles", stateStringified)
}

// Aquí está el enrredo
const insertRectProps = obj => {
    const svgEye = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Z"/></path></svg>`
    const svgEyeOff = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m19.8 22.6-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM12 16q.275 0 .512-.025.238-.025.513-.1l-5.4-5.4q-.075.275-.1.513-.025.237-.025.512 0 1.875 1.312 3.188Q10.125 16 12 16Zm7.3.45-3.175-3.15q.175-.425.275-.862.1-.438.1-.938 0-1.875-1.312-3.188Q13.875 7 12 7q-.5 0-.938.1-.437.1-.862.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm-4.625-4.6-3-3q.7-.125 1.288.112.587.238 1.012.688.425.45.613 1.038.187.587.087 1.162Z"/></svg>`
    const svgArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z"></path></svg>`
    const wrapperSvgEye = document.createElement("div")
    const wrapperSvgArrow = document.createElement("div")
    const divWrapperRectangleList = document.getElementById("wrapper-rectangles-list")
    const divProperieRectangle = document.createElement("div")
    const elemento = document.createElement("div")
    const divRectangle = document.createElement("div")
    const para = document.createElement("p")

    divRectangle.classList.add("rectangle")
    divRectangle.classList.add("pleat")
    divRectangle.style = `--border-left-color: ${obj.background}`
    wrapperSvgEye.classList.add("wrapper-svg")
    wrapperSvgArrow.classList.add("wrapper-svg")
    elemento.id = `props-${obj.id}`

    para.innerText = "Rectángulo"

    if(obj.visible) {
        wrapperSvgEye.innerHTML = svgEye
        wrapperSvgEye.classList.remove("off")
    }
    else{
        wrapperSvgEye.innerHTML = svgEyeOff
        wrapperSvgEye.classList.add("off")
    }

    wrapperSvgArrow.innerHTML = svgArrow

    wrapperSvgEye.addEventListener("click", () => {
        let state = giveState()
        let rectObj = state.find(rectObj =>  rectObj.id === obj.id)
        rectObj.visible = !rectObj.visible
        drowAllRectangles(state)
        saveStateInStorage(state)
        insetAllRectsProps(state)
    })

    wrapperSvgArrow.addEventListener("click", () => {
        divRectangle.classList.toggle("pleat")
    })

    // Ya el divRectangle está listo para usar

    divRectangle.appendChild(wrapperSvgEye)
    divRectangle.appendChild(para)
    divRectangle.appendChild(wrapperSvgArrow)

    divProperieRectangle.classList.add("properie-rectangle")
    divProperieRectangle.style.borderLeft = `1px solid ${obj.background}`

    const properie = ["Ancho", "Alto", "X", "Y", "Color", "Borrar"]
    const properie2 = ["width", "height", "x", "y", "color"]
    const value = [obj.width, obj.height, obj.positionX, obj.positionY]
    for(let i = 0; i <= 5; i++){
        const para = document.createElement("p")
        const input = document.createElement("input")

        if(i < 4){
            input.setAttribute("type", "number")
            input.setAttribute("min", "0")
            input.classList.add(`${properie2[i]}-${obj.id}`)
            input.value = value[i]
            input.addEventListener("keyup", () => sprt_a(obj.id))
            input.addEventListener("input", () => sprt_a(obj.id))
        }else if(i === 4){
            input.setAttribute("type", "color")
            input.classList.add(`${properie2[i]}-${obj.id}`)
            input.setAttribute("value", hslToHex(...obj.backgroundHSL))
            input.addEventListener("change", () => sprt_a(obj.id))
        }else{
            input.setAttribute("type", "button")
            input.setAttribute("value", "borrar rectángulo")
            input.addEventListener("click", () => quitRectOfSystem(obj.id))
        }

        para.innerText = properie[i]

        divProperieRectangle.appendChild(para)
        divProperieRectangle.appendChild(input)
    }

    elemento.appendChild(divRectangle)
    elemento.appendChild(divProperieRectangle)
    divWrapperRectangleList.appendChild(elemento)
}

const quitRectOfSystem = id => {
    removeRectangle(id)
    removeElement(`props-${id}`)

    let state = giveState()
    const array = state.filter(element => element.id != id)
    resetState()
    array.forEach(rectObj => state.push(rectObj))
    saveStateInStorage()
}

const insertRectInSystem = () => {
    let inputs = [  Number(document.getElementById("rectangle-width").value),
                    Number(document.getElementById("rectangle-height").value),
                    Number(document.getElementById("rectangle-position-x").value),
                    Number(document.getElementById("rectangle-position-y").value)
                ]
    let [width, height, positionX, positionY] = inputs
    const state = giveState()

    const isBadData = inputs.some(Element => isNaN(Element) )
    if(isBadData) {
        alert("Error: Los datos de las entradas tienen que ser numeros"); 
        return
    }

    const isBadData2 = [width,height].some(Element => Element <= 0 )
    if(isBadData2) {
        alert("Error El ancho o alto debe de ser positivo"); 
        return
    }

    const isBadData3 = [positionX,positionY].some(Element => Element < 0)       
    if(isBadData3) {
        alert("Error: La posicion no puede ser negativa"); 
        return
    }

    const colorHSL = cssRandomColorHSL(null, [30, 80], [40, 60])
    const [colorH, colorS, colorL] = colorHSL
    
    const objRectangle = {
        id: Date.now(),
        width: width,
        height: height,
        positionX: positionX,
        positionY: positionY,
        backgroundHSL: colorHSL,
        background: `hsla(${colorH}, ${colorS}%, ${colorL}%, .9)`,
        visible: true
    }

    state.push(objRectangle)
    drowRectangle(objRectangle)
    saveStateInStorage()
    insertRectProps(objRectangle)
}

const insetAllRectsProps = (array) => {
    const wrapperRectsList = document.getElementById("wrapper-rectangles-list")
    wrapperRectsList.innerHTML = ""
    array.forEach(rectObj => insertRectProps(rectObj))
} 

const pleatList = () => {
    const divProperieRectangle = document.querySelectorAll(".left-panel .wrapper-rectangles-list .properie-rectangle")
    divProperieRectangle.forEach(element => element.classList.add("hidden"))
}

export { 
    insertRectProps,
    insertRectInSystem,
    quitRectOfSystem,
    saveStateInStorage,
    cssRandomColorHSL,
    insetAllRectsProps
}