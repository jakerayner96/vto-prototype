/* Virtual Stylist v2 — the layer over the DS master PDP (v2/vto.html writes debenhamsgroup.design templates/pdp.html into this document first).
   The PDP is the template as it stands; this file only wires its own Virtual Stylist chip (.pdp-chips .ai-pill--tag) and its Add to bag, and adds:
     1 intro   DS Virtual Stylist intro, slide up (assets/ds/vs-intro.js): Jake's six start screen layouts, ?layout=1..6
     2 photo   as live (debenhams.com VirtualTryOnFlow, 3 Nov 2026): Camera = <input type=file accept=image/jpeg capture=user> (the phone's own
               camera app, front camera; iOS adds its Retake / Use Photo) · Upload = <input type=file accept=image/jpeg> (the phone's photo picker).
               The photo is scaled to 2000px max and re-encoded as a JPEG under 5MB, as live.
     3 crop    v2 adds our Move and Scale step after the photo (live has none): drag, pinch / wheel / double-tap zoom under a fixed
               2:3 frame (the result shape); Camera: Retake / Use Photo · Upload: Cancel / Choose. Always on (Jake, 3 Nov).
     4 loading Analysing your photo → Creating your outfit, over the cropped photo, blurred
     5 result  full-bleed look, fascia watermark, sizes (shared with the PDP's size selector), Add to bag
     bag       DS toast (Top, actionable) “Item added to bag · View”, header bag count +1 (as the Master prototype)
     limit     DS modal (Small / alert): the sixth try-on of the day
   Overlay colours (dark / light sheet, button, selected size, loader) are the signed-off VTO set in ../brands.js; type, radius and case are the DS tokens.
   Shell protocol (v2/index.html): in {vtoSet:{brand,crop}} {vtoJump:step} {vtoReset} {vtoPing}; out {vtoReady} {vtoState} {vtoPong}. */
(function(){
  const VT=window.VS2.vt, IC=VT+'assets/icons/', MOCK=VT+'assets/img/bodyshot.png';
  const qs=new URLSearchParams(location.search);
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const desk=()=>innerWidth>=600;
  let B=null,P=null,LAYOUT=/^([1-9]|10)$/.test(qs.get('layout')||'')?qs.get('layout'):'6';
  let step='pdp',consent=false,source='camera',stream=null,facing='user',camTimer=null;
  let gen='idle',genStart=0,raf=0,tPhase=0,tDone=0,tToast=0,PHASE_A=4500,GEN_TOTAL=9000,tries=0;const MAX=5;
  let photo=MOCK,cropped=MOCK;

  /* ---------- styles: native camera + crop (system UI, system font), loading + result (signed-off VTO overlay) ---------- */
  const css=`
  #vs{--vs-ease:cubic-bezier(.32,.72,0,1);position:fixed;inset:0;z-index:calc(var(--z-modal,500) + 20);background:#000;transform:translateY(100%);transition:transform .45s var(--vs-ease);overflow:hidden;font-family:var(--font-family-base);-webkit-font-smoothing:antialiased}
  #vs.open{transform:none}
  #vs *{box-sizing:border-box;margin:0;padding:0}
  #vs button{font:inherit;background:none;border:0;cursor:pointer;color:inherit}
  #vs .scr{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .3s ease}
  #vs .scr.on{opacity:1;pointer-events:auto}
  #vs .sys{font-family:-apple-system,'SF Pro Text','Helvetica Neue',sans-serif;color:#fff;background:#000}
  #vs .home-ind{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);width:139px;height:5px;background:#fff;border-radius:100px}
  /* crop: the native Move and Scale step */
  #vs .cr-stage{position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:grab}
  #vs .cr-stage.drag{cursor:grabbing}
  #vs .cr-img{position:absolute;left:0;top:0;transform-origin:0 0;max-width:none;user-select:none;-webkit-user-drag:none;pointer-events:none}
  #vs .cr-frame{position:absolute;outline:1px solid rgba(255,255,255,.85);pointer-events:none}
  #vs .cr-dim{position:absolute;background:rgba(0,0,0,.62);pointer-events:none;transition:background .2s}   /* four panels, not a box-shadow, so html2canvas exports the dim */
  #vs .cr-stage.drag .cr-dim{background:rgba(0,0,0,.4)}
  #vs .cr-grid{position:absolute;inset:0;opacity:0;transition:opacity .2s;background:
     linear-gradient(90deg,transparent calc(33.333% - .5px),rgba(255,255,255,.55) calc(33.333% - .5px),rgba(255,255,255,.55) calc(33.333% + .5px),transparent calc(33.333% + .5px),transparent calc(66.666% - .5px),rgba(255,255,255,.55) calc(66.666% - .5px),rgba(255,255,255,.55) calc(66.666% + .5px),transparent calc(66.666% + .5px)),
     linear-gradient(180deg,transparent calc(33.333% - .5px),rgba(255,255,255,.55) calc(33.333% - .5px),rgba(255,255,255,.55) calc(33.333% + .5px),transparent calc(33.333% + .5px),transparent calc(66.666% - .5px),rgba(255,255,255,.55) calc(66.666% - .5px),rgba(255,255,255,.55) calc(66.666% + .5px),transparent calc(66.666% + .5px))}
  #vs .cr-stage.drag .cr-grid{opacity:1}
  #vs .cr-title{position:absolute;left:0;right:0;top:52px;text-align:center;font-size:17px;font-weight:600;letter-spacing:-.4px;pointer-events:none}
  #vs .cr-hint{position:absolute;left:0;right:0;bottom:112px;text-align:center;font-size:13px;color:rgba(255,255,255,.7);letter-spacing:-.1px;pointer-events:none;transition:opacity .3s}
  #vs .cr-hint.off{opacity:0}
  #vs .cr-bar{position:absolute;left:0;right:0;bottom:0;height:96px;display:flex;justify-content:space-between;align-items:flex-start;padding:22px 26px 0;background:rgba(0,0,0,.35)}
  #vs .cr-bar button{font-size:18px;letter-spacing:-.3px;padding:6px 0}
  /* loading (as v1) */
  #vs .ld-bg{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.8),rgba(0,0,0,.8)),#e0dedc;overflow:hidden}
  #vs.light .ld-bg{background:var(--vs-ground)}
  #vs .ld-blur{position:absolute;left:50%;top:50%;width:156%;height:108%;transform:translate(-50%,-50%);opacity:.2;filter:blur(10.5px)}
  #vs .ld-blur img{width:100%;height:100%;object-fit:cover;display:block}
  #vs .ld{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:16px;align-items:center;padding:8px 18px 18px;text-align:center}
  #vs .ld .ic32{width:32px;height:32px;color:var(--vs-loader);animation:vsPulse 1.8s ease-in-out infinite}
  @keyframes vsPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.92)}}
  #vs .ld .hl{font-size:20px;font-weight:var(--w-strong,600);color:#fff}
  #vs .ld .trk{width:240px;height:6px;background:#6b6b6b;border-radius:100px;overflow:hidden}
  #vs .ld .fill{height:6px;width:0;background:var(--vs-loader);border-radius:100px;transition:width .35s ease}
  #vs .ld .cap,#vs .ld .tl{font-size:11.5px;font-weight:var(--w-regular,400);color:#b5b5b5}
  #vs .ld .tl.last{color:#fff}
  #vs.light .ld .hl,#vs.light .ld .tl.last{color:var(--vs-ink)}
  #vs.light .ld .cap,#vs.light .ld .tl{color:#323232}
  #vs.light .ld .trk{background:#e7e7e7}
  #vs .ld .b,#vs .ld .c{display:none}
  #vs .ld.creating .a{display:none}#vs .ld.creating .b{display:block}
  #vs .ld.nearly .a,#vs .ld.nearly .b{display:none}#vs .ld.nearly .c{display:block}
  /* round buttons (close / share) */
  #vs .cb{position:absolute;width:32px;height:32px;border-radius:50%;backdrop-filter:blur(2px)}
  #vs .cb .ring{position:absolute;inset:0;width:100%;height:100%}
  #vs .cb .g{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:12px;height:12px}
  #vs .cb .g.sh{width:16px;height:16px}
  #vs .x-tr{right:20px;top:20px}
  #vs.light .cb{background:#fff;box-shadow:0 0 14px -4px rgba(0,0,0,.25)}
  #vs.light .cb .ring{display:none}
  #vs.light .cb .g{filter:brightness(0)}
  /* result (Figma 15550-23866) */
  #vs .rs-img{position:absolute;inset:0;overflow:hidden;background:#242424}
  #vs .rs-img img{width:100%;height:100%;object-fit:cover;display:block}
  #vs .scr.on .rs-img img{animation:vsReveal .5s ease both}
  @keyframes vsReveal{from{transform:scale(1.03);opacity:.4}to{transform:none;opacity:1}}
  #vs .wm{position:absolute;left:50%;bottom:180px;transform:translateX(-50%);width:103px;height:32px;display:flex;align-items:center;justify-content:center;opacity:.7;pointer-events:none}
  #vs .wm img{width:103px;max-height:32px;height:auto;filter:brightness(0) invert(1)}
  #vs .rs-sheet{position:absolute;left:0;right:0;bottom:0;border-radius:var(--vs-sheet-r) var(--vs-sheet-r) 0 0;background:var(--vs-sheet);display:flex;flex-direction:column;gap:20px;padding:20px 24px calc(24px + env(safe-area-inset-bottom,0px));transform:translateY(110%);transition:transform .42s var(--vs-ease)}
  #vs .rs-sheet.in{transform:none}
  #vs .rs-sizes{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -24px;padding:0 24px}
  #vs .rs-sizes::-webkit-scrollbar{display:none}
  #vs .rsz{flex:1 0 52px;min-width:52px;height:50px;background:var(--vs-size-bg);border:1px solid var(--vs-size-border);border-radius:var(--radius-default,4px);font-size:16px;font-weight:var(--w-mid,500);color:var(--vs-size-ink)}
  #vs .rsz.sel{background:var(--vs-sel);border-color:var(--vs-sel);color:var(--vs-sel-ink)}
  #vs .rs-atb{width:100%;height:50px;background:var(--vs-cta);border-radius:var(--radius-default,4px);font-size:16px;line-height:24px;font-weight:var(--w-btn,600);color:var(--vs-cta-ink);text-transform:var(--case-btn1,none)}
  #vs .rail{position:absolute;right:20px;top:20px;display:flex;flex-direction:column;gap:12px}
  #vs .rail .cb{position:relative;opacity:0;transform:translateY(-14px) scale(.9);transition:opacity .28s ease,transform .38s var(--vs-ease)}
  #vs .rail.in .cb{opacity:1;transform:none}
  #vs .rail .cb+.cb{transition-delay:.06s}
  @media(min-width:600px){#vs .rs-sheet{left:50%;right:auto;width:440px;transform:translate(-50%,110%)}#vs .rs-sheet.in{transform:translate(-50%,0)}}
  `;
  document.head.insertAdjacentHTML('beforeend','<style id="vs-css">'+css+'</style>');

  const AI='<svg class="ic32" viewBox="0 0 25.9979 25.9977" fill="none" aria-hidden="true"><path d="M6.59147 0.791395C6.5437 0.567446 6.42052 0.366674 6.24251 0.222631C6.06451 0.0785881 5.84246 0 5.61347 0C5.38448 0 5.16243 0.0785881 4.98442 0.222631C4.80642 0.366674 4.68324 0.567446 4.63547 0.791395C4.32614 2.25273 3.90213 3.23806 3.31547 3.9394C2.74347 4.6274 1.94347 5.13006 0.715468 5.49406C0.508816 5.5554 0.327515 5.68186 0.198585 5.85462C0.0696552 6.02737 0 6.23717 0 6.45273C0 6.66829 0.0696552 6.87808 0.198585 7.05084C0.327515 7.22359 0.508816 7.35006 0.715468 7.41139C1.89547 7.76073 2.6888 8.23406 3.27014 8.9114C3.86214 9.5994 4.3128 10.5914 4.63547 12.1141C4.68324 12.338 4.80642 12.5388 4.98442 12.6828C5.16243 12.8269 5.38448 12.9055 5.61347 12.9055C5.84246 12.9055 6.06451 12.8269 6.24251 12.6828C6.42052 12.5388 6.5437 12.338 6.59147 12.1141C6.91414 10.5901 7.3648 9.5994 7.9568 8.9114C8.53813 8.23406 9.33013 7.76073 10.5128 7.41139C10.7195 7.35006 10.9008 7.22359 11.0297 7.05084C11.1586 6.87808 11.2283 6.66829 11.2283 6.45273C11.2283 6.23717 11.1586 6.02737 11.0297 5.85462C10.9008 5.68186 10.7195 5.5554 10.5128 5.49406C9.33147 5.14473 8.53813 4.6714 7.9568 3.99406C7.3648 3.30606 6.91414 2.31406 6.59147 0.791395ZM17.6621 5.12606C17.6094 4.908 17.4849 4.71399 17.3086 4.57524C17.1323 4.43648 16.9145 4.36104 16.6901 4.36104C16.4658 4.36104 16.248 4.43648 16.0717 4.57524C15.8954 4.71399 15.7709 4.908 15.7181 5.12606C14.9795 8.18206 14.1968 10.0247 13.0888 11.3101C11.9955 12.5794 10.4928 13.4114 8.06214 14.2327C7.86399 14.2997 7.69184 14.4271 7.5699 14.5971C7.44797 14.767 7.38238 14.9709 7.38238 15.1801C7.38238 15.3892 7.44797 15.5931 7.5699 15.7631C7.69184 15.933 7.86399 16.0604 8.06214 16.1274C10.6008 16.9847 12.1235 17.8901 13.1981 19.1834C14.2901 20.4981 15.0141 22.3234 15.7181 25.2327C15.7709 25.4508 15.8954 25.6448 16.0717 25.7836C16.248 25.9223 16.4658 25.9977 16.6901 25.9977C16.9145 25.9977 17.1323 25.9223 17.3086 25.7836C17.4849 25.6448 17.6094 25.4508 17.6621 25.2327C18.4008 22.1781 19.1848 20.3354 20.2915 19.0501C21.3848 17.7807 22.8875 16.9487 25.3181 16.1274C25.5163 16.0604 25.6884 15.933 25.8104 15.7631C25.9323 15.5931 25.9979 15.3892 25.9979 15.1801C25.9979 14.9709 25.9323 14.767 25.8104 14.5971C25.6884 14.4271 25.5163 14.2997 25.3181 14.2327C22.7755 13.3741 21.2555 12.4727 20.1821 11.1794C19.0915 9.8674 18.3688 8.0434 17.6621 5.12606Z" fill="currentColor"/></svg>';
  const RB=(cls,g,fn)=>`<button class="cb ${cls}" data-vs="${fn}" aria-label="${fn==='share'?'Share':'Close'}"><img class="ring" src="${IC}ring.svg" alt=""><img class="g ${g}" src="${IC}${g==='sh'?'share':'close'}.svg" alt=""></button>`;
  document.body.insertAdjacentHTML('beforeend',`
  <div id="vs" aria-hidden="true">
    <div class="scr sys" data-scr="crop">
      <div class="cr-stage" id="vsStage"><img class="cr-img" id="vsCropImg" alt="Your photo" draggable="false"><i class="cr-dim"></i><i class="cr-dim"></i><i class="cr-dim"></i><i class="cr-dim"></i><div class="cr-frame" id="vsFrame"><div class="cr-grid"></div></div></div>
      <p class="cr-title">Move and Scale</p>
      <p class="cr-hint" id="vsHint">Drag to move · pinch to zoom</p>
      <div class="cr-bar"><button data-vs="cropBack" id="vsBack">Retake</button><button class="use" data-vs="cropUse" id="vsUse">Use Photo</button></div>
      <div class="home-ind"></div>
    </div>
    <div class="scr" data-scr="loading">
      <div class="ld-bg"><div class="ld-blur"><img id="vsLdImg" src="${MOCK}" alt=""></div></div>
      <div class="ld" id="vsLd">${AI}
        <p class="hl a">Analysing your photo...</p><p class="hl b">Creating your outfit...</p><p class="hl c">Nearly ready!</p>
        <div class="trk"><div class="fill" id="vsFill"></div></div>
        <p class="cap a">We will generate your look shortly...</p><p class="cap b">Please wait...</p><p class="cap c">Your look will be ready in a few seconds</p>
        <p class="tl" id="vsTries"></p>
      </div>
      ${RB('x-tr','x','close')}
    </div>
    <div class="scr" data-scr="result">
      <div class="rs-img"><img id="vsResult" alt="Your Virtual Stylist look"></div>
      <div class="wm"><img id="vsWm" alt=""></div>
      <div class="rs-sheet" id="vsSheet"><div class="rs-sizes" id="vsSizes"></div><button class="rs-atb" data-vs="atb">Add to bag</button></div>
      <div class="rail" id="vsRail">${RB('','x','close')}${RB('','sh','share')}</div>
    </div>
  </div>
  <input type="file" id="vsCam" accept="image/jpeg" capture="user" hidden><input type="file" id="vsFile" accept="image/jpeg" hidden>`);   /* the live inputs */
  const vs=$('#vs'),video=$('#vsVideo'),mock=$('#vsMock'),file=$('#vsFile'),camFile=$('#vsCam'),ld=$('#vsLd'),fill=$('#vsFill');
  const SCR={};$$('#vs [data-scr]').forEach(s=>SCR[s.dataset.scr]=s);

  /* ---------- fascia ---------- */
  function lum(h){h=String(h).replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');return [0,2,4].map(i=>{const c=parseInt(h.substr(i,2),16)/255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)}).reduce((a,c,i)=>a+c*[.2126,.7152,.0722][i],0)}
  const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
  function skin(){const k=S.brand;B=(window.VTO_BRANDS||{})[k]||VTO_BRANDS.debenhams;P=(window.DG_PDP_PRODUCTS||{})[k]||DG_PDP_PRODUCTS.debenhams;
    const t=B.tokens,light=B.theme==='light';
    const dark={sheetBg:'linear-gradient(162.7deg,#0f0f0f 3.09%,#131313 100%)',sheetInk:'#fff',sizeBg:'#242424',sizeInk:'#fff',sizeBorder:'transparent'};
    const v=n=>t[n]!==undefined?t[n]:(light?{sheetBg:'var(--surface-raised)',sheetInk:'#000',sizeBg:'var(--surface-raised)',sizeInk:'#000',sizeBorder:'var(--border-default)'}:dark)[n];
    const cta=t.sheetCta||(light?'#000':'#fff'),ground=light?(t.grey05||'#fafafa'):'#2b2b2b';
    const set={'--vs-sheet':v('sheetBg'),'--vs-ink':v('sheetInk'),'--vs-size-bg':v('sizeBg'),'--vs-size-ink':v('sizeInk'),'--vs-size-border':v('sizeBorder'),
      '--vs-cta':cta,'--vs-cta-ink':t.sheetCtaInk||(light?'#fff':'#000'),'--vs-sel':t.sheetSel||cta,'--vs-sel-ink':t.sheetSelInk||t.sheetCtaInk||(light?'#fff':'#000'),
      '--vs-sheet-r':B.sheetRadius||'12px','--vs-ground':ground,
      '--vs-loader':/^#[0-9a-f]{3,6}$/i.test(cta)&&ratio(cta,ground)>=3?cta:(light?(t.sheetInk||'#000'):'#fff')};
    Object.entries(set).forEach(([a,b])=>vs.style.setProperty(a,b));
    vs.classList.toggle('light',light);
    $('#vsWm').src=VT+'assets/brands/'+k+'.svg';
    $('#vsResult').src=P.imgs[Math.max(0,(P.result||1)-1)]||P.imgs[0];
    sizes();hook();post()}
  /* sizes: one selection, shared with the template's size selector (.sz) */
  const pdpSize=()=>{const s=$('.sz.on');return s?s.textContent.trim():''};
  function sizes(){const cur=pdpSize();$('#vsSizes').innerHTML=P.sizes.map(z=>`<button class="rsz${z===cur?' sel':''}" data-z="${esc(z)}">${esc(z)}</button>`).join('');
    $$('#vsSizes .rsz').forEach(b=>b.onclick=()=>{const s=$$('.sz').find(x=>x.textContent.trim()===b.dataset.z);if(s)s.click();else mark(b.dataset.z)})}
  const mark=z=>$$('#vsSizes .rsz').forEach(b=>b.classList.toggle('sel',b.dataset.z===z));
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.sz'))setTimeout(()=>mark(pdpSize()),0)});

  /* the template's own pieces: the Virtual Stylist chip opens the intro (or the look); Add to bag → the DS toast (Master prototype behaviour) */
  function hook(){$$('.pdp-chips .ai-pill--tag').forEach(c=>{c.onclick=e=>{e.preventDefault();chip()}});
    $$('.pdp-ctas .bd.pri').forEach(b=>b.onclick=e=>{e.preventDefault();added()})}
  document.addEventListener('dg:render',()=>{hook();if(P)mark(pdpSize())});

  /* ---------- screens ---------- */
  function show(n,delay){for(const k in SCR)SCR[k].classList.toggle('on',k===n);
    $('#vsSheet').classList.remove('in');$('#vsRail').classList.remove('in');
    if(n==='result'){setTimeout(()=>$('#vsSheet').classList.add('in'),delay||120);setTimeout(()=>$('#vsRail').classList.add('in'),(delay||120)+100)}
    lock(true);vs.classList.add('open');vs.setAttribute('aria-hidden','false');setStep(n)}
  function closeOverlay(){vs.classList.remove('open');vs.setAttribute('aria-hidden','true');stopCam();lock(false)}
  const lock=on=>{document.documentElement.style.overflow=on?'hidden':''};
  function setStep(s){step=s;post()}
  function post(){if(parent!==window)parent.postMessage({vtoState:{brand:S.brand,step,tries,look:gen==='ready',layout:LAYOUT}},'*')}

  /* 1 intro — the DS Virtual Stylist intro modal */
  function intro(){closeIntro();closeOverlay();
    document.body.insertAdjacentHTML('beforeend',DG_vsIntro.layer({fascia:B.name,desk:desk(),left:MAX-tries,consent,layout:LAYOUT,photo:MOCK}));
    const el=$('[data-vs-intro]');lock(true);
    DG_vsIntro.wire(el,{onClose:()=>{closeIntro();lock(false);setStep('pdp')},onConsent:on=>{consent=on},onCamera:()=>camera(),onUpload:()=>upload()});
    setStep('intro')}
  const closeIntro=()=>$$('[data-vs-intro]').forEach(x=>x.remove());
  function chip(){if(gen==='ready'){closeIntro();show('result',430);toastOff();return}
    if(gen==='generating'){ld.classList.add('nearly');show('loading');return}
    if(tries>=MAX){limit();return}
    intro()}

  /* 2 photo: the phone's own camera / picker, as live */
  function camera(){source='camera';camFile.value='';camFile.click()}
  function upload(){source='library';file.value='';file.click()}
  const stopCam=()=>{};
  /* as live: scale to 2000px max, JPEG 0.9 stepping down until under 5MB */
  async function prep(f){const bm=await createImageBitmap(f),k=Math.min(1,2000/Math.max(bm.width,bm.height)),c=document.createElement('canvas');
    c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);c.getContext('2d').drawImage(bm,0,0,c.width,c.height);
    let q=.9,u=c.toDataURL('image/jpeg',q);while(u.length*.75>5242880&&q>.4){q-=.1;u=c.toDataURL('image/jpeg',q)}return u}
  const picked=inp=>async()=>{const f=inp.files&&inp.files[0];if(!f)return;let src;try{src=await prep(f)}catch(e){src=MOCK}
    closeIntro();photo=src;crop(src)};
  camFile.addEventListener('change',picked(camFile));file.addEventListener('change',picked(file));

  /* 3 crop — the native Move and Scale step: the photo moves and scales under a fixed frame; it always covers the frame */
  const stage=$('#vsStage'),cimg=$('#vsCropImg'),frame=$('#vsFrame');
  let C={s:1,min:1,x:0,y:0,f:{x:0,y:0,w:0,h:0},iw:1,ih:1};
  function crop(src){photo=src;
    $('#vsBack').textContent=source==='library'?'Cancel':'Retake';$('#vsUse').textContent=source==='library'?'Choose':'Use Photo';
    $('#vsHint').classList.remove('off');show('crop');
    cimg.onload=()=>{C.iw=cimg.naturalWidth;C.ih=cimg.naturalHeight;cimg.style.width=C.iw+'px';cimg.style.height=C.ih+'px';fit()};
    cimg.src=src;if(cimg.complete&&cimg.naturalWidth)cimg.onload()}
  function layoutFrame(){const W=stage.clientWidth||innerWidth,H=stage.clientHeight||innerHeight,top=92,bottom=140,avH=H-top-bottom,avW=W-32;
    const r=2/3;let w=Math.min(avW,avH*r,560),h=w/r;
    C.f={x:Math.round((W-w)/2),y:Math.round(top+(avH-h)/2),w:Math.round(w),h:Math.round(h)};
    const f=C.f,px=v=>v+'px';Object.assign(frame.style,{left:px(f.x),top:px(f.y),width:px(f.w),height:px(f.h)});
    const d=stage.querySelectorAll('.cr-dim');
    [[0,0,W,f.y],[0,f.y+f.h,W,H-f.y-f.h],[0,f.y,f.x,f.h],[f.x+f.w,f.y,W-f.x-f.w,f.h]].forEach(([l,t,w,h],i)=>Object.assign(d[i].style,{left:px(l),top:px(t),width:px(Math.max(0,w)),height:px(Math.max(0,h))}))}
  function fit(){layoutFrame();C.min=Math.max(C.f.w/C.iw,C.f.h/C.ih);C.s=C.min;
    C.x=C.f.x+(C.f.w-C.iw*C.s)/2;C.y=C.f.y+(C.f.h-C.ih*C.s)/2;apply()}
  function clamp(){const f=C.f;C.s=Math.min(Math.max(C.s,C.min),C.min*5);
    C.x=Math.min(f.x,Math.max(f.x+f.w-C.iw*C.s,C.x));C.y=Math.min(f.y,Math.max(f.y+f.h-C.ih*C.s,C.y))}
  function apply(){clamp();cimg.style.transform=`translate(${C.x}px,${C.y}px) scale(${C.s})`}
  function zoomAt(px,py,ns){const k=Math.min(Math.max(ns,C.min),C.min*5)/C.s;C.x=px-(px-C.x)*k;C.y=py-(py-C.y)*k;C.s*=k;apply()}
  const pts=new Map();let g0=null,lastTap=0;
  const rel=e=>{const r=stage.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}};
  const gesture=()=>{const a=[...pts.values()];if(a.length===1)return {x:a[0].x,y:a[0].y,d:0};
    return {x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2,d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}};
  stage.addEventListener('pointerdown',e=>{stage.setPointerCapture(e.pointerId);pts.set(e.pointerId,rel(e));g0=Object.assign(gesture(),{s:C.s,cx:C.x,cy:C.y});
    stage.classList.add('drag');$('#vsHint').classList.add('off');
    const now=Date.now();if(pts.size===1&&now-lastTap<300){const p=rel(e);zoomAt(p.x,p.y,C.s>C.min*1.2?C.min:C.s*2);g0=Object.assign(gesture(),{s:C.s,cx:C.x,cy:C.y})}lastTap=now});
  stage.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,rel(e));const g=gesture();
    if(pts.size>1&&g0.d&&g.d){const ns=Math.min(Math.max(g0.s*g.d/g0.d,C.min),C.min*5),k=ns/g0.s;C.s=ns;C.x=g.x-(g0.x-g0.cx)*k;C.y=g.y-(g0.y-g0.cy)*k}
    else{C.x=g0.cx+(g.x-g0.x);C.y=g0.cy+(g.y-g0.y)}apply()});
  const up=e=>{pts.delete(e.pointerId);if(pts.size)g0=Object.assign(gesture(),{s:C.s,cx:C.x,cy:C.y});else stage.classList.remove('drag')};
  stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
  stage.addEventListener('wheel',e=>{e.preventDefault();const p=rel(e);$('#vsHint').classList.add('off');zoomAt(p.x,p.y,C.s*Math.exp(-e.deltaY*.0015))},{passive:false});
  addEventListener('resize',()=>{if(step==='crop')fit()});
  function cropOut(){const f=C.f,sx=(f.x-C.x)/C.s,sy=(f.y-C.y)/C.s,sw=f.w/C.s,sh=f.h/C.s,k=Math.min(1,1200/sw);
    const c=document.createElement('canvas');c.width=Math.round(sw*k);c.height=Math.round(sh*k);
    try{c.getContext('2d').drawImage(cimg,sx,sy,sw,sh,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.9)}catch(e){return photo}}
  function cropBack(){if(source==='library'){closeOverlay();intro()}else camera()}   /* Retake reopens the phone's camera */
  function cropUse(){cropped=cropOut();$('#vsLdImg').src=cropped;generate()}

  /* 4 loading */
  function syncTries(){const l=$('#vsTries'),last=tries>=MAX;l.textContent=last?'You’ve used all '+MAX+' try-ons for today':tries+' of '+MAX+' today';
    l.classList.toggle('last',last);l.style.display=tries?'':'none';$$('[data-vs-note]').forEach(n=>n.textContent=DG_vsIntro.note(MAX-tries))}
  function generate(){if(tries>=MAX){closeOverlay();limit();return}
    PHASE_A=3000+Math.random()*3000;GEN_TOTAL=PHASE_A+3000+Math.random()*3000;tries++;syncTries();
    ld.classList.remove('nearly','creating');gen='generating';genStart=Date.now();show('loading');
    fill.style.width='0';cancelAnimationFrame(raf);
    (function tick(){const t=Date.now()-genStart;fill.style.width=Math.min(100,t/GEN_TOTAL*100)+'%';if(t<GEN_TOTAL)raf=requestAnimationFrame(tick)})();
    clearTimeout(tPhase);clearTimeout(tDone);tPhase=setTimeout(()=>ld.classList.add('creating'),PHASE_A);tDone=setTimeout(done,GEN_TOTAL)}
  function done(){gen='ready';cancelAnimationFrame(raf);fill.style.width='100%';
    if(vs.classList.contains('open'))setTimeout(()=>show('result'),350);
    else toast('Your Virtual Stylist look is ready',()=>{toastOff();show('result',430)});post()}

  /* 5 result · bag · limit */
  function atb(){closeOverlay();setTimeout(added,380)}
  let tt=0;
  function toast(msg,act){toastOff();clearTimeout(tt);
    document.body.insertAdjacentHTML('beforeend',`<div class="toast toast--top" data-vs-toast role="status"><span style="flex:1">${esc(msg)}</span><button class="act">View</button></div>`);
    const el=$('[data-vs-toast]');el.style.zIndex='calc(var(--z-modal,500) + 40)';el.querySelector('.act').onclick=act||toastOff;tt=setTimeout(toastOff,6000)}
  const toastOff=()=>$$('[data-vs-toast]').forEach(x=>x.remove());
  function added(){$$('.hd-count').forEach(b=>b.setAttribute('data-n',(+b.getAttribute('data-n')||0)+1));toast('Item added to bag');setStep('bag')}
  function limit(){closeIntro();
    document.body.insertAdjacentHTML('beforeend',`<div class="vs-layer" data-vs-intro><div class="mdl-scrim" data-vs-close></div><div class="mdl mdl--alert" role="alertdialog" aria-modal="true" aria-labelledby="vs-lim">
      <div class="modal-hd"><span class="mt" id="vs-lim">You’ve used all ${MAX} try-ons today</span><button class="modal-x" data-vs-close aria-label="Close"></button></div>
      <div class="mdl-bd"><p style="margin:0">You can create up to ${MAX} try-ons a day. Your limit resets tomorrow.</p></div>
      <div class="mdl-ft"><button class="bd pri" data-vs-close>Continue</button></div></div></div>`);
    lock(true);$$('[data-vs-intro] [data-vs-close]').forEach(b=>b.onclick=()=>{closeIntro();lock(false);setStep('pdp')});setStep('limit')}
  function share(){if(navigator.share)navigator.share({title:P.name,text:'My Virtual Stylist look on '+B.name,url:P.url}).catch(()=>{})}

  const ACT={cropBack,cropUse,close:()=>{closeOverlay();setStep('pdp')},atb,share};
  vs.addEventListener('click',e=>{const b=e.target.closest('[data-vs]');if(b&&ACT[b.dataset.vs]){e.preventDefault();ACT[b.dataset.vs]()}});

  /* ---------- review shell: reset, jumps, fascia + crop switch (re-skins in place, never resets the journey) ---------- */
  function reset(){cancelAnimationFrame(raf);clearTimeout(tPhase);clearTimeout(tDone);stopCam();closeIntro();toastOff();closeOverlay();
    gen='idle';tries=0;consent=false;photo=cropped=MOCK;$('#vsLdImg').src=MOCK;ld.classList.remove('creating','nearly');fill.style.width='0';syncTries();scrollTo(0,0);setStep('pdp')}
  function jump(s){closeIntro();toastOff();
    switch(s){
      case 'pdp':closeOverlay();setStep('pdp');break;
      case 'intro':consent=false;intro();break;
      case 'crop':consent=true;source='camera';crop(MOCK);break;
      case 'loading':consent=true;if(tries>=MAX)tries=MAX-1;$('#vsLdImg').src=cropped;generate();break;
      case 'result':cancelAnimationFrame(raf);clearTimeout(tPhase);clearTimeout(tDone);if(!tries){tries=1;syncTries()}gen='ready';show('result',430);break;
      case 'bag':closeOverlay();added();break;
      case 'limit':closeOverlay();tries=MAX;syncTries();limit();break}}
  function setBrand(k){if(k&&k!==S.brand&&window.DG_PDP_PRODUCTS[k]){S.brand=k;render()}skin();if(step==='intro')intro()}
  addEventListener('message',e=>{const d=e.data||{};
    if(d.vtoSet){const v=d.vtoSet;if(v.layout&&String(v.layout)!==LAYOUT){LAYOUT=String(v.layout);if(step==='intro'){setBrand(v.brand);intro();return}}setBrand(d.vtoSet.brand)}
    if(d.vtoJump)jump(d.vtoJump);
    if(d.vtoReset)reset();
    if(d.vtoPing)parent.postMessage({vtoPong:d.vtoPing,h:document.documentElement.scrollHeight},'*')});

  skin();syncTries();
  if(qs.get('step'))setTimeout(()=>jump(qs.get('step')),250);
  if(parent!==window)parent.postMessage({vtoReady:1},'*');
})();
