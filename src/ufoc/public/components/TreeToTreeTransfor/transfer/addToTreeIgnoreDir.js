import {deepClone} from 'nc-lightapp-front';
import * as tree_utils from './tree_utils';

const {getNodeByKey, hasGivenKey} = tree_utils;

export default function addToTreeIgnoreDir(from_tree, to_tree, checkedNodes, toTreeDataList) {
    let cloneSkeletonCheckedNodes = deepClone(checkedNodes);  //深克隆选中节点的数据对象
    let newSkeletonCheckedNodes = [];
    cloneSkeletonCheckedNodes.forEach(item => {  //过滤出目标树种不存在的节点
        !hasGivenKey(item.key, toTreeDataList) && newSkeletonCheckedNodes.push(item);
    });
    newSkeletonCheckedNodes.forEach(item => {
        if (item.isDir) {
            return;
        }
        item.reportStyle = '';
        let parent = getNodeByKey(to_tree, item.pid);
        if (parent) {
            parent.children || (parent.children = []);
            parent.children.push(item);
        } else {
            to_tree[0].children || (to_tree[0].children = []);
            to_tree[0].children.push(item);
        }
    });
}
