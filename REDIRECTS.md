# Old GoDaddy W+M URLs -> new pages (crawled live sitemap 2026-11-02, 7 URLs)
| Old | New |
|---|---|
| / | / |
| /application | /admissions-apply.html |
| /contact-us | /#tour (contact + tour form) |
| /giving | /giving.html |
| /other-information | /faq.html |
| /our-program | /program.html |
| /tuition-and-fees | /tuition.html |
GitHub Pages: stub folders (application/, contact-us/ ...) do instant client redirects; 404.html catches the rest.
Vercel: vercel.json has true 301s. AT LAUNCH: strip "/toddler-program-preview" prefix from stubs + 404.html links.
Old PDFs (2027-28 application form, AUW pledge/booklet) live on img1.wsimg.com (GoDaddy CDN) - re-host before cancelling W+M.
