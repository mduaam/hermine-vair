export interface FallbackJournalPost {
  id: string;
  slug: {
    fr: string;
    en: string;
  };
  category: 'entretien' | 'style' | 'coulisses';
  publishedAt: string;
  readTime: string;
  title: {
    fr: string;
    en: string;
  };
  excerpt: {
    fr: string;
    en: string;
  };
  author: {
    fr: string;
    en: string;
  };
  heroImage: {
    url: string;
    alt_fr: string;
    alt_en: string;
  };
  body: {
    fr: Array<{
      title?: string;
      content: string;
      quote?: string;
    }>;
    en: Array<{
      title?: string;
      content: string;
      quote?: string;
    }>;
  };
  relatedCollectionLinks: Array<{
    label: {
      fr: string;
      en: string;
    };
    href: {
      fr: string;
      en: string;
    };
  }>;
  seo: {
    metaTitle: {
      fr: string;
      en: string;
    };
    metaDescription: {
      fr: string;
      en: string;
    };
  };
}

export interface FallbackFaqItem {
  id: string;
  category: 'commandes' | 'livraison' | 'entretien' | 'surmesure';
  question: {
    fr: string;
    en: string;
  };
  answer: {
    fr: string;
    en: string;
  };
}

export const FALLBACK_JOURNAL_POSTS: FallbackJournalPost[] = [
  {
    id: 'post-1',
    slug: {
      fr: 'guide-preservation-fourrure-precieuse',
      en: 'precious-fur-preservation-guide',
    },
    category: 'entretien',
    publishedAt: '2026-03-10T10:00:00Z',
    readTime: '6 min',
    title: {
      fr: 'Guide de Préservation : Soigner et Conserver Votre Manteau de Vison',
      en: 'Preservation Guide: Caring for and Storing Your Precious Mink Coat',
    },
    excerpt: {
      fr: "Découvrez les secrets séculaires des maîtres fourreurs pour préserver la brillance soyeuse et la souplesse incomparable de votre fourrure à travers les saisons.",
      en: "Discover the age-old secrets of master furriers to preserve the silky luster and supple touch of your fine fur through every season.",
    },
    author: {
      fr: 'Atelier de Restauration',
      en: 'Restoration Atelier',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=85',
      alt_fr: "Préservation et brossage délicat d'une pièce de haute fourrure dans l'atelier parisien",
      alt_en: 'Delicate brushing and preservation of a haute fourrure piece in the Parisian atelier',
    },
    body: {
      fr: [
        {
          title: '1. L’Importance Fondamentale de la Fraîcheur et de l’Humidité',
          content:
            "Une fourrure naturelle respire. Pour empêcher le cuir de se dessécher au fil des décennies, votre manteau doit toujours être conservé dans une pièce tempérée (entre 10°C et 14°C) avec un taux d'hygrométrie compris entre 45% et 55%. Évitez impérativement la proximité des radiateurs, des sources de chaleur directe et la lumière vive du soleil qui peut altérer l'éclat des pigments naturels.",
        },
        {
          title: '2. Le Choix du Cintre et de la Housse',
          content:
            "Ne rangez jamais votre manteau ou votre cape sur un cintre métallique fin. Choisissez un cintre large et galbé en bois naturel pour soutenir la carrure et préserver le tombé des épaules. Pour le voyage ou le repos en penderie, utilisez exclusivement une housse en coton ou lin écru respirant. Proscrivez formellement les housses plastiques étanches qui asphyxient le duvet.",
          quote:
            "« Le soin accordé à une fourrure d'exception est le prolongement naturel de l'art qui lui a donné vie. »",
        },
        {
          title: '3. Que Faire en Cas d’Averse ou d’Humidité ?',
          content:
            "Si vous êtes surprise par une averse de neige ou de pluie fine, secouez délicatement votre vêtement pour expulser l'eau de surface, puis suspendez-le sur son cintre dans une pièce bien aérée. Ne tentez jamais de le sécher au sèche-cheveux ou sur un radiateur. Laissez la nature opérer. Une fois sec, brossez délicatement dans le sens du poil.",
        },
        {
          title: '4. Le Gardiennage Estival en Chambre Froide',
          content:
            "Durant la belle saison, notre Maison propose un service exclusif de conservation en chambres climatisées et sécurisées au cœur de Paris. Ce gardiennage préserve la fraîcheur du duvet et assure un contrôle minutieux de chaque couture avant le retour de l'hiver.",
        },
      ],
      en: [
        {
          title: '1. The Crucial Role of Climate and Humidity',
          content:
            'Natural fur breathes. To prevent the pelts from drying out over decades, fine fur garments should always be stored in a cool room (between 10°C and 14°C) with humidity maintained between 45% and 55%. Keep away from radiators, direct sunlight, and heat ducts that can dehydrate the leather backing and fade natural coloration.',
        },
        {
          title: '2. The Right Hanger and Breathable Storage',
          content:
            'Never hang your coat or cape on a thin wire hanger. Opt for a wide-shouldered wooden hanger that mirrors human ergonomics and maintains shoulder shape. Use only 100% breathable unbleached cotton or linen garment bags. Synthetic plastic bags suffocate the pelts and must strictly be avoided.',
          quote:
            '“The care bestowed upon an exceptional fur is the natural continuation of the art that gave it life.”',
        },
        {
          title: '3. What to Do in Case of Rain or Snow?',
          content:
            'Should you encounter a winter shower, gently shake the coat to dispel surface droplets, then hang it in a well-ventilated room at ambient temperature. Never apply heat or use a hairdryer. Allow it to air dry slowly, then brush lightly in the direction of the hair.',
        },
        {
          title: '4. Summer Cold Storage Vaults',
          content:
            'During the warmer months, L’Hermine et le Vair provides an exclusive seasonal cold storage vault service in Paris, preserving pristine moisture equilibrium and safeguarding your investments for generations.',
        },
      ],
    },
    relatedCollectionLinks: [
      {
        label: {
          fr: 'Découvrir nos Manteaux de Vison d’Exception',
          en: 'Discover Exceptional Mink Coats',
        },
        href: {
          fr: '/collections/manteaux/manteaux-de-fourrure',
          en: '/collections/coats/fur-coats',
        },
      },
      {
        label: {
          fr: 'Explorer la Collection Vison',
          en: 'Explore the Mink Collection',
        },
        href: {
          fr: '/collections/vison',
          en: '/collections/mink',
        },
      },
    ],
    seo: {
      metaTitle: {
        fr: 'Guide d’Entretien de la Fourrure Précieuse | L’Hermine et le Vair',
        en: 'Precious Fur Care & Storage Guide | L’Hermine et le Vair',
      },
      metaDescription: {
        fr: 'Secrets et rituels d’entretien de la haute fourrure : conservation, brossage, gardiennage estival et protection de votre manteau de vison.',
        en: 'Expert care rituals for fine furs: humidity control, breathable storage, rain management and summer vault storage.',
      },
    },
  },
  {
    id: 'post-2',
    slug: {
      fr: 'allure-contemporaine-porter-le-vair-au-quotidien',
      en: 'contemporary-allure-styling-fur-cashmere',
    },
    category: 'style',
    publishedAt: '2026-02-18T14:30:00Z',
    readTime: '4 min',
    title: {
      fr: 'Allure Contemporaine : Comment Porter le Vair et la Fourrure au Quotidien',
      en: 'Contemporary Allure: Styling Fur and Cashmere for Modern Elegance',
    },
    excerpt: {
      fr: "Démystifier la haute fourrure : loin des conventions rigides, découvrez comment associer capes amples, gilets de renard et cachemire impérial dans vos silhouettes du jour.",
      en: 'Demystifying haute fourrure: step beyond rigid conventions to pair fluid capes, silver fox vests, and imperial cashmere with effortless daily elegance.',
    },
    author: {
      fr: 'Direction Artistique',
      en: 'Artistic Direction',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=85',
      alt_fr: 'Silhouette contemporaine élégante portant une cape de fourrure et cachemire',
      alt_en: 'Contemporary elegant silhouette wearing a fur trimmed cashmere cape',
    },
    body: {
      fr: [
        {
          title: 'L’Équilibre des Matières et des Textures',
          content:
            "La clé de l'élégance contemporaine réside dans le contraste audacieux. Associez un gilet de renard argenté volumineux à un pantalon cigarette en laine vierge et un col roulé en cachemire ultrafin. La richesse texturée de la fourrure sublime la pureté architecturale d'une tenue monochrome.",
        },
        {
          title: 'Du Crépuscule à l’Aube : La Cape Universelle',
          content:
            "La cape doublée de soie sauvage est sans doute la pièce la plus polyvalente de notre vestiaire. Posée sur les épaules par-dessus un ensemble tailleur pour une réunion d'affaires, elle se métamorphose le soir venu en parure spectaculaire sur une robe fourreau.",
          quote:
            "« L'allure véritable est celle qui semble naturelle, même dans la matière la plus somptueuse. »",
        },
        {
          title: 'Les Accessoires Comme Touche Finale',
          content:
            "Pour les journées fraîches où un manteau intégral n'est pas requis, une étole en renard polaire ou un manchon délicat apporte cette note de raffinement discret caractéristique du chic parisien.",
        },
      ],
      en: [
        {
          title: 'The Contrast of Rare Textures',
          content:
            'The secret of modern styling lies in balance. Pair a sculpted silver fox vest with tailored cigarette trousers and an ultra-fine cashmere turtleneck. The volume of the fur elevates clean, minimalist architectural lines.',
        },
        {
          title: 'From Dawn to Evening Gala: The Fluid Cape',
          content:
            'A cashmere cape lined in heavy silk and edged in dark fur is our most versatile silhouette. Draped effortlessly over daywear, it transitions effortlessly into a showstopping evening mantle.',
          quote:
            '“True allure feels effortless, even when enveloped in the world’s most sumptuous materials.”',
        },
        {
          title: 'Curated Accent Pieces',
          content:
            'On crisp transitional days, a fur stole or collar scarf injects understated distinction without excess weight.',
        },
      ],
    },
    relatedCollectionLinks: [
      {
        label: {
          fr: 'Découvrir nos Capes & Étoffes Précieuses',
          en: 'Discover Capes & Fine Cloths',
        },
        href: {
          fr: '/collections/capes',
          en: '/collections/capes',
        },
      },
      {
        label: {
          fr: 'Voir la Collection Gilets & Silhouettes Courtes',
          en: 'View Vests & Short Silhouettes',
        },
        href: {
          fr: '/collections/gilets',
          en: '/collections/vests',
        },
      },
    ],
    seo: {
      metaTitle: {
        fr: 'Allure Contemporaine & Style Fourrure | L’Hermine et le Vair',
        en: 'Contemporary Fur Styling & Outfits | L’Hermine et le Vair',
      },
      metaDescription: {
        fr: 'Conseils de style pour intégrer gilets de renard, capes en cachemire et étoles précieuses dans une garde-robe parisienne moderne.',
        en: 'Modern styling advice: pairing statement fur vests, cashmere capes, and stoles with contemporary luxury wardrobes.',
      },
    },
  },
  {
    id: 'post-3',
    slug: {
      fr: 'secret-atelier-gestes-maitre-fourreur',
      en: 'secret-atelier-master-furrier-craftsmanship',
    },
    category: 'coulisses',
    publishedAt: '2026-01-25T09:00:00Z',
    readTime: '7 min',
    title: {
      fr: 'Dans le Secret de l’Atelier : Les Gestes Précis du Maître Fourreur',
      en: 'Inside the Secret Atelier: The Precision Artistry of the Master Furrier',
    },
    excerpt: {
      fr: "Immersion au cœur de notre atelier de la Rue de la Paix : du choix exigeant des peaux à la coupe millimétrique du galonnage, voyage dans l'artisanat d'art parisien.",
      en: 'A rare glimpse inside our Rue de la Paix atelier: from painstaking pelt matching to the delicate millimeter-thin stranding cuts of Parisian haute couture.',
    },
    author: {
      fr: 'Maître Artisan Fourreur',
      en: 'Master Furrier Artisan',
    },
    heroImage: {
      url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85',
      alt_fr: 'Atelier de couture haute fourrure avec patrons et outils artisanaux en bois et laiton',
      alt_en: 'Haute fourrure workshop with bespoke paper patterns and brass hand tools',
    },
    body: {
      fr: [
        {
          title: '1. L’Assortiment : L’Harmonie des Nuances',
          content:
            "Avant même le premier coup de lame, le maître artisan passe des heures à assortir les peaux sous la verrière de l'atelier, à la lumière pure du nord. Chaque fourrure présente des variations infimes de densité, de hauteur de poil et de reflets. Seule une dizaine de peaux sélectionnées parmi des centaines trouveront leur place sur une même création.",
        },
        {
          title: '2. La Coupe en Allongé : Le Chef-d’Œuvre de Précision',
          content:
            "La technique du galonnage ou de l'allongé consiste à découper la peau en biseaux de quelques millimètres, puis à les réassembler à la main avec un fil de soie pour donner au manteau une fluidité incomparable, sans rupture visuelle. Ce geste exige jusqu'à 80 heures de concentration ininterrompue.",
          quote:
            "« Le véritable luxe réside dans ce qui ne se voit pas : l'infinie légèreté d'un vêtement qui défie la pesanteur. »",
        },
        {
          title: '3. Le Montage et la Soie Lyonnaise',
          content:
            "Chaque pièce est montée sur une toile de corps personnalisée avant de recevoir sa doublure en crêpe de soie tissée à Lyon. Chaque boutonnière est façonnée à la main au point de cordonnet, garantissant une longévité qui traversera les générations.",
        },
      ],
      en: [
        {
          title: '1. The Sorting Ritual: Chromatic Harmony',
          content:
            'Before any cut is made, the master artisan examines pelts beneath the northern skylight. No two pelts are identical. Grain density, guard-hair length, and chromatic sheen must be reconciled so that the completed garment reads as a single uninterrupted wave.',
        },
        {
          title: '2. The Stranding Technique: Feats of Dexterity',
          content:
            'Stranding involves slicing pelts into diagonal bands just millimeters wide, then shifting and sewing them back together to lengthen the silhouette and impart liquid drape. It requires up to 80 hours of unwavering focus per piece.',
          quote:
            '“True luxury lives in what remains invisible: the breathtaking weightlessness of a garment that defies gravity.”',
        },
        {
          title: '3. Bespoke Finishing and Lyon Silk Linings',
          content:
            'Each creation is assembled over a custom muslin structure and lined with heavy silk jacquard woven in Lyon. Hand-knotted corded buttonholes complete an heirloom destined to endure for generations.',
        },
      ],
    },
    relatedCollectionLinks: [
      {
        label: {
          fr: 'Explorer la Collection Complète de Manteaux',
          en: 'Explore the Complete Coat Collection',
        },
        href: {
          fr: '/collections/manteaux',
          en: '/collections/coats',
        },
      },
      {
        label: {
          fr: 'Consulter nos Pièces Emblématiques',
          en: 'View Our Iconic Creations',
        },
        href: {
          fr: '/collections/icones',
          en: '/collections/icons',
        },
      },
    ],
    seo: {
      metaTitle: {
        fr: 'Les Gestes du Maître Fourreur | L’Hermine et le Vair',
        en: 'Inside the Furrier Atelier | L’Hermine et le Vair',
      },
      metaDescription: {
        fr: 'Découvrez les coulisses de la haute fourrure parisienne : assortiment des peaux, coupe en allongé et finitions main en soie lyonnaise.',
        en: 'Step into our Paris workshop: pelt grading, stranding precision, and hand-stitched silk linings of heirloom couture.',
      },
    },
  },
];

export const FALLBACK_FAQS: FallbackFaqItem[] = [
  {
    id: 'faq-1',
    category: 'commandes',
    question: {
      fr: 'Comment se déroule la commande d’une pièce d’exception ?',
      en: 'How does ordering an exceptional bespoke piece work?',
    },
    answer: {
      fr: "Chaque commande est prise en charge par un concierge dédié de notre Maison. Dès validation de votre règlement sécurisé, un étui de transport sur-mesure est préparé et votre pièce bénéficie d'une dernière inspection minutieuse par notre chef d'atelier avant expédition sous scellé d'art.",
      en: 'Every order is overseen by a private Maison concierge. Following verified payment, your garment undergoes final inspection by our head artisan before being sealed in custom protective flight cases.',
    },
  },
  {
    id: 'faq-2',
    category: 'commandes',
    question: {
      fr: 'Quels sont les moyens de paiement acceptés ?',
      en: 'Which payment methods are accepted?',
    },
    answer: {
      fr: 'Nous acceptons l’ensemble des cartes bancaires majeures (Visa, Mastercard, American Express), Apple Pay, Google Pay, ainsi que les facilités de paiement échelonné sécurisées Klarna et Afterpay selon votre pays de résidence.',
      en: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, as well as insured installments via Klarna and Afterpay where available.',
    },
  },
  {
    id: 'faq-3',
    category: 'livraison',
    question: {
      fr: 'Quels sont les délais et modes d’expédition ?',
      en: 'What are the delivery timeframes and courier methods?',
    },
    answer: {
      fr: 'Toutes nos créations voyagent en transport sécurisé haute valeur avec remise contre signature et pièce d’identité. La livraison est effectuée en 24h à 48h en France métropolitaine et Union Européenne, et sous 3 à 5 jours ouvrés à l’international.',
      en: 'All pieces travel via specialized high-value armored couriers with mandatory in-person signature and ID verification. Delivery takes 24–48h across Europe and 3–5 business days internationally.',
    },
  },
  {
    id: 'faq-4',
    category: 'livraison',
    question: {
      fr: 'Comment s’appliquent les droits de douane et taxes d’importation ?',
      en: 'How are customs duties and import taxes handled?',
    },
    answer: {
      fr: 'Pour toutes les livraisons vers les États-Unis, le Royaume-Uni, la Suisse et le Japon, les droits de douane et taxes locales sont calculés et inclus lors de votre paiement (rendu droits acquittés DDP). Aucun frais supplémentaire ne vous sera réclamé à la livraison.',
      en: 'For shipments to the US, UK, Switzerland, and Japan, all duties and local taxes are collected at checkout (Delivered Duty Paid - DDP). No additional tariffs will be demanded upon delivery.',
    },
  },
  {
    id: 'faq-5',
    category: 'entretien',
    question: {
      fr: 'Proposez-vous un service de gardiennage estival ?',
      en: 'Do you provide seasonal summer cold storage?',
    },
    answer: {
      fr: 'Oui, notre Maison met à disposition de sa clientèle des chambres fortes climatisées et hygrométriquement régulées à Paris. Nous organisons l’enlèvement sécurisé à votre domicile au printemps et la réexpédition au début de l’automne.',
      en: 'Yes, our Maison maintains climate-controlled vaults in Paris. We coordinate insured doorstep collection in spring and return in early autumn.',
    },
  },
  {
    id: 'faq-6',
    category: 'surmesure',
    question: {
      fr: 'Est-il possible de réserver un rendez-vous privé à l’atelier ?',
      en: 'Can I book a private consultation at the atelier?',
    },
    answer: {
      fr: 'Nos salons de la Rue de la Paix à Paris vous accueillent sur rendez-vous privé pour un essayage exclusif ou pour concevoir une commande spéciale avec notre maître fourreur. Vous pouvez effectuer votre demande via notre formulaire de contact ou auprès de votre concierge.',
      en: 'Our salons on Rue de la Paix in Paris welcome clients for private fittings and bespoke commissions with our master artisan. Consultations can be reserved through our concierge contact form.',
    },
  },
];
