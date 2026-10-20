
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const B=window.BEARS||[];document.querySelectorAll('.age').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.age').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');const d=B[+b.dataset.i],m=document.getElementById('match');m.style.background=d.bg;m.innerHTML=d.html;}));

const C=window.TTP_CONFIG||{};const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
async function slotsCfg(){if(C.backendUrl){try{const r=await fetch(C.backendUrl+'?action=slots');const j=await r.json();if(j.slots&&j.slots.length)return j.slots}catch(e){}}try{const r=await fetch('tour-slots.json');return (await r.json()).slots||[]}catch(e){return[]}}
const tf=document.getElementById('tourForm');
if(tf){tf.startedAt.value=Date.now();const d=tf.date,t=new Date();t.setDate(t.getDate()+1);d.min=t.toISOString().slice(0,10);let SL=[];slotsCfg().then(x=>SL=x);
d.addEventListener('change',()=>{const dt=new Date(d.value+'T12:00');const day=DN[dt.getDay()];const m=SL.filter(x=>x.day===day).flatMap(x=>x.times);const L=document.getElementById('slotList');
L.innerHTML=m.length?m.map((x,i)=>`<label><input type="radio" name="time" value="${x}" ${i?'':'required'}><span>${x}</span></label>`).join(''):'<p class="muted">No tour times that day. Try '+[...new Set(SL.map(x=>x.day))].join(', ')+', or call us.</p>';});
tf.addEventListener('submit',async e=>{e.preventDefault();const msg=tf.querySelector('.formmsg');msg.className='full formmsg';const fd=Object.fromEntries(new FormData(tf));
if(!tf.checkValidity()||!fd.time){msg.textContent='Please choose a date and time, and fill in your name, email, phone and child\'s age.';msg.classList.add('err');tf.reportValidity();return}
if(fd.website)return;fd.type='tour';
if(C.backendUrl){try{msg.textContent='Sending…';const r=await fetch(C.backendUrl,{method:'POST',body:JSON.stringify(fd)});const j=await r.json();if(j.ok){msg.textContent='Mahalo! Your tour request is in. We\'ll confirm by email or phone.';msg.classList.add('ok');tf.reset();return}throw 0}catch(_){msg.textContent='Something went wrong. Opening an email instead…'}}
const body=encodeURIComponent(`Aloha! We'd love to tour The Toddler Program.\n\nPreferred: ${fd.date} at ${fd.time}\nParent: ${fd.name}\nEmail: ${fd.email}\nPhone: ${fd.phone}\nChild's age: ${fd.childAge}\nNotes: ${fd.notes||''}`);
location.href=`mailto:admin@thetoddlerprogram.com?subject=${encodeURIComponent('Tour request - '+fd.name)}&body=${body}`;});}
// exit-intent popup (Honey Bears) — switch off with TTP_CONFIG.exitPopup=false
(function(){const xp=document.getElementById('xp');if(!xp||C.exitPopup===false)return;let shown=false;try{shown=sessionStorage.getItem('ttpXp')}catch(e){}
let last=null;const open=()=>{if(shown)return;shown=1;try{sessionStorage.setItem('ttpXp','1')}catch(e){}last=document.activeElement;xp.classList.add('open');xp.querySelector('.x').focus();document.addEventListener('keydown',esc)};
const close=()=>{xp.classList.remove('open');document.removeEventListener('keydown',esc);last&&last.focus&&last.focus()};const esc=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const f=[...xp.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}}};
xp.querySelector('.x').onclick=close;xp.addEventListener('click',e=>{if(e.target===xp)close()});window.ttpOpenPopup=open;
const touch=matchMedia('(hover:none)').matches;if(!touch){document.addEventListener('mouseout',e=>{if(!e.relatedTarget&&e.clientY<=0)open()})}else{let y=scrollY,ts=Date.now();addEventListener('scroll',()=>{const n=Date.now(),dy=y-scrollY,dt=n-ts;if(scrollY>600&&dy>120&&dt<300)open();y=scrollY;ts=n},{passive:true});setTimeout(open,45000)}})();

