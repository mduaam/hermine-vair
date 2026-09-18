import { resend } from '@/lib/resend/client';

export interface OrderItemEmail {
  name: string;
  size: string;
  quantity: number;
  unitPrice: string;
  total?: string;
  imageUrl?: string;
}

export interface OrderConfirmationEmailProps {
  locale: 'fr' | 'en';
  orderNumber: string;
  customerName: string;
  items: OrderItemEmail[];
  subtotal: string;
  shippingTotal: string;
  total: string;
  currency: string;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    postalCode: string;
    country: string;
  };
  orderUrl?: string;
}

export async function sendOrderConfirmation(
  recipientEmail: string,
  data: OrderConfirmationEmailProps
): Promise<{ success: boolean; id?: string; error?: unknown }> {
  const isEn = data.locale === 'en';

  const subject = isEn
    ? `Order Confirmation · ${data.orderNumber} — L’Hermine et le Vair`
    : `Confirmation de votre commande · ${data.orderNumber} — L’Hermine et le Vair`;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid #E5DFD7; font-family: 'Playfair Display', Georgia, serif; font-size: 14px; color: #1C1917;">
          <strong>${item.name}</strong><br />
          <span style="font-family: 'Inter', sans-serif; font-size: 11px; color: #A38268; text-transform: uppercase; letter-spacing: 0.1em;">
            ${isEn ? 'Size:' : 'Taille :'} ${item.size} · ${isEn ? 'Qty:' : 'Quantité :'} ${item.quantity}
          </span>
        </td>
        <td style="padding: 14px 0; border-bottom: 1px solid #E5DFD7; text-align: right; font-family: 'Playfair Display', Georgia, serif; font-size: 14px; color: #1C1917;">
          ${item.unitPrice}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${data.locale}">
      <head>
        <meta charset="utf-8" />
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F5F0; font-family: 'Inter', Arial, sans-serif; color: #1C1917; line-height: 1.6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F5F0; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E5DFD7; max-width: 600px; width: 100%; text-align: left;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #C89B5C;">
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 0.08em; color: #1C1917; text-transform: none;">
                      L’Hermine et le Vair
                    </div>
                    <div style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #A38268; margin-top: 6px;">
                      Paris · Haute Fourrure
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 40px 40px 20px;">
                    <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C89B5C; font-weight: 600; margin-bottom: 8px;">
                      ${isEn ? 'Official Haute Couture Receipt' : 'Récépissé de Commande d’Atelier'}
                    </div>

                    <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: normal; margin: 0 0 16px; color: #1C1917;">
                      ${isEn ? `Dear Client,` : `Chère Cliente, Cher Client,`}
                    </h1>

                    <p style="font-size: 13px; color: #4A4642; margin-bottom: 24px;">
                      ${
                        isEn
                          ? `We have the honor to confirm the receipt of your order <strong>${data.orderNumber}</strong>. Your commission has been registered and transmitted to our master furriers in Paris.`
                          : `Nous avons l'honneur de vous confirmer la prise en compte de votre commande <strong>${data.orderNumber}</strong>. Votre acquisition est désormais confiée à nos maîtres artisans fourreurs au sein de nos ateliers parisiens.`
                      }
                    </p>

                    <!-- Items Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <thead>
                        <tr>
                          <th style="padding-bottom: 10px; border-bottom: 1px solid #1C1917; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #1C1917; text-align: left;">
                            ${isEn ? 'Creation' : 'Création'}
                          </th>
                          <th style="padding-bottom: 10px; border-bottom: 1px solid #1C1917; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #1C1917; text-align: right;">
                            ${isEn ? 'Total' : 'Montant'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>

                    <!-- Totals Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; font-size: 13px;">
                      <tr>
                        <td style="padding: 6px 0; color: #4A4642;">${isEn ? 'Subtotal' : 'Sous-total'}</td>
                        <td style="padding: 6px 0; text-align: right; color: #1C1917; font-family: 'Playfair Display', Georgia, serif;">${data.subtotal}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #4A4642;">${isEn ? 'Insured White-Glove Courier' : 'Livraison Haute Sécurité Scellée'}</td>
                        <td style="padding: 6px 0; text-align: right; color: #C89B5C; font-weight: 600; text-transform: uppercase; font-size: 11px;">${isEn ? 'Complimentary' : 'Offerte'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 6px; border-top: 1px solid #1C1917; font-weight: 600; font-size: 15px; color: #1C1917;">${isEn ? 'Total' : 'Total'}</td>
                        <td style="padding: 12px 0 6px; border-top: 1px solid #1C1917; text-align: right; font-weight: 600; font-size: 18px; color: #1C1917; font-family: 'Playfair Display', Georgia, serif;">${data.total}</td>
                      </tr>
                    </table>

                    <!-- Delivery Address Box -->
                    <div style="background-color: #F8F5F0; border: 1px solid #E5DFD7; padding: 20px; margin-bottom: 30px; font-size: 12px; color: #4A4642;">
                      <div style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #1C1917; font-weight: 600; margin-bottom: 8px;">
                        ${isEn ? 'Delivery Address' : 'Adresse de Destination'}
                      </div>
                      <div><strong>${data.shippingAddress.fullName}</strong></div>
                      <div>${data.shippingAddress.line1}</div>
                      ${data.shippingAddress.line2 ? `<div>${data.shippingAddress.line2}</div>` : ''}
                      <div>${data.shippingAddress.postalCode} ${data.shippingAddress.city}</div>
                      <div style="text-transform: uppercase; margin-top: 4px; color: #A38268;">${data.shippingAddress.country}</div>
                    </div>

                    <!-- Concierge Assistance Note -->
                    <p style="font-size: 12px; color: #4A4642; line-height: 1.6; margin-bottom: 0;">
                      ${
                        isEn
                          ? `Our private concierge remains at your exclusive service for any specific customization or delivery appointment instructions:<br />
                             <strong>Telephone:</strong> +33 1 42 68 00 00<br />
                             <strong>Email:</strong> concierge@lhermineetlevair.com`
                          : `Notre conciergerie privée demeure à votre entière disposition pour tout renseignement ou instruction spécifique pour la remise de votre pli :<br />
                             <strong>Téléphone :</strong> +33 1 42 68 00 00<br />
                             <strong>Courriel :</strong> concierge@lhermineetlevair.com`
                      }
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #1C1917; padding: 24px 40px; text-align: center; font-size: 10px; letter-spacing: 0.1em; color: #F3EFE8;">
                    L’Hermine et le Vair Paris · 24 Place Vendôme, 75001 Paris<br />
                    ${isEn ? 'All furs are certified under the Furmark® global standard.' : 'Toutes nos fourrures sont certifiées selon le standard mondial Furmark®.'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, simulating order confirmation email log:');
      console.log(`[EMAIL to ${recipientEmail}]: Order ${data.orderNumber} confirmed.`);
      return { success: true };
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'concierge@lhermineetlevair.com',
      to: recipientEmail,
      subject,
      html: htmlContent,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error sending order confirmation email via Resend:', error);
    return { success: false, error };
  }
}
