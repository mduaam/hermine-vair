'use client';
// CLIENT: interactive category hierarchy manager with dual-language French/English slugs

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Tag, FolderTree, Loader2, Edit, Check } from 'lucide-react';
import { DualLanguageTabs } from './DualLanguageTabs';

interface CategoryManagerProps {
  categories: any[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [activeLocale, setActiveLocale] = useState<'fr' | 'en'>('fr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name_fr: '',
    slug: '',
    name_en: '',
    slug_en: '',
    parent_id: '',
    kind: 'type',
    position: categories.length + 1,
  });

  const parentCategories = categories.filter((c) => !c.parent_id);

  const handleOpenModal = () => {
    setForm({
      name_fr: '',
      slug: '',
      name_en: '',
      slug_en: '',
      parent_id: '',
      kind: 'type',
      position: categories.length + 1,
    });
    setError(null);
    setShowModal(true);
  };

  const handleTextChange = (field: string, val: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (field === 'name_fr' && !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      if (field === 'name_en' && !prev.slug_en) {
        updated.slug_en = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_fr || !form.slug || !form.name_en || !form.slug_en) {
      setError('Les champs français et anglais sont obligatoires (Mandat Bilingue).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de la création de la catégorie.');
      }

      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvelle Catégorie (FR/EN)</span>
        </button>
      </div>

      {/* Categories Hierarchy Table */}
      <div className="bg-surface/60 border border-border/80 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface border-b border-border text-muted uppercase tracking-wider">
              <th className="py-3.5 px-4 font-medium">Nom Français</th>
              <th className="py-3.5 px-4 font-medium">English Name</th>
              <th className="py-3.5 px-4 font-medium">Slug FR</th>
              <th className="py-3.5 px-4 font-medium">Slug EN</th>
              <th className="py-3.5 px-4 font-medium">Type / Niveau</th>
              <th className="py-3.5 px-4 text-right font-medium">Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {parentCategories.map((parent) => {
              const children = categories.filter((c) => c.parent_id === parent.id);
              return (
                <React.Fragment key={parent.id}>
                  {/* Parent Category Row */}
                  <tr className="bg-background/40 hover:bg-surface/80 transition-colors font-medium">
                    <td className="py-3 px-4 text-primary flex items-center gap-2">
                      <FolderTree className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{parent.name_fr}</span>
                    </td>
                    <td className="py-3 px-4 text-muted italic">{parent.name_en}</td>
                    <td className="py-3 px-4 font-mono text-primary/80">{parent.slug}</td>
                    <td className="py-3 px-4 font-mono text-gold/90">{parent.slug_en || '—'}</td>
                    <td className="py-3 px-4 text-muted uppercase text-[10px]">
                      Racine ({parent.kind})
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-muted">{parent.position}</td>
                  </tr>

                  {/* Sub-categories */}
                  {children.map((child) => (
                    <tr key={child.id} className="hover:bg-surface/60 transition-colors">
                      <td className="py-2.5 px-4 pl-10 text-primary">
                        <span className="text-muted mr-1.5">└</span>
                        {child.name_fr}
                      </td>
                      <td className="py-2.5 px-4 text-muted italic">{child.name_en}</td>
                      <td className="py-2.5 px-4 font-mono text-xs text-primary/70">{child.slug}</td>
                      <td className="py-2.5 px-4 font-mono text-xs text-gold/80">{child.slug_en || '—'}</td>
                      <td className="py-2.5 px-4 text-muted/70 text-[10px]">Sous-catégorie</td>
                      <td className="py-2.5 px-4 text-right font-mono text-muted">{child.position}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#111111] border border-border max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-lg text-primary font-normal">
                Créer une Catégorie Bilingue
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted hover:text-primary text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/60 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <DualLanguageTabs
                activeLocale={activeLocale}
                onLocaleChange={setActiveLocale}
                frFilled={Boolean(form.name_fr && form.slug)}
                enFilled={Boolean(form.name_en && form.slug_en)}
              />

              {activeLocale === 'fr' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted">
                      Nom Français *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name_fr}
                      onChange={(e) => handleTextChange('name_fr', e.target.value)}
                      placeholder="ex: Manteaux en Cachemire"
                      className="w-full bg-background border border-border p-2 text-xs text-primary focus:border-gold focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted">
                      Slug Français (Généré) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => handleTextChange('slug', e.target.value)}
                      placeholder="ex: manteaux-en-cachemire"
                      className="w-full bg-background border border-border p-2 text-xs font-mono text-primary focus:border-gold focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted">
                      English Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name_en}
                      onChange={(e) => handleTextChange('name_en', e.target.value)}
                      placeholder="e.g. Cashmere Coats"
                      className="w-full bg-background border border-border p-2 text-xs text-primary focus:border-gold focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted">
                      English Slug (Generated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.slug_en}
                      onChange={(e) => handleTextChange('slug_en', e.target.value)}
                      placeholder="e.g. cashmere-coats"
                      className="w-full bg-background border border-border p-2 text-xs font-mono text-primary focus:border-gold focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted">
                    Catégorie Parente
                  </label>
                  <select
                    value={form.parent_id}
                    onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                    className="w-full bg-background border border-border p-2 text-xs text-primary focus:border-gold focus:outline-hidden"
                  >
                    <option value="">Aucune (Catégorie Racine)</option>
                    {parentCategories.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name_fr} ({p.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted">Type</label>
                  <select
                    value={form.kind}
                    onChange={(e) => setForm({ ...form, kind: e.target.value })}
                    className="w-full bg-background border border-border p-2 text-xs text-primary focus:border-gold focus:outline-hidden"
                  >
                    <option value="type">Type de vêtement</option>
                    <option value="material">Matière noble</option>
                    <option value="season">Saison / Édition</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface border border-border text-xs uppercase tracking-wider text-muted hover:text-primary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Créer la Catégorie</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
