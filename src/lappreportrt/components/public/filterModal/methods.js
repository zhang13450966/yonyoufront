export function getRequireFlag(list = []) {
    let returnValue = {
        isError: false,
        item: null,
    };

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (
            !item.firstValue ||
            !item.relationOper ||
            (item.relationOper === "8" &&
                (!item.secondValue ||
                    !item.betweenSecondRelationOper ||
                    !item.betweenFirstRelationOper))
        ) {
            returnValue = {
                ...returnValue,
                isError: true,
                item,
                currentIndex: i,
            };
            break;
        }
    }
    return returnValue;
}
