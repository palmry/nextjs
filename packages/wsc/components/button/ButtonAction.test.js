import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonAction } from './ButtonAction'

const BUTTON_TEXT = 'SUBSCRIBE TO CafeMom.com'

describe('ButtonAction', () => {
  // Functional Test
  it('can be clicked', () => {
    const clickEvent = jest.fn()

    // Render the component
    render(<ButtonAction text={BUTTON_TEXT} active={true} action={clickEvent} />)

    // Click on button
    userEvent.click(screen.getByText(BUTTON_TEXT))

    // Check the click event function is called
    expect(clickEvent).toHaveBeenCalled()
  })
})
