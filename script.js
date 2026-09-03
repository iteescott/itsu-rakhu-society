const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// ===================== MENU =====================
const drawer = $('#indexDrawer');
$('#menuButton').addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); });
$('#drawerClose').addEventListener('click', () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); });
$$('.drawer-inner nav a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

// ===================== I WISH YOU WERE HERE =====================
const wishResponses = [
  'Me too. Extremely too.',
  'Me too — this is becoming administratively inconvenient.',
  'Me too. Come here immediately.',
  'Me too. I have filed a formal complaint with geography.',
  'Me too. Distance remains deeply overrated.',
  'Me too. Unfortunately, Estonia is still where you are.',
  'Me too. I would like to skip to the part where you are next to me.',
  'ME TOO. In capital letters.',
  'Me too. Come back and collect your girlfriend.',
  'Me too. Still us, just with more screen time.'
];
$('#wishButton').addEventListener('click', () => {
  const box = $('#wishResponse');
  box.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300});
  box.textContent = wishResponses[Math.floor(Math.random()*wishResponses.length)];
});

// ===================== VIDEO / CORRESPONDENCE MODAL =====================
const modal = $('#modal');
const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); $('#modalMedia').innerHTML=''; };
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
$$('.envelope').forEach(card => card.addEventListener('click', () => {
  const title = card.dataset.title;
  const url = card.dataset.video;
  $('#modalEyebrow').textContent = 'PRIVATE CORRESPONDENCE';
  $('#modalTitle').textContent = title;
  if (url) {
    $('#modalMedia').innerHTML = `<iframe src="${url}" title="${title}" style="width:100%;height:100%;border:0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    $('#modalNote').textContent = 'For your eyes only.';
  } else {
    $('#modalMedia').textContent = 'VIDEO SLOT — ADD URL IN SCRIPT.JS';
    $('#modalNote').textContent = 'This envelope is ready. Add the private/unlisted video URL to its data-video attribute in index.html.';
  }
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}));

// ===================== QUIZ =====================
const quiz = [
  {q:'What is the most reliable way to tell that we have been together for a while?', options:['We own matching luggage.','There are too many inside jokes to explain.','We have stopped taking photos.','We agree on everything.'], correct:1},
  {q:'When one of us says “I am fine,” what does it usually mean?', options:['Everything is objectively perfect.','Please conduct a full investigation.','They would like a snack.','Nothing at all.'], correct:1},
  {q:'What is the Society’s official stance on long distance?', options:['A tragic ending.','A temporary administrative inconvenience.','A personality trait.','An excuse to stop dating.'], correct:1},
  {q:'What belongs in the Society archive?', options:['Only perfect memories.','Only important dates.','The good, the chaotic and the deeply unserious.','Tax documents.'], correct:2},
  {q:'What is the correct answer to “Who loves who more?”', options:['Itsu.','Rakhu.','A mathematically impossible tie.','The person reading this.'], correct:2}
];
let qi=0, score=0;
function renderQuiz(){
  if(qi>=quiz.length){
    const label = score===5?'FOUNDER-LEVEL KNOWLEDGE':score>=4?'DISTINGUISHED MEMBER':score>=3?'ACCEPTABLE. BARELY.':'PROBATIONARY MEMBER';
    $('#quizProgress').textContent='EXAMINATION COMPLETE'; $('#quizScore').textContent=`SCORE ${String(score).padStart(2,'0')} / 05`;
    $('#quizQuestion').innerHTML=`${label}<br><small style="font:italic 22px var(--body)">You have been provisionally certified as someone who knows us quite well.</small>`;
    $('#quizOptions').innerHTML=''; $('#quizRestart').classList.remove('hidden'); return;
  }
  const item=quiz[qi]; $('#quizProgress').textContent=`QUESTION ${String(qi+1).padStart(2,'0')} / 05`; $('#quizScore').textContent=`SCORE ${String(score).padStart(2,'0')}`; $('#quizQuestion').textContent=item.q;
  $('#quizOptions').innerHTML=item.options.map((o,i)=>`<button class="quiz-option" data-i="${i}">${o}</button>`).join('');
  $$('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>{
    const selected=Number(btn.dataset.i); $$('.quiz-option').forEach(b=>b.disabled=true);
    if(selected===item.correct){score++;btn.classList.add('correct')}else{btn.classList.add('wrong');$$('.quiz-option')[item.correct].classList.add('correct')}
    setTimeout(()=>{qi++;renderQuiz()},650);
  }));
}
$('#quizRestart').addEventListener('click',()=>{qi=0;score=0;$('#quizRestart').classList.add('hidden');renderQuiz()});
renderQuiz();

// ===================== ARCADE =====================
const defaultGames = [
  {name:'Codenames',desc:'Teams, clues and an opportunity to accuse each other of being terrible at words.',meta:'2+ PLAYERS · BROWSER',url:'https://codenames.game/'},
  {name:'Gartic Phone',desc:'Telephone, but with drawings. The results will be used as evidence against everyone involved.',meta:'4+ PLAYERS · BROWSER',url:'https://garticphone.com/'},
  {name:'GeoGuessr',desc:'Travel the world from separate rooms and discover who has suspiciously good geography instincts.',meta:'2 PLAYERS · BROWSER',url:'https://www.geoguessr.com/'},
];
let customGames = JSON.parse(localStorage.getItem('itsuRakhuGames')||'[]');
function renderGames(){
 const games=[...defaultGames,...customGames];
 $('#arcadeCount').textContent=`${String(games.length).padStart(2,'0')} APPROVED GAMES`;
 $('#gameGrid').innerHTML=games.map(g=>`<article class="game-card"><span class="eyebrow">SOCIETY APPROVED</span><h3>${escapeHtml(g.name)}</h3><p>${escapeHtml(g.desc)}</p><div class="game-meta"><span>${escapeHtml(g.meta||'BROWSER')}</span><span>FREE / CHECK SITE</span></div>${g.url?`<a href="${escapeAttr(g.url)}" target="_blank" rel="noopener">OPEN GAME ↗</a>`:''}</article>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function escapeAttr(s){return String(s).replace(/"/g,'&quot;')}
$('#addGameButton').addEventListener('click',()=>{
 const name=prompt('Game name?'); if(!name) return; const url=prompt('Game link? (optional)')||''; const desc=prompt('One-line description?')||'An approved recreational activity for members.'; customGames.push({name,url,desc,meta:'ADDED BY A MEMBER'}); localStorage.setItem('itsuRakhuGames',JSON.stringify(customGames)); renderGames();
});
renderGames();

// ===================== DATE GENERATOR =====================
const dates=[
 'Cook the same meal together, then rate each other’s plating like an unnecessarily serious food critic.',
 'Pick a city neither of you knows well and spend 45 minutes planning an imaginary weekend there.',
 'Order each other’s favourite food and eat it together on video call.',
 'Get dressed up as if you are going somewhere fancy. You are not allowed to explain why.',
 'Watch the same terrible film and live-text commentary to each other throughout.',
 'Take each other on a 20-minute walking tour of wherever you are. No itinerary required.',
 'Build the most chaotic shared playlist possible, one song at a time.',
 'Have a tiny PowerPoint night: five minutes each on a topic you are weirdly passionate about.',
 'Make a shared bucket list for your first month together after the distance ends.',
 'Have dessert for dinner. The Society has approved this.'
];
$('#dateButton').addEventListener('click',()=>{
 const r=dates[Math.floor(Math.random()*dates.length)]; $('#dateResult').animate([{opacity:0},{opacity:1}],{duration:300}); $('#dateResult').textContent=r;
});

// ===================== VAULT =====================
$$('.vault-card').forEach(card=>card.querySelector('.vault-open').addEventListener('click',()=>{
 const m=Number(card.dataset.month), d=Number(card.dataset.day), now=new Date();
 const unlocked=(now.getMonth()+1===m && now.getDate()===d);
 const status=card.querySelector('.vault-status');
 status.textContent=unlocked?'UNLOCKED FOR TODAY':'LOCKED — NOT THE DATE';
 if(unlocked){status.style.color='var(--mustard)'; card.querySelector('.vault-open').textContent='OPEN';}
}));
