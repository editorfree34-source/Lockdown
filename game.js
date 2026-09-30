const I=n=>IMG[n+'.jpg'];
document.querySelectorAll('[data-img]').forEach(e=>e.src=I(e.dataset.img));
$h=document.getElementById('home');$h.style.backgroundImage='url('+I('menu_bg')+')';document.querySelector('link[rel=icon]').href=I('icon');
const $=s=>document.querySelector(s),A='assets/';
let S,tmr,ac,hl={},toastT;
const go=id=>document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('on',e.id==id));
const beep=(f=600,d=.12,t='sine')=>{try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.value=.07;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}};
const morse=async p=>{for(const c of p){beep(700,c=='-'?.3:.1);await new Promise(r=>setTimeout(r,c=='-'?420:220))}};
const T=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2600)};
const M=h=>{$('#mbody').innerHTML=h;$('#modal').classList.add('on')};
const close=()=>$('#modal').classList.remove('on');
const ITEMS={flash:'פנס',driver:'מברג',key:'מפתח',wheel:'גלגל הצפנה',card:'כרטיס גישה'};
const NAMES=['צפון','מזרח','דרום','מערב'];

/* ---------- מסכים ---------- */
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{beep(500,.06);go(b.dataset.go)});
[['vault','כספות ושודדים'],['bunker','בונקרים'],['lab','מעבדות סודיות'],['space','חלל ועתיד'],['tomb','מסתורין ועתיק']].forEach(([k,n])=>{
  const ok=k=='bunker',d=document.createElement('div');d.className='cat '+(ok?'ok':'lock');
  d.innerHTML=`<img src="${I(`card_${k}`)}"><div><b>${n}</b><span>${ok?'בונקר 13 · 45 דק׳':'🔒 בקרוב'}</span></div>`;
  d.onclick=()=>ok?go('story'):T('הקטגוריה הזאת תיפתח בקרוב');
  $('#catlist').append(d)});
$('#startBtn').onclick=start;$('#again').onclick=start;
$('#quit').onclick=()=>{if(confirm('לצאת מהמשחק?')){clearInterval(tmr);go('cats')}};
$('#mx').onclick=close;$('#modal').onclick=e=>{if(e.target.id=='modal')close()};

/* ---------- חדר ---------- */
const W=[
 {img:'wall_n',hs:[[77,18,12,48,()=>chalk()],[8,32,31,40,()=>T('ארון תיקים חלוד. המגירות ריקות, חוץ מפתק: "הסדר קובע".')],[42,22,32,31,()=>mapP()]]},
 {img:'wall_e',hs:[[60,78,17,9,()=>tool()],[43,17,45,48,()=>wires()]]},
 {img:'wall_s',hs:[[70,62,16,25,()=>drawer()],[41,52,22,6,()=>diary()],[39,44,34,11,()=>radio()],[11,40,22,21,()=>safe()]]},
 {img:'wall_w',hs:[[32,62,12,11,()=>vent()],[16,41,9,8,()=>panel()],[38,37,22,18,()=>door()]]}
];
const STEPS=[
 ['flash',['החדר חשוך מאוד. אולי יש כאן משהו שמאיר?','ארגז כלים מונח על הרצפה ליד הגנרטור.','קיר מזרח, הארגז על הרצפה מימין.']],
 ['code',['יש משהו כתוב על אחד הקירות, אבל קשה לראות אותו.','בקיר הצפוני, ליד הצינור.','בחר את הפנס מהתיק ולחץ על הקיר הימני.']],
 ['driver',['חסר לך כלי לפתיחת ברגים.','שולחן העבודה ליד הרדיו מכיל מגירות.','קיר דרום, המגירות בצד ימין.']],
 ['power',['הרדיו מת. צריך להחזיר חשמל.','לוח החשמל פתוח. יש תרשים בפנים הדלת.','חבר את החוטים לפי הסדר שבתרשים, קיר מזרח.']],
 ['order',['היומן על השולחן מסביר איך להפעיל את הרדיו.','יומן: שמאל 4, ימין 7. סובב את הכפתורים.','כוון את שני המחוונים ל־4 ול־7 והקשב.']],
 ['key',['מישהו הסתיר משהו מאחורי רשת האוורור.','קיר מערב, ליד תחתית הדלת. יש בה ארבעה ברגים.','בחר את המברג ולחץ על הרשת.']],
 ['wheel',['המפה הקרועה על הקיר הצפוני היא לא סתם קישוט.','הרכב אותה מחדש. הקו האדום חייב להתחבר.','אחרי שהמפה שלמה תמצא משהו מאחוריה.']],
 ['card',['הארון המתכתי בקיר הדרומי הוא כספת.','החוגה: 23 · 61 · 47. הסדר הוא מהרדיו. חור המפתח צריך את המפתח.','הסמלים: לחץ לפי הסדר האדום שעל גלגל ההצפנה.']],
 ['win',['כמעט שם. הדלת הגדולה עדיין נעולה.','ליד הדלת יש פאנל קטן. הוא צריך כרטיס.','בחר את כרטיס הגישה ולחץ על הפאנל, ואז סובב את הגלגל.']]
];
function start(){
  S={w:0,inv:[],f:{},sel:null,hints:0,t:2700};hl={};
  $('#wimg').src=I(W[0].img);$('#game').classList.remove('pw','em');
  $('#over').classList.remove('on');$('#fox').classList.remove('on');
  draw();inv();tick();clearInterval(tmr);tmr=setInterval(tick,1000);go('game');
  T('חפש בחדר. לחץ על חפצים, סובב עם החצים.')}
function tick(){
  if(!$('#game').classList.contains('on')||S.f.win)return;
  if(S.t<=0){clearInterval(tmr);over();return}
  S.t--;const m=String(S.t/60|0).padStart(2,'0'),s=String(S.t%60).padStart(2,'0');
  $('#time').textContent=m+':'+s;$('#game').classList.toggle('em',S.t<300);
  if(S.t<300&&S.t%2==0)beep(300,.05,'square')}
function over(){$('#ot').textContent='הזמן נגמר!';$('#op').textContent='הדלת ננעלה... אבל אפשר להמשיך עוד 5 דקות.';$('#ob').textContent='עוד 5 דקות';$('#ob').onclick=()=>{S.t=300;$('#over').classList.remove('on');tmr=setInterval(tick,1000)};$('#over').classList.add('on')}
function draw(){
  $('#wimg').src=I(W[S.w].img);$('#dirs').textContent='קיר '+NAMES[S.w];
  const h=$('#hs');h.innerHTML='';
  W[S.w].hs.forEach(([x,y,w,hh,fn])=>{const d=document.createElement('div');d.className='hs';d.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${hh}%`;d.onclick=()=>{beep(420,.05);fn()};h.append(d)})}
function turn(d){
  const w=$('#wall');w.classList.add(d>0?'tr':'tl');beep(250,.1,'triangle');
  setTimeout(()=>{S.w=(S.w+d+4)%4;draw();w.classList.remove('tr','tl');w.classList.add(d>0?'tl':'tr');void w.offsetWidth;w.classList.remove('tl','tr')},220)}
$('#next').onclick=()=>turn(1);$('#prev').onclick=()=>turn(-1);
let sx=null;const st=$('#stage');
st.onpointerdown=e=>sx=e.clientX;
st.onpointerup=e=>{if(sx!=null&&Math.abs(e.clientX-sx)>70)turn(e.clientX<sx?1:-1);sx=null};
function inv(){
  const b=$('#inv');b.innerHTML=S.inv.length?'':'<i>התיק ריק. חפש חפצים בחדר</i>';
  S.inv.forEach(k=>{const d=document.createElement('div');d.className='it'+(S.sel==k?' sel':'');d.title=ITEMS[k];
    d.innerHTML=`<img src="${I(`i_${k}`)}">`;
    d.onclick=()=>{S.sel=S.sel==k?null:k;inv();if(S.sel)T('נבחר: '+ITEMS[k]+'. לחץ על מקום בחדר');if(k=='wheel')wheelV()};b.append(d)})}
const add=k=>{if(!S.inv.includes(k))S.inv.push(k);S.f[k]=1;beep(880,.15);T('מצאת: '+ITEMS[k]);inv()};
const use=k=>{S.inv=S.inv.filter(i=>i!=k);S.sel=null;inv()};

/* ---------- רמזים ---------- */
$('#hintBtn').onclick=()=>{
  const i=STEPS.findIndex(([k])=>!S.f[k]);if(i<0)return;
  const l=hl[i]=Math.min((hl[i]||0)+1,3);S.hints++;
  $('#foxi').src=I('fox'+(l==1?0:l==2?1:2));$('#foxt').textContent=STEPS[i][1][l-1];
  $('#fox').classList.add('on');clearTimeout(S.ft);S.ft=setTimeout(()=>$('#fox').classList.remove('on'),9000);beep(520,.15)};
$('#fox').onclick=()=>$('#fox').classList.remove('on');

/* ---------- חידות ---------- */
function chalk(){
  if(!S.f.code){if(S.sel!='flash')return T('חשוך מדי כדי לראות מה כתוב על הקיר. צריך מקור אור.');S.f.code=1;beep(900,.2)}
  M(`<h3>מספרים בגיר</h3><div class="chalk">47<br>23<br>61</div><p>שלושה מספרים, אבל באיזה סדר? הפתק בארון אמר: "הסדר קובע".</p>`)}
function tool(){if(S.f.flash)return T('ארגז כלים ריק.');add('flash');$('#game').classList.add('pw');setTimeout(()=>$('#game').classList.remove('pw'),1500)}
function drawer(){if(S.f.driver)return T('המגירות ריקות.');add('driver')}
function diary(){M(`<h3>יומן</h3><p>יום 41. הרדיו מתעורר רק כשיש חשמל. אחר כך צריך לכוון את התדר: <b>שמאל 4, ימין 7</b>. הוא שולח לי את הסדר של הקוד. לא לשכוח.</p><p style="color:#8aa">בשוליים מצויר גלגל עם סמלים.</p>`)}
function wires(){
  const C=[['לבן','#eee','●'],['כחול','#3a7bff','▲'],['אדום','#ff2d3d','■'],['ירוק','#2ecc71','◆'],['צהוב','#f1c40f','★'],['זית','#8a9a3b','✚']];
  const diag=C.map(c=>`<span style="color:${c[1]}">${c[2]} ${c[0]}</span>`).join(' ← ');
  if(S.f.power)return M(`<h3>לוח חשמל</h3><p>החשמל חזר. הגנרטור פועל.</p><p>${diag}</p>`);
  let n=0;const o=[...C.keys()].sort(()=>Math.random()-.5);
  M(`<h3>לוח חשמל</h3><p>תרשים בפנים הדלת: חבר לפי הסדר הזה:</p><p style="font-size:1.05rem">${diag}</p><div class="row" id="wr">${o.map(i=>`<button class="w" data-i="${i}" style="background:${C[i][1]}">${C[i][2]}</button>`).join('')}</div>`);
  document.querySelectorAll('.w').forEach(b=>b.onclick=()=>{
    if(+b.dataset.i==n){b.classList.add('d');n++;beep(600+n*120,.12);
      if(n==6){S.f.power=1;$('#game').classList.add('pw');morse('...');T('הגנרטור התניע! החשמל חזר.');setTimeout(close,900)}}
    else{n=0;document.querySelectorAll('.w').forEach(x=>x.classList.remove('d'));beep(150,.25,'sawtooth');T('הסדר שגוי. מתחילים מחדש')}})}
function radio(){
  M(`<img class="big" src="${I(`radio`)}"><div class="disp" id="rd">— — —</div><p>שמאל: <b id="lv">0</b></p><input type="range" id="rl" min="0" max="9" value="0"><p>ימין: <b id="rv">0</b></p><input type="range" id="rr" min="0" max="9" value="0"><p id="rm" style="color:var(--cy)"></p>`);
  const chk=()=>{const l=+$('#rl').value,r=+$('#rr').value;$('#lv').textContent=l;$('#rv').textContent=r;
    if(!S.f.power){$('#rd').textContent='אין חשמל';return}
    if(l==4&&r==7){$('#rd').textContent='23 → 61 → 47';$('#rm').textContent='משדר: "הסדר הנכון: עשרים ושלוש, שישים ואחד, ארבעים ושבע."';S.f.order=1;morse('.-.. -.-.');}
    else{$('#rd').textContent='~ ~ רעש ~ ~';$('#rm').textContent='';beep(200+l*60+r*40,.06,'sawtooth')}};
  $('#rl').oninput=$('#rr').oninput=chk}
function vent(){
  if(S.f.key)return T('הפתח ריק.');
  if(S.sel!='driver')return T('רשת אוורור עם ארבעה ברגים. צריך כלי מתאים.');
  add('key');T('פתחת את הרשת ומצאת מפתח ישן!')}
function mapP(){
  if(S.f.wheel)return T('המפה שלמה. מאחוריה היה גלגל הצפנה.');
  let t=[...Array(9).keys()];do{t.sort(()=>Math.random()-.5)}while(t.every((v,i)=>v==i));let sel=-1;
  const r=()=>{$('#mg').innerHTML=t.map((v,i)=>`<button data-i="${i}" class="${sel==i?'s':''}" style="background-image:url(${I(`m${v}`)})"></button>`).join('');
    document.querySelectorAll('#mg button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;beep(480,.05);
      if(sel<0)sel=i;else{[t[sel],t[i]]=[t[i],t[sel]];sel=-1}r();
      if(t.every((v,k)=>v==k)){beep(1000,.3);setTimeout(()=>{close();add('wheel')},700);T('המפה הושלמה! מאחוריה מסתתר משהו...')}})};
  M(`<h3>מפה קרועה</h3><p>לחץ על שתי חתיכות כדי להחליף ביניהן. הקו האדום חייב להתחבר, מהעיגול ועד ה־X.</p><div class="map" id="mg"></div>`);r()}
function wheelV(){M(`<h3>גלגל הצפנה</h3><img class="big" src="${I(`i_wheel`)}" style="max-width:200px;margin:auto"><p>שלושה סמלים בוהקים באדום: <b style="font-size:1.6rem;color:var(--red)">✶ ← ≈ ← ☀</b></p><p>אולי זה הסדר לפאנל בכספת.</p>`)}
function safe(){
  if(S.f.card)return T('הכספת ריקה.');
  const sy=['✶','⛰','◎','≈','๑','☀'];let d=[0,0,0],q=[];
  M(`<div class="door" id="sd"><img class="big" src="${I(`safe`)}"></div><div class="dial">${[0,1,2].map(i=>`<div><button data-u="${i}">+</button><b id="d${i}">00</b><button data-d="${i}">−</button></div>`).join('')}</div><div class="row">${sy.map((s,i)=>`<button class="sy" data-s="${i}">${s}</button>`).join('')}</div><button class="btn red" id="op2" style="width:100%">נסה לפתוח</button>`);
  const up=()=>d.forEach((v,i)=>$('#d'+i).textContent=String(v).padStart(2,'0'));
  document.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{d[+b.dataset.u]=(d[+b.dataset.u]+1)%100;up();beep(700,.03)});
  document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{d[+b.dataset.d]=(d[+b.dataset.d]+99)%100;up();beep(600,.03)});
  document.querySelectorAll('.sy').forEach(b=>b.onclick=()=>{const i=+b.dataset.s;if(q.includes(i))return;q.push(i);b.classList.add('on');beep(500+i*60,.08);if(q.length>3){q=[i];document.querySelectorAll('.sy').forEach(x=>x.classList.toggle('on',x==b))}});
  $('#op2').onclick=()=>{
    if(d.join()!='23,61,47')return(beep(150,.3,'sawtooth'),T('חוגת הקוד לא נפתחה. הסדר של המספרים חשוב.'));
    if(!S.f.key)return T('החוגה נפתחה, אבל חור המפתח עדיין נעול. חסר מפתח.');
    if(q.join()!='0,3,5')return(beep(150,.3,'sawtooth'),T('סדר הסמלים שגוי.'));
    $('#sd').classList.add('open');beep(300,.6,'triangle');setTimeout(()=>{close();add('card')},1300)}}
function panel(){
  if(S.f.panel)return T('הפאנל דולק. הדלת מוכנה.');
  if(S.sel!='card')return T('פאנל קטן עם חריץ לכרטיס. הוא כבוי.');
  S.f.panel=1;use('card');beep(900,.3);T('הפאנל נדלק! עכשיו אפשר לסובב את הגלגל.')}
function door(){
  if(!S.f.panel)return T('הדלת נעולה. הפאנל הקטן שלידה כבוי.');
  S.f.win=1;clearInterval(tmr);beep(1000,.5,'triangle');
  const used=2700-S.t,stars=used<1500&&S.hints<=2?3:used<2100&&S.hints<=5?2:1;
  $('#stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
  $('#stats').textContent=`זמן: ${String(used/60|0)} דק׳ ${used%60} שנ׳ · רמזים: ${S.hints}`;
  setTimeout(()=>go('end'),600)}
