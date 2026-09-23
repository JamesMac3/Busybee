import { useEffect, useRef } from 'react';
import { mulberry32 } from '../seededRandom.js';
import '../lawn.css';

// A self-contained lawn scene. No frame-by-frame React updates or external assets.
export default function GrassBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let W = 0, H = 0, blades = [], raf = 0, last = 0, elapsed = 0, visible = false;
    let reduced = motion.matches;
    const pointer = { x: -1000, y: -1000 };
    const oval = (x, y, rx, ry, color, angle = 0) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2); ctx.fill();
    };
    const line = (points, color, width) => {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
      ctx.beginPath(); points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.stroke();
    };
    const bee = (x, y, size, phase, direction = 1, driver = false) => {
      ctx.save(); ctx.translate(x,y); ctx.scale(size * direction,size);
      const flap = reduced ? 0.7 : 0.45 + Math.abs(Math.sin(phase * 29)) * 0.55;
      oval(-5,-10,7,10 * flap,'#e3f5ed',-0.5); oval(4,-10,6,8 * flap,'#b8ded2',0.4);
      oval(0,0,12,8,'#f4cf35');
      ctx.save(); ctx.beginPath(); ctx.ellipse(0,0,12,8,0,0,Math.PI*2); ctx.clip();
      ctx.fillStyle='#183328'; ctx.fillRect(-7,-9,4,18); ctx.fillRect(1,-9,4,18); ctx.restore();
      oval(11,-2,6,6,'#183328'); oval(13,-3,1.4,1.5,'#fff');
      line([[12,-7],[15,-12],[18,-13]],'#183328',1.5);
      if(driver) { ctx.fillStyle='#f4cf35'; ctx.fillRect(7,-10,13,3); oval(11,-11,5,3,'#f4cf35'); }
      ctx.restore();
    };
    const mower = (x, t, scale) => {
      ctx.save(); ctx.translate(x,H-18); ctx.scale(scale,scale);
      oval(0,9,65,8,'#0a281f66');
      // Compact ride-on mower, with a worker bee at the controls.
      ctx.fillStyle='#173c2c'; ctx.fillRect(-45,-31,31,27);
      ctx.fillStyle='#f1cd36'; ctx.beginPath(); ctx.roundRect(-47,-18,100,18,6); ctx.fill();
      ctx.fillStyle='#e4ad25'; ctx.beginPath(); ctx.roundRect(4,-40,40,24,7); ctx.fill();
      line([[15,-34],[10,-48],[1,-49]],'#173328',4);
      line([[-24,-38],[-25,-54],[-36,-55]],'#183328',6);
      bee(-19,-63,1.4,t,1,true);
      line([[-4,-59],[10,-47]],'#183328',3);
      ctx.fillStyle='#194330'; ctx.fillRect(17,-34,17,3); ctx.fillRect(17,-28,17,3);
      oval(41,-32,3,4,'#fff7bb');
      [-32,34].forEach((wx) => {
        oval(wx,0,13,13,'#132b24'); oval(wx,0,7,7,'#a3bca5'); oval(wx,0,3,3,'#254f3b');
        const r = t*5; line([[wx-Math.cos(r)*5,-Math.sin(r)*5],[wx+Math.cos(r)*5,Math.sin(r)*5]],'#1d4534',2);
      });
      ctx.restore();
    };
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      const t = reduced ? 0 : elapsed % 27;
      const scale = W < 600 ? 0.72 : 0.95;
      const progress = Math.max(0,Math.min(1,(t-3)/13));
      const mx = -90 + progress*(W+180);
      const cutEdge = mx + 49*scale;
      const growing = Math.max(0,Math.min(1,(t-22)/5));
      const growEase = growing*growing*(3-2*growing);
      const ground = H-12;
      for (const b of blades) {
        const cut = !reduced && t >= 3 && b.x < cutEdge;
        const short = 15 + b.seed*13;
        const bh = cut ? short+(b.h-short)*growEase : b.h;
        const near = Math.max(0,1-Math.abs(pointer.x-b.x)/85);
        const push = pointer.y > H-130 ? Math.sign(b.x-pointer.x)*near*near*18 : 0;
        const sway = reduced ? 0 : Math.sin(t*1.4+b.phase)*bh*0.12 + Math.sin(t*.55+b.x*.006)*bh*.08;
        const lean = b.lean+sway+push;
        ctx.fillStyle=b.color; ctx.beginPath(); ctx.moveTo(b.x-b.w,ground);
        ctx.quadraticCurveTo(b.x+lean*.3,ground-bh*.6,b.x+lean,ground-bh);
        ctx.quadraticCurveTo(b.x+lean*.45+2,ground-bh*.42,b.x+b.w,ground); ctx.fill();
      }
      ctx.fillStyle='#245936'; ctx.fillRect(0,ground,W,12);
      // Clippings appear only at the cutting deck and settle behind it.
      if(t>3 && t<16 && !reduced) {
        for(let i=0;i<15;i++) {
          const age=(t*1.8+i*.071)%1;
          const px=mx+38*scale-age*(30+i*3);
          const py=ground-15-Math.sin(age*Math.PI)*(20+i*2);
          ctx.globalAlpha=1-age;
          line([[px,py],[px+5,py-3]],i%2?'#b0cf6a':'#76ad55',2);
        }
        ctx.globalAlpha=1;
      }
      const count=W<600?5:9;
      for(let i=0;i<count;i++) {
        const phase=i*2.399;
        const x=(i+.5)*W/count + Math.sin(t*.48+phase)*Math.min(65,W/count*.4);
        const y=45+(i%3)*23+Math.sin(t*1.15+phase)*12;
        bee(x,y,(W<600?.57:.7)+(i%3)*.07,t+phase,Math.cos(t*.48+phase)>0?1:-1);
      }
      if(reduced) mower(W*.72,0,scale);
      else if(t>=2.2 && t<=17) mower(mx,t,scale);
    };
    const stop=()=>{ cancelAnimationFrame(raf); raf=0; last=0; };
    const tick=(now)=>{
      raf=0;
      elapsed+=Math.min((now-(last||now))/1000,.06);
      last=now; draw();
      if(visible&&!document.hidden&&!reduced) raf=requestAnimationFrame(tick);
    };
    const start=()=>{ if(!raf&&visible&&!document.hidden&&!reduced) raf=requestAnimationFrame(tick); };
    const resize=()=>{
      W=canvas.clientWidth; H=canvas.clientHeight;
      const dpr=Math.min(devicePixelRatio||1,1.5);
      canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      const rnd=mulberry32(9173+W); blades=[];
      const palette=['#356e43','#4b8750','#78a852','#9cbb68'];
      for(let layer=0;layer<3;layer++) {
        const count=Math.round(W/(W<600?5:4));
        for(let i=0;i<count;i++) blades.push({x:rnd()*W,h:32+rnd()*75+(layer===0?12:0),w:1.2+rnd()*2,lean:rnd()*14-7,phase:rnd()*6.28,seed:rnd(),color:palette[(layer+Math.floor(rnd()*2))%4]});
      }
      draw();
    };
    const ro=new ResizeObserver(resize); ro.observe(canvas);
    const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting; visible?start():stop();}); io.observe(canvas);
    const visibility=()=>document.hidden?stop():start();
    const motionChange=()=>{ reduced=motion.matches; stop(); draw(); start(); };
    const move=(e)=>{if(e.pointerType==='touch'||reduced)return;const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;};
    const leave=()=>{pointer.x=-1000;pointer.y=-1000;};
    const section=canvas.closest('section');
    section.addEventListener('pointermove',move,{passive:true}); section.addEventListener('pointerleave',leave);
    document.addEventListener('visibilitychange',visibility); motion.addEventListener('change',motionChange);
    resize();
    return()=>{stop();ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',motionChange);section.removeEventListener('pointermove',move);section.removeEventListener('pointerleave',leave);};
  },[]);
  return <div className="lawn-scene">
    <div className="lawn-scene-heading"><span><i aria-hidden="true" /> These bees mean business.</span>
    </div>
    <canvas ref={canvasRef} className="lawn-canvas" aria-hidden="true" />
  </div>;
}
