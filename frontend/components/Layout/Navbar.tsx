'use client'
import { useState, useEffect, ChangeEvent } from 'react'
import { MoreVertical, Search } from 'react-feather'
import { useRouter } from 'next/navigation'
import { VibeMatchUser } from '@/lib/types'

interface Props {
    users: VibeMatchUser[] | []
}

function Navbar({}: Props) {
    const [openMenu, setOpenMenu] = useState(false)
    const [input, setInput] = useState('')
    const router = useRouter()
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }
    const handleLogout = () => {
        router.push('/')
    }
    return (
        <nav className=" text-main bg-white sticky top-0 z-50 w-full border-b mb-3">
            <div className="mx-3 max-w-screen-lg xl:max-w-screen-xl lg:mx-auto py-4 flex justify-between space-x-3">
                <h1 className="text-lg font-bold">VibeMatch</h1>

                {/* Search */}
                <div className="border flex bg-neutral-100 rounded-md py-1 px-2 items-center text-secondary flex-1 max-w-80">
                    <Search size={15} />
                    <input
                        value={input}
                        onChange={handleOnChange}
                        className="bg-inherit focus:outline-none ml-2 text-main text-sm w-full"
                        placeholder="Search for other users"
                    />
                </div>

                {/* Logout, Delete */}
                <div className="relative">
                    <button onClick={() => setOpenMenu(!openMenu)}>
                        <MoreVertical />
                    </button>

                    <div
                        className={`${
                            openMenu ? '' : 'opacity-0 -z-10'
                        } absolute top-[110%] flex flex-col  right-0  rounded-md overflow-hidden transition duration-200`}
                    >
                        <button
                            onClick={handleLogout}
                            className="hover:bg-neutral-200 bg-neutral-100  text-sm flex space-x-1 items-center px-3 py-2 "
                        >
                            Logout
                        </button>
                        <button className="hover:bg-red-500 hover:text-white border-t text-red-500 bg-neutral-100  text-sm flex space-x-1 items-center px-3 py-2 w-max">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
