'use strict';

const
    isRoot = require('is-root'),
    ports = {
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

function isInRange(port, min, max) {

    // Ports are allowed to exactly equal min or max, otherwise they
    // must be between min and max (avoids false positives).
    if (port === min || port === max || (min < port && port < max)) {
        return true;
    }

    return false;
}

function portType(port) {

    // Special case. Port 0 means a system-allocated dynamic port.
    if (port === 0) {
        return 'dynamic';
    }

    for (const type in ports) {
        if (isInRange(port, ports[type].min, ports[type].max)) {
            return type;
        }
    }
}
function isSystem(port) {
    return portType(port) === 'system';
}
function isRegistered(port) {
    return portType(port) === 'registered';
}
function isDynamic(port) {
    return portType(port) === 'dynamic';
}
// API to ask whether binding to a port would require
// elevated privileges on the current platform.
function needsRoot(port) {
    return process.platform === 'win32' ? false : isSystem(port);
}
// API to ask whether we have the necessary privileges
// to bind to a port.
function haveRights(port) {
    return !needsRoot(port) || isRoot();
}

portType.isSystem     = isSystem;
portType.isRegistered = isRegistered;
portType.isDynamic    = isDynamic;

// Aliases.
portType.isWellKnown = isSystem;
portType.isPrivate   = isDynamic;

// Permission utilities.
portType.needsRoot    = needsRoot;
portType.haveRights   = haveRights;

module.exports = portType;
