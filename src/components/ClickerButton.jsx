'use client'

import { useState, useRef } from 'react';

export default function ClickerButton() {
    const [count, setCount] = useState(0);
    const interval = useRef(0);
    function handleClick() {
        setCount(interval.current += 1);
    };
    return(
        <button onClick={handleClick} className='px-4 py-2 border-2 border-white rounded-3xl hover:border-amber-950'>Clicked {count} Times!</button>
    )
}