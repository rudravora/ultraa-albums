const image = (name, size = 800) => `/assets/images/${name}-${size}.webp`;

export const content = {
  brand: {
    name: 'Ultraa Albums',
    logo: '/assets/ultraa-logo.png',
    logoAlt: 'Ultraa Albums',
    home: 'https://ultraaalbums.com/',
  },
  meta: {
    title: 'Ultraa Albums | Wedding Albums for Photographers and Couples',
    description: 'Wedding albums in Mumbai for photographers, couples and families. Compare Luxury, Flush Mount, Layflat and Photo Books.',
    themeColor: '#faf9f7',
  },
  actions: {
    primary: 'Start your album',
    secondary: 'Get a quote',
  },
  navigation: [
    { label: 'Services', href: '#services' },
    { label: 'How it works', href: '#process' },
    { label: 'Album options', href: '#album-options' },
    { label: 'Journal', href: 'https://ultraaalbums.com/blogs/' },
    { label: 'Contact', href: '#contact' },
  ],
  productsMenu: [
    { label: 'Luxury Albums', href: 'https://ultraaalbums.com/luxury-albums/' },
    { label: 'Flush Mount Albums', href: 'https://ultraaalbums.com/flush-mount-album/' },
    { label: 'Layflat Albums', href: 'https://ultraaalbums.com/layflat/' },
    { label: 'Photo Books', href: 'https://ultraaalbums.com/photo-book/' },
    { label: 'Boxes, bags and slip-ins', href: 'https://ultraaalbums.com/our-products/' },
  ],
  hero: {
    audienceControl: 'Choose an audience',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    // Each audience opens the album at its own spread.
    audiences: [
      {
        id: 'couples',
        label: 'For couples',
        title: 'Wedding albums for couples',
        sentence: 'Keep wedding photographs together in a printed album.',
        spread: 0,
      },
      {
        id: 'photographers',
        label: 'For photographers',
        title: 'Wedding albums for photographers',
        sentence: 'Send client photographs online and review the design before printing.',
        spread: 2,
      },
    ],
    // Album spreads drawn onto the 3D pages. Generated stand-in photographs, cropped
    // per layout: full (one photo per page), pano (one photo across both pages),
    // framed (one inset photo), pair (two inset photos). focus = [x, y] from 0 to 1.
    spreads: [
      {
        alt: 'An open album: a couple under a flowering tree on the left page, a bride by a window on the right.',
        left: { layout: 'full', src: image('editing-01-after', 1200), focus: [0.45, 0.55] },
        right: { layout: 'full', src: image('editing-02-after', 1200), focus: [0.6, 0.5] },
      },
      {
        alt: 'An open album with one panoramic photograph of a couple on a garden path across both pages.',
        pano: { src: image('editing-03-after', 1200), focus: [0.5, 0.62], zoom: 1 },
      },
      {
        alt: 'An open album with a designed layout: a bouquet and blossom details on the left page and one framed portrait on the right.',
        left: {
          layout: 'pair',
          items: [
            { src: image('editing-02-after', 1200), focus: [0.7, 0.47], zoom: 2.6 },
            { src: image('editing-01-after', 1200), focus: [0.5, 0.12], zoom: 1.6 },
          ],
        },
        right: { layout: 'framed', src: image('editing-03-after', 1200), focus: [0.5, 0.6], zoom: 1.25 },
      },
    ],
    fact: 'Made in Mumbai. Ships worldwide.',
    // Stills rendered from the same Three.js scene (closed = first frame, open = rest).
    fallbackImage: image('album-closed', 1400),
    fallbackAlt: 'A closed dark leather album with a stitched border on its cover.',
    fallbackSrcset: [640, 960, 1400].map((w) => `${image('album-closed', w)} ${w}w`).join(', '),
    openImage: image('album-open', 1400),
    openAlt: 'An open leather album: a couple under a flowering tree on the left page, a bride by a window on the right.',
    openSrcset: [640, 960, 1400].map((w) => `${image('album-open', w)} ${w}w`).join(', '),
  },
  sections: {
    products: {
      id: 'products',
      title: 'Album formats',
      items: [
        {
          title: 'Luxury Albums',
          description: 'Flush-mounted pages with a choice of cover finishes.',
          href: 'https://ultraaalbums.com/luxury-albums/',
          action: 'See Luxury Albums',
          image: image('luxury-cover'),
          alt: 'Stitched dark leather album cover on natural stone beside an open wedding book.',
          ratio: '4 / 5',
        },
        {
          title: 'Flush Mount Albums',
          description: 'Thick pages with photo, fabric and hard-cover choices.',
          href: 'https://ultraaalbums.com/flush-mount-album/',
          action: 'See Flush Mount Albums',
          image: image('flush-mount'),
          alt: 'An open Flush Mount album showing a two-page wedding photograph.',
          ratio: '4 / 5',
        },
        {
          title: 'Layflat Albums',
          description: 'Panoramic photographs across two open pages.',
          href: 'https://ultraaalbums.com/layflat/',
          action: 'See Layflat Albums',
          image: image('layflat-spread'),
          alt: 'A Layflat album held open to a wide two-page wedding spread.',
          ratio: '4 / 5',
        },
        {
          title: 'Photo Books',
          description: 'Printed wedding and family books in four listed formats.',
          href: 'https://ultraaalbums.com/photo-book/',
          action: 'See Photo Books',
          image: image('photo-book'),
          alt: 'An open photo book with a wedding-family scene and smaller photographs on the pages.',
          ratio: '4 / 5',
        },
      ],
    },
    materials: {
      id: 'materials',
      title: 'Choose a cover',
      legend: 'Cover material',
      items: [
        {
          id: 'leather', label: 'Leather', image: image('material-leather'),
          alt: 'A stitched dark leather album cover with a soft matte finish.',
        },
        {
          id: 'linen', label: 'Linen', image: image('material-linen'),
          alt: 'A close view of a pale linen-bound album cover and page edge.',
        },
        {
          id: 'acrylic', label: 'Acrylic', image: image('material-acrylic'),
          alt: 'A smooth acrylic cover above an open wedding album.',
        },
        {
          id: 'canvas', label: 'Canvas', image: image('material-canvas'),
          alt: 'A warm canvas album cover with visible woven texture.',
        },
      ],
    },
    process: {
      id: 'process',
      title: 'From photographs to print',
      introduction: 'A four-step path from online transfer to shipping.',
      image: image('design-proofs'),
      imageAlt: 'An album open beside paper photographs and book-cover materials on a worktable.',
      steps: [
        { title: 'Transfer photos online', description: 'Send the selected photographs through online transfer.' },
        { title: 'Get a design', description: 'Review the album layout before it goes to print.' },
        { title: 'Printing', description: 'Printing follows approval of the album design.' },
        { title: 'Shipping', description: 'The finished album is shipped to its destination.' },
      ],
    },
    services: {
      id: 'services',
      title: 'Design, editing and photography',
      items: [
        {
          title: 'Album Design', description: 'Choose a pattern and review the soft-copy design.',
          href: 'https://ultraaalbums.com/album-designs/', action: 'See Album Design',
        },
        {
          title: 'Photo Editing', description: 'Prepare portraits and photographs for print.',
          href: 'https://ultraaalbums.com/photo-editing-and-album-design/', action: 'See Photo Editing',
        },
        {
          title: 'Wedding Photography', description: 'Wedding photography and videography.',
          href: 'https://ultraaalbums.com/photography/', action: 'See Wedding Photography',
        },
      ],
      editControl: 'Editing examples',
      editRange: 'Drag to compare before and after',
      before: 'Before',
      after: 'After',
      // Each example is a real file pair. Until Ultraa supplies its own edits, the
      // "after" files are generated stand-ins and each "before" is derived from its
      // "after" (flattened, cooler, under-exposed). Replace both files per pair.
      examples: [
        {
          id: 'tree', label: 'Under the tree',
          before: image('editing-01-before'), after: image('editing-01-after'),
          alt: 'A fictional newlywed couple beneath a flowering tree in a garden.',
        },
        {
          id: 'window', label: 'By the window',
          before: image('editing-02-before'), after: image('editing-02-after'),
          alt: 'A fictional bride holding flowers beside a tall window.',
        },
        {
          id: 'path', label: 'Garden path',
          before: image('editing-03-before'), after: image('editing-03-after'),
          alt: 'A fictional newlywed couple walking along a garden path.',
        },
      ],
    },
    packages: {
      id: 'album-options',
      title: 'Album options',
      introduction: 'Published sizes, covers and page choices by album format.',
      columns: ['Album format', 'Sizes', 'Covers', 'Pages'],
      rows: [
        {
          format: 'Luxury Albums',
          sizes: 'Not listed.',
          covers: 'Acrylic, leather, hardcover, linen, wood or canvas.',
          pages: 'Flush-mounted pages. No page count listed.',
        },
        {
          format: 'Flush Mount Albums',
          sizes: 'Not listed.',
          covers: 'Photo, acrylic, metal, canvas, linen or leather.',
          pages: '1 mm standard or 1.5 mm extra-thick. 0.5 mm prints; white or black substrate.',
        },
        {
          format: 'Layflat Albums',
          sizes: 'Not listed.',
          covers: 'Acrylic, canvas, linen, leather, photo, metal or wood.',
          pages: 'Thinner, lighter page block with panoramic two-page spreads.',
        },
        {
          format: 'Photo Books',
          sizes: '6 × 8 in; 9 × 12 in; wedding books, 12 × 18 in; mini books, 5 × 5 in.',
          covers: 'Photo-printed, laminated covers.',
          pages: 'Non-tearable paper; glossy, matt or feather-touch finish.',
        },
      ],
      note: 'Printed photo sizes listed separately: 4 × 6 in, 5 × 7 in and 6 × 8 in.',
    },
    contact: {
      id: 'contact',
      title: 'Contact Ultraa Albums',
      introduction: 'Talk through the album format and design.',
      phoneLabel: '+91 93222 54315',
      phoneHref: 'tel:+919322254315',
      emailLabel: 'Email Ultraa',
      emailHref: 'mailto:ultraaalbums@gmail.com',
      messengerLabel: 'Message on Messenger',
      messengerHref: 'https://m.me/UltraaAlbums',
      fieldLabels: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        message: 'Message',
      },
      validation: {
        name: 'Enter your name.',
        email: 'Enter your email address.',
        emailInvalid: 'Enter a valid email address.',
        message: 'Enter a message.',
        tooLong: 'This entry is too long.',
        form: 'Check the highlighted fields.',
      },
      submit: 'Start your album',
      emailTo: 'ultraaalbums@gmail.com',
      emailSubject: 'Album enquiry from the website',
      mailtoNote: 'Sending opens your email app with this message addressed to ultraaalbums@gmail.com.',
      mailtoOpened: 'Your email app should now show the message. It is sent only when you press send there.',
      sending: 'Sending your enquiry…',
      sent: 'Your enquiry was sent to Ultraa.',
      failed: 'We could not confirm that your enquiry arrived. Your text is still here: try again, call or message Ultraa.',
    },
  },
  external: {
    catalog: 'https://ultraaalbums.com/wp-content/uploads/2021/11/Ultraa-product-Catelogue.pdf',
    products: 'https://ultraaalbums.com/our-products/',
    faq: 'https://ultraaalbums.com/faq/',
    shipping: '#process',
    journal: 'https://ultraaalbums.com/blogs/',
    payOnline: 'https://www.paypal.com/in/signin',
    privacy: 'https://ultraaalbums.com/privacy-policy/',
    terms: 'https://ultraaalbums.com/terms-and-condition/',
  },
  footer: {
    productLinks: [
      { label: 'Luxury Albums', href: 'https://ultraaalbums.com/luxury-albums/' },
      { label: 'Flush Mount Albums', href: 'https://ultraaalbums.com/flush-mount-album/' },
      { label: 'Layflat Albums', href: 'https://ultraaalbums.com/layflat/' },
      { label: 'Photo Books', href: 'https://ultraaalbums.com/photo-book/' },
      { label: 'Boxes, bags and slip-ins', href: 'https://ultraaalbums.com/our-products/' },
    ],
    serviceLinks: [
      { label: 'Album Design', href: 'https://ultraaalbums.com/album-designs/' },
      { label: 'Photo Editing', href: 'https://ultraaalbums.com/photo-editing-and-album-design/' },
      { label: 'Wedding Photography', href: 'https://ultraaalbums.com/photography/' },
    ],
  },
};
