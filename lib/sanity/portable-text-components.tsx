import React from 'react';
import Image from 'next/image';
import type { PortableTextComponents } from '@portabletext/react';

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl lg:text-2xl text-primary font-normal tracking-wide mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="font-sans text-muted leading-relaxed mb-6 font-light text-base lg:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-gold pl-6 my-8 italic font-serif text-lg lg:text-xl text-primary font-light">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 font-sans text-muted font-light">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 font-sans text-muted font-light">
        {children}
      </ol>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null;
      return (
        <figure className="my-10 relative">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
            <Image
              src={value.asset.url}
              alt={value.alt || "Création de haute fourrure L'Hermine et le Vair"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center font-sans text-xs tracking-wider uppercase text-muted/80 mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
