import React, { useState } from 'react'
import { increment, decrement, incrementByAmount } from './counterSlice'
import { useSelector, useDispatch } from 'react-redux'

const Counter = () => {
    const count = useSelector((state)=>state)
    console.log(count)
    const dispatch = useDispatch();
  return (
    <div>
      counter
    </div>
  )
}

export default Counter
