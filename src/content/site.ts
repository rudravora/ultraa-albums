// Site-wide content: brand, contacts, navigation and the page list.
// Facts come from ultraaalbums.com (contact-us, about-us); nothing here is invented.

export const site = {
  name: "Ultraa Albums",
  legalName: "Ultraa Album",
  // ponytail: preview domain; switch to https://ultraaalbums.com at launch.
  url: "https://ultraa-albums-black.vercel.app",
  fact: "Made in Mumbai. Ships worldwide.",
  tagline: "Wedding albums, made in Mumbai since 2012.",
  blurb: "Flush mount, layflat and luxury albums for couples and photographers across India and abroad.",
  logo: "/assets/ultraa-logo.png",
  address: "Shree Krishna Ind. Estate, Near Toll Naka, 211, Western Express Hwy, Dahisar East, Mumbai 400068, India",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shree+Krishna+Industrial+Estate+Dahisar+East+Mumbai+400068",
  phones: [
    { label: "+91 93222 54315", href: "tel:+919322254315" },
    { label: "+91 93200 54315", href: "tel:+919320054315" },
  ],
  emails: ["ultraaalbums@gmail.com", "ultraadesignes@gmail.com"],
  messenger: "https://m.me/UltraaAlbums",
  // ponytail: assumes the main number is on WhatsApp; confirm with Ultraa.
  whatsapp: "https://wa.me/919322254315?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20albums.",
  payOnline: "https://www.paypal.com/in/signin",
  catalog: "https://ultraaalbums.com/wp-content/uploads/2021/11/Ultraa-product-Catelogue.pdf",
};

export type NavLink = { label: string; href: string; items?: { label: string; href: string }[] };

export const products = [
  { label: "Flush Mount Albums", href: "/flush-mount-album" },
  { label: "Layflat Albums", href: "/layflat" },
  { label: "Luxury Albums", href: "/luxury-albums" },
  { label: "Photo Books", href: "/photo-book" },
  { label: "Boxes and Bags", href: "/box-and-bags" },
  { label: "Slip-in Albums", href: "/slip-in-albums" },
];

export const services = [
  { label: "Album Designing", href: "/album-designing" },
  { label: "Album Designs", href: "/album-designs" },
  { label: "Image Editing", href: "/image-editing" },
  { label: "Photo Editing and Album Design", href: "/photo-editing-and-album-design" },
  { label: "Wedding Photography", href: "/photography" },
];

export const navigation: { links: NavLink[]; cta: { label: string; href: string } } = {
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about-us" },
    { label: "Products", href: "/our-products", items: [{ label: "All products", href: "/our-products" }, ...products] },
    { label: "Services", href: "/album-designing", items: services },
    { label: "Blog", href: "/blogs" },
    { label: "Contact", href: "/contact-us" },
  ],
  cta: { label: "Start your album", href: "/contact-us" },
};

export const footer = {
  links: [
    { label: "About", href: "/about-us" },
    { label: "Our Products", href: "/our-products" },
    ...products,
    { label: "Album Designing", href: "/album-designing" },
    { label: "Image Editing", href: "/image-editing" },
    { label: "Wedding Photography", href: "/photography" },
    { label: "Wedding Photo Albums", href: "/wedding-photo-albums" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact", href: "/contact-us" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms and Conditions", href: "/terms-and-condition" },
  ],
};

export type PageKind = "home" | "product" | "service" | "info" | "legal";

/** Every public page. Paths match the live ultraaalbums.com URLs. */
export const pages: { path: string; name: string; title: string; description: string; kind: PageKind }[] = [
  { path: "/", name: "Home", kind: "home", title: "Ultraa Albums | Wedding albums made in Mumbai", description: "Flush mount, layflat and luxury wedding albums, designed and printed in Mumbai and shipped worldwide." },
  { path: "/about-us", name: "About Us", kind: "info", title: "About Us | Ultraa Albums", description: "Ultraa Album was founded in 2012 by photographers to make high-end wedding albums affordable." },
  { path: "/our-products", name: "Our Products", kind: "info", title: "Our Products | Ultraa Albums", description: "Flush mount, layflat and luxury albums, photo books, boxes and bags, and slip-in albums." },
  { path: "/flush-mount-album", name: "Flush Mount Albums", kind: "product", title: "Flush Mount Albums | Ultraa Albums", description: "Flush mount wedding albums with panoramic spreads and thick pages." },
  { path: "/layflat", name: "Layflat Albums", kind: "product", title: "Layflat Albums | Ultraa Albums", description: "Premium layflat albums with panoramic pages that open flat." },
  { path: "/luxury-albums", name: "Luxury Albums", kind: "product", title: "Luxury Albums | Ultraa Albums", description: "Luxury wedding albums with a choice of cover pads and finishes." },
  { path: "/photo-book", name: "Photo Books", kind: "product", title: "Photo Books | Ultraa Albums", description: "Printed photo books with a choice of covers." },
  { path: "/box-and-bags", name: "Boxes and Bags", kind: "product", title: "Boxes and Bags | Ultraa Albums", description: "Album boxes and bags to store and present wedding albums." },
  { path: "/slip-in-albums", name: "Slip-in Albums", kind: "product", title: "Slip-in Albums | Ultraa Albums", description: "Slip-in albums for loose wedding prints." },
  { path: "/album-designing", name: "Album Designing", kind: "service", title: "Album Designing | Ultraa Albums", description: "Professional wedding album design in classic, clean, contemporary and Indian styles." },
  { path: "/album-designs", name: "Album Designs", kind: "service", title: "Wedding Album Designs | Ultraa Albums", description: "Examples of Indian and Western wedding album designs." },
  { path: "/image-editing", name: "Image Editing", kind: "service", title: "Image Editing Services | Ultraa Albums", description: "Wedding photo retouching and editing by an in-house team." },
  { path: "/photo-editing-and-album-design", name: "Photo Editing and Album Design", kind: "service", title: "Photo Editing and Album Design | Ultraa Albums", description: "Clipping paths, photo restoration and album design services." },
  { path: "/photography", name: "Wedding Photography", kind: "service", title: "Wedding Photography | Ultraa Albums", description: "Wedding photography and videography services." },
  { path: "/wedding-photo-albums", name: "Wedding Photo Albums", kind: "info", title: "Wedding Photo Albums and Books | Ultraa Albums", description: "A guide to flush mount, layflat and luxury wedding albums and photo books." },
  { path: "/contact-us", name: "Contact", kind: "info", title: "Contact Us | Ultraa Albums", description: "Call, email or message Ultraa Albums in Dahisar East, Mumbai." },
  { path: "/faq", name: "FAQ", kind: "info", title: "FAQ | Ultraa Albums", description: "Answers to common questions about Ultraa albums, design and shipping." },
  { path: "/blogs", name: "Blog", kind: "info", title: "Blog | Ultraa Albums", description: "Articles from Ultraa Albums." },
  { path: "/privacy-policy", name: "Privacy Policy", kind: "legal", title: "Privacy Policy | Ultraa Albums", description: "How Ultraa Albums handles your information." },
  { path: "/terms-and-condition", name: "Terms and Conditions", kind: "legal", title: "Terms and Conditions | Ultraa Albums", description: "Terms and conditions for Ultraa Albums orders." },
];

export const pageFor = (path: string) => pages.find((p) => p.path === path);
