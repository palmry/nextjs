 ```javascript static
import { queryStrings } from 'wsc/utils/queryStrings'
```

 ### Summary

url query string helpers

### Usage

#### queryStrings
Returns an object containing query strings from the current url location. For example if the url is "cafemom.com?foo=true&bar=false" the function will return this
```javascript static
{foo: 'true', bar: 'false'}
```

#### queryStringsBoolean()
Takes a string as an argument. 
Returns true if the current url contains the string passed in the query argument. Otherwise returns false. 
```javascript static
queryStringsBoolean('foo')
```
For example if the url is "cafemom.com?foo=somevalue"
```javascript static
queryStringsBoolean('foo')
```
will return this
```javascript static
true
```