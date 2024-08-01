import { useState } from 'react'
import { TimeRanges } from '@/lib/types'
import { ChevronDown, Check } from 'react-feather'
import { TimeRangePlaceholders } from '.'

interface Props {
    sx?: string
    value: string
    options: TimeRanges[]
    onClick: (value: TimeRanges) => void
}

function Dropdown({ value, options, onClick, sx }: Props) {
    const [open, setOpen] = useState(false)
    const handleSelect = (val: TimeRanges) => {
        if (open) {
            setOpen(false)
            onClick(val)
        }
    }

    return (
        <div className={`w-64 relative text-sm ${sx}`}>
            <button
                onClick={() => setOpen(!open)}
                className="bg-neutral-100 w-full px-3 py-2  rounded-md flex justify-between items-center"
            >
                <span className="font-semibold">
                    {TimeRangePlaceholders[value]}
                </span>
                <ChevronDown size={18} />
            </button>

            <ul
                className={`${
                    open ? '' : 'opacity-0 -z-10'
                } absolute top-[110%] w-full rounded-md overflow-hidden transition duration-300`}
            >
                {options.map((item) => (
                    <li
                        key={item}
                        onClick={() => handleSelect(item)}
                        className={`flex items-center space-x-1.5 p-2 bg-neutral-100 hover:bg-neutral-200 cursor-pointer ${
                            item === value
                                ? 'text-accent font-semibold'
                                : 'text-transparent'
                        }`}
                    >
                        <Check size={18} />
                        <span className="text-main">
                            {TimeRangePlaceholders[item]}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dropdown
