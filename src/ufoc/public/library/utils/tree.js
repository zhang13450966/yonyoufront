
/**
 * @description 修改节点key值
 * @export
 * @param {*} treeData
 */
export function editKey(treeData) {
	treeData.forEach(node => {
		if (node.nodeData.pk_org) {
			node.key = node.nodeData.pk_org
			node.refpk = node.nodeData.pk_org
			node.id = node.nodeData.pk_org
		}
		if (node.children && node.children.length > 0) {
            node.children.forEach(item => {
                item.pid = node.id
            })
			editKey(node.children)
		}
	});
}


/**
 * @description 从树数据中获取叶子节点
 * @param {*} [treeData=[]]
 * @return {*} 
 */
export function getLeafKey (treeData = []) {
    let leafNodeKesy = []
    let fn = (treeData) => {
        treeData.forEach(item => {
            if (item.children && item.children.length > 0) {
                fn(item.children)
            } else {
                leafNodeKesy.push(item.key)
            }
        })
    }
    fn(treeData)
    return leafNodeKesy
}