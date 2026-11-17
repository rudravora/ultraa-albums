// Home page content. Facts are from ultraaalbums.com; photos are stand-ins.

const image = (name: string, size = 800) => `/assets/images/${name}-${size}.webp`;
const srcset = (name: string) => [640, 960, 1400].map((w) => `${image(name, w)} ${w}w`).join(", ");

export type Audience = { id: string; label: string; title: string; accent: string; sentence: string; spread: number };

type PagePhoto = { src: string; focus?: [number, number]; zoom?: number };
export type Spread = {
  alt: string;
  left?: { layout: "full" | "framed"; src: string; focus?: [number, number]; zoom?: number } | { layout: "pair"; items: PagePhoto[] };
  right?: { layout: "full" | "framed"; src: string; focus?: [number, number]; zoom?: number };
  pano?: PagePhoto;
};

export const hero = {
  audienceControl: "Choose an audience",
  audiences: [
    {
      id: "couples",
      label: "For couples",
      title: "Your wedding story,",
      accent: "beautifully printed to revisit for years",
      sentence: "Keep wedding photographs together in a printed album.",
      spread: 0,
    },
    {
      id: "photographers",
      label: "For photographers",
      title: "Wedding albums",
      accent: "for photographers",
      sentence: "Send client photographs online and review the design before printing.",
      spread: 2,
    },
  ] as Audience[],
  // The left-hand text moves through these as the pinned hero scrolls; step 0 is the
  // headline above (it stays the page's h1).
  steps: [
    {
      title: "Covers made in Mumbai,",
      accent: "in the finish you choose.",
      body: "Leather, linen, canvas, acrylic, photo, metal, wooden and embossed cover pads.",
      action: { label: "See cover options", href: "/luxury-albums" },
    },
    {
      title: "Panoramic spreads,",
      accent: "printed across both pages.",
      body: "Flush mount and layflat albums open flat, so a wide photograph runs across the spread.",
      action: { label: "See album formats", href: "/our-products" },
    },
  ],
  pager: { previous: "Previous page", next: "Next page", spread: "Spread", hint: "Click or drag a page to turn it" },
  // Spreads painted onto the 3D pages, cropped per layout (focus = [x, y], 0 to 1).
  spreads: [
    {
      alt: "An open album: a couple under a flowering tree on the left page, a bride by a window on the right.",
      left: { layout: "full", src: image("editing-01-after", 1200), focus: [0.45, 0.55] },
      right: { layout: "full", src: image("editing-02-after", 1200), focus: [0.6, 0.5] },
    },
    {
      alt: "An open album with one panoramic photograph of a couple on a garden path across both pages.",
      pano: { src: image("editing-03-after", 1200), focus: [0.5, 0.62], zoom: 1 },
    },
    {
      alt: "An open album with a designed layout: a bouquet and blossom details on the left page and one framed portrait on the right.",
      left: {
        layout: "pair",
        items: [
          { src: image("editing-02-after", 1200), focus: [0.7, 0.47], zoom: 2.6 },
          { src: image("editing-01-after", 1200), focus: [0.5, 0.12], zoom: 1.6 },
        ],
      },
      right: { layout: "framed", src: image("editing-03-after", 1200), focus: [0.5, 0.6], zoom: 1.25 },
    },
  ] as Spread[],
  // Stills rendered from the same scene: closed (before WebGL starts) and open (no WebGL).
  closed: { src: image("album-closed", 1400), srcset: srcset("album-closed"), alt: "A closed black leather album with a stitched border on its cover." },
  open: { src: image("album-open", 1400), srcset: srcset("album-open"), alt: "An open black leather album: a couple under a flowering tree on the left page, a bride by a window on the right." },
};
