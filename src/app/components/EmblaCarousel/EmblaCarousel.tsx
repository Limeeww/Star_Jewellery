import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla">
        <div className='full__embla'>
            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                </div>
            </div>
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                {slides.map((index) => (
                    <div className="embla__slide" key={index}>
                    <div className="embla__slide__number">{index + 1}</div>
                    </div>
                ))}
                </div>
            </div>
            <div className="embla__controls">
                <div className="embla__buttons">
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </div>
    </section>
  )
}

export default EmblaCarousel
