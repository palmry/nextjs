import React, { useState, useEffect } from 'react'
import ContactUsForm from './ContactUsForm'
import ContactUsSubmitResult from './ContactUsSubmitResult'

const PAGE_STATE = {
  FORM: 'form',
  COMPLETE: 'complete',
}

const ContactUsPage = ({ history }) => {
  const [pageState, setPageStage] = useState(PAGE_STATE.FORM)

  useEffect(() => {
    window.scroll(0, 0)
  }, [pageState])

  useEffect(() => {
    const unlisten = history.listen((location) => {
      // Add this condition to avoid a duplicated call by changing the location to another page.
      if (location.pathname === '/contact') {
        if (pageState === PAGE_STATE.COMPLETE) {
          // At the thank you page,
          // It needs to set the state back to the form page when the user clicks the contact link at footer.
          setPageStage(PAGE_STATE.FORM)
        } else {
          // Jump a cursor to the top of page if the user stays at form page.
          window.scroll(0, 0)
        }
      }
    })
    return () => {
      // Unload the listener to avoid multiple calls from another component.
      unlisten()
    }
  }, [history, pageState])

  const content =
    pageState === PAGE_STATE.FORM ? (
      <ContactUsForm
        onSuccess={() => {
          setPageStage(PAGE_STATE.COMPLETE)
        }}
      />
    ) : (
      <ContactUsSubmitResult />
    )

  return content
}

export default ContactUsPage
