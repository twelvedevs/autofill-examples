import type { TemplatePreset } from "../types/autofill";

/** Sync with shared/data/templates.json when backend presets change. */
export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "bill_of_lading",
    name: "Bill of Lading",
    presetKey: "bill_of_lading",
    fields: [
      "shipper name",
      "consignee name",
      "origin zip code",
      "destination zip code",
      "trailer number",
      "scac code",
      "gross_weight",
    ],
  },
  {
    id: "commercial_invoice",
    name: "Commercial Invoice",
    presetKey: "commercial_invoice",
    fields: [
      "seller ein / tax id",
      "invoice number",
      "po number",
      "incoterms",
      "total amount",
      "currency",
      "payment terms",
    ],
  },
  {
    id: "proof_of_delivery",
    name: "Proof of Delivery",
    presetKey: "proof_of_delivery",
    fields: [
      "delivery date",
      "received by (name)",
      "pieces received",
      "bol reference number",
      "damage notes",
      "arrival timestamp",
    ],
  },
  {
    id: "shipping_label",
    name: "Shipping Label",
    presetKey: "shipping_label",
    fields: [
      "tracking number",
      "service type",
      "ship from address",
      "ship to address",
      "package_weight",
      "carrier scac",
    ],
  },
];

export const AUTO_PRESET_ID = "__auto__";
