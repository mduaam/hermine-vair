import { createAdminClient } from '@/lib/supabase/admin';
import { SEED_PRODUCTS, SEED_CATEGORIES } from './catalog';

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  lowStockItemsCount: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export async function getAdminDashboardMetrics(): Promise<AdminMetrics> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch Orders
    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_number, email, total, status, created_at')
      .order('created_at', { ascending: false });

    // 2. Fetch Products with variants
    const { data: products } = await supabase
      .from('products')
      .select('id, name_fr, name_en, slug, slug_en, price_amount, variants:product_variants(*)');

    const orderList = orders || [];
    const productList = products || SEED_PRODUCTS;

    const paidOrders = orderList.filter((o) =>
      ['paid', 'fulfilled', 'shipped', 'delivered'].includes(o.status)
    );

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = orderList.length;
    const pendingOrders = orderList.filter((o) => ['pending', 'paid'].includes(o.status)).length;
    const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

    // Find low stock products (< 3 items in any variant)
    const lowStockProducts: any[] = [];
    productList.forEach((prod: any) => {
      const totalStock = prod.variants?.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) ?? 0;
      if (totalStock <= 3) {
        lowStockProducts.push({
          id: prod.id,
          name: prod.name_fr || prod.name_en,
          stock: totalStock,
          slug: prod.slug,
        });
      }
    });

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      averageOrderValue,
      lowStockItemsCount: lowStockProducts.length,
      recentOrders: orderList.slice(0, 5),
      lowStockProducts: lowStockProducts.slice(0, 5),
    };
  } catch (err) {
    console.warn('[Admin Queries] Using fallback metrics:', err);
    return {
      totalRevenue: 24800,
      totalOrders: 6,
      pendingOrders: 2,
      averageOrderValue: 4133,
      lowStockItemsCount: 2,
      recentOrders: [
        {
          id: 'ord-seed-01',
          order_number: 'ORD-2026-0891',
          email: 'c.delacroix@haute-couture.fr',
          total: 7200,
          status: 'paid',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
        {
          id: 'ord-seed-02',
          order_number: 'ORD-2026-0890',
          email: 'eleanor.vane@mayfair-interiors.co.uk',
          total: 12500,
          status: 'fulfilled',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: 'ord-seed-03',
          order_number: 'ORD-2026-0889',
          email: 'sophie.monet@geneva-private.ch',
          total: 5100,
          status: 'delivered',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
      ],
      lowStockProducts: [
        {
          id: 'prod-vison-cognac',
          name: 'Manteau en Vison Cognac',
          stock: 2,
          slug: 'manteau-vison-cognac',
        },
        {
          id: 'prod-chinchilla-court',
          name: 'Veste en Chinchilla',
          stock: 1,
          slug: 'veste-chinchilla',
        },
      ],
    };
  }
}

export async function getAdminOrders(statusFilter?: string) {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*), shipping_address:addresses!shipping_address_id(*)')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching admin orders:', err);
  }

  // Fallback demo orders
  return [
    {
      id: 'ord-seed-01',
      order_number: 'ORD-2026-0891',
      email: 'c.delacroix@haute-couture.fr',
      locale: 'fr',
      currency: 'EUR',
      status: 'paid',
      subtotal: 7200,
      shipping_total: 0,
      total: 7200,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      items: [
        {
          id: 'item-01',
          product_name_snapshot: 'Manteau en Vison Noir Impérial (Taille 38)',
          quantity: 1,
          unit_price: 7200,
          total: 7200,
        },
      ],
    },
    {
      id: 'ord-seed-02',
      order_number: 'ORD-2026-0890',
      email: 'eleanor.vane@mayfair-interiors.co.uk',
      locale: 'en',
      currency: 'EUR',
      status: 'fulfilled',
      subtotal: 12500,
      shipping_total: 0,
      total: 12500,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      items: [
        {
          id: 'item-02',
          product_name_snapshot: 'Chinchilla Jacket (Size 38)',
          quantity: 1,
          unit_price: 12500,
          total: 12500,
        },
      ],
    },
    {
      id: 'ord-seed-03',
      order_number: 'ORD-2026-0889',
      email: 'sophie.monet@geneva-private.ch',
      locale: 'fr',
      currency: 'EUR',
      status: 'delivered',
      subtotal: 4800,
      shipping_total: 300,
      total: 5100,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      items: [
        {
          id: 'item-03',
          product_name_snapshot: 'Gilet en Renard Platine (Taille S)',
          quantity: 1,
          unit_price: 4800,
          total: 4800,
        },
      ],
    },
  ];
}

export async function getAdminOrderById(orderId: string) {
  try {
    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from('orders')
      .select('*, items:order_items(*), shipping_address:addresses!shipping_address_id(*), billing_address:addresses!billing_address_id(*), events:order_events(*), returns(*)')
      .eq('id', orderId)
      .maybeSingle();

    if (order) return order;
  } catch (err) {
    console.warn('[Admin Queries] Error fetching order by ID:', err);
  }

  // Fallback order for demo
  return {
    id: orderId,
    order_number: 'ORD-2026-0891',
    email: 'c.delacroix@haute-couture.fr',
    locale: 'fr',
    currency: 'EUR',
    status: 'paid',
    subtotal: 7200,
    shipping_total: 0,
    tax_total: 1200,
    total: 7200,
    payment_provider: 'stripe',
    payment_reference: 'pi_3P_demo_secret_token',
    notes: 'Livraison sur rendez-vous privé en matinée.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    shipping_address: {
      full_name: 'Comtesse Clothilde Delacroix',
      line1: '12 Place Vendôme',
      city: 'Paris',
      postal_code: '75001',
      country: 'FR',
      phone: '+33 1 42 68 00 00',
    },
    items: [
      {
        id: 'item-01',
        product_name_snapshot: 'Manteau en Vison Noir Impérial (Taille 38)',
        quantity: 1,
        unit_price: 7200,
        total: 7200,
      },
    ],
    events: [
      {
        id: 'evt-1',
        type: 'order_created',
        message: 'Commande enregistrée via Stripe Checkout.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: 'evt-2',
        type: 'payment_verified',
        message: 'Règlement de 7 200,00 € capturé avec succès.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3 + 1000 * 12).toISOString(),
      },
    ],
  };
}

export async function getAdminProductsList() {
  try {
    const supabase = createAdminClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
      .order('created_at', { ascending: false });

    if (!error && products && products.length > 0) {
      return products;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching admin products:', err);
  }

  return SEED_PRODUCTS.map((p) => {
    const cat = SEED_CATEGORIES.find((c) => c.id === p.category_id);
    return {
      ...p,
      category: cat,
    };
  });
}

export async function getAdminCategoriesList() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching admin categories:', err);
  }

  return SEED_CATEGORIES;
}

export async function getAdminDiscountsList() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching admin discounts:', err);
  }

  return [
    {
      id: 'disc-01',
      code: 'PRIVILEGE10',
      type: 'percentage',
      value: 10,
      min_order_amount: 3000,
      description_fr: 'Remise exclusive de 10% sur les commandes supérieures à 3 000 €.',
      description_en: 'Exclusive 10% privilege on orders exceeding €3,000.',
      active: true,
      starts_at: '2026-01-01T00:00:00Z',
      ends_at: '2026-12-31T23:59:59Z',
    },
    {
      id: 'disc-02',
      code: 'LIVRAISONCONCIERGE',
      type: 'free_shipping',
      value: 0,
      min_order_amount: 0,
      description_fr: 'Expédition haute sécurité offerte sur l’ensemble de la collection.',
      description_en: 'Complimentary high-security armored delivery across all collections.',
      active: true,
      starts_at: '2026-01-01T00:00:00Z',
      ends_at: null,
    },
  ];
}

export async function getAdminReviewsList(status?: string) {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from('reviews')
      .select('*, product:products(name_fr, name_en, slug)')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching admin reviews:', err);
  }

  return [
    {
      id: 'rev-seed-1',
      product_id: '30000000-0000-0000-0000-000000000001',
      customer_name: 'Éléonore de B.',
      rating: 5,
      title: 'Une pièce magistrale',
      body: 'Le toucher du vison est d’une douceur incomparable. La doublure en soie écru et la coupe en font un investissement pour toute une vie.',
      is_verified_purchase: true,
      status: 'approved',
      is_featured: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      product: {
        name_fr: 'Manteau en Vison Noir Impérial',
        name_en: 'Imperial Black Mink Coat',
        slug: 'manteau-vison-noir',
      },
    },
    {
      id: 'rev-seed-2',
      product_id: 'prod-renard-platine',
      customer_name: 'Claire M.',
      rating: 5,
      title: 'Légèreté et prestance',
      body: 'Gilet spectaculaire, porté aussi bien en journée sur une chemise blanche qu’en soirée. Les conseils du concierge étaient impeccables.',
      is_verified_purchase: true,
      status: 'pending',
      is_featured: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      product: {
        name_fr: 'Gilet en Renard Platine',
        name_en: 'Platinum Fox Vest',
        slug: 'gilet-renard-platine',
      },
    },
  ];
}

export async function getAdminAuditLogsList() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching audit logs:', err);
  }

  return [
    {
      id: 'aud-01',
      actor_id: '00000000-0000-0000-0000-000000000001',
      action: 'UPDATE_ORDER_STATUS',
      resource_type: 'order',
      resource_id: 'ORD-2026-0891',
      before: { status: 'paid' },
      after: { status: 'fulfilled' },
      ip: '127.0.0.1',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'aud-02',
      actor_id: '00000000-0000-0000-0000-000000000001',
      action: 'APPROVE_REVIEW',
      resource_type: 'review',
      resource_id: 'rev-seed-1',
      before: { status: 'pending' },
      after: { status: 'approved', is_featured: true },
      ip: '127.0.0.1',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'aud-03',
      actor_id: '00000000-0000-0000-0000-000000000001',
      action: 'UPDATE_STOCK',
      resource_type: 'product_variant',
      resource_id: 'var-rp-xs',
      before: { stock_quantity: 4 },
      after: { stock_quantity: 3 },
      ip: '127.0.0.1',
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
  ];
}

export async function getAdminComplianceRules() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('region_rules')
      .select('*')
      .order('country_code', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching region rules:', err);
  }

  return [
    { id: 'reg-fr', country_code: 'FR', fur_sales_allowed: true, currency: 'EUR', default_locale: 'fr', duties_note_fr: 'TVA 20% incluse', duties_note_en: 'VAT 20% included' },
    { id: 'reg-gb', country_code: 'GB', fur_sales_allowed: true, currency: 'GBP', default_locale: 'en', duties_note_fr: 'DDP - Douanes incluses', duties_note_en: 'DDP - Duties prepaid' },
    { id: 'reg-us', country_code: 'US', fur_sales_allowed: true, currency: 'USD', default_locale: 'en', duties_note_fr: 'Restreint en Californie (AB 44)', duties_note_en: 'Restricted in California (AB 44)' },
    { id: 'reg-ch', country_code: 'CH', fur_sales_allowed: true, currency: 'CHF', default_locale: 'fr', duties_note_fr: 'DDP rendu droits acquittés', duties_note_en: 'DDP Delivered Duty Paid' },
    { id: 'reg-il', country_code: 'IL', fur_sales_allowed: false, currency: 'USD', default_locale: 'en', duties_note_fr: 'Interdiction légale de vente de fourrure', duties_note_en: 'Strict statutory fur sales prohibition' },
  ];
}

export async function getAdminCustomersList() {
  try {
    const supabase = createAdminClient();
    const { data: profiles, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && profiles && profiles.length > 0) {
      // Enrich with orders count & spend
      const { data: orders } = await supabase.from('orders').select('customer_id, email, total, status');
      return profiles.map((p) => {
        const clientOrders = (orders || []).filter(
          (o) => o.customer_id === p.id && ['paid', 'fulfilled', 'shipped', 'delivered'].includes(o.status)
        );
        const total_spent = clientOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
        return {
          ...p,
          email: clientOrders[0]?.email || `${p.first_name?.toLowerCase() || 'client'}@exclusive-luxury.com`,
          orders_count: clientOrders.length,
          total_spent,
        };
      });
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching customers:', err);
  }

  return [
    {
      id: 'cust-01',
      first_name: 'Clothilde',
      last_name: 'Delacroix',
      email: 'c.delacroix@haute-couture.fr',
      phone: '+33 1 42 68 00 00',
      locale: 'fr',
      preferred_currency: 'EUR',
      marketing_opt_in: true,
      orders_count: 3,
      total_spent: 19400,
      created_at: '2025-11-10T14:20:00Z',
    },
    {
      id: 'cust-02',
      first_name: 'Eleanor',
      last_name: 'Vane',
      email: 'eleanor.vane@mayfair-interiors.co.uk',
      phone: '+44 20 7946 0912',
      locale: 'en',
      preferred_currency: 'GBP',
      marketing_opt_in: true,
      orders_count: 2,
      total_spent: 24300,
      created_at: '2025-12-04T09:15:00Z',
    },
    {
      id: 'cust-03',
      first_name: 'Sophie',
      last_name: 'Monet',
      email: 'sophie.monet@geneva-private.ch',
      phone: '+41 22 730 01 01',
      locale: 'fr',
      preferred_currency: 'CHF',
      marketing_opt_in: false,
      orders_count: 1,
      total_spent: 5100,
      created_at: '2026-01-18T16:45:00Z',
    },
  ];
}

export async function getAdminCustomerById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('*, addresses(*)')
      .eq('id', id)
      .maybeSingle();

    if (profile) {
      const { data: orders } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      return {
        ...profile,
        orders: orders || [],
      };
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching customer by ID:', err);
  }

  // Seed Fallback
  return {
    id,
    first_name: 'Clothilde',
    last_name: 'Delacroix',
    email: 'c.delacroix@haute-couture.fr',
    phone: '+33 1 42 68 00 00',
    locale: 'fr',
    preferred_currency: 'EUR',
    marketing_opt_in: true,
    created_at: '2025-11-10T14:20:00Z',
    addresses: [
      {
        id: 'addr-01',
        label: 'Hôtel Particulier',
        full_name: 'Clothilde Delacroix',
        line1: '12 Place Vendôme',
        city: 'Paris',
        postal_code: '75001',
        country: 'FR',
        is_default_shipping: true,
        is_default_billing: true,
      },
    ],
    orders: [
      {
        id: 'ord-seed-01',
        order_number: 'ORD-2026-0891',
        total: 7200,
        status: 'paid',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        items: [
          {
            id: 'item-01',
            product_name_snapshot: 'Manteau en Vison Noir Impérial (Taille 38)',
            quantity: 1,
            unit_price: 7200,
            total: 7200,
          },
        ],
      },
      {
        id: 'ord-seed-prev',
        order_number: 'ORD-2025-0412',
        total: 12200,
        status: 'delivered',
        created_at: '2025-11-15T10:00:00Z',
        items: [
          {
            id: 'item-prev',
            product_name_snapshot: 'Étole en Vison Sauvage',
            quantity: 1,
            unit_price: 12200,
            total: 12200,
          },
        ],
      },
    ],
  };
}

export async function getAdminStaffList() {
  try {
    const supabase = createAdminClient();
    const { data: staffList, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && staffList && staffList.length > 0) {
      return staffList;
    }
  } catch (err) {
    console.warn('[Admin Queries] Error fetching staff:', err);
  }

  return [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'alexandre.vair@hermine-vair.com',
      role: 'owner',
      active: true,
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'directeur.ateliers@hermine-vair.com',
      role: 'admin',
      active: true,
      created_at: '2025-02-15T00:00:00Z',
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'fourreur.maitre@hermine-vair.com',
      role: 'product_specialist',
      active: true,
      created_at: '2025-03-01T00:00:00Z',
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'logistique.paris@hermine-vair.com',
      role: 'order_manager',
      active: true,
      created_at: '2025-04-10T00:00:00Z',
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      email: 'redaction.journal@hermine-vair.com',
      role: 'content_editor',
      active: true,
      created_at: '2025-05-20T00:00:00Z',
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      email: 'conciergerie@hermine-vair.com',
      role: 'support_agent',
      active: true,
      created_at: '2025-06-01T00:00:00Z',
    },
  ];
}

