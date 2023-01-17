const rectanglesInGrid = []

const giveState = () => {
    return rectanglesInGrid
}

const resetState = () => {
    const state = giveState()
    let length = state.length

    for(let i = 0; i < length; i++){
        state.pop()
    }
}

export {giveState, resetState} 