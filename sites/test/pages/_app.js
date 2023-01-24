import '../styles/globals.css'
import DetectDeviceProvider from 'wsc/components/context/DetectDeviceProvider'
import { PreviewSiteBannerProvider } from 'wsc/components/context/PreviewSiteBannerProvider'
import { NavbarProvider } from 'wsc/components/context/NavbarProvider'
import { LocaleProvider } from '../components/context/LocaleProvider'
import { PostNavProvider } from 'wsc/components/context/PostNavProvider'

export default function App({ Component, pageProps }) {
  return (
    <LocaleProvider>
      <DetectDeviceProvider>
        <PreviewSiteBannerProvider>
          <PostNavProvider>
            <NavbarProvider>
              <Component {...pageProps} />
            </NavbarProvider>
          </PostNavProvider>
        </PreviewSiteBannerProvider>
      </DetectDeviceProvider>
    </LocaleProvider>
  )
}
