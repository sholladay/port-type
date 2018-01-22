import test from 'ava';
import isRoot from 'is-root';
import portType from '.';

test('range', (t) => {
    t.deepEqual(portType.range, {
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
    });
    t.deepEqual(Object.keys(portType.range), ['system', 'registered', 'dynamic']);
    for (const range of Object.values(portType.range)) {
        t.is(typeof range, 'object');
        t.is(typeof range.min, 'number');
        t.is(typeof range.max, 'number');
        t.true(range.min >= 1);
        t.true(range.max >= 1);
        t.true(range.min <= 65535);
        t.true(range.max <= 65535);
    }
});

test('is()', (t) => {
    t.is(portType.is(0), 'dynamic');
    t.is(portType.is(1), 'system');
    t.is(portType.is(1023), 'system');
    t.is(portType.is(1024), 'registered');
    t.is(portType.is(49151), 'registered');
    t.is(portType.is(49152), 'dynamic');
    t.is(portType.is(65535), 'dynamic');
});

test('isSystem()', (t) => {
    t.false(portType.isSystem(0));
    t.true(portType.isSystem(1));
    t.true(portType.isSystem(1023));
    t.false(portType.isSystem(1024));
});

test('isRegistered()', (t) => {
    t.false(portType.isRegistered(1023));
    t.true(portType.isRegistered(1024));
    t.true(portType.isRegistered(49151));
    t.false(portType.isRegistered(49152));
});

test('isDynamic()', (t) => {
    t.false(portType.isDynamic(49151));
    t.true(portType.isDynamic(49152));
    t.true(portType.isDynamic(65535));
    t.false(portType.isDynamic(65536));
});

test('needsRoot()', (t) => {
    t.false(portType.needsRoot(0));
    t.false(portType.needsRoot(1024));
    t.false(portType.needsRoot(49151));
    t.false(portType.needsRoot(49152));
    t.false(portType.needsRoot(65535));

    if (process.platform === 'win32') {
        t.false(portType.needsRoot(1));
        t.false(portType.needsRoot(80));
        t.false(portType.needsRoot(443));
        t.false(portType.needsRoot(1023));
    }
    else {
        t.true(portType.needsRoot(1));
        t.true(portType.needsRoot(80));
        t.true(portType.needsRoot(443));
        t.true(portType.needsRoot(1023));
    }
});

test('haveRights()', (t) => {
    t.is(typeof portType.haveRights(80), 'boolean');
    t.true(portType.haveRights(0));
    t.true(portType.haveRights(1024));
    t.true(portType.haveRights(49151));
    t.true(portType.haveRights(49152));
    t.true(portType.haveRights(65535));

    if (process.platform === 'win32') {
        t.true(portType.haveRights(1));
        t.true(portType.haveRights(80));
        t.true(portType.haveRights(443));
        t.true(portType.haveRights(1023));
    }
    else if (isRoot()) {
        t.true(portType.haveRights(1));
        t.true(portType.haveRights(80));
        t.true(portType.haveRights(443));
        t.true(portType.haveRights(1023));
    }
    else {
        t.false(portType.haveRights(1));
        t.false(portType.haveRights(80));
        t.false(portType.haveRights(443));
        t.false(portType.haveRights(1023));
    }
});
