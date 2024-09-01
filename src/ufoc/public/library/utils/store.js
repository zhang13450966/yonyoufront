/**
 * @description 页面用的比较多, 统一管控, 为以后增加日志提供较友好的方法
 * 一：方法代理
 * 二：增加 getDef(k),setDef(k,v)
 *      -方便快速保存页面数据
 *      -方法与cardCache缓存数据无关
 *      -减少state,this等负载
 * 三：ide友好提示
 * @todo 页面只有一个 dataSource就好,以后合并 cardTable
 * */
import {cacheTools, cardCache} from 'nc-lightapp-front';

// 页面自定义存方数据, 与缓存区分开
const PAGE_STORE = '__page_store_namespace_for_ufoe';

export class _store {
    static _data = {};

    /**
     * @description 添加缓存
     * @method addCache
     */
    static addCache(pkvalue, newData, headAreacode, dataSource, headData) {
        return cardCache.addCache(pkvalue, newData, headAreacode, dataSource, headData);
    }

    /**
     * @description 更新缓存
     * @method updateCache
     */
    static updateCache(pkname, pkvalue, newData, headAreacode, dataSource, headData) {
        return cardCache.updateCache(pkname, pkvalue, newData, headAreacode, dataSource, headData);
    }

    /**
     * @description 更新缓存
     * @method deleteCacheById
     */
    static getNextId(pkvalue, dataSource) {
        return cardCache.getNextId(pkvalue, dataSource);
    }

    /**
     * @description 更新缓存
     * @method deleteCacheById
     */
    static deleteCacheById(pkname, pkvalue, dataSource) {
        return cardCache.deleteCacheById(pkname, pkvalue, dataSource);
    }

    /**
     * @description 获取表格最后一个pk, 平台提供
     * @method getCurrentLastId
     */
    static getCurrentLastId(dataSource) {
        // updateCache 获取到
        return cardCache.getCurrentLastId(dataSource);
    }

    static getCacheById(pkvalue, dataSource) {
        return cardCache.getCacheById(pkvalue, dataSource);
    }

    /**
     * @description 放在session或者local可选的值, 小的值可放在此处，用于刷新保持的值
     * @method getSession
     * @param {string} key: session键
     */
    static getSession(key) {
        return cacheTools.get(key);
    }

    /**
     * @description 放在session或者local可选的值, 小的值可放在此处，用于刷新保持的值
     * @method setSession
     * @param {string} key: session键
     * @param {string|object} [value]: session值
     */
    static setSession(key, value) {
        if (!value) { // value 不存在等效删除缓存key
            return cacheTools.remove(key);
        }
        return cacheTools.set(key, value);
    }

    /**
     * @description 放在Map值, 用于大值, 可用过交互参数保存等 eg refresh
     * @method getDef
     * @param {string} key: map键
     */
    static getDefData(key, dataSource) {
        return cardCache.getDefData(key, dataSource);
    }

    /**
     * @description 放在Map值, 用于大值, 可用过交互参数保存等 eg refresh
     * @method setDef
     * @param {string} key: map键
     * @param {object} value: map值
     */
    static setDefData(key, dataSource, data) {
        return cardCache.setDefData(key, dataSource, data);
    }

    /**
     * @description quick get 自定义数据
     * @method getDef
     * @param {string} key: map键
     * @param {string|[]} [path]
     */
    static getDef(key, path) {
        let value = this.getDefData(key, PAGE_STORE);

        return path ? _.get(value, path) : value;
    }

    /**
     * @description quick set 自定义数据
     * @method setDef
     * @param {string} key: map键
     * @param {*} value: map值
     * @param {string|[]} [path]
     */
    static setDef(key, value = null, path) {
        value = path ? _.set(this.getDef(key), path, value) : value;

        this._data[key] = value;
        return this.setDefData(key, PAGE_STORE, value);
    }
}