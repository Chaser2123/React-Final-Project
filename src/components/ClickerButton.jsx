'use client'

import { useRef, useState } from "react"

export default function ClickerButton() {
    const [count, setCount] = useState(0);
    const interval = useRef(0);

    function handleClick() {
        interval.current++;
        setCount(interval.current);
    }
    return (
        <div className="flex justify-center items-center w-full">
            <button onClick={handleClick} className="px-4 py-2 text-white border-2 border-white rounded-3xl hover:bg-amber-950">You clicked {count} times</button>
        </div>
    )
}