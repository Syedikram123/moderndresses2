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
  isPriceHidden,
  isOutOfStock
}: WhatsAppMessageParams): string {
  const cleanPhone = sanitizePhoneNumber(whatsappNumber);
  
  let introLine: string;
  if (isOutOfStock) {
    introLine = "Hi, I noticed this product is marked out of stock. Could you please let me know if it can be ordered or if similar styles are available?";
  } else if (isPriceHidden) {
    introLine = "Hi, I'm interested in this product and would like to know the price and details.";
  } else {
    introLine = "Hi, I'm interested in this product. Can I get more details?";
  }

    const lines = [
    introLine,
    "",
    currentUrl,
    "",
  ];

  if (selectedColour) {
    lines.push(`Colour: ${selectedColour}`);
  }

  if (selectedSize) {
    lines.push(`Size: ${selectedSize}`);
  }

  const fullMessage = lines.join("\n");
  const encodedMessage = encodeURIComponent(fullMessage);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateGeneralInquiryWhatsAppUrl(whatsappNumber: string, storeName: string = "Modern Dresses"): string {
  const cleanPhone = sanitizePhoneNumber(whatsappNumber);
  const message = `Hi ${storeName}, I would like to enquire about your latest fashion collections.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
