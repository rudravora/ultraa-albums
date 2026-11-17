// Service pages and the wedding album guide. Copy is condensed from the matching
// ultraaalbums.com pages (November 2026); nothing is added. Photos are Unsplash
// stand-ins (credited in the README).
import { stock, type ProductSection } from "@/content/products";

export type Service = {
  path: string;
  name: string;
  summary: string;
  image: { src: string; srcSet: string };
  alt: string;
  sections: ProductSection[];
};

export const services: Service[] = [
  {
    path: "/album-designing",
    name: "Album Designing",
    summary:
      "Ultraa's designers lay out your album for you in one of six or seven design themes, instead of leaving you with do-it-yourself software. You see a soft-copy preview, ask for as many revisions as you need, and the design is free.",
    image: stock("design-layout"),
    alt: "Printed photos, flowers and an open album on a table, laid out for a design.",
    sections: [
      {
        question: "Why not design the album yourself?",
        answer: [
          "Album software takes days to learn and usually comes without themes or templates, so pages end up as photos placed flat on a page. For photographers, designing every album themselves takes time that could go into shooting.",
        ],
      },
      {
        question: "How does the design process work?",
        answer: ["A professional designer works to your taste and shows you a soft-copy preview for corrections and approval. Revisions are unlimited until you are happy."],
      },
      {
        question: "Which design styles are there?",
        answer: ["Some of the styles the team designs in:"],
        bullets: ["Classic and Indian classic", "Clean and modern", "Contemporary and elegant", "Indian and Indian fusion", "Western", "Baby albums"],
        link: { label: "See album designs", href: "/album-designs" },
      },
    ],
  },
  {
    path: "/album-designs",
    name: "Album Designs",
    summary:
      "Wedding albums designed from scratch in the style you have in mind, for Indian and Western weddings, and for birthdays, graduations, baby showers, family and corporate events. If you are not sure what you want, the designers help you choose a theme, layout and materials for your style and budget.",
    image: stock("album-open"),
    alt: "An open wedding album with a photo of a couple outside a church on the right page.",
    sections: [
      {
        question: "Do you design Indian and Western wedding albums?",
        answer: ["Yes. There are experienced designers for both, and the team is open to any theme or design you suggest."],
      },
      {
        question: "What if I do not have a design in mind?",
        answer: ["The designers suggest a theme, layouts, design and materials that suit your style and budget, and keep the pages free of clutter and colour problems."],
      },
      {
        question: "Will I see the design before it is printed?",
        answer: ["Yes. The in-house designers share every change with you at each stage, so you approve the album before it goes to print."],
        link: { label: "How album designing works", href: "/album-designing" },
      },
    ],
  },
  {
    path: "/image-editing",
    name: "Image Editing",
    summary:
      "Retouching and restoration by editors with more than ten years in Lightroom and Photoshop. Images can be repaired, retouched, enhanced or resized without harming the original, and you can send one or two raw files for a free sample edit.",
    image: stock("editing"),
    alt: "Photo editing software open on a laptop.",
    sections: [
      {
        question: "What does image editing include?",
        answer: ["The retouching service covers:"],
        bullets: [
          "Advanced cut-outs and clipping paths",
          "Brightness and contrast balancing",
          "Repair of scratches, creases, dust and spots",
          "Light and colour correction",
          "Beauty and glamour retouching",
          "Object removal",
          "E-commerce editing",
          "Video editing",
        ],
      },
      {
        question: "Can I try it before I order?",
        answer: ["Yes. Send one or two raw files with your instructions, as an attachment or by WeTransfer, and the first edit is free."],
        link: { label: "Photo editing and album design", href: "/photo-editing-and-album-design" },
      },
    ],
  },
  {
    path: "/photo-editing-and-album-design",
    name: "Photo Editing and Album Design",
    summary:
      "Photo editing and album design in one place: beauty retouching, colour correction, background changes, clipping paths and old photo restoration, followed by the album layout, printing and binding, with each stage shared for your approval.",
    image: stock("couple-bw"),
    alt: "A black and white photo of a bride and groom under a veil.",
    sections: [
      {
        question: "Which editing services are there?",
        answer: ["Alongside retouching and colour correction:"],
        bullets: [
          "Clipping paths, to cut people or objects out of an image",
          "Old photo restoration, for faded family photos",
          "Background removal, for a transparent background",
          "Retouching: colour and tone, blemishes and dark circles, brightness, shadows, contrast and saturation",
        ],
      },
      {
        question: "How does the process work?",
        answer: [
          "Once the photographs arrive, the team calls you to agree the edits, layout, paper, cover material, images per page, finish, design and font.",
          "Edited photos are shared by email or WhatsApp for changes. After you approve the album design and layout, the photos are printed on the paper you chose and bound into the album.",
        ],
        link: { label: "See image editing", href: "/image-editing" },
      },
    ],
  },
  {
    path: "/photography",
    name: "Wedding Photography",
    summary:
      "Candid and traditional wedding photography and video from a team of more than 15 photographers and videographers who travel across the country, plus save-the-date, engagement, and pre- and post-wedding shoots.",
    image: stock("photographer"),
    alt: "A photographer crouching to photograph a couple in a narrow street.",
    sections: [
      {
        question: "What do you photograph?",
        answer: [
          "Weddings, with formal portraits of the wedding party, family and friends and the signature moments of the day. Candid photography is the team's strength, along with traditional coverage.",
        ],
        bullets: ["Save-the-date and engagement shoots", "Pre- and post-wedding shoots", "Proposals, bar and bat mitzvahs and special events", "Outdoor family portraits"],
      },
      {
        question: "Do you film video?",
        answer: ["Yes. Wedding video is filmed in traditional and cinematic styles, from several angles."],
      },
      {
        question: "How do I get a quote?",
        answer: [
          "Packages are made for every need and budget, and sample photos and video highlights are shown at a meeting. Ultraa replies to enquiries by email or phone within 24 hours, or a day later during a wedding or a holiday.",
        ],
      },
    ],
  },
];

export const weddingGuide = {
  path: "/wedding-photo-albums",
  name: "Wedding Photo Albums",
  summary:
    "A guide to Ultraa's wedding albums: hand-bound flush mount albums, lighter layflat albums, luxury albums in a wooden casket, and wedding photo books, each with a choice of covers and a design made for your wedding.",
  image: stock("album-browse"),
  alt: "Hands turning the pages of an album of black and white wedding photographs.",
  sections: [
    {
      question: "Flush mount albums",
      answer: ["Hand-bound with silver-halide prints on Fuji Crystal Archive paper, mounted on thick archival board for a seamless panoramic spread that lasts."],
      link: { label: "See flush mount albums", href: "/flush-mount-album" },
    },
    {
      question: "Layflat albums",
      answer: ["Pages lie flat, so panoramas print across the spread without bending or creasing. They cost less than flush mount albums and come with covers from canvas to acrylic crystal."],
      link: { label: "See layflat albums", href: "/layflat" },
    },
    {
      question: "Luxury albums",
      answer: ["Handcrafted leather in a wooden casket, with acrylic, leather, hardcover, linen, wood or canvas covers, personalised with your names or a message."],
      link: { label: "See luxury albums", href: "/luxury-albums" },
    },
    {
      question: "Wedding photo books",
      answer: ["Tear-resistant pages in a choice of finishes, from compact books to coffee-table hardcovers, with acrylic crystal, canvas, linen or leather covers."],
      link: { label: "See photo books", href: "/photo-book" },
    },
  ] as ProductSection[],
};

export const serviceFor = (path: string) => services.find((s) => s.path === path);
