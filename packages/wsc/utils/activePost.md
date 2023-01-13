 ```javascript static
import { activePost } from 'wildsky-components'
```

 ### Summary

- State for tracking which post is 'active' in the viewport.
- Need this so we can update URL only for the active post.
- We're not using props or context here to avoid rerenders,
- which aren't necesarry when this changes and we want to avoid prop-drilling a ref.

### Usage

#### setActivePost()
Sets the currently active post as well as lastActivePost if activePost exists. Takes post object as an argument
```javascript static
setActivePost(post)
```

#### isActivePost()
Takes a post object as an argument. Returns boolean. True if post.sys.id matches activePost post.sys.id
 ```javascript static
isActivePost(post)
```

#### isLastActivePost()
Takes a post object as an argument. Returns boolean. True if post.sys.id matches lastActivePost post.sys.id
 ```javascript static
isActivePost(post)
```

#### getActivePost()
Returns activePost object. 
 ```javascript static
getActivePost()
```

#### getLastActivePost()
Returns lastActivePost object. 
 ```javascript static
getLastActivePost()
```

#### clearLastActivePost()
Clears the lastActivePost state value 
 ```javascript static
clearLastActivePost()
```
#### clearAllActivePosts()
Clears both the activePost and lastActivePost state values
 ```javascript static
clearAllActivePosts()
```



 
