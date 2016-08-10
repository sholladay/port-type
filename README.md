# port-type [![Build status for port-type on Circle CI.](https://img.shields.io/circleci/project/sholladay/port-type/master.svg "Circle Build Status")](https://circleci.com/gh/sholladay/port-type "Port Type Builds")

> Categorize port numbers by semantics.

## Why?

 - Helps you screen user input.
 - Identify port ranges by name.
 - Can tell you if it is possible to start a server.

## Install

```sh
npm install port-type --save
```

## Usage

Get it into your program.

```js
const portType = require('port-type');
```

Identify the [type of port](http://en.wikipedia.org/wiki/Registered_port "Explanation of distinct port categories.") you are working with, as a lowercase string.

```js
portType.is(123);  // => "system"
```

But why type all that and still have to do a [strict equality check](http://www.impressivewebs.com/why-use-triple-equals-javascipt/ "Explanation of why you should always use triple equals over double equals in JavaScript.")? Fuggedaboutit.

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

## Contributing

See our [contributing guidelines](https://github.com/sholladay/port-type/blob/master/CONTRIBUTING.md "The guidelines for participating in this project.") for more details.

1. [Fork it](https://github.com/sholladay/port-type/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/port-type/compare "Submit code to this project for review.").

## License

[MPL-2.0](https://github.com/sholladay/port-type/blob/master/LICENSE "The license for port-type.") © [Seth Holladay](http://seth-holladay.com "Author of port-type.")

Go make something, dang it.
