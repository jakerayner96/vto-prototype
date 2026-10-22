/* Review shell: "Screenshot" button beside Export (Jake, 19–20 Oct 2026).
   One click saves a PNG of exactly what is on screen in the device frame — real pixels, like Chrome DevTools' "Capture node screenshot":
   the browser's own tab capture (getDisplayMedia, this tab), cropped to the visible #device (bezel, status bar, page, browser bar).
   Chrome asks once to share the tab; the share stays open for 2 minutes after the last shot so a run of shots needs no new prompt.
   No tab capture (Safari / phones / declined) → falls back to an html2canvas render of the page in the frame.
   Saved as a download, so it lands in Downloads. Drop-in: <script src="../../assets/ds/proto-shot.js"></script> after the shell's script. */
(function(){
const ICON='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M2 5.5h2.5L6 3.5h4l1.5 2H14v7.5H2z"/><circle cx="8" cy="9" r="2.4"/></svg>';
const stamp=()=>new Date().toISOString().slice(0,19).replace('T','-').replace(/:/g,'');
const slug=s=>String(s||'prototype').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const raf2=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
/* what to capture: the device frame (bezel + page) when the shell has one, else the visible page iframe */
function target(){const d=document.getElementById('device');if(d&&d.offsetParent!==null&&d.getBoundingClientRect().width>50)return d;
  return [...document.querySelectorAll('iframe')].filter(f=>{const r=f.getBoundingClientRect();return f.offsetParent&&r.width>50&&r.height>50})
  .sort((a,b)=>{const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();return B.width*B.height-A.width*A.height})[0]}
/* the part of the element that is actually on screen: clipped by every scrolling / overflow-hidden ancestor and the window */
function visibleRect(el){const r=el.getBoundingClientRect();let L=r.left,T=r.top,R=r.right,B=r.bottom;
  for(let p=el.parentElement;p&&p!==document.documentElement;p=p.parentElement){const cs=getComputedStyle(p);
    if(/(auto|scroll|hidden|clip)/.test(cs.overflow+cs.overflowX+cs.overflowY)){const q=p.getBoundingClientRect();L=Math.max(L,q.left);T=Math.max(T,q.top);R=Math.min(R,q.right);B=Math.min(B,q.bottom)}}
  L=Math.max(L,0);T=Math.max(T,0);R=Math.min(R,innerWidth);B=Math.min(B,innerHeight);
  return {r,L,T,W:Math.max(0,R-L),H:Math.max(0,B-T)}}
function save(canvas,name){return new Promise(res=>canvas.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();res()},500)},'image/png'))}
function fileName(w){const brand=(document.querySelector('#brands .chip.on')||{}).textContent||'';return `${slug(document.title.split('·')[0])}${brand?'-'+slug(brand):''}-${Math.round(w)}w-${stamp()}.png`}

/* ---- real pixels: tab capture ---- */
let live=null,idle=0;   /* {stream,video} kept for 2 min after the last shot */
async function stream(){
  if(live&&live.stream.getVideoTracks()[0].readyState==='live')return live;
  const s=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:'browser',frameRate:30,width:{ideal:Math.round(innerWidth*devicePixelRatio)},height:{ideal:Math.round(innerHeight*devicePixelRatio)}},audio:false,preferCurrentTab:true,selfBrowserSurface:'include',surfaceSwitching:'exclude',monitorTypeSurfaces:'exclude'});
  const v=document.createElement('video');v.muted=true;v.playsInline=true;v.srcObject=s;await v.play();
  s.getVideoTracks()[0].addEventListener('ended',()=>{if(live&&live.stream===s)live=null});
  live={stream:s,video:v};await wait(350);   /* let the "sharing this tab" bar settle the layout */
  return live}
function stopLater(){clearTimeout(idle);idle=setTimeout(()=>{if(live){live.stream.getTracks().forEach(t=>t.stop());live=null}},120000)}
async function frame(v){await new Promise(r=>v.requestVideoFrameCallback?v.requestVideoFrameCallback(()=>r()):setTimeout(r,60));
  await new Promise(r=>v.requestVideoFrameCallback?v.requestVideoFrameCallback(()=>r()):setTimeout(r,60))}
async function pixelShot(el){const {video:v}=await stream();
  await raf2();await frame(v);
  const vr=visibleRect(el),sx=v.videoWidth/innerWidth,sy=v.videoHeight/innerHeight;   /* the capture is the tab's viewport at device pixels */
  const c=document.createElement('canvas');c.width=Math.round(vr.W*sx);c.height=Math.round(vr.H*sy);
  c.getContext('2d').drawImage(v,vr.L*sx,vr.T*sy,vr.W*sx,vr.H*sy,0,0,c.width,c.height);
  stopLater();return {c,w:vr.W}}

/* ---- fallback: html2canvas render of the page in the frame ---- */
async function renderShot(){const f=[...document.querySelectorAll('iframe')].find(x=>x.offsetParent&&x.getBoundingClientRect().width>50);let win,doc;try{win=f.contentWindow;doc=f.contentDocument}catch(e){}
  if(!doc||!window.html2canvas)throw new Error('nothing to capture');
  const v=visibleRect(f),k=v.r.width/(f.offsetWidth||v.r.width)||1,x=win.scrollX+(v.L-v.r.left)/k,y=win.scrollY+(v.T-v.r.top)/k,w=Math.round(v.W/k),h=Math.round(v.H/k);
  const B=doc.body,had=B.classList.contains('exporting');B.classList.add('exporting');
  try{return {c:await html2canvas(doc.documentElement,{x,y,width:w,height:h,windowWidth:win.innerWidth,windowHeight:win.innerHeight,scale:2,useCORS:true,backgroundColor:'#FFFFFF',logging:false}),w}}
  finally{if(!had)B.classList.remove('exporting')}}

let busy=false;
async function shot(btn){if(busy)return;const el=target();if(!el){toast('Nothing to capture yet');return}
  busy=true;btn&&(btn.disabled=true);
  const panel=document.querySelector('.panel.open');if(panel){panel.classList.remove('open');await wait(300)}   /* phones: the panel slides over the page */
  try{let out,how='';
    if(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia){try{out=await pixelShot(el)}catch(e){how=e&&e.name==='NotAllowedError'?' (tab share declined — rendered instead)':' (tab capture unavailable — rendered instead)';console.warn(e)}}
    if(!out){out=await renderShot();how=how||' (rendered — this browser has no tab capture)'}
    await save(out.c,fileName(out.w));toast('Screenshot saved to Downloads'+how)}
  catch(e){console.error(e);toast('Screenshot failed: '+e.message)}
  finally{busy=false;btn&&(btn.disabled=false)}}
function toast(t){let el=document.getElementById('shot-toast');if(!el){el=document.createElement('div');el.id='shot-toast';el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;background:#0A0A0A;color:#FFF;border:1px solid rgba(255,255,255,.2);border-radius:99px;padding:8px 16px;font:600 12px/1.2 system-ui,sans-serif;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw;text-align:center';document.body.appendChild(el)}
  el.textContent=t;el.style.opacity='1';clearTimeout(el._h);el._h=setTimeout(()=>el.style.opacity='0',2600)}
function mount(){for(const id of ['exportbtn','exportbtn2']){const ex=document.getElementById(id);if(!ex||document.getElementById(id+'-shot'))continue;
    const b=document.createElement('button');b.id=id+'-shot';b.className=ex.className;b.type='button';b.title='Save a PNG of exactly what is on screen in the device frame (to Downloads). Chrome asks once to share this tab.';
    b.innerHTML=id==='exportbtn'?ICON+'Screenshot':'Screenshot';b.onclick=()=>shot(b);ex.parentNode.insertBefore(b,ex)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.DG_protoShot=shot;
})();
