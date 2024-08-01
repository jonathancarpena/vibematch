import { useRef, useCallback, useState } from 'react'
import { TimeRangePlaceholders } from '.'
import { SpotifyArtist } from '@/lib/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import Image from 'next/image'
import { Disc, Grid, ChevronLeft, ChevronRight } from 'react-feather'

interface Props {
    artists: SpotifyArtist[] | []
    term: any
}

function Artists({ artists, term }: Props) {
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
        <section className="mb-12 relative">
            {/* Heading */}
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h2 className="font-bold text-2xl md:text-3xl">
                        Top Artists
                    </h2>
                    <p className="text-secondary font-medium text-sm">
                        Your top artists{' '}
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
                    {artists.map((item, index) => (
                        <SwiperSlide
                            key={`${term}-${item.id}`}
                            className="max-w-44"
                        >
                            <div className="w-full">
                                {/* Art */}
                                <div className="mb-2 w-44 h-44 aspect-square overflow-hidden rounded-full relative bg-neutral-100 text-secondary flex justify-center items-center">
                                    {item.image ? (
                                        <Image
                                            src={item.image.url}
                                            alt={`${item.name}`}
                                            fill
                                            sizes={'176px'}
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                            }}
                                        />
                                    ) : (
                                        <Disc size={70} />
                                    )}
                                </div>

                                {/* Name */}
                                <p className="font-bold text-center">
                                    {index + 1}. {item.name}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <ol className="flex flex-wrap justify-evenly w-full ">
                    {artists.map((item, index) => (
                        <li
                            key={`grid-${term}-${item.id}`}
                            className="w-44 mb-4"
                        >
                            {/* Art */}
                            <div className="mb-2 w-11/12 aspect-square rounded-full overflow-hidden relative bg-neutral-100 text-secondary flex justify-center items-center">
                                {item.image ? (
                                    <Image
                                        src={item.image.url}
                                        alt={`${item.name}`}
                                        fill
                                        sizes={'176px'}
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                    />
                                ) : (
                                    <Disc size={70} />
                                )}
                            </div>

                            {/* Name */}
                            <p className="font-bold text-center ">
                                {index + 1}. {item.name}
                            </p>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    )
}

export default Artists
