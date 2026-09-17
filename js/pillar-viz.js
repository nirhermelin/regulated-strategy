(function(){
  var canvases = document.querySelectorAll('.pillar-canvas');
  if(!canvases.length) return;
  var DPR = Math.min(window.devicePixelRatio||1, 2);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COPPER=[168,104,63], SAGE=[95,134,99], AMBER=[184,134,46];
  function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}

  function setup(cv){
    var ctx=cv.getContext('2d'), W,H;
    function size(){var r=cv.getBoundingClientRect();W=cv.width=Math.max(1,r.width*DPR);H=cv.height=Math.max(1,r.height*DPR);}
    size();
    window.addEventListener('resize',function(){clearTimeout(cv._t);cv._t=setTimeout(size,200);});
    return {ctx:ctx, get W(){return W;}, get H(){return H;}, size:size};
  }

  /* -------- BUSINESS: growing bars + rising trend line, loops -------- */
  function business(cv){
    var s=setup(cv), x=s.ctx, p=0, T=0, last=0;
    cv._reset=function(){ p=0; last=0; };
    function frame(ts){ if(!cv._run){ x.clearRect(0,0,s.W,s.H); last=0; requestAnimationFrame(frame); return; } if(!last)last=ts; var dt=Math.min(0.05,(ts-last)/1000); last=ts; T+=dt;
      var W=s.W,H=s.H; x.clearRect(0,0,W,H);
      p += dt/3.5; if(p>1.5) p=0;                     // draw in faster, brief hold, restart
      var pp=Math.min(1,p);
      var gx=W*0.10, gy=H*0.18, gw=W*0.80, gh=H*0.64;
      // bars
      var bn=6;
      for(var i=0;i<bn;i++){
        var bp=Math.max(0,Math.min(1,(pp*bn - i)));
        if(bp<=0) continue;
        var bw=gw/bn*0.5, bx=gx+(gw/bn)*(i+0.25);
        var bh=gh*(0.22+0.62*(i/(bn-1)))*bp;
        x.fillStyle=rgba(COPPER,0.13);
        x.fillRect(bx, gy+gh-bh, bw, bh);
      }
      // trend line
      var ln=32, pts=[];
      for(var s2=0;s2<=ln;s2++){var t=s2/ln;
        pts.push([gx+gw*t, gy+gh - gh*(0.15+0.7*t+Math.sin(t*6)*0.05)]);
      }
      var dn=Math.floor(pp*ln);
      x.strokeStyle=rgba(COPPER,0.85); x.lineWidth=2*DPR; x.lineCap='round'; x.lineJoin='round';
      x.beginPath();
      for(var k=0;k<=dn;k++){ if(k===0)x.moveTo(pts[k][0],pts[k][1]); else x.lineTo(pts[k][0],pts[k][1]); }
      x.stroke();
      if(dn>0){var hd=pts[Math.min(dn,ln)];
        var g=x.createRadialGradient(hd[0],hd[1],0,hd[0],hd[1],9*DPR);
        g.addColorStop(0,rgba(AMBER,0.9)); g.addColorStop(1,rgba(AMBER,0));
        x.fillStyle=g; x.beginPath(); x.arc(hd[0],hd[1],9*DPR,0,7); x.fill();
        x.fillStyle=rgba(COPPER,1); x.beginPath(); x.arc(hd[0],hd[1],2.4*DPR,0,7); x.fill();
      }
      requestAnimationFrame(frame);
    }
    if(reduce){ p=1; var f={}; requestAnimationFrame(frame); } else requestAnimationFrame(frame);
  }

  /* -------- NERVOUS SYSTEM: mycelium field (from the music site) -------- */
  function mycelium(cv){
    var s=setup(cv), cb=s.ctx, tips=[], spores=[];
    var PAL=[SAGE,[120,150,80],[104,162,74]];
    function mk(i,cnt){return {x:(0.05+0.9*((i+0.5)/cnt))*s.W+(Math.random()-.5)*20*DPR, y:s.H+6, a:-Math.PI/2+(Math.random()-.5)*0.5, len:0, max:s.H*(0.5+Math.random()*0.5), w:(0.8+Math.random()*1.4), col:PAL[i%PAL.length], gen:0};}
    function seed(){tips=[]; var n=11; for(var k=0;k<n;k++)tips.push(mk(k,n));}
    seed();
    function step(){
      var W=s.W,H=s.H;
      cb.globalCompositeOperation='source-over'; cb.fillStyle='rgba(250,246,239,0.045)'; cb.fillRect(0,0,W,H);
      for(var i=tips.length-1;i>=0;i--){var t=tips[i];
        if(t.len>t.max){tips.splice(i,1);continue;}
        var sp=1.4*DPR, nx=t.x+Math.cos(t.a)*sp, ny=t.y+Math.sin(t.a)*sp;
        cb.strokeStyle=rgba(t.col,0.62); cb.lineWidth=(t.w*1.5)*DPR; cb.lineCap='round';
        cb.beginPath(); cb.moveTo(t.x,t.y); cb.lineTo(nx,ny); cb.stroke();
        t.x=nx; t.y=ny; t.len+=sp; t.a += (Math.random()-.5)*0.26 - 0.01;
        if(t.gen<5 && Math.random()<0.036 && t.len>45*DPR){ tips.push({x:t.x,y:t.y,a:t.a+(Math.random()<.5?-1:1)*(0.5+Math.random()*0.6),len:0,max:t.max*0.55,w:t.w*0.72,col:t.col,gen:t.gen+1}); }
        if(Math.random()<0.022) spores.push({x:t.x,y:t.y,vy:-(0.2+Math.random()*0.5)*DPR,ph:Math.random()*6,life:1,r:(0.5+Math.random()*1.1)*DPR,col:t.col});
      }
      for(var j=spores.length-1;j>=0;j--){var sp2=spores[j]; sp2.y+=sp2.vy; sp2.x+=Math.sin(sp2.y*0.015+sp2.ph)*0.4*DPR; sp2.life-=0.004;
        if(sp2.life<=0){spores.splice(j,1);continue;}
        cb.beginPath(); cb.arc(sp2.x,sp2.y,sp2.r,0,7); cb.fillStyle=rgba(sp2.col,0.30*sp2.life); cb.fill();
      }
      if(tips.length===0 && spores.length<6) seed();
    }
    cv._reset=function(){ seed(); spores=[]; };
    function loop(){ if(cv._run){ step(); } else { cb.clearRect(0,0,s.W,s.H); } requestAnimationFrame(loop); }
    if(reduce){ for(var q=0;q<500;q++)step(); } else loop();
  }

  /* -------- AI: neural constellation, signals travel between nodes -------- */
  function ai(cv){
    var s=setup(cv), x=s.ctx, streams=[], packets=[], T=0, last=0;
    var GLYPHS="01<>/{}=+*#01".split("");
    function build(){ streams=[]; packets=[];
      var cols=Math.max(7, Math.round(s.W/(12*DPR)));
      for(var i=0;i<cols;i++){
        streams.push({
          x:(i+0.5)/cols*s.W,
          y:Math.random()*s.H,
          sp:(28+Math.random()*46)*DPR,     // fall speed
          gap:(11+Math.random()*7)*DPR,      // glyph spacing
          len:6+Math.floor(Math.random()*8), // trail length
          fs:(9+Math.random()*3),            // font size
          t:Math.random()*100
        });
      }
    }
    s.size(); build();
    window.addEventListener('resize',function(){clearTimeout(cv._t2);cv._t2=setTimeout(function(){s.size();build();},220);});
    cv._reset=function(){ build(); last=0; };
    function frame(ts){ if(!cv._run){ x.clearRect(0,0,s.W,s.H); last=0; requestAnimationFrame(frame); return; } if(!last)last=ts; var dt=Math.min(0.05,(ts-last)/1000); last=ts; T+=dt;
      var W=s.W,H=s.H; x.clearRect(0,0,W,H);
      x.textAlign="center";
      for(var i=0;i<streams.length;i++){var st=streams[i]; st.y+=st.sp*dt; st.t+=dt;
        if(st.y - st.len*st.gap > H){ st.y=-Math.random()*H*0.4; }
        x.font=(st.fs*DPR)+"px 'Space Grotesk', monospace";
        for(var j=0;j<st.len;j++){
          var gy=st.y - j*st.gap;
          if(gy<0||gy>H) continue;
          var head=(j===0);
          var a=head?0.95:(0.5*(1 - j/st.len));
          // occasional glyph change
          var gi=((st.t*6+i*3+j)|0)%GLYPHS.length;
          if(head){ x.fillStyle=rgba([230,200,120],a); }
          else { x.fillStyle=rgba(AMBER,a); }
          x.fillText(GLYPHS[gi], st.x, gy);
        }
      }
      // bright data packets racing down a couple of streams
      x.globalCompositeOperation='lighter';
      if(!reduce && Math.random()<0.12 && streams.length){ var stm=streams[(Math.random()*streams.length)|0]; packets.push({x:stm.x, y:-10*DPR, sp:(180+Math.random()*120)*DPR}); }
      for(var p=packets.length-1;p>=0;p--){var pk=packets[p]; pk.y+=pk.sp*dt; if(pk.y>H+20*DPR){packets.splice(p,1);continue;}
        var r=4*DPR; var gr=x.createRadialGradient(pk.x,pk.y,0,pk.x,pk.y,r*3); gr.addColorStop(0,rgba([245,220,150],0.95)); gr.addColorStop(1,rgba(AMBER,0));
        x.fillStyle=gr; x.beginPath(); x.arc(pk.x,pk.y,r*3,0,7); x.fill();
      }
      x.globalCompositeOperation='source-over';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  canvases.forEach(function(cv){
    var kind=cv.getAttribute('data-viz');
    cv._run = false;
    if(kind==='business') business(cv);
    else if(kind==='mycelium') mycelium(cv);
    else if(kind==='ai') ai(cv);

    var card = cv.closest('.pillar');
    if(!card) return;
    var stopTimer;
    function start(){
      clearTimeout(stopTimer);
      if(cv._reset) cv._reset();
      cv._run = true;
      cv.classList.add('viz-on');
    }
    function stop(){
      cv.classList.remove('viz-on');           // CSS fades opacity out over ~1.1s
      stopTimer = setTimeout(function(){ cv._run = false; }, 1200); // stop advancing after fade
    }
    card.addEventListener('mouseenter', start);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focusin', start);
    card.addEventListener('focusout', stop);
  });
})();
