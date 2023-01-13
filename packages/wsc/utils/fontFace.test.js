import { createFontStyles } from './fontFace'

describe('fontFace', () => {
  it('should create font styles', () => {
    const AVENIR_FONT_CONFIG = [
      {
        fontFamily: 'Avenir Next LT Pro',
        url: 'AvenirNextLTPro-Bold.otf',
        format: 'opentype',
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
      {
        fontFamily: 'Avenir Next LT Pro',
        url: 'AvenirNextLTPro-It.otf',
        format: 'opentype',
        fontWeight: 'bold',
        fontStyle: 'italic',
      },
    ]

    const css = createFontStyles(AVENIR_FONT_CONFIG)
    expect(css).toMatchSnapshot()
  })
})
