// About, Contact, FAQ, Blog and legal page content. Facts come from ultraaalbums.com
// (about-us, contact-us, the product and service pages, privacy-policy); each FAQ
// answer restates something published on one of those pages.
import { stock } from "@/content/products";

export const aboutPage = {
  label: "About Ultraa Albums",
  statement: ["Albums made by", "photographers."],
  intro: "Ultraa Album was founded in 2012 by photographers who wanted high-end wedding albums that showed photographs in true colour, at a price that fits every package.",
  heroImage: stock("album-browse"),
  heroAlt: "Hands turning the pages of an album of black and white wedding photographs.",
  story: {
    heading: "Our story",
    image: stock("product-luxury"),
    imageAlt: "A brown leather album beside a light wooden album box.",
    paragraphs: [
      "The team started as wedding photographers in 2010, working on assignments across the world. By 2011 they could not find albums that showed their photographs in true colour; the binding felt like a pack of playing cards, and the albums that were good cost too much for their packages.",
      "So in 2012 they started making their own. Today Ultraa makes wedding albums, parent albums and boxes for clients across India and abroad, including the United States, the United Kingdom, New Zealand, Canada and Europe, and packs every album to reach international clients intact.",
    ],
  },
  team: {
    heading: "Our team",
    intro: "Albums are handcrafted in Mumbai and designed in-house by designers who work in Lightroom and Photoshop.",
    people: [
      { name: "Rajiv Panchal", role: "Founder" },
      { name: "Mayank Panchal", role: "Co-Founder" },
      { name: "Bhairavi Panchal", role: "Head of Design" },
    ],
  },
  why: {
    heading: "Why choose Ultraa",
    items: [
      { title: "Affordable albums", text: "Founded to make high-end albums suitable for every budget." },
      { title: "Reliable quality", text: "Hand-bound albums, checked before they are dispatched." },
      { title: "Customer centric", text: "Soft-copy previews and unlimited revisions on every design." },
      { title: "Private and secure", text: "Your images are kept private and secure." },
    ],
  },
  band: {
    heading: "We invest in you",
    text: "Every wedding photographer gets 10% off studio samples, on top of competitive prices.",
  },
  cta: { heading: "Start your album", text: "Tell us about the occasion and the photos you have.", action: { label: "Contact us", href: "/contact-us" } },
};

export const contactPage = {
  h1: "Contact Ultraa Albums",
  intro: "Talk to us about an album, a design or editing work. Call, email, message us on WhatsApp or Messenger, or send the form.",
  form: {
    heading: "Send an enquiry",
    labels: { name: "Name", phone: "Phone", email: "Email", country: "Country", message: "Message" },
    submit: "Send enquiry",
    mailtoNote: "Sending opens your email app with this message addressed to ultraaalbums@gmail.com.",
    mailtoOpened: "Your email app should now show the message. It is sent only when you press send there.",
    sending: "Sending your enquiry…",
    sent: "Thank you. Your enquiry was sent to Ultraa.",
    failed: "We could not confirm that your enquiry arrived. Your text is still here: try again, or call or message us.",
    errors: { name: "Enter your name.", email: "Enter a valid email address.", message: "Enter a message." },
    emailSubject: "Album enquiry from the website",
  },
  mapEmbed: "https://www.google.com/maps?q=Shree+Krishna+Industrial+Estate+Dahisar+East+Mumbai+400068&output=embed",
};

export const faqGroups: { heading: string; faqs: { question: string; answer: string }[] }[] = [
  {
    heading: "Albums and materials",
    faqs: [
      { question: "Are Ultraa albums hand bound?", answer: "Yes. Flush mount, layflat and luxury albums are bound by hand with traditional bookbinding, not glue alone." },
      { question: "Which photo paper do you use?", answer: "Flush mount albums are printed on Fuji Crystal Archive silver-halide photo paper with a lustre finish." },
      { question: "How thick are flush mount pages?", answer: "A standard page is 1 mm thick; extra-thick pages are 1.5 mm." },
      { question: "Which covers can I choose?", answer: "Acrylic crystal, canvas, linen, leather, photo, metal, wooden and embossed covers. Text can be foil stamped in gold, rose gold or silver." },
      { question: "Can I buy an album box on its own?", answer: "No. Boxes, display boxes and carry cases are ordered with an album. Unless you upgrade, albums come in a standard soft leather bag." },
    ],
  },
  {
    heading: "Design and editing",
    faqs: [
      { question: "Do I have to design the album myself?", answer: "No. Ultraa's designers design it for you, show you a soft-copy preview, and make unlimited revisions until you are happy. Album design is free." },
      { question: "Can I try your editing before ordering?", answer: "Yes. Send one or two raw files with your instructions and the sample edit is free." },
      { question: "Do you design Indian and Western albums?", answer: "Yes. There are designers for both, and around six or seven design themes to choose from." },
    ],
  },
  {
    heading: "Orders and shipping",
    faqs: [
      { question: "Do you ship outside India?", answer: "Yes. Ultraa serves clients in India and abroad, including the United States, the United Kingdom, New Zealand, Canada and Europe, and packs albums to arrive intact." },
      { question: "How soon do you reply to an enquiry?", answer: "Within 24 hours by email or phone, or a day later during a wedding shoot or a holiday." },
      { question: "Do photographers get a discount?", answer: "Yes. Wedding photographers get 10% off studio samples." },
    ],
  },
];

export const blogCopy = {
  h1: "Blog & Resources",
  intro: "Guides for couples and photographers on choosing, designing and caring for wedding albums.",
  heading: ["Blog &", "Resources"],
  subheading: "Album formats, covers, design and care, explained by the team that has made albums in Mumbai since 2012.",
  cta: "Visit our blog",
};

// Ultraa's published privacy policy, with its unfilled "[name]" placeholders set to
// "Ultraa Albums". ponytail: needs a legal review; it is a generic template.
export const privacyPolicy = {
  h1: "Privacy Policy",
  intro: [
    "This privacy policy explains how Ultraa Albums uses and protects the data you give us when you visit and use www.ultraaalbums.com.",
    "We may change this policy at any time. To stay up to date with the latest changes, please visit this page from time to time.",
  ],
  sections: [
    { heading: "What user data we collect", text: "When you visit the website, we may collect:", list: ["Your IP address.", "Your contact information and email address.", "Other information such as interests and preferences.", "A profile of how you use our website."] },
    {
      heading: "Why we collect your data",
      text: "We collect your data:",
      list: [
        "To better understand your needs.",
        "To improve our services and products.",
        "To send you promotional emails with information we think you will find interesting.",
        "To contact you about surveys and other market research.",
        "To customise our website to how you use it and your preferences.",
      ],
    },
    { heading: "Safeguarding and securing the data", text: "Ultraa Albums is committed to keeping your data secure and confidential, and uses current technology and software to prevent data theft, unauthorised access and disclosure." },
    {
      heading: "Our cookie policy",
      text: "If you allow our website to use cookies, you agree that we may use the data they collect about how you use the site (web traffic, the pages you spend most time on, and the sites you visit). We use it to tailor the website to your needs and remove it from our systems after statistical analysis. Cookies do not give us control of your computer. You can turn cookies off in your browser's settings.",
    },
    { heading: "Links to other websites", text: "Our website links to other websites. Ultraa Albums is not responsible for your data and privacy on those sites, which this policy does not cover. Please read their privacy policies." },
    {
      heading: "Restricting the collection of your personal data",
      text: "You can limit how your personal data is used:",
      list: [
        "When you fill in a form on the website, leave unchecked any box that would share your personal information.",
        "If you have already agreed to share your information with us, email us and we will change this for you.",
      ],
      after:
        "Ultraa Albums will not lease, sell or distribute your personal information to third parties without your permission, unless the law requires it. We will use your personal information to send you promotional material only if you agree to this privacy policy.",
    },
  ],
};

export const termsPage = {
  h1: "Terms and Conditions",
  // ponytail: Ultraa's current page is template text with no actual terms; replace with
  // the real terms once Ultraa supplies them.
  intro: "Ultraa Albums is preparing its terms and conditions for orders. Until they are published here, please contact us with any question about an order, payment or delivery.",
};
