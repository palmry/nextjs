import React from 'react'
import { render } from '@testing-library/react'
import ContentMarkdown from './ContentMarkdown'

describe('ContentMarkdown', () => {
  it('can render contentful markdown', () => {
    // mock the IG api
    window.instgrm = {
      Embeds: {
        process: jest.fn(() => {}),
      },
    }

    // render the component with markdown and <script> tag
    const { container } = render(
      <ContentMarkdown
        content={`[Wayfair's \"Way Day\" sale](https://www.wayfair.com/daily-sales/way-day) totally beats them all <script src="test.js"></script>`}
      />
    )

    // ensure the IG emded process is called.
    expect(window.instgrm.Embeds.process).toBeCalled()

    // check the content that is transformed to HTML.
    expect(container.firstChild).toMatchSnapshot()
  })
})
