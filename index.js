'use strict';

const isRoot = require('is-root');

const range = {
    system : {
        min : 1,
        max : 1023
    },
    registered : {
        min : 1024,
        max : 49151
    },
    dynamic : {
        min : 49152,
        max : 65535
    }
};

const isInRange = (port, min, max) => {
    // Ports are allowed to exactly equal min or max, otherwise they
    // must be between min and max (avoids false positives).
    return port === min || port === max || (min < port && port < max);
};

const is = (port) => {
    return Object.keys(range).find((type) => {
        return module.exports['is' + type[0].toUpperCase() + type.substring(1)](port);
    });
};

const isSystem = (port) => {
    return isInRange(port, range.system.min, range.system.max);
};
const isRegistered = (port) => {
    return isInRange(port, range.registered.min, range.registered.max);
};
const isDynamic = (port) => {
    // Zero is a wildcard for a dynamic port.
    // See: http://unix.stackexchange.com/a/180500
    return port === 0 || isInRange(port, range.dynamic.min, range.dynamic.max);
};

// Find out if binding to a port would require elevated privileges
// on the current platform.
const needsRoot = (port) => {
    return process.platform === 'win32' ? false : isSystem(port);
};
// Find out if we have the necessary privileges to bind to a port.
const haveRights = (port) => {
    return !needsRoot(port) || isRoot();
};

module.exports = {
    range,
    is,
    isSystem,
    isRegistered,
    isDynamic,
    needsRoot,
    haveRights
};
