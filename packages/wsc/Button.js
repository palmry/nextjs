import * as React from 'react'
import Link from 'wsc/components/Link'
export const Button = () => {
  return (
    <Link withDefaultStyle={false} to="/contact">
      <button>contact page</button>
    </Link>
  )
}
