const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const names=['로봇 찾기','로봇의 구성','허브 탐험','전원 켜기','연결 연습','센서 찾기','입력·출력과 케이블','개념 퀴즈','최종 퀴즈'];let current=1;const done=new Set();
names.forEach((name,i)=>{const b=document.createElement('button');b.textContent=`${i+1}. ${name}`;b.onclick=()=>show(i+1);$('.steps').append(b)});
function show(n){current=n;$$('.stage').forEach(s=>s.classList.toggle('active',+s.dataset.step===n));$$('.steps button').forEach((b,i)=>{b.classList.toggle('active',i+1===n);b.classList.toggle('done',done.has(i+1));b.setAttribute('aria-current',i+1===n?'step':'false')});$('#stepLabel').textContent=`${n} / 9 탐험 · ${names[n-1]}`;$('#completed').textContent=`완료 ${done.size} / 9`;$('#bar').style.width=`${done.size/9*100}%`;$('#prev').disabled=n===1;$('#next').disabled=n===9;$('#markDone').textContent=done.has(n)?'완료 표시 취소':'이 활동을 마쳤어요 ✓'}
$('#prev').onclick=()=>show(Math.max(1,current-1));$('#next').onclick=()=>show(Math.min(9,current+1));$('#markDone').onclick=()=>{done.has(current)?done.delete(current):done.add(current);show(current)};
function mark(parent,[name,x,y,w,h],activate){const b=document.createElement('button');b.className='spot';b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;b.setAttribute('aria-label',name);b.setAttribute('aria-pressed','false');b.onclick=()=>activate(b);$(parent).append(b);return b}
function selectMarker(b){b.classList.add('marked');b.setAttribute('aria-pressed','true')}
const robots=[['가정용 로봇','바닥을 깨끗하게 청소해요.'],['산업용 로봇','공장에서 물건을 조립해요.'],['의료용 로봇','의료진의 정밀한 수술을 도와요.'],['우주탐사용 로봇','다른 행성에서 사진과 정보를 모아요.'],['놀이용 로봇','우리와 놀고 함께 배워요.'],['군사용 로봇','사람이 가기 위험한 곳을 살펴요.']];const found=new Set();robots.forEach(([name,desc],i)=>mark('#robotTypes',[name,(i%3)*33.33+2,Math.floor(i/3)*50+4,29,42],b=>{selectMarker(b);found.add(i);$('#robotInfo').textContent=`${name}: ${desc}`;$('#robotCount').textContent=`발견 ${found.size} / 6`}));
let sticker=null;const stickerNames={hardware:'하드웨어',energy:'에너지',software:'소프트웨어'};$$('[data-sticker]').forEach(b=>b.onclick=()=>{sticker=b.dataset.sticker;$$('[data-sticker]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b)})});$$('[data-drop]').forEach(b=>b.onclick=()=>{if(!sticker){$('#stickerStatus').textContent='먼저 이름을 골라 주세요.';return}if(sticker===b.dataset.drop){b.classList.add('filled');b.querySelector('b').textContent='✓ '+stickerNames[sticker];selectMarker(componentMarkers[sticker]);$('#stickerStatus').textContent=$$('.drop.filled').length===3?'🎉 로봇의 세 가지 구성을 모두 찾았어요!':'맞아요! 다음 설명도 찾아요.'}else $('#stickerStatus').textContent='몸과 모터는 하드웨어, 배터리는 에너지, 프로그램은 소프트웨어예요.'});
function buildMenu(items,picture,menu,status,count){const found=new Set();items.forEach((r,i)=>{let marker;const b=document.createElement('button');b.className='choice';b.textContent=r[0];b.setAttribute('aria-pressed','false');const activate=()=>{selectMarker(marker);found.add(i);b.classList.add('selected');b.textContent='✓ '+r[0];b.setAttribute('aria-pressed','true');$(status).textContent=r[0]+': '+r[5];$(count).textContent=`${count==='#sensorCount'?'찾은 부품':'찾은 부분'} ${found.size} / ${items.length}`};marker=mark(picture,r,activate);marker.style.pointerEvents='none';marker.tabIndex=-1;b.onclick=activate;$(menu).append(b)})}
buildMenu([['무선 연결 아이콘',35,20,5,5,'무선 연결 상태를 보여줘요.'],['브릭 이름',46,20,10,5,'내 허브의 이름이에요.'],['USB 연결 표시',56,20,10,5,'USB 연결 상태를 보여줘요.'],['화면',32,19,35,22,'메뉴와 정보를 보여줘요.'],['가운데 버튼 · 전원 켜기',45,60,8,9,'전원을 켜거나 선택을 확인해요.'],['방향 버튼',34,51,31,27,'위·아래·왼쪽·오른쪽으로 이동해요.'],['뒤로 버튼',28,49,10,7,'이전 화면으로 돌아가요.']], '#brickPicture','#brickMenu','#brickStatus','#brickCount');
buildMenu([['초음파',75,35,14,19,'물체까지의 거리를 알아보는 센서예요.'],['컬러',67,49,13,16,'색과 빛의 밝기를 알아보는 센서예요.'],['자이로',57,60,14,16,'얼마나 돌았는지 알아보는 센서예요.'],['터치',47,68,12,18,'눌렸는지 알아보는 센서예요.'],['큰모터',8,10,22,49,'바퀴나 팔을 힘있게 움직여요.'],['중간모터',43,10,16,17,'작은 부품을 빠르게 움직여요.']], '#sensorPicture','#sensorMenu','#sensorStatus','#sensorCount');
$$('[data-check]').forEach(b=>{b.setAttribute('aria-pressed','false');b.onclick=()=>{b.classList.toggle('done');b.setAttribute('aria-pressed',b.classList.contains('done'));const key=b.dataset.check,all=$$(`[data-check="${key}"]`),n=all.filter(x=>x.classList.contains('done')).length;$('#'+key+'Status').textContent=n===all.length?'🎉 모두 확인했어요!':`체크 ${n} / ${all.length}`}});
const io=[['컬러 센서가 색을 알아봐요','input'],['모터가 바퀴를 돌려요','output'],['터치 센서가 눌림을 알아봐요','input'],['브릭이 소리를 내요','output']];let ioIndex=0,ioSolved=false;$('#ioPrompt').textContent=io[0][0];$$('[data-io]').forEach(b=>b.onclick=()=>{if(ioSolved)return;ioSolved=b.dataset.io===io[ioIndex][1];$('#ioStatus').textContent=ioSolved?'🎉 맞아요! 다음 문제를 눌러요.':'다시 생각해요. 정보를 받으면 입력, 움직이거나 소리를 내면 출력!'});$('#nextIo').onclick=()=>{if(!ioSolved){$('#ioStatus').textContent='먼저 답을 골라 보세요.';return}if(ioIndex===io.length-1){$('#ioStatus').textContent='🎉 네 문제 모두 성공!';return}ioIndex++;ioSolved=false;$('#ioPrompt').textContent=io[ioIndex][0];$('#ioStatus').textContent='입력일까요? 출력일까요?'};
function quizGroup(parent,status,questions,onFinish){const solved=new Set();$(parent).replaceChildren();$(status).textContent=`정답 0 / ${questions.length}`;questions.forEach(([q,answers,correct,hint],i)=>{const box=document.createElement('div');box.className='quiz';const h=document.createElement('h3');h.textContent=`Q${i+1}. ${q}`;box.append(h);const feedback=document.createElement('p');feedback.className='quiz-feedback';feedback.setAttribute('aria-live','polite');answers.forEach((a,j)=>{const b=document.createElement('button');b.className='choice';b.textContent=['① ','② ','③ ','④ '][j]+a;b.onclick=()=>{if(solved.has(i))return;box.querySelectorAll('.choice').forEach(x=>x.classList.remove('wrong'));if(j===correct){b.classList.add('correct');b.textContent='✓ '+a;solved.add(i);feedback.textContent='맞아요! '+hint;$(status).textContent=`정답 ${solved.size} / ${questions.length}`;if(solved.size===questions.length)onFinish()}else{b.classList.add('wrong');feedback.textContent='다시 골라 보세요! '+hint}};box.append(b)});box.append(feedback);$(parent).append(box)})}
quizGroup('#conceptQuiz','#conceptStatus',[
['사람이 하기 힘든 일을 대신하는 기계는?',['로봇','책','의자'],0,'사람을 돕는 기계예요.'],
['컴퓨터가 할 일을 명령으로 만드는 작업은?',['청소','충전','코딩'],2,'컴퓨터에게 할 일을 알려줘요.'],
['문제를 해결하는 순서와 방법은?',['알고리즘','모터','케이블'],0,'일의 순서를 정리해요.'],
['복잡한 문제를 논리적이고 효율적으로 분석하고 해결하는 문제에서 생각하는 방법은?',['예술적사고력','컴퓨팅사고력','직관적사고력'],1,'문제를 차근차근 분석하고 해결하는 방법이에요.']
],()=>{done.add(8);show(current);$('#conceptStatus').textContent='🎉 네 가지 개념 퀴즈 성공!'});
function finalQuiz(){quizGroup('#finalQuiz','#finalStatus',[
['로봇의 두뇌 역할은?',['바퀴','허브','장식 블록'],1,'프로그램을 실행하는 곳이에요.'],
['주변 정보를 알아보는 것은?',['센서','바퀴','케이블'],0,'주변을 보고 느끼는 부품이에요.'],
['코딩 후 실제 움직임을 구현한 것은?',['화면','모터','메뉴'],1,'바퀴나 팔을 돌리는 부품이에요.']
],()=>{done.add(9);show(current);$('#finish').showModal()})}finalQuiz();$('#retryFinal').onclick=()=>{done.delete(9);$('#finish').close();finalQuiz();show(current)};show(1);
// Keep each illustration proportional to the available activity space.
function fitPictures(){document.querySelectorAll('.stage.active .picture').forEach(p=>{const img=p.querySelector('img'),grid=p.closest('.grid');if(!img.naturalWidth||!grid)return;const ratio=img.naturalWidth/img.naturalHeight;const available=grid.getBoundingClientRect().height;const columns=getComputedStyle(grid).gridTemplateColumns.split(' ');const columnWidth=parseFloat(columns[0]);p.style.width=Math.floor(Math.min(columnWidth,available*ratio))+'px';if(p.id==='robotTypes'){const stage=p.closest('.stage');stage.style.setProperty('--robot-panel-width',p.style.width);stage.style.setProperty('--robot-panel-height',p.getBoundingClientRect().height+'px');}});}
new ResizeObserver(fitPictures).observe(document.querySelector('main'));document.querySelectorAll('.picture img').forEach(img=>img.addEventListener('load',fitPictures));const originalShow=show;show=function(n){originalShow(n);requestAnimationFrame(fitPictures)};fitPictures();

const componentMarkers={};[['hardware',7,3,86,37],['energy',7,41,86,24],['software',7,67,86,30]].forEach(([key,x,y,w,h])=>{const marker=mark('#componentPicture',[stickerNames[key],x,y,w,h],()=>{});marker.style.pointerEvents='none';marker.tabIndex=-1;componentMarkers[key]=marker;});requestAnimationFrame(fitPictures);

$('#closeComplete').onclick=()=>$('#finish').close();$('#finish').addEventListener('close',()=>$('#retryFinal').isConnected&&document.querySelector('#finalQuiz .quiz:last-child button.correct')?.focus());


// Replay the other stages' interactions after refreshing the current activity.
let activityHistory=[];let restoringActivities=false;
document.addEventListener('click',event=>{
 if(restoringActivities)return;
 const button=event.target.closest('button'),stage=button?.closest('.stage');
 if(!stage||button.id==='closeComplete')return;
 activityHistory.push({step:+stage.dataset.step,button:[...stage.querySelectorAll('button')].indexOf(button)});
},true);
$('#retryStage').onclick=()=>{
 sessionStorage.setItem('ev3-replay',JSON.stringify({step:current,team:$('#team').value,done:[...done].filter(x=>x!==current),history:activityHistory.filter(x=>x.step!==current)}));
 location.reload();
};
const replayRaw=sessionStorage.getItem('ev3-replay');
if(replayRaw){
 sessionStorage.removeItem('ev3-replay');
 try{
 const replay=JSON.parse(replayRaw);$('#team').value=replay.team||'';
 restoringActivities=true;
 for(const action of replay.history||[]){const stage=document.querySelector(`.stage[data-step="${action.step}"]`);stage?.querySelectorAll('button')[action.button]?.click();}
 restoringActivities=false;activityHistory=replay.history||[];
 if($('#finish').open)$('#finish').close();done.clear();replay.done.forEach(n=>done.add(n));show(replay.step);requestAnimationFrame(fitPictures);
 }catch(e){restoringActivities=false;show(1)}
}
