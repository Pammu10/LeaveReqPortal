import React from 'react'

const ChildComponent = (props) => {
    const {name} = props;
  return (
    <p>Hello, {name} !</p>
  )
}

export default ChildComponent