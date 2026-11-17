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

// ─── Sections below the hero (layouts from the Parmar main-site) ───────────
const stock = (name: string, size = 800) => `/assets/images/stock/${name}-${size}.webp`;

export const why = {
  eyebrow: "Why Ultraa",
  segments: [
    { text: "Albums made by photographers, for photographers.", color: "text-black font-medium" },
    {
      text: "Ultraa began in 2012, when its founders, photographers themselves, could not find albums that showed their work in true colour at a fair price.",
      color: "text-black/45",
    },
  ],
  image: { src: stock("album-browse", 1600), srcSet: `${stock("album-browse")} 800w, ${stock("album-browse", 1600)} 1600w`, alt: "Hands turning the pages of an album of black and white wedding photographs." },
};

export const identity = {
  heading: [
    { text: "Who We Are", color: "text-white", base: "text-neutral-800" },
    { text: "& What We Make", color: "text-neutral-400", base: "text-neutral-800" },
  ],
  images: [
    { src: stock("photo-book"), alt: "Hands holding an open photo book with a bride and groom on the page." },
    { src: stock("bride"), alt: "A bride in a red outfit with gold jewellery." },
    { src: stock("editing"), alt: "Photo editing software open on a laptop." },
    { src: stock("photographer"), alt: "A photographer crouching to photograph a couple in a narrow street." },
  ],
  body: [
    { text: "Ultraa designs, prints and binds wedding albums in Mumbai", color: "text-white font-medium", base: "text-neutral-800" },
    { text: "for couples and photographers across India and abroad, with album design, photo editing and wedding photography under one roof.", color: "text-neutral-400", base: "text-neutral-800" },
  ],
};

// Numbers from ultraaalbums.com/landing-2023 (confirm they are current).
export const about = {
  eyebrow: "Wedding albums for couples and photographers, made in Mumbai since 2012.",
  stats: [
    { value: "10,000+", label: "Albums completed" },
    { value: "1,500+", label: "Happy customers" },
    { value: "30+", label: "Team members" },
    { value: "100%", label: "Service guarantee" },
  ],
  heading: "ABOUT",
  body: [
    { text: "Ultraa Album was founded in 2012 to make high-end albums suitable for every budget.", color: "text-black" },
    { text: "Designers work in Photoshop and Lightroom, every album is quality checked, and each one is packed to reach international clients intact.", color: "text-black/45" },
  ],
  action: { label: "More about us", href: "/about-us" },
  image: { src: stock("album-open"), alt: "" },
};

export const process = {
  heading: ["Your album,", "step by step."],
  action: { label: "Start your album", href: "/contact-us" },
  subheading: "Steps:",
  steps: [
    { number: "01", title: "Send your photos.", description: "Transfer the selected photographs online." },
    { number: "02", title: "Approve the design.", description: "Review the album layout before it goes to print." },
    { number: "03", title: "We print and bind.", description: "Printing starts once you approve the design." },
    { number: "04", title: "It ships to you.", description: "The finished album is packed and shipped to its destination." },
  ],
};

export const marquee = ["Flush mount", "Layflat", "Luxury albums", "Photo books", "Slip-in albums", "Leather", "Linen", "Canvas", "Acrylic", "Metal", "Wooden", "Embossed"];

export const services = {
  items: [
    { number: 1, label: "Albums", description: "Flush mount, layflat and luxury albums, photo books, boxes and slip-ins.", href: "/our-products", image: stock("photo-book") },
    { number: 2, label: "Design", description: "Album layouts in classic, clean, contemporary and Indian styles.", href: "/album-designing", image: stock("design-layout") },
    { number: 3, label: "Editing", description: "Retouching and photo editing by an in-house team.", href: "/image-editing", image: stock("editing") },
    { number: 4, label: "Photography", description: "Wedding photography and videography.", href: "/photography", image: stock("camera") },
  ],
  closing: { lead: "We take your album from selected photographs to a finished book,", muted: "with design, editing and printing in one place." },
  action: { label: "Talk to us", href: "/contact-us" },
};

export const materials = {
  heading: ["OUR COVER,", "MATERIALS"],
  body: "Every album takes one of eight cover pads, from soft leather and linen to acrylic, metal and wood.",
  items: ["Leather", "Linen", "Canvas", "Acrylic crystal", "Photo cover", "Metal", "Wooden", "Embossed"],
  action: { label: "See cover options", href: "/luxury-albums" },
};

export const expertise = {
  heading: ["Our", "Services"],
  lead: "Design, editing and photography",
  muted: "from the same team that prints your album.",
  cards: [
    { title: "Album Design", description: "Classic, clean, contemporary and Indian design styles.", image: stock("album-open"), action: "See designs", href: "/album-designs" },
    { title: "Image Editing", description: "Retouching, clipping paths and old photo restoration.", image: stock("couple-bw"), action: "See editing", href: "/photo-editing-and-album-design" },
    { title: "Wedding Photography", description: "Photography and videography for weddings.", image: stock("photographer"), action: "See photography", href: "/photography" },
  ],
};

export const cta = {
  headline: "Ready to start your album?",
  action: { label: "Start your album", href: "/contact-us" },
  image: { src: stock("couple-path", 1600), srcSet: `${stock("couple-path")} 800w, ${stock("couple-path", 1600)} 1600w` },
};
