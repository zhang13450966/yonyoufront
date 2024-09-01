//整理侧边栏列表数据，返回一个包含所有设置项的数据
export const getSideBarListData = (data) => {
    const { sideBarList } = data;
    const commonMap = getMap(data, "sideBarList");
    let list = [];
    sideBarList.forEach((item) => {
        const { webSideBarInfo = [] } = item;

        const itemMap = getMap(item, "webSideBarInfo");

        const areaParam = webSideBarInfo.map((item) => {
            const pk_storyboard = item.comtargetid || item.targetid;
            return {
                ...commonMap,
                ...itemMap,
                ...item,
                Key: item.code,
                label: item.tapName,
                pk_storyboard,
            };
        });

        list.push(areaParam);
    });

    return list;
};

//获取设置的参数
const getMap = (data, excludeKey) => {
    let map = {};
    Object.keys(data).forEach((key) => {
        if (key !== excludeKey) {
            map[key] = data[key];
        }
    });
    return map;
};

//获取当前拓展区的侧边栏列表
export const getTargetAreaList = ({
    pointMap,
    realCoords,
    graphicList,
    currentSelectedCell,
}) => {
    if (Object.keys(pointMap).length === 1 || !currentSelectedCell)
        return graphicList[0];

    const target = getTargetArea(realCoords, pointMap);
    if (!target) return null;

    const [key] = target;
    return graphicList.flat().filter((item) => item.areaPK === key);
};

function getTargetArea(pos, areas) {
    const { row, col } = pos;
    const entries = Object.entries(areas);

    const target = entries.find(([key, val]) => {
        const { area } = val;
        if (!area) return null;
        return (
            +row >= +area[0] &&
            +row <= +area[2] &&
            +col >= +area[1] &&
            +col <= +area[3]
        );
    });
    return target;
}

//点击格子是否在拓展区内
export function checkPosInArea(pos, areas) {
    return !!getTargetArea(pos, areas);
}

export function getAnalysisParams(list = []) {
    let map = {};
    list.forEach((item) => {
        const { mappingType, paramName, paramValue } = item;
        if (mappingType === "0") {
            map[paramName] = paramValue;
        }
    });
    return map;
}
