/**
 * @desc 获取树 操作数据(仅本级, 所有下级, 直接下级, 末级)
 * @example
 * ref = $namespace.getTreeHandler(allNodeData);
 * ref.getCurrent(refPkOrPks) -> 仅本级节点数据
 * ref.getDeepLower(refPkOrPks) -> 所有下级节点数据
 * ref.getLower(refPkOrPks) -> 直接下级节点数据
 * ref.getLeaf(refPkOrPks) -> 末级节点数据
 *
 * ref.all -> all node data mapping
 *
 * */
export function getTeeHandler(nodes) {

    return {
        all: _initMapping(nodes),

        // 获取原始 带有children
        getOriginCurrent(refpkOrPks = []) {
            return _ensurePkToArray(refpkOrPks).map(refpk => this.all.get(refpk))
        },
        // 仅本级
        getCurrent(refpkOrPks = []) {
            return this.getOriginCurrent(refpkOrPks).map(node => {
                let o = {};
                if (node.children) {
                    o._children = node.children;
                }
                if (node.pid) {
                    o._pid = node.pid
                }
                if (node.isleaf) {
                    o._isleaf = node.isleaf
                }

                return {..._.omit(node, 'pid', 'children', 'isleaf'), ...o};
            })
        },
        // 所有下级
        getDeepLower (refpkOrPks = []) {
            let s = _ensurePkToArray(refpkOrPks);

            let loop = (children = []) => {
                for (let child of children) {
                    s.push(...this.getChildRefPks(child));
                    loop(child.children);
                }
            };
            loop(this.getOriginCurrent(s));

            return this.getCurrent([...s]);

        },
        // 直接下级
        getLower (refpkOrPks = []) {
            let s = _ensurePkToArray(refpkOrPks);

            for (let child of this.getOriginCurrent(s)) {
                s.push(...this.getChildRefPks(child));
            }

            return this.getCurrent(s);
        },
        // 末级
        getLeaf (refpkOrPks = []) {
            refpkOrPks = _ensurePkToArray(refpkOrPks);
            let s = new Set();

            let loop = (children = []) => {
                for (let child of children) {
                    if (child.isleaf === true || !_.get(child, 'children.length')) {
                        s.add(child.refpk);
                    }
                    loop(child.children);
                }
            };
            loop(this.getOriginCurrent(refpkOrPks));

            return this.getCurrent([...refpkOrPks, ...s]);
        },

        // 末级（排除自己）
        getLeafNoMe (refpkOrPks = []) {
            refpkOrPks = _ensurePkToArray(refpkOrPks);
            let s = new Set();

            let loop = (children = []) => {
                for (let child of children) {
                    if (child.isleaf === true || !_.get(child, 'children.length')) {
                        s.add(child.refpk);
                    }
                    loop(child.children);
                }
            };
            loop(this.getOriginCurrent(refpkOrPks));

            return this.getCurrent([...s]);
        },

         // 直接下级（排除自己）
         getLowerNoMe (refpkOrPks = []) {
            let s = _ensurePkToArray(refpkOrPks);
            let res = []
            for (let child of this.getOriginCurrent(s)) {
                res.push(...this.getChildRefPks(child));
            }

            return this.getCurrent(res);
        },

        // 获取children pk
        getChildRefPks (parentNode = {}) {
            let s = new Set();
            for (let child of parentNode.children || []) {
                s.add(child.refpk);
            }
            return [...s];
        },
        // 获取所有pks
        getAllPks () {
            return this.all.keys();
        },
        // 获取所有的节点信息
        getAllnodes () {
            return this.all.values();
        }
    }
}

function _initMapping(nodes) {
    let all = new Map();

    // init all Mapping
    let loop = (children = []) => {
        for (let child of children) {
            let refpk = _.get(child, 'refpk');
            all.set(refpk, child);
            loop(_.get(child, 'children'))
        }
    };

    loop(nodes);

    return all;
}

function _ensurePkToArray(refpkOrPks) {
    // format to array
    // with copy/unique ret
    let ret = Array.isArray(refpkOrPks) ? refpkOrPks : [refpkOrPks];
    return [...new Set(ret)];
}