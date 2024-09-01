import { contextConfig } from "../config";

//右键设计器
export function contextGenerator(props) {
    return [...commonHandle(contextConfig(props), props)];
}

function commonHandle(data, props) {
    if (data.length === 0) return [];

    if (
        props.props.ownReportParams &&
        props.props.ownReportParams.hideContextMenu
    ) {
        return [];
    }

    const result = loop(data);

    function loop(d) {
        const result = d.map((item) => {
            if (item.submenu && item.submenu.length) {
                item.submenu = loop(item.submenu);
            }
            return {
                ...item,
                onSelect(num) {
                    props.onContextMenuClick(item.code, num);
                },
            };
        });
        return result;
    }

    return result;
}
