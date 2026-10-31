// The Toddler Program — analytics (GA4 + optional Meta Pixel), driven by site-config.js.
// Never sends personal data: no names, emails, phones or form answers.
(function(){var C=window.TTP_CONFIG||{};window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){dataLayer.push(arguments)};
if(C.ga4Id){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(C.ga4Id);document.head.appendChild(s);
 gtag('js',new Date());gtag('config',C.ga4Id,{allow_google_signals:false,allow_ad_personalization_signals:false});}
if(C.metaPixelId){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',C.metaPixelId);fbq('track','PageView');}
window.ttpTrack=function(g,m,p){try{C.ga4Id&&gtag('event',g,p||{})}catch(e){}try{m&&C.metaPixelId&&window.fbq&&fbq('track',m)}catch(e){}};
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'';
 if(h.indexOf('tel:')===0)ttpTrack('phone_click','Contact',{link_location:location.pathname});
 else if(h.indexOf('mailto:')===0)ttpTrack('email_click','Contact',{link_location:location.pathname});
 else if(/#tour$/.test(h)||(C.tourBookingUrl&&h===C.tourBookingUrl))ttpTrack('tour_cta_click',null,{link_location:location.pathname});},true);
})();
