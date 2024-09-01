//返回处理后的树数据（节点需要根据返回的树数据，进行树节点可编辑性设置的，调用此方法）
export function _setTeeDisable (treeData) {

    let loop = (node) => {
        node.forEach( item => {
            (item.nodeData && item.nodeData.ts) ? delete(item.disabled): item['disabled'] = true//有ts 可用
            if(!_.isEmpty(item.children)){ 
                loop(item.children)
            }
        })
    }

    loop(treeData);
    return treeData
}
