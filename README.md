# port-type

A helper to categorize port numbers and understand what they mean.

 - Get the type of a port (registered vs dynamic, etc.)
 - Ask if a port needs root privileges on your system.
 - Ask if you have sufficient privileges to listen.

**Version**: `0.0.3`

**Documentation**: https://sholladay.github.io/port-type/

## Installation
````sh
npm install port-type --save
````

## Usage
Retrieve the [type of port](http://en.wikipedia.org/wiki/Registered_port "Explanation of distinct port categories.") you are working with, as a lowercase string.

````javascript
var input = 123;
portType(input);  // => "system"
````

But why type all that and still have to do a [strict equality check](http://www.impressivewebs.com/why-use-triple-equals-javascipt/ "Explanation of why you should always use triple equals over double equals in JavaScript.")? Fuggedaboutit.

````javascript
var input = 123;
portType.isSystem(input);  // => true
````

There are other types, too.
````javascript
var input = 4444;
portType.isSystem(input);      // => false
portType.isRegistered(input);  // => true
portType.isDynamic(port);      // => false
````

Still wondering what these are exactly? They are simple number ranges, which determine how different sets of ports should be used. You can get the definition of each range, too.
````javascript
var input = 4444;
portType.ports.system.MIN;     // => 0
portType.ports.registered.MAX  // => 49151
````
But a better way is to ask with some sugar on top.
portType.min('system');      // => 0
portType.max('registered');  // => 49151

There are a few handy dandy method aliases because I love you and I don't want you to be sad.

````javascript
var input = 123;
portType.isWellKnown(input);  // => true, same as isSystem
portType.isPrivate(input);    // => false, same as isDynamic
````

Eventually you are going to want to make use of the underlying data by determining if it is even remotely possible or sensible to try to listen on a port.

````javascript
var input = 80;
portType.needsRoot(input);  // => false on Windows, true everywhere else
````

or...

````javascript
var input = 80;
portType.haveRights() === global;  // => true on Windows, false everywhere else unless running as root
````

Isn't that warm and cozy? Just look at it.

## Contributing
See our [contribution guidelines](https://github.com/sholladay/port-type/blob/master/CONTRIBUTING.md "The guidelines for being involved in this project.") for mode details.
1. [Fork it](https://github.com/sholladay/port-type/fork).
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/port-type/compare "Submit code to this repo now for review.").

## License
[MPL-2.0](https://github.com/sholladay/port-type/blob/master/LICENSE "The license for port-type.")
