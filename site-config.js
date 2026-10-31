// ============================================================
// The Toddler Program — site settings (Becky/Martin can edit)
// ============================================================
window.TTP_CONFIG = {
  // Paste the Google Apps Script web app URL here after deploying
  // (ends in /exec). Leave "" to keep the email fallback for tours
  // and the "call or use the PDF" message on the application.
  backendUrl: "https://script.google.com/macros/s/AKfycbwx3NK_KlSfZ7SqNc2sLKcV-xQ53lHVhsyO6zWSFa7FIo86CLLYWG0utyn_BNdrXzNr4g/exec",
  // Used by apply.html (type=application) and the home-page tour form (type=tour).

  // Online fee payment (Stripe Payment Link). While this still says
  // "STRIPE_LINK_PLACEHOLDER" the pay button stays hidden. Paste Becky's
  // https://buy.stripe.com/... link here when it exists.
  stripeLink: "STRIPE_LINK_PLACEHOLDER",

  // Tour scheduling swap point. "" = current behaviour (Book a Tour goes to
  // the home-page tour form). Paste a Calendly (or Google appointment) URL
  // to send every "Book a Tour" button there instead.
  tourBookingUrl: "",

  // Analytics. GA4 measurement ID (approved by Martin 2026-10-30).
  ga4Id: "G-T8X5DPET2L",
  // Meta Pixel ID: not ready yet. Leave "" until the dataset exists in the
  // "thetoddlerprogram 1" business portfolio; then paste the numeric ID.
  metaPixelId: "",

  // Honey Bears (5-year-olds) pop-up. true = on, false = off.
  exitPopup: true
};
