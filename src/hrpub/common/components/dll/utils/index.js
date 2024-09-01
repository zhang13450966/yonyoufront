
export const handleWidgetStatic = widgets => {
    if(!Array.isArray(widgets))throw Error(widgets+' is not a array')
    for (let i of widgets) {
        i.static = true
    }
    return widgets
}
//根据widgets返回layouts
export const transferWidgetsToLayout = (widgets) => {
    let copyWidgets = JSON.parse(JSON.stringify(widgets))
    let copyWidgetsLen = copyWidgets.length
    let layoutArr = []
    for (let a = 0; a < copyWidgetsLen; a++) {
        layoutArr.push({lg: copyWidgets[a]})
    }
    return layoutArr
}