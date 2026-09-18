'use client';
// CLIENT: interactive dual-language product editor enforcing FR & EN mandatory fields

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { DualLanguageTabs } from './DualLanguageTabs';

interface ProductFormProps {
  initialData?: any;
  categories: any[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [activeLocale, setActiveLocale] = useState<'fr' | 'en'>('fr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    sku: initialData?.sku || 'SKU-NEW-001',
    category_id: initialData?.category_id || categories[0]?.id || '',
    material: initialData?.material || 'vison',
    price_amount: initialData?.price_amount || 5000,
    price_currency: initialData?.price_currency || 'EUR',
    is_best_seller: initialData?.is_best_seller ?? false,
    status: initialData?.status || 'active',
    origin_atelier: initialData?.origin_atelier || 'Atelier Paris — 15 Rue de la Paix',

    // French Fields (Mandatory)
    name_fr: initialData?.name_fr || '',
    slug: initialData?.slug || '',
    description_fr: initialData?.description_fr || '',
    care_instructions_fr: initialData?.care_instructions_fr || 'Confier exclusivement à un maître fourreur agréé.',
    meta_title_fr: initialData?.meta_title_fr || '',
    meta_description_fr: initialData?.meta_description_fr || '',

    // English Fields (Mandatory)
    name_en: initialData?.name_en || '',
    slug_en: initialData?.slug_en || '',
    description_en: initialData?.description_en || '',
    care_instructions_en: initialData?.care_instructions_en || 'Entrust exclusively to an authorized master furrier.',
    meta_title_en: initialData?.meta_title_en || '',
    meta_description_en: initialData?.meta_description_en || '',
  });

  // Images State
  const [images, setImages] = useState<Array<{ url: string; alt_text_fr: string; alt_text_en: string }>>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images.map((img: any) => ({
          url: img.url,
          alt_text_fr: img.alt_text_fr || '',
          alt_text_en: img.alt_text_en || '',
        }))
      : [
          {
            url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
            alt_text_fr: 'Création haute fourrure atelier parisien',
            alt_text_en: 'Haute fourrure piece crafted in Paris atelier',
          },
        ]
  );

  // Variants Matrix State
  const [variants, setVariants] = useState<Array<{ size: string; sku: string; stock_quantity: number }>>(
    initialData?.variants && initialData.variants.length > 0
      ? initialData.variants.map((v: any) => ({
          size: v.size,
          sku: v.sku,
          stock_quantity: v.stock_quantity ?? 1,
        }))
      : [
          { size: '36', sku: `${formData.sku}-36`, stock_quantity: 2 },
          { size: '38', sku: `${formData.sku}-38`, stock_quantity: 2 },
          { size: '40', sku: `${formData.sku}-40`, stock_quantity: 2 },
        ]
  );

  const frFilled = Boolean(formData.name_fr && formData.slug && formData.description_fr);
  const enFilled = Boolean(formData.name_en && formData.slug_en && formData.description_en);

  const handleTextChange = (field: string, val: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: val };
      // Auto-generate French slug if empty
      if (field === 'name_fr' && (!prev.slug || !isEdit)) {
        updated.slug = val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      // Auto-generate English slug if empty
      if (field === 'name_en' && (!prev.slug_en || !isEdit)) {
        updated.slug_en = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'TU', sku: `${formData.sku}-${prev.length + 1}`, stock_quantity: 1 },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Strict validation of Dual-Language Mandate
    if (!formData.name_fr || !formData.slug || !formData.description_fr) {
      setError('Erreur Mandat Bilingue: Les champs français (Nom, Slug, Description) sont obligatoires.');
      setActiveLocale('fr');
      return;
    }

    if (!formData.name_en || !formData.slug_en || !formData.description_en) {
      setError('Erreur Mandat Bilingue: Les champs anglais (Name, English Slug, Description) sont obligatoires.');
      setActiveLocale('en');
      return;
    }

    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images,
          variants,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de l’enregistrement du produit.');
      }

      setSuccess(true);
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au Catalogue</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl text-primary font-normal tracking-wide">
            {isEdit ? `Modifier: ${formData.name_fr}` : 'Créer une Pièce d’Exception'}
          </h1>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEdit ? 'Enregistrer les Modifications' : 'Créer le Produit (FR/EN)'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-500/60 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Dual Language Tab Section */}
      <div className="bg-surface/60 border border-border/80 p-6 space-y-6">
        <DualLanguageTabs
          activeLocale={activeLocale}
          onLocaleChange={setActiveLocale}
          frFilled={frFilled}
          enFilled={enFilled}
        />

        {activeLocale === 'fr' ? (
          /* French Tab Content */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Nom du Produit (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_fr}
                  onChange={(e) => handleTextChange('name_fr', e.target.value)}
                  placeholder="ex: Manteau en Vison Noir Impérial"
                  className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Slug URL Français (Généré) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleTextChange('slug', e.target.value)}
                  placeholder="ex: manteau-vison-noir"
                  className="w-full bg-background border border-border p-2.5 text-xs font-mono text-primary focus:border-gold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted font-medium">
                Description Poétique & Technique (Français) *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description_fr}
                onChange={(e) => handleTextChange('description_fr', e.target.value)}
                placeholder="Décrivez la texture, le lustre du poil, la doublure en soie..."
                className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted font-medium">
                Conseils d'Entretien (Français)
              </label>
              <input
                type="text"
                value={formData.care_instructions_fr}
                onChange={(e) => handleTextChange('care_instructions_fr', e.target.value)}
                className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/40">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Meta Title SEO (Français)
                </label>
                <input
                  type="text"
                  value={formData.meta_title_fr}
                  onChange={(e) => handleTextChange('meta_title_fr', e.target.value)}
                  placeholder="ex: Manteau en Vison Noir | L'Hermine et le Vair"
                  className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Meta Description SEO (Français)
                </label>
                <input
                  type="text"
                  value={formData.meta_description_fr}
                  onChange={(e) => handleTextChange('meta_description_fr', e.target.value)}
                  className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        ) : (
          /* English Tab Content */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => handleTextChange('name_en', e.target.value)}
                  placeholder="e.g. Imperial Black Mink Coat"
                  className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  English URL Slug (Generated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug_en}
                  onChange={(e) => handleTextChange('slug_en', e.target.value)}
                  placeholder="e.g. black-mink-coat"
                  className="w-full bg-background border border-border p-2.5 text-xs font-mono text-primary focus:border-gold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted font-medium">
                Editorial Description (English) *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description_en}
                onChange={(e) => handleTextChange('description_en', e.target.value)}
                placeholder="Describe the pelts, liquid drape, Lyon silk lining..."
                className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted font-medium">
                Care Instructions (English)
              </label>
              <input
                type="text"
                value={formData.care_instructions_en}
                onChange={(e) => handleTextChange('care_instructions_en', e.target.value)}
                className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/40">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Meta Title SEO (English)
                </label>
                <input
                  type="text"
                  value={formData.meta_title_en}
                  onChange={(e) => handleTextChange('meta_title_en', e.target.value)}
                  placeholder="e.g. Black Mink Coat | L'Hermine et le Vair"
                  className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Meta Description SEO (English)
                </label>
                <input
                  type="text"
                  value={formData.meta_description_en}
                  onChange={(e) => handleTextChange('meta_description_en', e.target.value)}
                  className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Commercial & Technical Specs Card */}
      <div className="bg-surface/60 border border-border/80 p-6 space-y-6">
        <h2 className="font-serif text-lg text-primary font-normal border-b border-border/60 pb-3">
          Caractéristiques Commerciales & Atelier
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted font-medium">
              Référence SKU Maître *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => handleTextChange('sku', e.target.value)}
              className="w-full bg-background border border-border p-2.5 text-xs font-mono text-primary focus:border-gold focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted font-medium">
              Prix de Vente (€ TTC) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.price_amount}
              onChange={(e) => handleTextChange('price_amount', Number(e.target.value))}
              className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted font-medium">
              Matière Noble *
            </label>
            <select
              value={formData.material}
              onChange={(e) => handleTextChange('material', e.target.value)}
              className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden capitalize"
            >
              <option value="vison">Vison</option>
              <option value="renard">Renard</option>
              <option value="chinchilla">Chinchilla</option>
              <option value="cachemire">Cachemire</option>
              <option value="hermine">Hermine</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted font-medium">
              Catégorie de Rattachement *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => handleTextChange('category_id', e.target.value)}
              className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
            >
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_fr} ({cat.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted font-medium">
              Statut Commercial
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleTextChange('status', e.target.value)}
              className="w-full bg-background border border-border p-2.5 text-xs text-primary focus:border-gold focus:outline-hidden"
            >
              <option value="active">Actif (Publié)</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_best_seller"
              checked={formData.is_best_seller}
              onChange={(e) => handleTextChange('is_best_seller', e.target.checked)}
              className="w-4 h-4 rounded-xs border-border bg-background text-gold focus:ring-gold"
            />
            <label htmlFor="is_best_seller" className="text-xs uppercase tracking-wider text-primary font-medium cursor-pointer">
              Mettre en avant (Best-Seller)
            </label>
          </div>
        </div>
      </div>

      {/* Visual Media Card */}
      <div className="bg-surface/60 border border-border/80 p-6 space-y-4">
        <h2 className="font-serif text-lg text-primary font-normal border-b border-border/60 pb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gold" />
          <span>Visuels & Textes Alternatifs Bilingues</span>
        </h2>

        {images.map((img, idx) => (
          <div key={idx} className="p-4 bg-background/80 border border-border/60 space-y-3">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-muted font-medium">
                URL de la Photographie *
              </label>
              <input
                type="url"
                required
                value={img.url}
                onChange={(e) => {
                  const val = e.target.value;
                  setImages((prev) => prev.map((item, i) => (i === idx ? { ...item, url: val } : item)));
                }}
                className="w-full bg-surface border border-border p-2 text-xs font-mono text-primary focus:border-gold focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Texte Alt (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={img.alt_text_fr}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImages((prev) => prev.map((item, i) => (i === idx ? { ...item, alt_text_fr: val } : item)));
                  }}
                  placeholder="Description pour accessibilité en français"
                  className="w-full bg-surface border border-border p-2 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted font-medium">
                  Alt Text (English) *
                </label>
                <input
                  type="text"
                  required
                  value={img.alt_text_en}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImages((prev) => prev.map((item, i) => (i === idx ? { ...item, alt_text_en: val } : item)));
                  }}
                  placeholder="Accessibility description in English"
                  className="w-full bg-surface border border-border p-2 text-xs text-primary focus:border-gold focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Variants & Stock Matrix Card */}
      <div className="bg-surface/60 border border-border/80 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="font-serif text-lg text-primary font-normal">
            Tailles & Stocks Atelier
          </h2>
          <button
            type="button"
            onClick={handleAddVariant}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold hover:text-primary transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter Taille</span>
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-background/80 p-3 border border-border/60">
              <div className="w-24 space-y-1">
                <label className="text-[10px] uppercase text-muted">Taille</label>
                <input
                  type="text"
                  value={v.size}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVariants((prev) => prev.map((item, i) => (i === idx ? { ...item, size: val } : item)));
                  }}
                  className="w-full bg-surface border border-border p-1.5 text-xs text-primary focus:border-gold focus:outline-hidden uppercase"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-[10px] uppercase text-muted">SKU Variante</label>
                <input
                  type="text"
                  value={v.sku}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVariants((prev) => prev.map((item, i) => (i === idx ? { ...item, sku: val } : item)));
                  }}
                  className="w-full bg-surface border border-border p-1.5 text-xs font-mono text-primary focus:border-gold focus:outline-hidden"
                />
              </div>

              <div className="w-28 space-y-1">
                <label className="text-[10px] uppercase text-muted">Stock Unités</label>
                <input
                  type="number"
                  min="0"
                  value={v.stock_quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVariants((prev) => prev.map((item, i) => (i === idx ? { ...item, stock_quantity: val } : item)));
                  }}
                  className="w-full bg-surface border border-border p-1.5 text-xs text-primary focus:border-gold focus:outline-hidden font-mono"
                />
              </div>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="text-muted hover:text-rose-400 p-1 mt-4"
                  title="Supprimer la taille"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
