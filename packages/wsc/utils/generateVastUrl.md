 ```javascript static
import { generateVastUrl } from 'wsc/src/utils/generateVastUrl'
```

 ### Summary

- Generates and returns a vast url for use as pre-roll in jw player. Makes use of the site's global ad config to generate.

### Usage

#### generateVastUrl()
Returns a vast ad url. Takes a deviceType string as an argument. The value of deviceType should be on of the following: "mobile", "desktop", "tablet"
```javascript static
generateVastUrl(deviceType)
```



 
