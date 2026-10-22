import Image from "next/image";

const tiles = [
  { src: "/images/gallery-1.jpg", className: "col-span-2 row-span-2" },
  { src: "/images/gallery-2.jpg", className: "" },
  { src: "/images/gallery-3.jpg", className: "" },
  { src: "/images/gallery-4.jpg", className: "col-span-2" },
  { src: "/images/gallery-5.jpg", className: "md:col-span-2" },
  { src: "/images/gallery-6.jpg", className: "md:col-span-2" },
];

const Gallery = () => {
  return (
    <section className="page-container py-14">
      <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.src}
            className={`group relative overflow-hidden rounded-2xl ${tile.className}`}
          >
            <Image
              alt=""
              src={tile.src}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="img scale-animation"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
