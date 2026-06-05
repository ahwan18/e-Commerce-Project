import { cn } from "../../lib/utils";

interface ImageSource {
  src: string;
  alt: string;
}

interface ShowImageListItemProps {
  text: string;
  images: [ImageSource, ImageSource];
  className?: string;
}

function RevealImageListItem({ text, images, className }: ShowImageListItemProps) {
  const container = "absolute right-8 -top-1 z-40 h-20 w-16 pointer-events-none";
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover:shadow-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:h-full w-16 h-16 overflow-hidden transition-all rounded-md";

  return (
    <div className="group relative h-fit w-fit overflow-visible py-4 sm:py-8 cursor-pointer">
      <h1 className={cn("text-5xl sm:text-7xl font-black text-white transition-all duration-500 group-hover:opacity-40", className)}>
        {text}
      </h1>
      <div className={container}>
        <div className={effect}>
          <img alt={images[1].alt} src={images[1].src} className="h-full w-full object-cover" />
        </div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12",
        )}
      >
        <div className={cn(effect, "duration-200")}>
          <img alt={images[0].alt} src={images[0].src} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

function RevealImageList() {
  const items: ShowImageListItemProps[] = [
    {
      text: "Action",
      images: [
        {
          src: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&auto=format&fit=crop&q=60",
          alt: "Action Figure 1",
        },
        {
          src: "https://images.unsplash.com/photo-1608338784860-2efa3910c592?w=200&auto=format&fit=crop&q=60",
          alt: "Action Figure 2",
        },
      ],
    },
    {
      text: "Learning",
      images: [
        {
          src: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop&q=60",
          alt: "Educational Toy 1",
        },
        {
          src: "https://images.unsplash.com/photo-1500995617113-cf789402a22c?w=200&auto=format&fit=crop&q=60",
          alt: "Educational Toy 2",
        },
      ],
    },
    {
      text: "Games",
      images: [
        {
          src: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffaed?w=200&auto=format&fit=crop&q=60",
          alt: "Board Game 1",
        },
        {
          src: "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=200&auto=format&fit=crop&q=60",
          alt: "Board Game 2",
        },
      ],
    },
  ];
  return (
    <div className="flex flex-col gap-1 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 w-fit mx-auto shadow-2xl">
      <h3 className="text-sm font-black uppercase text-indigo-200 mb-2">Popular Categories</h3>
      {items.map((item, index) => (
        <RevealImageListItem key={index} text={item.text} images={item.images} />
      ))}
    </div>
  );
}

export { RevealImageList, RevealImageListItem };
