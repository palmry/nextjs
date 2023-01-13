import { createGlobalStyle } from 'styled-components'

const SubscribePopupStyle = createGlobalStyle`
  .subscribe-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  .subscribe-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }
  .subscribe-exit {
    opacity: 1;
  }
  .subscribe-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 300ms, transform 300ms;
  }
`

export default SubscribePopupStyle
