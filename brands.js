/* Virtual Stylist prototype — per-fascia configuration.
   Colours: signed-off Colour Alignment set (post-KM review, Aug 2026 — colour-alignment-prototype / DS tokens.css) +
   SEEL Enhancements 2026 Deliver+ branding, cross-checked against the live sites on 10 Sep 2026 (computed styles at 390px).
   Layout truth: Figma "VTO - Virtual Wardrobe" (LxHqA4rFpRYNWJu8vzn18X) node 15550-23866 (result screen, five fascias)
   + 15578-1559 (Add a Photo with the consent checkbox).
   The overlay has two themes per Figma: dark sheet (Debenhams, boohoo, boohooMAN) and light sheet (PLT, Karen Millen).
   Dorothy Perkins and Coast are new (no Figma yet): mono live palette on the light sheet, like Karen Millen.
   Products are real live SKUs captured 10 Sep 2026 (prices/stock will drift); images are mediahub exports at w=800. */
window.VTO_BRANDS = {
  debenhams: {
    name: 'Debenhams', domain: 'debenhams.com', logoH: 16, font: "'Geologica', sans-serif", theme: 'dark',
    weights: { body: 300, med: 300, bold: 600, btn: 600 }, caseBtn: 'uppercase', radius: '4px', stars: true,
    tokens: { primary: '#7be7d8', primaryInk: '#000', cta: '#00787d', outline: '#70beb3', check: '#00787d', vto: '#00787d',
      bodyBg: '#fff', white: '#fff', grey05: '#fafafa', badgeBg: '#fff2f2', badgeInk: '#d33f3f', price: '#d33f3f',
      banner1Bg: '#fafafa', banner1Ink: '#000', banner2Bg: '#000', banner2Ink: '#fff',
      dplusBg: '#e8f4f2', dplusInk: '#000', dplusLink: '#00787d',
      /* dark sheet (Figma 15534-23066): aqua selected size + CTA with black ink; live CTA is #7BE7D8 / #000 too */
      sheetCta: '#7be7d8', sheetCtaInk: '#000', sheetSel: '#7be7d8', sheetSelInk: '#000', sheetLink: '#7be7d8', progress: '#7be7d8' },
    usp: ['Free standard delivery on orders over £40', 'Up to 50% off in the Blue Cross Sale'],
    deliver: 'deb',
    product: { brand: 'Wallis', title: 'Floral Satin Midi Dress', price: '£39.00', was: '£65.00', save: 'Save 40%', colour: 'Brown',
      sizes: [['8', 0], ['10', 1], ['12', 0], ['14', 0], ['16', 0], ['18', 0], ['20', 0], ['22', 0]], sel: '12',
      crumbs: ['Womens', 'Womens Clothing', 'Dresses', 'Floral Midi Dresses'],
      images: ['assets/live/products/debenhams/01.jpg', 'assets/live/products/debenhams/02.jpg', 'assets/live/products/debenhams/03.jpg', 'assets/live/products/debenhams/04.jpg'],
      result: 'assets/live/products/debenhams/04.jpg',
      url: 'https://www.debenhams.com/product/wallis-floral-satin-midi-dress_byy17851?colour=brown' }
  },
  boohoo: {
    name: 'boohoo', domain: 'boohoo.com', logoH: 18, font: "'Montserrat', sans-serif", theme: 'dark',
    weights: { body: 400, med: 500, bold: 700, btn: 600 }, caseBtn: 'uppercase', radius: '4px', stars: false,
    /* signed-off: boohoo drops pink and runs mono like boohooMAN (live CTA today renders #444444 on white) */
    tokens: { primary: '#000', primaryInk: '#fff', cta: '#000', outline: '#000', check: '#000', vto: '#000',
      bodyBg: '#fff', white: '#fff', grey05: '#fafafa', badgeBg: '#fff2f2', badgeInk: '#d33f3f', price: '#d33f3f',
      banner1Bg: '#fafafa', banner1Ink: '#000', banner2Bg: '#000', banner2Ink: '#fff',
      dplusBg: '#ffe0eb', dplusInk: '#000', dplusLink: '#000',
      /* mono fascia on the dark sheet: white CTA + white selected size (the boohooMAN Figma treatment, 15534-23067) */
      sheetCta: '#fff', sheetCtaInk: '#000', sheetSel: '#fff', sheetSelInk: '#000', sheetLink: '#fff', progress: '#fff' },
    usp: ['Free delivery on orders over £50', 'Up to 60% off everything · Code: FAST'],
    deliver: 'bh',
    /* the Figma product — keeps the real generated try-on result (result-jersey.png) */
    product: { brand: 'DSGN Studio', title: 'DSGN Studio Stripe Football Jersey', price: '£12.00', was: '£15.00', save: '-20%', colour: 'Light Blue',
      sizes: [['XS', 0], ['S', 0], ['M', 1], ['L', 1], ['XL', 1]], sel: 'S',
      crumbs: ['Home', 'Womens', 'Womens Clothing', 'Tops', 'T-Shirts'],
      images: ['assets/live/products/boohoo/01.jpg', 'assets/live/products/boohoo/02.jpg', 'assets/live/products/boohoo/03.jpg', 'assets/live/products/boohoo/04.jpg'],
      result: 'assets/img/result-jersey.png',
      url: 'https://www.boohoo.com/product/dsgn-studio-dsgn-studio-stripe-football-jersey_xtt01659?colour=light+blue' }
  },
  boohooman: {
    name: 'boohooMAN', domain: 'boohooman.com', logoH: 10, font: "'Montserrat', sans-serif", theme: 'dark',
    weights: { body: 400, med: 500, bold: 700, btn: 600 }, caseBtn: 'uppercase', radius: '4px', stars: false,
    tokens: { primary: '#000', primaryInk: '#fff', cta: '#000', outline: '#000', check: '#000', vto: '#000',
      bodyBg: '#fff', white: '#fff', grey05: '#fafafa', badgeBg: '#fff2f2', badgeInk: '#d33f3f', price: '#d33f3f',
      banner1Bg: '#fafafa', banner1Ink: '#000', banner2Bg: '#000', banner2Ink: '#fff',
      dplusBg: '#101010', dplusInk: '#fff', dplusLink: '#fff',
      sheetCta: '#fff', sheetCtaInk: '#000', sheetSel: '#fff', sheetSelInk: '#000', sheetLink: '#fff', progress: '#fff' },
    usp: ['Free UK delivery on orders over £50', 'Extra 15% off · Code: TAKE15'],
    deliver: 'bm',
    product: { brand: 'boohooMAN', title: 'Muscle Fit Long Sleeve Shirt', price: '£16.00', was: '£20.00', save: '-20%', colour: 'White',
      sizes: [['XS', 0], ['S', 0], ['M', 0], ['L', 0], ['XL', 0], ['2XL', 0], ['3XL', 0], ['4XL', 0], ['5XL', 0]], sel: 'M',
      crumbs: ['Home', 'Mens', 'Shirts'],
      images: ['assets/live/products/boohooman/01.jpg', 'assets/live/products/boohooman/02.jpg', 'assets/live/products/boohooman/03.jpg', 'assets/live/products/boohooman/04.jpg'],
      result: 'assets/live/products/boohooman/04.jpg',
      url: 'https://www.boohooman.com/product/boohooman-muscle-fit-long-sleeve-shirt_cmm23021?colour=white' }
  },
  plt: {
    name: 'PrettyLittleThing', domain: 'prettylittlething.com', logoH: 22, font: "'Roboto', sans-serif", theme: 'light',
    weights: { body: 400, med: 400, bold: 700, btn: 600 }, caseBtn: 'uppercase', radius: '0px', stars: false,
    /* PLT chip (Figma 15203-71920): filled primary rectangle, left-aligned under the gallery, Roboto 12px uppercase white, white hanger */
    chip: { bg: '#550503', ink: '#fff', icon: '#fff', radius: '0', size: '12px', weight: 400, case: 'uppercase', align: 'flex-start' },
    tokens: { primary: '#550503', primaryInk: '#fff', cta: '#550503', outline: '#360502', check: '#550503', vto: '#550503',
      bodyBg: '#fffdf7', white: '#fffdf7', grey05: '#faf5e7', badgeBg: 'transparent', badgeInk: '#c90000', price: '#c90000',
      banner1Bg: '#f1c59e', banner1Ink: '#000', banner2Bg: '#ffe4d2', banner2Ink: '#000',
      dplusBg: '#e7ada2', dplusInk: '#000', dplusLink: '#000',
      /* light sheet (Figma 15534-23068): warm-white sheet, garnet selected size + CTA, grey-3 size borders */
      sheetBg: '#fffdf7', sheetInk: '#000', sheetSub: '#000', sizeBg: '#fffdf7', sizeInk: '#000', sizeBorder: '#b5b5b5', oosInk: '#b5b5b5',
      sheetCta: '#550503', sheetCtaInk: '#fff', sheetSel: '#550503', sheetSelInk: '#fff', sheetLink: '#550503', progress: '#550503' },
    usp: ['Free next day delivery on orders over £60', 'Up to 70% off · Ends midnight'],
    deliver: 'plt',
    product: { brand: 'PrettyLittleThing', title: 'Chocolate Satin Lace Cup Detail Midi Dress', price: '£20.00', was: '£25.00', save: '-20%', colour: 'Chocolate',
      sizes: [['4', 0], ['6', 0], ['8', 1], ['10', 0], ['12', 0], ['14', 0], ['16', 0]], sel: '10',
      crumbs: ['Home', 'Dresses', 'Midi Dresses'],
      images: ['assets/live/products/plt/01.jpg', 'assets/live/products/plt/02.jpg', 'assets/live/products/plt/03.jpg', 'assets/live/products/plt/04.jpg'],
      result: 'assets/live/products/plt/01.jpg',
      url: 'https://www.prettylittlething.com/product/satin-lace-cup-detail-midi-dress_plt01593?colour=chocolate' }
  },
  karenmillen: {
    name: 'Karen Millen', domain: 'karenmillen.com', logoH: 9, font: "'Jost', sans-serif", theme: 'light',
    weights: { body: 400, med: 500, bold: 600, btn: 400 }, caseBtn: 'none', radius: '4px', stars: true,
    /* signed-off KM: Primary orange #D24508 primary CTAs (live still renders black); links/ticks #892D05; black outlines; black hanger */
    tokens: { primary: '#d24508', primaryInk: '#fff', cta: '#892d05', outline: '#000', check: '#892d05', vto: '#000',
      bodyBg: '#fff', white: '#fff', grey05: '#fafafa', badgeBg: '#fff2f2', badgeInk: '#d33f3f', price: '#d33f3f',
      banner1Bg: '#fafafa', banner1Ink: '#000', banner2Bg: '#000', banner2Ink: '#fff',
      dplusBg: 'linear-gradient(90deg,#000 36%,#161616 100%)', dplusInk: '#fff', dplusLink: '#fff',
      /* light sheet (Figma 15534-23118: white sheet, grey-2 size borders, black selected size) */
      sheetBg: '#fff', sheetInk: '#000', sheetSub: '#000', sizeBg: '#fff', sizeInk: '#000', sizeBorder: '#e7e7e7', oosInk: '#b5b5b5',
      sheetCta: '#d24508', sheetCtaInk: '#fff', sheetSel: '#000', sheetSelInk: '#fff', sheetLink: '#892d05', progress: '#d24508' },
    usp: ['Complimentary delivery on orders over £100', 'Extra 10% off · Code: KMEXTRA10'],
    deliver: 'km',
    product: { brand: 'KarenMillen', title: 'Tailored Printed Satin Viscose Belted Maxi Shirt Dress', price: '£249.00', was: '', save: '', colour: 'Multi',
      sizes: [['6', 0], ['8', 0], ['10', 0], ['12', 0], ['14', 0], ['16', 0], ['18', 0]], sel: '10',
      crumbs: ['Satin Dresses', 'Long Sleeve Satin Dresses'],
      images: ['assets/live/products/karenmillen/01.jpg', 'assets/live/products/karenmillen/02.jpg', 'assets/live/products/karenmillen/03.jpg', 'assets/live/products/karenmillen/04.jpg'],
      result: 'assets/live/products/karenmillen/03.jpg',
      url: 'https://www.karenmillen.com/product/karen-millen-tailored-printed-satin-viscose-belted-maxi-shirt-dress_bkk31510?colour=multi' }
  },
  dorothyperkins: {
    name: 'Dorothy Perkins', domain: 'dorothyperkins.com', logoH: 30, font: "'Public Sans', sans-serif", theme: 'light',
    weights: { body: 400, med: 500, bold: 700, btn: 600 }, caseBtn: 'uppercase', radius: '4px', stars: false,
    /* live 10 Sep 2026: Public Sans, black #000 CTA with white uppercase label, white header, #F8F8F8 promo ticker */
    tokens: { primary: '#000', primaryInk: '#fff', cta: '#000', outline: '#000', check: '#000', vto: '#000',
      bodyBg: '#fff', white: '#fff', grey05: '#fafafa', badgeBg: '#fff2f2', badgeInk: '#d33f3f', price: '#d33f3f',
      banner1Bg: '#f8f8f8', banner1Ink: '#000', banner2Bg: '#000', banner2Ink: '#fff',
      dplusBg: '#f2f2f2', dplusInk: '#000', dplusLink: '#000',
      sheetBg: '#fff', sheetInk: '#000', sheetSub: '#000', sizeBg: '#fff', sizeInk: '#000', sizeBorder: '#e7e7e7', oosInk: '#b5b5b5',
      sheetCta: '#000', sheetCtaInk: '#fff', sheetSel: '#000', sheetSelInk: '#fff', sheetLink: '#000', progress: '#000' },
    usp: ['New Season: Up To 30% Off | Shop Now', 'Free standard delivery on orders over £50'],
    deliver: 'text',
    product: { brand: 'Dorothy Perkins', title: 'Petite Berry Ditsy Flutter Sleeve Frill Yoke Printed Chiffon Midaxi Dress', price: '£22.00', was: '£45.00', save: 'Save 51%', colour: 'Berry',
      sizes: [['8', 0], ['10', 0], ['12', 0], ['14', 0], ['16', 0], ['18', 0]], sel: '12',
      crumbs: ['Dresses', 'Chiffon Dresses'],
      images: ['assets/live/products/dorothyperkins/01.jpg', 'assets/live/products/dorothyperkins/02.jpg', 'assets/live/products/dorothyperkins/03.jpg', 'assets/live/products/dorothyperkins/04.jpg'],
      result: 'assets/live/products/dorothyperkins/01.jpg',
      url: 'https://www.dorothyperkins.com/product/dorothy-perkins-petite-berry-ditsy-flutter-sleeve-frill-yoke-printed-chiffon-midaxi-dress_bqq23692?colour=berry' }
  },
  coast: {
    name: 'Coast', domain: 'coastfashion.com', logoH: 24, font: "'Roboto', sans-serif", theme: 'light',
    weights: { body: 400, med: 500, bold: 700, btn: 600 }, caseBtn: 'uppercase', radius: '4px', stars: false,
    /* live 10 Sep 2026: Roboto, black #000 CTA with white uppercase label, white header, light-grey promo ticker */
    tokens: { primary: '#000', primaryInk: '#fff', cta: '#000', outline: '#000', check: '#000', vto: '#000',
      bodyBg: '#fff', white: '#fff', grey05: '#fafafa', badgeBg: '#fff2f2', badgeInk: '#d33f3f', price: '#d33f3f',
      banner1Bg: '#f8f8f8', banner1Ink: '#000', banner2Bg: '#000', banner2Ink: '#fff',
      dplusBg: '#f2f2f2', dplusInk: '#000', dplusLink: '#000',
      sheetBg: '#fff', sheetInk: '#000', sheetSub: '#000', sizeBg: '#fff', sizeInk: '#000', sizeBorder: '#e7e7e7', oosInk: '#b5b5b5',
      sheetCta: '#000', sheetCtaInk: '#fff', sheetSel: '#000', sheetSelInk: '#fff', sheetLink: '#000', progress: '#000' },
    usp: ['At Least 30% Off Shoes & Boots', 'Free UK delivery on orders over £75'],
    deliver: 'text',
    product: { brand: 'Coast', title: 'Pleat Detail Lace Trim Maxi Dress', price: '£50.00', was: '£129.00', save: 'Save 61%', colour: 'Flame Red',
      sizes: [['8', 0], ['10', 0], ['12', 1], ['14', 1], ['16', 0], ['18', 1]], sel: '10',
      crumbs: ['Summer Dresses', 'Long Summer Dresses'],
      images: ['assets/live/products/coast/01.jpg', 'assets/live/products/coast/02.jpg', 'assets/live/products/coast/03.jpg', 'assets/live/products/coast/04.jpg'],
      result: 'assets/live/products/coast/01.jpg',
      url: 'https://www.coastfashion.com/product/coast-pleat-detail-lace-trim-maxi-dress_bcc12445?colour=flame%20red' }
  }
};
window.VTO_ORDER = ['debenhams', 'boohoo', 'boohooman', 'plt', 'karenmillen', 'dorothyperkins', 'coast'];
