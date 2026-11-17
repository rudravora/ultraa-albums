// Product pages: /our-products and the six product pages. Copy is condensed from
// the matching ultraaalbums.com pages (November 2026); nothing is added. Section
// headings are questions, as on the Parmar service pages. Photos are Unsplash
// stand-ins (credited in the README).

export const stock = (name: string) => ({ src: `/assets/images/stock/${name}-1200.webp`, srcSet: `/assets/images/stock/${name}-800.webp 800w, /assets/images/stock/${name}-1200.webp 1200w` });

export type ProductSection = { question: string; answer: string[]; bullets?: string[]; link?: { label: string; href: string } };
export type Product = {
  path: string;
  name: string;
  /** One line for the product cards. */
  card: string;
  /** The direct answer under the h1. */
  summary: string;
  image: { src: string; srcSet: string };
  alt: string;
  sections: ProductSection[];
  /** Whether the shared cover-pad options apply. */
  covers: boolean;
};

export const productsHub = {
  h1: "Wedding albums and photo books",
  summary:
    "Six formats, all made in Mumbai: hand-bound flush mount and layflat albums, luxury albums with a wooden casket, photo books, slip-in albums for loose prints, and boxes and bags to keep them in.",
  cta: { title: "Not sure which album fits?", body: "Tell us about the occasion and the photos you have, and we will suggest a format." },
};

export const coverPads = {
  question: "Which covers can I choose?",
  intro: "Covers are handmade. The spine and back can match the front, and text can be embossed or foil stamped.",
  items: [
    { name: "Acrylic crystal", text: "The cover photo is mounted under clear acrylic with tapered, slightly rounded, diamond-polished edges. The back and spine are leatherette, usually black." },
    { name: "Canvas", text: "Bright white poly-cotton canvas with a protective varnish against moisture, abrasion and UV." },
    { name: "Linen", text: "A fine, hard-wearing fabric. Names can be printed directly on it." },
    { name: "Leather", text: "Full-wrap leather in any colour, with or without a cameo, finished by laser engraving, gold or silver foil, or UV printing." },
    { name: "Photo cover", text: "Your photo on a hard cover with matt lamination; names, dates and branding can be added. Full wrap is available." },
    { name: "Metal", text: "A brushed silver plate printed with the couple's photo or names." },
    { name: "Wooden", text: "A wooden case with laser-engraved or embossed text." },
    { name: "Embossed", text: "Raised text and titles in any colour, or gold, rose gold or silver foil, on leather, canvas, metal, wood or linen." },
  ],
};

export const products: Product[] = [
  {
    path: "/flush-mount-album",
    name: "Flush Mount Albums",
    card: "Hand-bound albums with thick pages and panoramic spreads on silver-halide photo paper.",
    summary:
      "Hand-bound flush mount albums with thick pages and panoramic spreads, printed on Fuji Crystal Archive silver-halide paper. Choose leather, fabric, acrylic, metal, canvas or photo covers, with a 100% quality guarantee.",
    image: stock("product-flush-mount"),
    alt: "The thick pages of a flush mount album fanned open.",
    covers: true,
    sections: [
      {
        question: "How is a flush mount album made?",
        answer: [
          "Every album is bound by hand. Pages are held with traditional bookbinding, not glue alone, so they fit more precisely and the album lasts longer than a machine-made one.",
          "Silver-halide prints are mounted on a thick white or black substrate, so each spread opens into a crisp, straight panorama.",
        ],
      },
      {
        question: "How thick are the pages?",
        answer: ["The archival board is 0.5 to 1 mm thick and each print is 0.5 mm, so a standard page is 1 mm. Extra-thick pages are 1.5 mm, made to handle everyday viewing."],
      },
      {
        question: "Which paper is used?",
        answer: ["Fuji Crystal Archive silver-halide photo paper with a lustre finish, for stable images, clean whites and accurate colour."],
      },
      {
        question: "What else can I choose?",
        answer: ["Designs are made for each album, not taken from templates."],
        bullets: [
          "Page lamination: UV, thermal matt, high gloss, velvet or silk",
          "Covers: photo, acrylic, metal, canvas, linen or leather",
          "Cut-out cover windows, and a leather binding with a magazine-style cover",
        ],
      },
    ],
  },
  {
    path: "/layflat",
    name: "Layflat Albums",
    card: "Lighter albums whose two-page spreads open flat, with no gutter through a panorama.",
    summary:
      "Layflat albums open completely flat, so a panoramic photograph runs across both pages with no bulge or gutter in the middle. They are built like our flush mount albums on a thinner, lighter substrate, which allows more pages at a lower cost.",
    image: stock("product-layflat"),
    alt: "An open photo book lying flat, with a couple's photographs across both pages.",
    covers: true,
    sections: [
      {
        question: "How is a layflat album different from a flush mount album?",
        answer: ["It is hand bound the same way, on a thinner and lighter substrate. That makes the album lighter, allows more pages and keeps the cost down."],
      },
      {
        question: "Why choose layflat for panoramic photos?",
        answer: ["Each two-page spread opens flat, with no bulging and no gutter, so an image printed across both pages is not broken by the fold. Pages are printed in rich, high-density colour on professional lab printers."],
      },
      {
        question: "Who are layflat books for?",
        answer: ["Weddings, travel, birthdays and family celebrations. They also make portfolios for photographers, interior and fashion designers, and make-up artists."],
      },
    ],
  },
  {
    path: "/luxury-albums",
    name: "Luxury Albums",
    card: "Handcrafted leather albums in a wooden casket, personalised with a name.",
    summary:
      "Luxury albums pair handcrafted leather with a wooden casket, and both can be personalised with a name. Photos are printed on flat, flush-mounted pages, and the cover, colour, design and layout are made to your brief.",
    image: stock("product-luxury"),
    alt: "A brown leather album beside a light wooden album box.",
    covers: true,
    sections: [
      {
        question: "What goes into a luxury album?",
        answer: ["Handcrafted leather, a wooden casket, and flush-mounted pages that lie flat. The casket and album can carry a name in a formal script."],
      },
      {
        question: "What can be customised?",
        answer: ["Everything from the cover to the layout."],
        bullets: ["Cover: acrylic, leather, hardcover, linen, wood or canvas", "Colour", "Design and page layout"],
      },
      {
        question: "Which occasions are they made for?",
        answer: ["Weddings, a child's first birthday, a parents' golden anniversary, or any occasion you want kept somewhere safe."],
      },
    ],
  },
  {
    path: "/photo-book",
    name: "Photo Books",
    card: "Hardcover books from 5 × 5 to 12 × 18 in, with pages that open fully flat.",
    summary:
      "Hardcover photo books for weddings, family milestones and photography portfolios. Pages are non-tearable and open fully flat, in a glossy, matt or feather-touch finish, in sizes from 5 × 5 in to 12 × 18 in.",
    image: stock("photo-book"),
    alt: "Hands holding an open photo book with a bride and groom on the page.",
    covers: true,
    sections: [
      {
        question: "Which sizes are available?",
        answer: ["Photo books come in several sizes, and prints can be ordered separately."],
        bullets: ["Mini photo books: 5 × 5 in", "Photo books: 6 × 8 in and 9 × 12 in", "Wedding photo books: 12 × 18 in", "Loose prints: 4 × 6, 5 × 7 and 6 × 8 in"],
      },
      {
        question: "What finishes can I choose?",
        answer: ["Non-tearable paper in a glossy, matt or feather-touch finish. Wedding photo books open fully flat, with no curve at the centre. Covers are printed with your design or photo and can be laminated."],
      },
      {
        question: "Who are photo books for?",
        answer: ["Everyday photos from phones and social media, wedding photo books, and photographers who want to show their work."],
      },
    ],
  },
  {
    path: "/box-and-bags",
    name: "Boxes and Bags",
    card: "Leatherette boxes, display boxes and carry cases to keep an album safe.",
    summary:
      "Album boxes are a hard wooden frame wrapped in leatherette, with a photo, acrylic strip, cameo window or leather wrap on the lid. Otherwise albums come in a standard soft leather bag. Boxes and cases are ordered with an album, not on their own.",
    image: stock("product-box"),
    alt: "A black album box with names in gold script on the lid.",
    covers: false,
    sections: [
      {
        question: "What can the box lid have?",
        answer: ["Any of these, or a combination:"],
        bullets: ["A full photo wrap", "An acrylic strip", "A photo in a window (cameo)", "A full leather wrap with names or a title, printed or embossed"],
      },
      {
        question: "Can I carry the album in its box?",
        answer: ["Yes. A heavy album is easier to carry with a handle, so boxes can have one like a suitcase or a handbag."],
      },
      {
        question: "Which display boxes and carry cases are there?",
        answer: [
          "Display boxes are an optional extra for albums 10 × 10 in and larger, in Pearl or Carbon buckram. Carry cases are available for albums 12 × 12 in and larger, in durable black fabric with a carry handle.",
          "Choose your packaging when you order. Unless you upgrade, albums come in the standard soft leather bag.",
        ],
      },
    ],
  },
  {
    path: "/slip-in-albums",
    name: "Slip-in Albums",
    card: "Affordable albums with photo-safe pockets for up to 300 loose prints.",
    summary:
      "Affordable albums for loose prints: photo-safe, moisture-proof pockets hold the photos with no glue. Covers come in leather in any colour or as a full photo wrap, and photo labs can order low-cost gift albums printed with their own details.",
    image: stock("product-slip-in"),
    alt: "Hands holding an old album of black and white photographs.",
    covers: false,
    sections: [
      {
        question: "How do slip-in albums work?",
        answer: ["Slide each print into a pocket; there is no glue to use and nothing to fix. Pockets are photo-safe, dimpled polypropylene or white PVC, sealed ultrasonically to the cover."],
      },
      {
        question: "How many photos fit?",
        answer: ["Slip-in albums hold up to 300 photos. Personalised albums take 200 to 500 prints of 4 × 6 in (10 × 15 cm), two to four to a page."],
      },
      {
        question: "Do you make gift albums for photo labs?",
        answer: ["Yes. Labs can give low-cost gift albums with loose print orders, with the lab's details printed on the cover. Any quantity can be ordered, and every album is checked before dispatch."],
      },
    ],
  },
];

export const productFor = (path: string) => products.find((p) => p.path === path);
