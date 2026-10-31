// ============================================================
// The Toddler Program — site settings (Becky/Martin can edit)
// ============================================================
window.TTP_CONFIG = {
  // Paste the Google Apps Script web app URL here after deploying
  // (ends in /exec). Leave "" to keep the email fallback for tours
  // and the "call or use the PDF" message on the application.
  backendUrl: "",
  // Used by apply.html (type=application) and the home-page tour form (type=tour).

  // Online fee payment (Stripe Payment Link). While this still says
  // "STRIPE_LINK_PLACEHOLDER" the pay button stays hidden. Paste Becky's
  // https://buy.stripe.com/... link here when it exists.
  stripeLink: "STRIPE_LINK_PLACEHOLDER",

  // Tour scheduling swap point. "" = current behaviour (Book a Tour goes to
  // the home-page tour form). Paste a Calendly (or Google appointment) URL
  // to send every "Book a Tour" button there instead.
  tourBookingUrl: "",

  // Honey Bears (5-year-olds) pop-up. true = on, false = off.
  exitPopup: true
};
