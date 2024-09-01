export const initRefer = {
    /**
     * @method 获取主组织的所有数据
     */
    async getMainOrgNodes () {
        let para = {
            pageInfo: {
                pageIndex: -1
            },
            queryCondition: {
                isShowUnit: false
            }
        };
        let res = await $nccUtil.promiseAjax('/nccloud/ufoe/refer/reportMainOrgTreeRef.do', para);
        return _.get(res, 'data.rows') || [];
    },
    /**
     * @method 根据主组织pk。查询该pk是否在主组织中存在
     * @param {string} pk_mainOrg：主组织的pk或display
     */
    async getMainOrg (pk_mainOrg) {
        let rows = await this.getMainOrgNodes(); //pk_mainOrg是pk时查找pk  pk_mainOrg是display时查找display
        return rows.find(it => (it.refpk === pk_mainOrg || it.refname === pk_mainOrg));
    },
     /**
     * @method 获取组织体系的所有数据
     * @param {string} pk_mainOrg：主组织的pk
     */
    async getRmsNodes (pk_mainOrg) {
        let para = {
            pageInfo: {
                pageIndex: 0,
                pageSize: 1e6,
            },
            queryCondition: {
                isShowUnit: false,
                pk_org: pk_mainOrg,
                GridRefActionExt: $nccConst.value.GridRefActionExt
            }
        }
        let res = await $nccUtil.promiseAjax('/nccloud/ufoe/refer/reportOrgSysGridRef.do', para);
        return _.get(res, 'data.rows') || [];
    },
    /**
     * @method 查询组织体系的pk或者display，在组织体系中是否存在
     * @param {string} pk_rms：组织体系的pk或display
     * @param {string} pk_mainOrg：主组织的pk
     */
    async getRms (pk_rms, pk_mainOrg) { //pk_rms是pk时查找pk  pk_rms是display时查找display
        let rows = await this.getRmsNodes(pk_mainOrg);
        return rows.find(it => (it.refpk === pk_rms || it.refname === pk_rms));
    },
     /**
     * @method 获取组织体系中第一个值
     * @param {string} pk_mainOrg：主组织pk
     */
    async getFirstRms (pk_mainOrg) {
        let rows = await this.getRmsNodes(pk_mainOrg);
        return rows[0];
    },

     /**
     * @method 获取任务的所有数据
     * @param {string} pk_mainOrg：主组织pk
     * @param {string} pk_busi：业务属性pk
     */
    async getTaskNodes (pk_mainOrg, pk_busi) {
        let para = {
            pageInfo: {
                pageIndex: 0,
                pageSize: 1e6,
            },
            queryCondition: {
                isShowUnit: false,
                pk_receiveorg: pk_mainOrg,
                busi_prop: pk_busi || ''
            }
        }
        let res = await $nccUtil.promiseAjax('/nccloud/ufoe/refer/taskGridRef.do', para);

        return _.get(res, 'data.rows') || [];
    },
     /**
     * @method 获取任务的pk或display在任务中是否存在，
     * @param {string} pk_task：任务的pk或display
     * @param {string} pk_mainOrg：主组织pk
     * @param {string} pk_busi：业务属性pk
     */
    async getTask (pk_task, pk_mainOrg, pk_busi) { //pk_task是pk时查找pk  pk_task是display时查找display
        let rows = await this.getTaskNodes(pk_mainOrg, pk_busi);
        return rows.find(it => (it.refpk === pk_task || it.refname === pk_task));
    },
     /**
     * @method 获取第一个任务
     * @param {string} pk_mainOrg：主组织pk
     * @param {string} pk_busi：业务属性pk
     */
    async getFirstTask (pk_mainOrg, pk_busi) {
        let rows = await this.getTaskNodes(pk_mainOrg, pk_busi);
        return rows[0];
    },
     /**
     * @method 获取三个参照的值
     * @param {string} pk_mainOrg：主组织pk
     * @param {string} pk_rms：组织体系pk
     * @param {string} pk_task：任务pk
     */
    async get3ReferNode (pk_mainOrg, pk_rms, pk_task) {
        let mainOrgNode = await this.getMainOrg(pk_mainOrg);
        let rmsNode = await this.getRms(pk_rms, pk_mainOrg);
        let taskNode = await this.getTask(pk_task, pk_mainOrg);
        return {mainOrgNode, rmsNode, taskNode,};
    },
}