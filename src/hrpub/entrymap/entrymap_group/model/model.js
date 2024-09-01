import proFetch from '../../../../hrpub/common/utils/project-fetch'

export default {
    name: 'entrymapGroup',
    data: {
        orgValue: {},
        pk_org: null,
        isOrg: false,
        formDataSave: {},
        json: {},
        orgDisabled: false
    },
    sync: {
        update(state, payload) {
            return {
                ...state,
                ...payload
            };
        }
    },
    async: {
        // 入职地图查询操作
        queryEntryMapAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/entrymap/QueryEntryMapAction.do',
                body: payload.postData
            });
        },
        // 入职地图启用/停用操作
        entryMapEnableAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/entrymap/EntryMapEnableAction.do',
                body: payload.postData
            });
        },
        // 入职地图保存操作
        entryMapSaveAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/entrymap/EntryMapSaveAction.do',
                body: payload.postData
            });
        }
    }

}