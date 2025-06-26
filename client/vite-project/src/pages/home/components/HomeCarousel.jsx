import React, { useState } from "react";
import styles from "./HomeCarousel.module.css";
import carousel1 from "../../../assets/carousel1.jpg";
import carousel2 from "../../../assets/carousel2.jpg";
import carousel3 from "../../../assets/carousel3.jpg";

const slides = [
  {
    image: carousel1,
    title: "Help Plant 10,000 Trees",
    desc: "Join the movement for a greener future. Support our reforestation campaign!",
    cta: "View Campaign",
    link: "/campaign/plant-trees",
  },
  {
    image: carousel2,
    title: "Jane’s Art School – Success!",
    desc: "Thanks to our backers, Jane opened her dream school. Read her story!",
    cta: "Read Story",
    link: "/stories/jane-art-school",
  },
  {
    image: carousel3,
    title: "Ready to Make an Impact?",
    desc: "Start your own campaign on GrowFund and bring your idea to life.",
    cta: "Start a Campaign",
    link: "/create-campaign",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);
  const prev = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const next = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    <div className={styles.carouselContainer}>
      {slides.map((slide, idx) => (
        <div
          key={slide.title}
          className={`${styles.slide} ${
            idx === current ? styles.slideActive : ""
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={styles.slideImg}
          />
          <div className={styles.slideContent}>
            <h2 className={styles.slideTitle}>{slide.title}</h2>
            <p className={styles.slideDesc}>{slide.desc}</p>
            <a href={slide.link} className={styles.ctaBtn}>
              {slide.cta}
            </a>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className={`${styles.arrowBtn} ${styles.arrowLeft}`}
        aria-label="Previous Slide"
      >
        &#8592;
      </button>
      <button
        onClick={next}
        className={`${styles.arrowBtn} ${styles.arrowRight}`}
        aria-label="Next Slide"
      >
        &#8594;
      </button>

      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${
              idx === current ? styles.dotActive : ""
            }`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
