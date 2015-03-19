var ports = {
    system : {
        min : 0,
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

function fail(port, silent) {

    if (!silent) {
        if (typeof message === 'function') {
            message = message(port);
        }
        if (!message || typeof message !== 'string') {
            // Default.
            message = 'Supplied port ' + port + ' is not a valid number.';
        }

        throw new Error(message);
    }
}

function isInRange(port, min, max) {

    var result = false;

    // ports are allowed to exactly equal min or max, otherwise they
    // must be between min and max (avoids false positives)...
    if (port === min || port === max || (min < port && port < max)) {
        result = true;
    }

    return result;
}

function getPortType(port) {

    var min, max, result;

    for (type in ports) {
        if (Object.prototype.hasOwnProperty.call(ports, type)) {
            min = ports[type].min;
            max = ports[type].max;
            if (isInRange(port, min, max)) {
                result = type;
                break;
            }
        }
    }

    return result;
}

function tryToFindNumber(port, silent) {

    var firstNumber = /-?\d*\.?\d+/,
        matches,
        result;

    if (typeof port === 'function') {
        // Assume the desired port still needs to be computed.
        port = port();
    }

    if (typeof port === 'number') {
        result = port;
    }

    else if (typeof port === 'string') {
        matches = port.match(firstNumber);
        if (matches) {
            // Coerce to a number.
            result = +(matches[0]);
        }
        else {
            fail(port, silent);
        }
    }
    else {
        fail(port, silent);
    }

    return result;
}

function sanitizePort(port, silent) {

    var result;

    if (typeof port === 'function') {
        port = port();
    }

    // Try to convert it to the nearest integer.
    result = Math.round(
        tryToFindNumber(port)
    );

    // Try to turn it into a positive number.
    result = Math.abs(result);

    // Final sanity check.
    if (Number.isNaN(result)) {
        fail(port, silent);
    }

    return result;
}

function app(port, silent) {

    var result;

    port = sanitizePort(port, silent);

    if (port) {
        result = getPortType(port);
    }

    return result;
}
function isSystem(port) {
    return app(port) === 'system';
}
function isWellKnown(port) {
    // alias
    return isSystem(port);
}
function isRegistered(port) {
    return app(port) === 'registered';
}
function isDynamic(port) {
    return app(port) === 'dynamic';
}
function isPrivate(port) {
    // alias
    return isDynamic(port);
}
function needsRoot(port) {
    return process.platform === 'win32' ? false : isSystem(port);
}
function haveRights(port) {
    return !needsRoot(port) || require('is-root')();
}
app.isSystem     = isSystem;
app.isWellKnown  = isWellKnown;
app.isRegistered = isRegistered;
app.isDynamic    = isDynamic;
app.needsRoot    = needsRoot;

module.exports = app;
