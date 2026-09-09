// Shared by the homepage, package builder, summary, and booking request.
// Existing published prices are preserved here.
export const STANDARD_PRICE = 175;
export const STANDARD_FEATURES = ['25–45 MLS-ready photos', '1 twilight photo', '2D black & white floor plans', '12-hour delivery', 'Private branded gallery', 'Light, color & exposure revisions'];
export const ADD_ONS = [
  { id: 'flyer', name: 'Custom Listing Flyer', price: 39, description: 'A property flyer for print and social media.' },
  { id: 'drone', name: 'Drone Photos & Video', price: 99, description: 'An aerial view of the property and its surroundings.' },
  { id: '3d_tour', name: '3D Virtual Tour', price: 99, description: 'An interactive walkthrough buyers can explore at their own pace.' },
  { id: 'video', name: 'Walkthrough/Cinematic Video', price: 179, description: 'A guided visual story of the space, filmed and edited.' },
  { id: 'reel', name: 'Creative Personal Branding Reel', price: 399, description: 'Concept, scripting, filming and editing for your personal brand.' },
] as const;
export const STAGING_TIERS = [
  { id: 'staging_1', label: '1 Room', price: 40 },
  { id: 'staging_3', label: '3 Rooms', price: 99 },
  { id: 'staging_5', label: '5 Rooms', price: 149 },
] as const;
export const PARTNERSHIP_FEATURES = ['Up to 1,999 sq ft properties', '20–45 professionally edited images', 'Full interior + exterior coverage', 'Same-day or 24-hour delivery', 'Priority scheduling', 'Walkthrough / Cinematic Video', 'Private online gallery (one-click download)', 'Virtual Staging images or Drone coverage'];
export const PLANS = [
  { id: 'growth', name: 'Growth', volume: '4 listings / week', price: 400, savings: 75, standard: 475, highlight: false, description: 'For agents building a consistent listing schedule.' },
  { id: 'scale', name: 'Scale', volume: '6 listings / week', price: 380, savings: 95, standard: 475, highlight: false, description: 'For agents and small teams with a growing listing volume.' },
  { id: 'dominance', name: 'Dominance', volume: '8+ listings / week', price: 350, savings: 125, standard: 475, highlight: true, description: 'Our best per-listing rate for high-volume teams.' },
] as const;
export type Plan = typeof PLANS[number];
export type AddOnId = typeof ADD_ONS[number]['id'];
export type Selection = { includeStandard: boolean; planId?: string | null; addOns: AddOnId[]; flyerQty: number; reelQty: number; stagingId: string | null };
export type LineItem = { id: string; name: string; quantity: number; unitPrice: number; total: number };
export function addOnQuantity(id: AddOnId, selection: Pick<Selection, 'flyerQty' | 'reelQty'>) {
  const value = id === 'flyer' ? selection.flyerQty : id === 'reel' ? selection.reelQty : 1;
  return Number.isSafeInteger(value) && value > 0 ? value : 1;
}
export function addOnPrice(id: AddOnId, quantity: number) {
  const addon = ADD_ONS.find(item => item.id === id);
  return (id === 'flyer' && quantity > 1 ? 35 : addon?.price ?? 0) * quantity;
}
export function buildOrder(selection: Selection) {
  const plan = PLANS.find(item => item.id === selection.planId);
  const items: LineItem[] = [];
  if (selection.includeStandard) {
    const price = plan?.price ?? STANDARD_PRICE;
    items.push({ id: plan?.id ?? 'standard', name: plan ? `${plan.name} Partnership Plan (${plan.volume})` : 'Standard Listing Media Package', quantity: 1, unitPrice: price, total: price });
  }
  for (const id of new Set(selection.addOns)) {
    const addon = ADD_ONS.find(item => item.id === id);
    if (!addon) continue;
    const quantity = addOnQuantity(id, selection);
    const total = addOnPrice(id, quantity);
    items.push({ id, name: addon.name, quantity, unitPrice: total / quantity, total });
  }
  const staging = STAGING_TIERS.find(item => item.id === selection.stagingId);
  if (staging) items.push({ id: staging.id, name: `Virtual Staging (${staging.label})`, quantity: 1, unitPrice: staging.price, total: staging.price });
  return { items, total: items.reduce((sum, item) => sum + item.total, 0), packageName: selection.includeStandard ? items[0].name : 'Add-ons only', plan: selection.includeStandard ? plan ?? null : null };
}
export function bookingOrderFields(selection: Selection) {
  const order = buildOrder(selection);
  return {
    package: order.packageName,
    partnership_plan: order.plan?.name ?? 'None',
    weekly_volume: order.plan?.volume ?? 'Not applicable',
    line_items: order.items,
    order_summary: order.items.map(item => `${item.name} × ${item.quantity} @ $${item.unitPrice} = $${item.total}`).join('\n'),
    add_ons: order.items.filter(item => item.id !== 'standard' && !PLANS.some(plan => plan.id === item.id)).map(item => `${item.name} × ${item.quantity}`).join(', ') || 'None',
    total_price: `$${order.total}`,
  };
}
