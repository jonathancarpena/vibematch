import { useRef, useCallback, useState } from 'react'
import { TimeRangePlaceholders } from '.'
import { SpotifyTrack } from '@/lib/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import Image from 'next/image'
import { Disc, Grid, ChevronLeft, ChevronRight } from 'react-feather'
import Link from 'next/link'

interface Props {
    tracks: SpotifyTrack[] | []
    term: any
}

function Tracks({ tracks, term }: Props) {
    const [gridView, setGridView] = useState(false)
    const [isEnd, setIsEnd] = useState(false)
    const [isBeginning, setIsBeginning] = useState(true)
    const swiperRef = useRef<any>(null)

    const handlePrev = useCallback(() => {
        swiperRef.current?.swiper.slidePrev()
        if (isEnd) {
            setIsEnd(false)
        }

        if (swiperRef.current?.swiper.isBeginning) {
            setIsBeginning(true)
        }

        if (!swiperRef.current?.swiper.isBeginning && isBeginning) {
            setIsBeginning(false)
        }
    }, [swiperRef, isEnd, isBeginning])

    const handleNext = useCallback(() => {
        swiperRef.current?.swiper.slideNext()

        if (isBeginning) {
            setIsBeginning(false)
        }

        if (swiperRef.current?.swiper.isEnd && !isEnd) {
            setIsEnd(true)
        }

        if (!swiperRef.current?.swiper.isEnd && isEnd) {
            setIsEnd(false)
        }
    }, [swiperRef, isEnd, isBeginning])

    return (
        <section className="mb-12 ">
            {/* Heading */}
            <div className="flex justify-between items-center mb-3 ">
                <div>
                    <h2 className="font-bold text-2xl md:text-3xl">
                        Top Tracks
                    </h2>
                    <p className="text-secondary font-medium text-sm">
                        Your top tracks{' '}
                        {`${
                            term === 'longTerm'
                                ? ''
                                : `from the past ${TimeRangePlaceholders[term]}`
                        }`}
                    </p>
                </div>

                <div className="flex space-x-2 items-center">
                    <button
                        onClick={() => setGridView(!gridView)}
                        className={`${
                            !gridView ? ' ' : 'bg-black text-white '
                        } bg-neutral-100 p-2 rounded-full outine-none active:scale-90 active:ring-4 active:ring-accentSecondary transition-all duration-200 `}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        disabled={isBeginning || gridView}
                        onClick={handlePrev}
                        className={`${
                            isBeginning || gridView
                                ? 'text-secondary cursor-default'
                                : ' text-main active:scale-90 active:ring-4 active:ring-accentSecondary'
                        } bg-neutral-100 p-2 rounded-full outine-none active:scale-90 active:ring-4 active:ring-accentSecondary transition-all duration-200 `}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        disabled={isEnd || gridView}
                        onClick={handleNext}
                        className={`${
                            isEnd || gridView
                                ? 'text-secondary cursor-default'
                                : 'text-main active:scale-90 active:ring-4 active:ring-accentSecondary'
                        } bg-neutral-100 p-2 rounded-full outine-none  transition-all duration-200 `}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            {!gridView ? (
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation]}
                    spaceBetween={12}
                    slidesPerView={'auto'}
                    slidesPerGroup={2}
                >
                    {tracks.map((item, index) => (
                        <SwiperSlide
                            key={`${term}-${item.id}`}
                            className="max-w-44"
                        >
                            <Link
                                href={`https://open.spotify.com/track/${item.id}`}
                                target="_blank"
                            >
                                <div className="w-full">
                                    {/* Art */}
                                    <div className="mb-2 w-44 h-44 aspect-square relative bg-neutral-100 text-secondary flex justify-center items-center">
                                        {item.image ? (
                                            <Image
                                                src={item.image.url}
                                                alt={`${item.name}`}
                                                fill
                                                sizes={'176px'}
                                            />
                                        ) : (
                                            <Disc size={70} />
                                        )}
                                    </div>

                                    {/* Title */}
                                    <p className="font-bold ">
                                        {index + 1}. {item.name}
                                    </p>
                                    {/* Artist */}
                                    <span className="text-secondary text-sm block font-medium">
                                        {item.artists[0].name}
                                    </span>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <ol className="flex flex-wrap justify-evenly md:justify-between w-full ">
                    {tracks.map((item, index) => (
                        <li
                            key={`grid-${term}-${item.id}`}
                            className="w-44 mb-2"
                        >
                            <Link
                                href={`https://open.spotify.com/track/${item.id}`}
                                target="_blank"
                            >
                                {/* Art */}
                                <div className="mb-2 w-full aspect-square relative bg-neutral-100 text-secondary flex justify-center items-center">
                                    {item.image ? (
                                        <Image
                                            src={item.image.url}
                                            alt={`${item.name}`}
                                            fill
                                            sizes={'176px'}
                                        />
                                    ) : (
                                        <Disc size={70} />
                                    )}
                                </div>

                                {/* Title */}
                                <p className="font-bold ">
                                    {index + 1}. {item.name}
                                </p>
                                {/* Artist */}
                                <span className="text-secondary text-sm block font-medium">
                                    {item.artists[0].name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    )
}

export default Tracks
