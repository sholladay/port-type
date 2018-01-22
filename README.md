# port-type [![Build status for Port Type](https://img.shields.io/circleci/project/sholladay/port-type/master.svg "Build Status")](https://circleci.com/gh/sholladay/port-type "Builds")

> Get info on [port number](https://en.wikipedia.org/wiki/Port_(computer_networking)) ranges and privileges

This module classifies numeric ports by their semantics and provides the range information for each type of port: [system](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports), [registered](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Registered_ports), and [dynamic](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Dynamic,_private_or_ephemeral_ports).

## Why?

 - Identifies port ranges by name.
 - Helps you validate user input and provide friendly defaults in configuration scripts.
 - Check whether a server can be started on a given port [based on privileges](https://w3.org/Daemon/User/Installation/PrivilegedPorts.html) (e.g. port 80 needs `sudo` on Unix).

## Install

```sh
npm install port-type --save
```

## Usage

Find a good port to run your server on.

```js
// server.js
const portType = require('port-type');
const serverPort = portType.haveRights(80) ? 80 : 3000;
console.log('serverPort:', serverPort);
```
```sh
$ node server.js
serverPort: 3000
$ sudo node server.js
serverPort: 80
```

Identify the [type of port](http://en.wikipedia.org/wiki/Registered_port "Explanation of distinct port categories") you are working with, as a lowercase string.

```js
portType.is(123) === 'system';  // => true
```

But why type all that and still have to do a [strict equality check](https://impressivewebs.com/why-use-triple-equals-javascipt/ "Explanation of why you should always use triple equals over double equals in JavaScript")? Fuggedaboutit.

```js
portType.isSystem(123);  // => true
```

There are other types, too.

```js
const port = 4444;
portType.isSystem(port);      // => false
portType.isRegistered(port);  // => true
portType.isDynamic(port);     // => false
```

Still wondering what these are exactly? They are simple number ranges, which determine how different sets of ports should be used. You can get the definition of each range, too.

```js
portType.range.system.min;      // => 1
portType.range.registered.max;  // => 49151
```

Eventually you will want to determine if it is even remotely possible or sensible to try to listen on a port.

```js
const port = 80;
portType.needsRoot(port);   // => false on Windows, true everywhere else
portType.haveRights(port);  // => true on Windows, false everywhere else unless running as root
```

Isn't that warm and cozy? Just look at it.

## API

### range

Type: `object`

Provides `system`, `registered`, and `dynamic` as properties, representing various port ranges specified by [IANA](https://en.wikipedia.org/wiki/Internet_Assigned_Numbers_Authority). Each is an object with `min` and `max` properties that are numbers.

Example:

```js
const portType = require('port-type');
console.log('Highest system port:', portType.range.system.max);
```

Note that port 0 is a [special case](http://unix.stackexchange.com/a/180500). It is not a real port number in most contexts and is not included here. It is typically used by applications to ask the operating system to assign them an available dynamic port, so you'll usually want to treat it as such. Our helper functions, including [`isDynamic()`](#isDynamic), treat port 0 as dynamic.

### is(port)

Returns the name of the range that the `port` belongs to, such as `registered`.

### isSystem(port)

Returns a boolean for whether the `port` is a [system port](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports) in the range of 1 - 1023 (inclusive).

### isRegistered(port)

Returns a boolean for whether the `port` is a [registered port](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Registered_ports) in the range of 1024 - 49151 (inclusive).

### isDynamic(port)

Returns a boolean for whether the `port` is either `0` or a [dynamic port](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Dynamic,_private_or_ephemeral_ports) in the range of 49152 - 65535 (inclusive).

### needsRoot(port)

Returns a boolean for whether elevated privileges are required to listen on the `port`. In other words, it only ever returns `true` if `port` is a system port. But it always returns `false` on Windows, because there you can listen on any port (even a system port) without Administrator mode.

### haveRights(port)

Returns a boolean for whether the current process has sufficient privileges to listen on the `port` by checking whether the process is running as root. Always returns `true` on Windows or if the `port` is not a system port, since elevated privileges are not required in those cases.

## Related

 - [default-port](https://github.com/sholladay/default-port) - Get the default port for a given protocol
 - [port-drop](https://github.com/sholladay/port-drop) - Bind to a port and drop privileges
 - [port-status](https://github.com/sholladay/port-status) - Detect port availability

## Contributing

See our [contributing guidelines](https://github.com/sholladay/port-type/blob/master/CONTRIBUTING.md "Guidelines for participating in this project") for more details.

1. [Fork it](https://github.com/sholladay/port-type/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/port-type/compare "Submit code to this project for review").

## License

[MPL-2.0](https://github.com/sholladay/port-type/blob/master/LICENSE "License for port-type") © [Seth Holladay](https://seth-holladay.com "Author of port-type")

Go make something, dang it.
