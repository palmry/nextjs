import React from 'react'
import { render } from '@testing-library/react'
import MarkdownInjector, { processMarkdown, createMarkdownPlaceHolder } from './MarkdownInjector'
import { ButtonAction } from '../button/ButtonAction'
import { DATA } from './__fixtures__/MarkdownInjector'

const ButtonActionInjector = jest.fn(index => {
  // insert after first paragraph
  if (index === 0) {
    return {
      after: <ButtonAction text={'OK'} key={`button-${index}`} />,
    }
  }
})

describe('processMarkdown function', () => {
  it('does nothing if markdown is null', () => {
    const components = processMarkdown(null, null)
    expect(components).toBeUndefined()
  })
  it('can inject any components to markdown', () => {
    const components = processMarkdown([ButtonActionInjector], DATA.markdownData)

    // ensure the injector function is called
    expect(ButtonActionInjector).toBeCalled()

    expect(components).toMatchSnapshot()
  })
})

describe('MarkdownInjector', () => {
  it('does nothing if markdown is null', () => {
    const { container } = render(<MarkdownInjector componentInjectors={[ButtonActionInjector]} />)
    expect(container.firstChild).toBeNull()
  })
  it('can inject any components to markdown', () => {
    const { container } = render(
      <MarkdownInjector componentInjectors={[ButtonActionInjector]} markdown={DATA.markdownData} />
    )
    expect(container).toMatchSnapshot()
  })
})

/*
We will enable this once we fixed twitter quote issue.
describe('createMarkdownPlaceHolder', () => {
  it('can replace embed code with EmbedImage component', () => {
    const markdownList = createMarkdownPlaceHolder(DATA.embedCodeData)
    expect(markdownList).toMatchSnapshot()
  })
})*/
