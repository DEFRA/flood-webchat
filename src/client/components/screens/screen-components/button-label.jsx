// ButtonLabelComponent.jsx
import React from 'react'

const ButtonLabelComponent = ({ isButtonDisabled }) => {
  const buttonLabel = isButtonDisabled ? 'Requesting...' : 'Request Chat'

  return <span>{buttonLabel}</span>
}

export default ButtonLabelComponent
