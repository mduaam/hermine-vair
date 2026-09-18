'use client';
// CLIENT: interactive concierge contact form

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface ContactClientViewProps {
  locale: string;
}

export function ContactClientView({ locale }: ContactClientViewProps) {
  const isEn = locale === 'en';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Conseil & Commande Spéciale',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Submission failed');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: 'Conseil & Commande Spéciale',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          (isEn
            ? 'An error occurred. Please reach us at contact@lhermineetlevair.com'
            : 'Une erreur est survenue. Vous pouvez nous écrire directement à contact@lhermineetlevair.com')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
      {/* Contact Details & Salons */}
      <div className="lg:col-span-5 bg-surface border border-border p-8 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
            {isEn ? 'Private Appointments' : 'Salons Privés'}
          </p>
          <h2 className="font-serif text-2xl text-primary font-normal">
            {isEn ? 'The Paris Concierge' : 'La Conciergerie Parisienne'}
          </h2>
          <p className="font-sans text-sm text-muted font-light leading-relaxed">
            {isEn
              ? 'Our advisors welcome you for private fittings, custom orders, and heirloom restorations.'
              : 'Nos conseillers vous reçoivent sur rendez-vous pour un essayage privé, une commande sur-mesure ou l’entretien de vos pièces.'}
          </p>
        </div>

        <div className="space-y-6 text-sm text-muted font-light">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-primary font-medium">{isEn ? 'Address' : 'Adresse'}</p>
              <p>15 Rue de la Paix, 75002 Paris, France</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-primary font-medium">{isEn ? 'Telephone' : 'Téléphone'}</p>
              <p>+33 (0)1 42 68 00 00</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-primary font-medium">{isEn ? 'Direct Inquiries' : 'Correspondance'}</p>
              <p>concierge@lhermineetlevair.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-primary font-medium">{isEn ? 'Opening Hours' : 'Horaires'}</p>
              <p>
                {isEn
                  ? 'Monday – Saturday: 10:00 – 19:30 (CET)'
                  : 'Lundi – Samedi : 10h00 – 19h30'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="lg:col-span-7 bg-surface border border-border p-8 space-y-6">
        <h2 className="font-serif text-2xl text-primary font-normal">
          {isEn ? 'Send an Inquiry' : 'Formuler une Demande'}
        </h2>

        {success ? (
          <div className="p-8 bg-background border border-gold/40 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-gold mx-auto" />
            <h3 className="font-serif text-xl text-primary">
              {isEn ? 'Thank You' : 'Message Transmis'}
            </h3>
            <p className="font-sans text-sm text-muted font-light leading-relaxed">
              {isEn
                ? 'Your inquiry has been relayed to our head concierge. We will respond within 24 business hours.'
                : 'Votre demande a été transmise à notre chef de conciergerie. Nous vous répondrons sous 24 heures ouvrées.'}
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="text-xs uppercase tracking-widest text-gold hover:underline pt-2"
            >
              {isEn ? 'Send another message' : 'Envoyer un autre message'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-900/10 border border-red-800 text-red-400 text-xs font-sans">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted">
                  {isEn ? 'Full Name *' : 'Nom & Prénom *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border text-sm text-primary focus:outline-none focus:border-gold transition-colors"
                  placeholder="Madame Claire de V."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted">
                  {isEn ? 'Email Address *' : 'Adresse Email *'}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border text-sm text-primary focus:outline-none focus:border-gold transition-colors"
                  placeholder="claire@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-muted">
                {isEn ? 'Subject *' : 'Objet de la Demande *'}
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border text-sm text-primary focus:outline-none focus:border-gold transition-colors"
              >
                <option value="Conseil & Commande Spéciale">
                  {isEn ? 'Styling Advice & Special Order' : 'Conseil de Style & Commande Spéciale'}
                </option>
                <option value="Prise de Rendez-vous Atelier">
                  {isEn ? 'Private Atelier Appointment' : 'Prise de Rendez-vous en Salon Privé'}
                </option>
                <option value="Gardiennage Estival">
                  {isEn ? 'Summer Cold Vault Storage' : 'Gardiennage Estival en Chambre Forte'}
                </option>
                <option value="Suivi de Commande & Livraison">
                  {isEn ? 'Order Tracking & Courier Delivery' : 'Suivi de Commande & Livraison'}
                </option>
                <option value="Autre Demande">{isEn ? 'Other Inquiry' : 'Autre Demande'}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-muted">
                {isEn ? 'Your Message *' : 'Votre Message *'}
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border text-sm text-primary focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder={
                  isEn
                    ? 'How may our Parisian concierge assist you today?'
                    : 'Comment notre conciergerie peut-elle vous accompagner ?'
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'Sending...' : 'Transmission...'}</span>
                </>
              ) : (
                <span>{isEn ? 'Transmit Request' : 'Transmettre la Demande'}</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
