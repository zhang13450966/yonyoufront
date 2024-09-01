export class _store {
    static _data = {};

    // key a.b.c
    static get(key) {
        return _.get(this._data, key);
    }

    // key a.b.c
    static set(key, value) {
        _.set(this._data, key, value);
    }

    // key a.b.c
    static remove(key) {
        this._data = _.omit(this._data, key);
    }
}