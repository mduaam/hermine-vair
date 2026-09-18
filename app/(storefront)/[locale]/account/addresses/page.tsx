'use client';
// CLIENT: Customer address book manager, add new address form and default toggles

import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getCustomerAddresses, saveAddress, deleteAddress, type Address } from '@/lib/supabase/queries/account';
import { Button } from '@/components/ui/Button';

interface AddressesPageProps {
  params: { locale: string };
}

export default function AccountAddressesPage({ params: { locale } }: AddressesPageProps) {
  const isEn = locale === 'en';
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Address Form State
  const [label, setLabel] = useState('');
  const [fullName, setFullName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('FR');
  const [isDefaultShipping, setIsDefaultShipping] = useState(true);

  async function loadAddresses(uid: string) {
    const data = await getCustomerAddresses(uid);
    setAddresses(data);
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      await loadAddresses(user.id);
    }

    init();
  }, []);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setErrorMsg(null);

    const saved = await saveAddress({
      customer_id: userId,
      label: label || (isEn ? 'Primary Residence' : 'Résidence Principale'),
      full_name: fullName,
      line1,
      line2: line2 || null,
      city,
      postal_code: postalCode,
      country,
      is_default_shipping: isDefaultShipping,
      is_default_billing: false,
    });

    if (saved) {
      setShowAddForm(false);
      setLabel('');
      setFullName('');
      setLine1('');
      setLine2('');
      setCity('');
      setPostalCode('');
      await loadAddresses(userId);
    } else {
      setErrorMsg(isEn ? 'Failed to save address.' : 'Impossible d’enregistrer cette adresse.');
    }
    setSaving(false);
  }

  async function handleDelete(addressId: string) {
    if (!userId) return;
    const ok = await deleteAddress(addressId);
    if (ok) {
      await loadAddresses(userId);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal/10 gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-black">
            {isEn ? 'Address Book' : 'Carnet d’Adresses Privilège'}
          </h2>
          <p className="text-xs text-charcoal mt-1">
            {isEn
              ? 'Addresses used for white-glove insured delivery and billing.'
              : 'Adresses enregistrées pour vos livraisons scellées et votre facturation.'}
          </p>
        </div>

        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-black bg-gold hover:bg-gold/90 px-4 py-2.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? 'Add Address' : 'Nouvelle Adresse'}</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-ivory border border-gold/40 p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-charcoal/10">
            <h3 className="font-serif text-lg text-black">
              {isEn ? 'Add New Address' : 'Ajouter une Adresse'}
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-charcoal hover:text-black uppercase tracking-wider"
            >
              {isEn ? 'Cancel' : 'Annuler'}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-medium text-black">
                  {isEn ? 'Label (e.g. Paris Residence)' : 'Libellé (ex. Hôtel Particulier Paris)'}
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={isEn ? 'Paris Apartment' : 'Appartement Paris 8e'}
                  className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-medium text-black">
                  {isEn ? 'Recipient Full Name' : 'Nom Complet du Destinataire'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider font-medium text-black">
                {isEn ? 'Street Address' : 'Adresse (Numéro et Voie)'}
              </label>
              <input
                type="text"
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="24 Place Vendôme"
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider font-medium text-black">
                {isEn ? 'Apartment, Suite (Optional)' : 'Bâtiment, Étage, Code (Optionnel)'}
              </label>
              <input
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="Bâtiment B, 3ème étage"
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-medium text-black">
                  {isEn ? 'Postal Code' : 'Code Postal'}
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="75001"
                  className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-medium text-black">
                  {isEn ? 'City' : 'Ville'}
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
                  className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-medium text-black">
                  {isEn ? 'Country' : 'Pays'}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                >
                  <option value="FR">France</option>
                  <option value="MC">Monaco</option>
                  <option value="CH">Suisse</option>
                  <option value="BE">Belgique</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="AE">United Arab Emirates</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal">
                <input
                  type="checkbox"
                  checked={isDefaultShipping}
                  onChange={(e) => setIsDefaultShipping(e.target.checked)}
                  className="accent-gold"
                />
                <span>{isEn ? 'Set as default delivery address' : 'Définir comme adresse de livraison par défaut'}</span>
              </label>
            </div>

            <Button type="submit" loading={saving} className="py-3 px-6 text-xs uppercase tracking-widest">
              {isEn ? 'Save Address' : 'Enregistrer l’Adresse'}
            </Button>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showAddForm ? (
        <div className="bg-ivory border border-charcoal/15 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center mx-auto text-taupe">
            <MapPin className="w-5 h-5 stroke-[1.2]" />
          </div>
          <p className="text-xs text-charcoal">
            {isEn ? 'You have no saved addresses.' : 'Vous n’avez aucune adresse enregistrée.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-ivory border border-charcoal/20 p-5 space-y-3 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-base font-medium text-black">
                    {addr.label || addr.full_name}
                  </h3>
                  {addr.is_default_shipping && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-gold/20 text-black border border-gold/40">
                      {isEn ? 'Default Delivery' : 'Livraison par Défaut'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  aria-label={isEn ? 'Delete address' : 'Supprimer l’adresse'}
                  className="p-1 text-charcoal/50 hover:text-black transition-colors"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              <div className="text-xs text-charcoal leading-relaxed space-y-0.5">
                <p className="font-medium text-black">{addr.full_name}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.postal_code} {addr.city}
                </p>
                <p className="uppercase tracking-wider text-[11px] text-taupe">{addr.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
