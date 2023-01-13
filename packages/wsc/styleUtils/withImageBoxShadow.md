 ```javascript static
import { withImageBoxShadow } from 'wsc/styleUtils/withImageBoxShadow'
```

 ### Summary

style "mixin" for box-shadow

### Usage

Returns css for box-shadow property.
The prop "isStaticShadowLength" bool can be passed via a styled component which determines whether the box-shadow length is responsive

```javascript static
const Example = styled.div`
  ${withImageBoxShadow}
`
return (<Example isStaticShadowLength={false}>)
```
