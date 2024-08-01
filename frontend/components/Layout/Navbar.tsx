import React from 'react'

interface Props {}

function Navbar({}: Props) {
    return (
        <nav className="px-5 text-black bg-white sticky top-0 z-50 py-4  w-full border-b mb-3">
            <h1 className="text-lg font-bold">VibeMatch</h1>
        </nav>
    )
}

export default Navbar
