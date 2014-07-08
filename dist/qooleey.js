(function (root, decorator) {
    'use strict';

    // CommonJS
    if (typeof exports === 'object' && module) {
        module.exports = decorator;

    // AMD
    } else if (typeof define === 'function' && define.amd) {
        define(decorator);

    // Browser
    } else {
        root.qooleey = decorator;
    }
}(( typeof window === 'object' && window ) || this, function () {
    "use strict";

    /**
     * qooleey, is an object decorator adding pub/sub functionality
     * inspired heavily by others pub/sub libs
     * TODO: find reference to other libs
     *
     * @module
     */
    var qooleey = (function () {
        var extensionMethods = Object.create(null),
            id = 0;

        /**
         * Add a subscriber to the subscribers list.
         * Client has to pass in a handler function and itself as arguments.
         *
         * @param {function} handler
         * @param {object} subscriber
         * @returns {number}
         */
        extensionMethods.addSubscriber = function (handler, subscriber) {
            this.subscribers.push({
                id: id += 1,
                handler: handler,
                subscriber: subscriber
            });

            return id;
        };

        /**
         * Remove a subscriber from receiving notification
         *
         * @param {number} id
         */
        extensionMethods.removeSubscriber = function (id) {
            var len = this.subscribers.length,
                i = 0;
            for (; i < len; i++) {
                if (this.subscribers[i].id === id) {
                    this.subscribers.splice(i, 1);
                    break;
                }
            }
        };

        /**
         * Publish notification to subscribers
         *
         * @param what
         * @param sender
         * @param data
         */
        extensionMethods.publish = function (what, sender, data) {
            var len = this.subscribers.length,
                i = 0;
            for (; i < len; i++) {
                this.subscribers[i].handler.call(this.subscribers[i].subscriber, what, sender, data);
            }
        };

        /**
         * Enables the publishing capability of an object
         *
         * @param {object} obj
         * @param {string} autoPublishMethodName
         */
        var makePublisher = function (obj, autoPublishMethodName) {
            var autoPublishMethod;
            if (!obj) return;

            // 'extends' obj as a publisher by adding new methods to it
            obj.subscribers = [];
            for (var m in extensionMethods) {
                obj[m] = extensionMethods[m];
            }

            // if there is an autoPublishMethodName and it has a corresponding method in obj then we decorate the method with an auto-publishing one
            if (autoPublishMethodName &&
                obj[autoPublishMethodName] &&
                Object.prototype.toString.call(obj[autoPublishMethodName]) === '[object Function]') {

                autoPublishMethod = obj[autoPublishMethodName];
                obj[autoPublishMethodName] = function () {
                    var retVal = autoPublishMethod.apply(obj, arguments);

                    obj.publish.apply(obj, arguments);

                    return retVal;
                };
            }

        };

        return {makePublisher: makePublisher};
    })();

    return qooleey;
}));
