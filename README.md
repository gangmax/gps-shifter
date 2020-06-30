This program is a JavaScript port of the original [Python](https://github.com/scateu/PyWGS84ToGCJ02/blob/master/WGS84ToGCJ02.py) version.

This program is used to solve the GPS shifting [issue](https://www.serviceobjects.com/blog/why-gps-coordinates-look-wrong-on-maps-of-china/). More details of this issue can be found [here](https://en.wikipedia.org/wiki/Restrictions_on_geographic_data_in_China).

Install this package:

```bash
npm install gps-shifter
```

How to use:

```js
const gps = require('gps-shifter');
gps.shift(39.90768, 116.39101);
// output: { lat: 39.90908114338472, lng: 116.39725105064856 }
gps.unshift(39.90908114338472, 116.39725105064856);
// output: { lat: 39.90767768348111, lng: 116.39100747992725 }
```
