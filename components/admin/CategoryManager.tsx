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
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-medium rounded-sm shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvelle Catégorie (FR/EN)</span>
        </button>
      </div>

      {/* Categories Hierarchy Table */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-md overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[10px]">
              <th className="py-2.5 px-4 font-medium">Nom Français</th>
              <th className="py-2.5 px-4 font-medium">English Name</th>
              <th className="py-2.5 px-4 font-medium">Slug FR</th>
              <th className="py-2.5 px-4 font-medium">Slug EN</th>
              <th className="py-2.5 px-4 font-medium">Type / Niveau</th>
              <th className="py-2.5 px-4 text-right font-medium">Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {parentCategories.map((parent) => {
              const children = categories.filter((c) => c.parent_id === parent.id);
              return (
                <React.Fragment key={parent.id}>
                  {/* Parent Category Row */}
                  <tr className="bg-white hover:bg-slate-50/80 transition-colors font-medium">
                    <td className="py-3 px-4 text-slate-900 flex items-center gap-2 font-semibold">
                      <FolderTree className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{parent.name_fr}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic">{parent.name_en}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">{parent.slug}</td>
                    <td className="py-3 px-4 font-mono font-medium text-indigo-600">{parent.slug_en || '—'}</td>
                    <td className="py-3 px-4 text-slate-500 uppercase text-[10px]">
                      Racine ({parent.kind})
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">{parent.position}</td>
                  </tr>

                  {/* Sub-categories */}
                  {children.map((child) => (
                    <tr key={child.id} className="bg-slate-50/30 hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 pl-10 text-slate-800 font-medium">
                        <span className="text-slate-400 mr-1.5">└</span>
                        {child.name_fr}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 italic">{child.name_en}</td>
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-700">{child.slug}</td>
                      <td className="py-2.5 px-4 font-mono text-xs text-indigo-600">{child.slug_en || '—'}</td>
                      <td className="py-2.5 px-4 text-slate-400 text-[10px]">Sous-catégorie</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500">{child.position}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-md max-w-lg w-full p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-bold text-base text-slate-900">
                Créer une Catégorie Bilingue
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs font-medium">
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
                    <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
                      Nom Français *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name_fr}
                      onChange={(e) => handleTextChange('name_fr', e.target.value)}
                      placeholder="ex: Manteaux en Cachemire"
                      className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden rounded-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
                      Slug Français (Généré) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => handleTextChange('slug', e.target.value)}
                      placeholder="ex: manteaux-en-cachemire"
                      className="w-full bg-white border border-slate-300 p-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:outline-hidden rounded-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
                      English Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name_en}
                      onChange={(e) => handleTextChange('name_en', e.target.value)}
                      placeholder="e.g. Cashmere Coats"
                      className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden rounded-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
                      English Slug (Generated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.slug_en}
                      onChange={(e) => handleTextChange('slug_en', e.target.value)}
                      placeholder="e.g. cashmere-coats"
                      className="w-full bg-white border border-slate-300 p-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:outline-hidden rounded-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
                    Catégorie Parente
                  </label>
                  <select
                    value={form.parent_id}
                    onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden rounded-sm"
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
                  <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">Type</label>
                  <select
                    value={form.kind}
                    onChange={(e) => setForm({ ...form, kind: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden rounded-sm"
                  >
                    <option value="type">Type de vêtement</option>
                    <option value="material">Matière noble</option>
                    <option value="season">Saison / Édition</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 rounded-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-semibold rounded-sm shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
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
