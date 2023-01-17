// User = Establecido por el usuario
// Calculated = Valor calculado


class ObjTools {
    constructor(userConfig){
        this.grid = {
            zoom: userConfig.grid.zoom,
            widthColumn: userConfig.grid.zoom,
            heightRow: userConfig.grid.zoom,
            numColumns: 10000,
            numRows: 10000
        }

        this.lines = {
            color: userConfig.lines.color,
            grosor: userConfig.lines.grosor,
            visible: userConfig.lines.visible,
            numLinesX: (this.getNumColumns() / userConfig.square.width) + 1,
            numLinesY: (this.getNumRows() / userConfig.square.height) + 1,
        }

        this.square = {
            width: userConfig.square.width,
            height: userConfig.square.height,
            numsquareX: this.getNumColumns() / userConfig.square.width,
            numsquareY: this.getNumRows() / userConfig.square.height
        }
    }

    getWidthColumn(){return this.grid.zoom}
    getHeightRow(){return this.grid.zoom}
    getNumColumns(){return this.grid.numColumns}
    getNumRows(){return this.grid.numRows}
    getsquareWidth(){return this.square.width}
    getsquareHeight(){return this.square.height}
}

const defaultConfig = {
    grid: {
        zoom: 1,
    },
    
    lines: {
        color: "#000",
        grosor: 1,
        visible: true
    },

    square: {
        width: 10,
        height: 10,
    }
}


const objectTools = {
    grid: {
        widthColumn: 1,     /** En px **/  /** Calculated **/
        heightRow: 1,       /** En px **/  /** Calculated **/
        numColumns: 100000,
        numRows: 100000,
        Zoom: 1,    /** User **/  /** Porcentaje en decimal **/
    },
    
    lines: {
        color: "#000",      /** User **/
        grosor: 1,          /** User **/    /** En px **/
        visible: true,      /** User **/
        numLinesX: 10000 + 1,      /** Calculated (square.numsquareX + 1) **/
        numLinesY: 10000 + 1      /** Calculated (square.numsquareY + 1) **/
    },

    square: {
        width: 10,  /** User **/  // Medida en cuanto las culumnas de la grilla
        height: 10, /** User **/  // Medida en cuanto las fillas de la grilla 
        numsquareX: 10000,     /** Calculated (grid.numColumns / lines.square.width) **/
        numsquareY: 10000,     /** Calculated (grid.numRows / lines.square.height) **/
    }
}

export {ObjTools, defaultConfig}