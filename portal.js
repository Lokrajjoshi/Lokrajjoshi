(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const status = document.querySelector('.status-line');
  const moth = document.querySelector('.signal-moth');
  const trails = [...document.querySelectorAll('.cursor-trail')];
  const cards = [...document.querySelectorAll('[data-tilt]')];
  if (!reducedMotion && !coarsePointer && moth) {
    const points = [{x:innerWidth/2,y:innerHeight/2},{x:innerWidth/2,y:innerHeight/2},{x:innerWidth/2,y:innerHeight/2},{x:innerWidth/2,y:innerHeight/2}];
    let pointer = {...points[0]}; let frame = 0;
    const move = (event) => { pointer = {x:event.clientX,y:event.clientY}; };
    const render = () => { points[0].x += (pointer.x-points[0].x)*.24; points[0].y += (pointer.y-points[0].y)*.24; for(let i=1;i<points.length;i++){points[i].x+=(points[i-1].x-points[i].x)*.18;points[i].y+=(points[i-1].y-points[i].y)*.18;} moth.style.transform=`translate(${points[0].x}px,${points[0].y}px) translate(-50%,-50%)`; trails.forEach((node,i)=>{node.style.transform=`translate(${points[i+1].x}px,${points[i+1].y}px) translate(-50%,-50%)`;}); frame=requestAnimationFrame(render); };
    addEventListener('pointermove', move, {passive:true}); addEventListener('pointerdown', (event) => { const burst=document.createElement('span'); burst.className='cursor-burst'; burst.style.left=`${event.clientX}px`; burst.style.top=`${event.clientY}px`; document.body.append(burst); burst.addEventListener('animationend',()=>burst.remove()); if(status) status.innerHTML='<span>STATUS</span> INTERACTION REGISTERED · SIGNAL PATH ACTIVE'; });
    render(); addEventListener('pagehide',()=>cancelAnimationFrame(frame));
  }
  if (!reducedMotion && !coarsePointer) cards.forEach((card) => { card.addEventListener('pointermove',(event)=>{const box=card.getBoundingClientRect();const rx=((event.clientY-box.top)/box.height-.5)*-8;const ry=((event.clientX-box.left)/box.width-.5)*10;card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;}); card.addEventListener('pointerleave',()=>{card.style.transform='';}); card.addEventListener('focus',()=>{if(status) status.innerHTML='<span>STATUS</span> WORLD SELECTED · OPENING SYSTEM LINK';}); });
})();

