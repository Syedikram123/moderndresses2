import { Product } from '../types';

export function sanitizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return digits;
  }
  return digits || '918951337609';
}

export interface WhatsAppMessageParams {
  product: Product;
  selectedColour?: string;
  selectedSize?: string;
  currentUrl: string;
  whatsappNumber: string;
  isPriceHidden?: boolean;
  isOutOfStock?: boolean;
}

export function generateWhatsAppUrl({
  product,
  selectedColour,
  selectedSize,
  currentUrl,
  whatsappNumber,
}: WhatsAppMessageParams): string {
  const cleanPhone = sanitizePhoneNumber(whatsappNumber);

  const lines = [
    "Hi Modern Dresses 👋",
    "I’m interested in this product and would like to know the price and availability.",
    "",
    `*Product:* ${product.name}`,
    `*Colour:* ${selectedColour || "Not selected"}`,
    `*Size:* ${selectedSize || "Not selected"}`,
    "",
    "Please share the details. Thank you! 😊",
    "",
    "*🔗 Product Link :*",
    currentUrl,
  ];

  const fullMessage = lines.join("\n");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;
}