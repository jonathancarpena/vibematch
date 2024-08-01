import React from 'react'

interface Props {
    children?: React.ReactNode
}

function Container({ children }: Props) {
    return (
        <main className="mx-3 max-w-screen-lg xl:max-w-screen-xl lg:mx-auto text-main">
            {children}
        </main>
    )
}

export default Container
