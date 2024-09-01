export default class CommonModel {
    constructor(props) {
        this.props =(props)
    }
    sync = {
        update: (state, payload) => {
            return {
                ...state,
                ...payload
            };
        },
        handleParamsByKey:  (state, searchParams) => {
            let key = Object.keys(searchParams)
            let value = Object.values(searchParams)
            let params
            let tempState = state
            let tostring = Object.prototype.toString
            key.forEach((v, k)=> {
                let ckey = key[k]
                if (tostring.call(tempState[ckey])  === '[object Object]') {
                    params = Object.assign({}, state[ckey], {...value[k]})
                    tempState = {
                        ...tempState,
                        [ckey]: params
                    }
                }  else {
                    tempState = {
                        ...tempState,
                        [ckey]: searchParams[ckey]
                    }
                }
            })
            return {
                ...state,
                ...tempState
            }
        }
    }
}