(function(){
 if(!document.getElementById('heroViz'))return;


  var DPR=Math.min(window.devicePixelRatio||1,2);
  var fade=1, fadingOut=false, holdT=0;
  var cv=document.getElementById('heroViz'), x=cv.getContext('2d'), W,H,T=0,last=0;
  var reduce=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COPPER=[168,104,63], SAGE=[95,134,99], AMBER=[184,134,46];
  function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}
  function ease(p){return p<0?0:p>1?1:p*p*(3-2*p);}
  var filaments=[], pulses=[], anchors=[];

  function size(){var r=cv.getBoundingClientRect();W=cv.width=Math.max(1,r.width*DPR);H=cv.height=Math.max(1,r.height*DPR);build();}
  function build(){
    filaments=[];pulses=[];anchors=[];
    // organic roots on the right
    var rootY=[0.12,0.22,0.32,0.42,0.5,0.58,0.68,0.78,0.88,0.95];
    for(var k=0;k<rootY.length;k++) filaments.push(makeFil(W*(0.74+Math.random()*0.24),H*(rootY[k]+(Math.random()-.5)*0.06)));
    // anchors = points on the business chart the pulses can hop between
  }
  function makeFil(sx,sy){return {segs:[{x:sx,y:sy}],x:sx,y:sy,a:Math.PI+(Math.random()-.5)*0.9,grow:0,max:W*(0.22+Math.random()*0.34),w:(0.5+Math.random()*1.5),done:false,gen:0,tx:null};}
  function growFil(f,dt){ if(f.done)return; var sp=W*0.055*dt; f.grow+=sp;
    if(f.tx==null){f.tx=W*(0.34+Math.random()*0.30);f.ty=H*(0.05+Math.random()*0.9);}
    var target=Math.atan2(f.ty-f.y,f.tx-f.x); f.a+=(target-f.a)*0.03+(Math.random()-.5)*0.14;
    f.x+=Math.cos(f.a)*sp; f.y+=Math.sin(f.a)*sp; f.segs.push({x:f.x,y:f.y}); if(f.segs.length>150)f.segs.shift();
    if(f.gen<2&&Math.random()<0.02&&f.grow>W*0.08){var nf=makeFil(f.x,f.y);nf.a=f.a+(Math.random()<.5?-1:1)*0.7;nf.gen=f.gen+1;nf.max=f.max*0.5;nf.tx=f.tx;nf.ty=f.ty;filaments.push(nf);}
    if(f.grow>f.max)f.done=true; }

  // ---- BUSINESS side (left): growth chart + bars + funnel + target, drawn with progress p ----
  function drawBusiness(p){
    var gx=W*0.05, gy=H*0.16, gw=W*0.56, gh=H*0.54; // chart frame
    x.save();
    // axes
    x.strokeStyle=rgba(COPPER,0.35); x.lineWidth=1.2*DPR;
    x.beginPath(); x.moveTo(gx,gy); x.lineTo(gx,gy+gh); x.lineTo(gx+gw,gy+gh); x.stroke();
    // bars growing up (behind the line)
    var bn=6;
    for(var i=0;i<bn;i++){
      var bp=ease((p*bn - i)); if(bp<=0)continue;
      var bw=gw/bn*0.55, bx=gx+ (gw/bn)*(i+0.22);
      var bh=gh*(0.22+0.62*(i/(bn-1))) * bp;
      x.fillStyle=rgba(COPPER,0.14);
      x.fillRect(bx, gy+gh-bh, bw, bh);
    }
    // rising trend line with a moving highlight dot
    var pts=[]; var ln=40;
    for(var s=0;s<=ln;s++){var t=s/ln;
      var xx=gx+gw*t;
      var yy=gy+gh - gh*(0.15 + 0.7*t + Math.sin(t*7)*0.05); // upward with wobble
      pts.push([xx,yy]);
    }
    var drawN=Math.floor(ease(p)*ln);
    x.strokeStyle=rgba(COPPER,0.9); x.lineWidth=2*DPR; x.lineCap='round'; x.lineJoin='round';
    x.beginPath();
    for(var s2=0;s2<=drawN;s2++){ if(s2===0)x.moveTo(pts[s2][0],pts[s2][1]); else x.lineTo(pts[s2][0],pts[s2][1]); }
    x.stroke();
    // head dot with glow + arrowhead
    if(drawN>0){var hd=pts[Math.min(drawN,ln)];
      var g=x.createRadialGradient(hd[0],hd[1],0,hd[0],hd[1],10*DPR);
      g.addColorStop(0,rgba(AMBER,0.9));g.addColorStop(1,rgba(AMBER,0));
      x.fillStyle=g;x.beginPath();x.arc(hd[0],hd[1],10*DPR,0,7);x.fill();
      x.fillStyle=rgba(COPPER,1);x.beginPath();x.arc(hd[0],hd[1],2.6*DPR,0,7);x.fill();
    }
    x.restore();

    // ---- funnel (below the chart) ----
    var fx0=W*0.10, fy0=H*0.76, fw=W*0.26, fh=H*0.16;
    var stages=4;
    for(var k=0;k<stages;k++){
      var fp=ease(p*stages - k); if(fp<=0)continue;
      var wTop=fw*(1-k/stages), wBot=fw*(1-(k+1)/stages);
      var yy=fy0 + (fh/stages)*k, hh=fh/stages*0.8;
      var cxs=fx0+fw/2;
      x.fillStyle=rgba(COPPER,0.12+0.05*k);
      x.beginPath();
      x.moveTo(cxs-wTop/2*fp, yy);
      x.lineTo(cxs+wTop/2*fp, yy);
      x.lineTo(cxs+wBot/2*fp, yy+hh);
      x.lineTo(cxs-wBot/2*fp, yy+hh);
      x.closePath(); x.fill();
    }
    // ---- target (top-right of business zone) ----
    var tx=W*0.58, ty=H*0.24, tp=ease(p*1.2-0.2);
    if(tp>0){ x.strokeStyle=rgba(COPPER,0.4); x.lineWidth=1.4*DPR;
      for(var rr=0;rr<3;rr++){x.beginPath();x.arc(tx,ty,(8+rr*9)*DPR,-Math.PI/2,-Math.PI/2+7*tp);x.stroke();}
      if(tp>0.9){x.fillStyle=rgba(AMBER,0.9);x.beginPath();x.arc(tx,ty,3*DPR,0,7);x.fill();}
    }
    // collect a few anchor points for pulses to travel between
    anchors=[pts[Math.floor(ln*0.25)],pts[Math.floor(ln*0.6)],pts[ln],[tx,ty],[fx0+fw/2,fy0]];
  }


  // ---- nervous-system heartbeat + ECG spine (right side) ----
  var beat=0, beatPhase=0;
  function heartbeat(dt){
    // ~ 1 beat per 1.4s, with a sharp systole spike then settle (organic, breath-modulated)
    beatPhase += dt/1.4;
    if(beatPhase>=1) beatPhase-=1;
    // envelope: quick rise, quick fall (the 'lub'), small echo (the 'dub'), then rest
    var p=beatPhase, e=0;
    if(p<0.06) e=p/0.06;                 // rise
    else if(p<0.16) e=1-(p-0.06)/0.10;   // fall
    else if(p<0.24) e=0.4*(1-(p-0.16)/0.08); // dub echo
    else e=0;
    // breath modulation: slow swell every ~7s makes beats deeper/shallower
    var breath=0.75+0.25*Math.sin(T*0.9);
    beat = e*breath;
  }
  function drawECG(){
    // a vertical ECG/breath ribbon down the right edge — the 'spine' the filaments grow from
    var sx=W*0.955, top=H*0.12, bot=H*0.88, amp=W*0.028;
    x.save();
    x.strokeStyle=rgba(SAGE,0.5); x.lineWidth=1.6*DPR; x.lineCap='round'; x.lineJoin='round';
    x.beginPath();
    var N=120;
    for(var i=0;i<=N;i++){
      var t=i/N, yy=top+(bot-top)*t;
      // scrolling waveform: gentle breath sine + a sharp beat blip that travels
      var scroll=(t - (T*0.12 % 1));
      var breathWave=Math.sin(t*6.283*1.5 - T*1.2)*0.35;
      // sharp beat spike near the current beat position
      var bp=((t + T*0.12) % 1);
      var spike=0;
      var d=Math.abs(bp-0.5);
      if(d<0.02) spike=(1-d/0.02); // narrow tall spike
      var off=(breathWave + spike*2.2*(0.4+beat)) * amp;
      var xx=sx - off;
      if(i===0)x.moveTo(xx,yy); else x.lineTo(xx,yy);
    }
    x.stroke();
    x.restore();
  }

  var bizP=0;
  function step(dt){ T+=dt;
    x.clearRect(0,0,W,H);
    if(!reduce)heartbeat(dt);
    // gentle fade cycle
    if(!reduce){
      if(fadingOut){ fade-=dt*0.35; if(fade<=0){ fade=0; fadingOut=false; build(); } }
      else if(fade<1){ fade+=dt*0.4; if(fade>1)fade=1; }
    }
    x.save(); x.globalAlpha=(fade<0?0:fade>1?1:fade);
    // business draws/grows in over ~4s, then holds
    bizP=Math.min(1,bizP+dt/9);

    if(!reduce)drawECG();
    // organic filaments
    for(var i=0;i<filaments.length;i++){var f=filaments[i]; if(!reduce)growFil(f,dt);
      x.lineCap='round';x.lineWidth=f.w*(1+beat*0.6)*DPR;x.strokeStyle=rgba(SAGE,0.26+beat*0.12);
      x.beginPath();
      for(var s=0;s<f.segs.length;s++){var pp=f.segs[s];var sway=Math.sin(T*0.8+s*0.15+f.segs[0].y*0.01)*1.3*DPR;
        if(s===0)x.moveTo(pp.x,pp.y+sway);else x.lineTo(pp.x,pp.y+sway);}
      x.stroke();
      if(!f.done){var tip=f.segs[f.segs.length-1];x.beginPath();x.arc(tip.x,tip.y,f.w*(1.6+beat*1.4)*DPR,0,7);x.fillStyle=rgba(SAGE,0.4+beat*0.3);x.fill();}
    }

    // AI pulses hop between business anchors and along filaments
    if(!reduce&&Math.random()<0.14){
      if(false){var a=anchors[(Math.random()*anchors.length)|0],b=anchors[(Math.random()*anchors.length)|0];
        if(a&&b&&a!==b)pulses.push({type:'seg',a:a,b:b,t:0,sp:0.7+Math.random()*0.5});}
      else if(filaments.length){var f2=filaments[(Math.random()*filaments.length)|0];if(f2.segs.length>8)pulses.push({type:'fil',f:f2,t:0,sp:0.5+Math.random()*0.5});}
    }
    x.globalCompositeOperation='lighter';
    for(var pz=pulses.length-1;pz>=0;pz--){var pu=pulses[pz];pu.t+=pu.sp*dt;if(pu.t>=1){pulses.splice(pz,1);continue;}
      var px,py; if(pu.type==='seg'){px=pu.a[0]+(pu.b[0]-pu.a[0])*pu.t;py=pu.a[1]+(pu.b[1]-pu.a[1])*pu.t;}
      else{var seg=pu.f.segs;var idx=Math.min(seg.length-1,(pu.t*seg.length)|0);px=seg[idx].x;py=seg[idx].y;}
      var r=4*DPR;var g=x.createRadialGradient(px,py,0,px,py,r*3);g.addColorStop(0,rgba(AMBER,0.9));g.addColorStop(1,rgba(AMBER,0));
      x.fillStyle=g;x.beginPath();x.arc(px,py,r*3,0,7);x.fill();
      x.fillStyle=rgba([230,200,120],0.95);x.beginPath();x.arc(px,py,r*0.5,0,7);x.fill();}
    x.globalCompositeOperation='source-over';

    x.restore();
    var alive=false;for(var q=0;q<filaments.length;q++)if(!filaments[q].done){alive=true;break;}
    if(!alive&&!reduce&&!fadingOut){ holdT+=dt; if(holdT>2.5){ holdT=0; fadingOut=true; } }
  }
  function frame(ts){if(!last)last=ts;var dt=Math.min(0.05,(ts-last)/1000);last=ts;step(dt);requestAnimationFrame(frame);}
  size();window.addEventListener('resize',function(){clearTimeout(cv._t);cv._t=setTimeout(size,200);});
  if(reduce){for(var q=0;q<400;q++)step(0.016);}else requestAnimationFrame(frame);
})();
