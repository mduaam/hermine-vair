import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  Download,
} from 'lucide-react';
import { getAdminCustomerById } from '@/lib/supabase/queries/admin';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata = {
  title: 'Détail Client | Administration',
};

export const dynamic = 'force-dynamic';

interface CustomerDetailPageProps {
  params: { id: string };
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const customer = await getAdminCustomerById(params.id);

  if (!customer) {
    notFound();
  }

  const addresses = customer.addresses || [];
  const orders = customer.orders || [];
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à la liste des clients</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center font-serif text-lg">
              {customer.first_name ? customer.first_name[0] : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
                  {customer.first_name} {customer.last_name}
                </h1>
                {customer.marketing_opt_in && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 border border-gold/30">
                    <ShieldCheck className="w-3 h-3" /> Cercle Privé
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Client depuis le {new Date(customer.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right border-l border-border/60 pl-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Dépenses Totales</div>
              <div className="font-serif text-lg text-foreground font-medium">
                {formatPrice(totalSpent, customer.preferred_currency || 'EUR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Orders History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border/60 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <h2 className="font-serif text-base text-primary font-medium tracking-wide flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Commandes Passées ({orders.length})</span>
              </h2>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center font-sans">
                Aucune commande enregistrée pour ce client.
              </p>
            ) : (
              <div className="divide-y divide-border/40">
                {orders.map((ord: any) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="font-medium text-foreground hover:text-gold hover:underline"
                        >
                          {ord.order_number}
                        </Link>
                        <StatusBadge type="order" status={ord.status} />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(ord.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      {ord.items && ord.items.length > 0 && (
                        <div className="text-xs text-muted-foreground font-sans">
                          {ord.items.map((it: any) => it.product_name_snapshot).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="font-mono text-sm font-medium text-foreground">
                        {formatPrice(ord.total, customer.preferred_currency || 'EUR')}
                      </div>
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs text-primary hover:text-gold hover:underline transition-colors"
                      >
                        Détail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GDPR / Compliance Block */}
          <div className="bg-surface border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-serif text-sm font-medium border-b border-border/40 pb-3 mb-4">
              <ShieldAlert className="w-4 h-4 text-gold" />
              <span>Conformité RGPD & Données Personnelles</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              En vertu de la réglementation européenne sur la protection des données (RGPD), le client dispose d'un droit d'accès, de rectification et d'effacement de ses informations personnelles.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/40 border border-border/60 text-foreground text-xs hover:bg-muted/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter l'archive client (JSON)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Addresses */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-surface border border-border/60 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-sm text-primary font-medium tracking-wide border-b border-border/40 pb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <span>Coordonnées</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Email</span>
                <span className="font-medium text-foreground">{customer.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Téléphone</span>
                <span className="font-medium text-foreground">{customer.phone || 'Non renseigné'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Langue</span>
                  <span className="font-medium uppercase text-foreground">{customer.locale || 'fr'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Devise</span>
                  <span className="font-medium text-foreground">{customer.preferred_currency || 'EUR'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-surface border border-border/60 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-sm text-primary font-medium tracking-wide border-b border-border/40 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Adresses de Livraison</span>
            </h3>

            {addresses.length === 0 ? (
              <p className="text-xs text-muted-foreground">Aucune adresse sauvegardée.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr: any) => (
                  <div key={addr.id} className="p-3 bg-muted/20 border border-border/40 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{addr.label || 'Adresse principale'}</span>
                      {addr.is_default_shipping && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 bg-gold/15 text-gold border border-gold/30">
                          Défaut
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground font-sans pt-1">
                      <div>{addr.full_name}</div>
                      <div>{addr.line1}</div>
                      {addr.line2 && <div>{addr.line2}</div>}
                      <div>{addr.postal_code} {addr.city}</div>
                      <div>{addr.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
