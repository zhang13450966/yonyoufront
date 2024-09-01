const eventbus = (function () {
    let events = {},
        onces = {},
        isWhateType = (obj, type) => {
            return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
        };

    return {
        on: function (event, callback) {
            if (isWhateType(event, 'string')) {
                if (isWhateType(callback, 'function')) {
                    events[event] = events[event] || [];
                    let index = events[event].indexOf(callback);
                    if (index == -1) {
                        events[event].push(callback);
                    }
                }
            }
        },
        once: function (event, callback) {
            if (isWhateType(event, 'string')) {
                if (isWhateType(callback, 'function')) {
                    onces[event] = onces[event] || [];
                    let index = onces[event].indexOf(callback);
                    if (index == -1) {
                        onces[event].push(callback);
                    }
                }
            }
        },
        off: function (event, callback) {
            if (isWhateType(event, 'string')) {
                if (isWhateType(callback, 'function')) {
                    events[event] = events[event] || [];
                    let index = events[event].indexOf(callback);
                    if (index != -1) {
                        events[event].splice(index, -1);
                    }
                }

                if (isWhateType(callback, 'undefined')) {
                    events[event] = null;
                    delete events[event];
                }
            }

            if (isWhateType(event, 'undefined')) {
                events = null;
                events = {};
            }
        },
        dispatch: function () {
            if (arguments.length) {
                const event = arguments[0];
                // for not once
                if (isWhateType(event, 'string') && events[event]) {
                    const params = Array.prototype.splice.call(arguments, 1, arguments.length);

                    for (let x in events[event]) {
                        if (events[event].hasOwnProperty(x)) {
                            try {
                                events[event][x].apply(null, params);
                            } catch (error) {
                                console.log('EventHandleError.', error);
                            }
                        }
                    }
                }
                // for once
                if (isWhateType(event, 'string') && onces[event]) {
                    const params = Array.prototype.splice.call(arguments, 1, arguments.length);

                    for (let x in onces[event]) {
                        if (onces[event].hasOwnProperty(x)) {
                            try {
                                onces[event][x].apply(null, params);
                            } catch (error) {
                                console.log('EventHandleError.', error);
                            }
                        }
                    }
                    delete onces[event];
                }
            }
        }
    }
})();

export default eventbus;