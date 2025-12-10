import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* sliding images */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-full flex-shrink-0 object-cover"
            alt={`carousel-${i}`}
          />
        ))}
      </div>

      {/* left arrow */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-slate-700 px-3 py-2 rounded-full shadow"
      >
        ❮
      </button>

      {/* right arrow */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-slate-700 px-3 py-2 rounded-full shadow"
      >
        ❯
      </button>

      {/* slide dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === i ? "bg-blue-900" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
