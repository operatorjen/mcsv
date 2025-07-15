(() => {
  const cv=sc,
        W=innerWidth, H=innerHeight;
  cv.width=W; cv.height=H;
  const x=cv.getContext('2d');
  const RA=Math.random;
  x.globalCompositeOperation='saturation';

  const S={
    e:{happy:{r:.2,d:-.1},sad:{r:-.1,d:.2},depressed:{r:-.2,d:.3},anxious:{r:-.2,d:.3},excited:{r:.3,d:.2},nervous:{r:-.2,d:.2},frustrated:{r:-.2,d:.2},content:{r:.1,d:-.2}},
    b:{buying:{r:.1,d:-.1},saving:{r:.2,d:-.1},researching:{r:.1,d:0},avoiding:{r:-.1,d:.1},sharing:{r:.2,d:-.1},meditating:{r:.3,d:-.2}}
  };

  const g=(r,d)=>{let m=1e9,s; for(const C of [S.e,S.b]) for(const k in C){const v=C[k],D=Math.abs(v.r-r)+Math.abs(v.d-d); if(D<m){m=D; s=k;}} return s;};

  class C {
    constructor(x,y,r=RA(),d=RA(),e=0.1){
      this.x=x; this.y=y; this.r=r; this.d=d; this.e=e;
      this.a=[]; this.h=[]; this.s=g(r,d);
      this.v={x:(RA()-.5)*4,y:(RA()-.5)*4};
      this.R=['instigator','observer','receiver'][~~(3*RA())];
      this.o=[]; this.t=0;
    }
    uR(){
      if(++this.t%100) return;
      const T=.7;
      if(this.r>T&&this.R!=='instigator'){this.R='instigator';this.t=0;}
      else if(this.d>T&&this.R!=='receiver'){this.R='receiver';this.t=0;}
      else if(this.r<T&&this.d<T&&this.R!=='observer'){this.R='observer';this.t=0;}
    }
    aA(f,t,k){this.a.push({f,t,k});}
    gC(){return {stateName:this.s,resonance:this.r,dissonance:this.d};}
    pF(k,{resonance:R,dissonance:D}){return k*D/(R+D);}
    uS(){
      this.r*=.999; this.d*=.999;
      const ns=g(this.r,this.d);
      if(ns!==this.s){
        this.h.push(ns);
        if(this.h.length>10) this.h.shift();
        this.s=ns;
      }
      this.uR();
    }
    pNS(){
      const P=this.a.filter(q=>q.f===this.s);
      if(!P.length) return;
      let m=-1,sel;
      for(const {t,k} of P){
        const p=this.pF(k,this.gC());
        if(p>m){m=p; sel=t;}
      }
      const e=S.e[sel]||S.b[sel];
      if(e){ this.r=Math.min(1,Math.max(0,this.r+e.r*.1));
              this.d=Math.min(1,Math.max(0,this.d+e.d*.1)); }
      this.uS();
      return {from:this.s,to:sel,currentState:this.gC(),history:this.h};
    }
    m(W,H){
      this.x+=this.v.x; this.y+=this.v.y;
      if(this.x<0||this.x>W) this.v.x*=-1;
      if(this.y<0||this.y>H) this.v.y*=-1;
      this.v.x*=.99; this.v.y*=.99;
      this.v.x+=(RA()-.5)*.15; this.v.y+=(RA()-.5)*.15;
      const V=Math.hypot(this.v.x,this.v.y),M=5;
      if(V>M){this.v.x=this.v.x/V*M; this.v.y=this.v.y/V*M;}
    }
    i(o){
      const dx=this.x-o.x, dy=this.y-o.y, d=Math.hypot(dx,dy);
      if(d<150){
        const rs=1-Math.abs(this.r-o.r), ds=1-Math.abs(this.d-o.d),
              F=.01*(rs+ds)/(d*d);
        this.v.x-=F*dx; this.v.y-=F*dy; o.v.x+=F*dx; o.v.y+=F*dy;
        if(d<50) this.rI(o);
      }
    }
    rI(o){
      if(this.R==='instigator') this.iP(o);
      else if(this.R==='observer') this.oI(this,o);
    }
    iP(o){
      const P=.1;
      o.r=Math.max(0,Math.min(1,o.r+(this.r-o.r)*P));
      o.d=Math.max(0,Math.min(1,o.d+(this.d-o.d)*P));
      o.uS();
    }
    oI(a,b){
      if(a===b) return;
      this.o.push({
        c1:{role:a.R,state:a.gC(),x:a.x,y:a.y},
        c2:{role:b.R,state:b.gC(),x:b.x,y:b.y},
        t:Date.now()
      });
      if(this.o.length>5) this.o.shift();
    }
  }

  const M=[],n=40,all=Object.keys(S.e).concat(Object.keys(S.b));
  for(let i=0;i<n;i++){
    const u=new C(RA()*W,RA()*H);
    for(let j=0;j<30;j++){
      const f=all[~~(RA()*all.length)],
            t=all[~~(RA()*all.length)],
            k=RA();
      u.aA(f,t,k);
    }
    M.push(u);
  }

  const z=Math.PI/180;
  function D(c){
    const R=65;
    x.beginPath();
    for(let i=0;i<360;i++){
      const a=i*z,noise=1-c.r+c.d,
            rad=R+(RA()-.5)*noise*c.d*20,
            X=c.x+rad*Math.cos(a), Y=c.y+rad*Math.sin(a);
      i?x.lineTo(X,Y):x.moveTo(X,Y);
    }
    x.closePath();
    x.fillStyle=`rgba(${~~(c.d*255)},${~~(c.r*185)},${~~(c.r*215)},.65)`; x.fill();
    x.strokeStyle=`rgb(${~~(c.d*155)},${~~(c.r*255)},${~~(c.r*165)})`;
    x.lineWidth=c.d*3; x.stroke();
    x.font='12px Arial'; x.fillStyle='white'; x.textAlign='center';
    x.fillText(c.s,c.x,c.y+R+20);
    x.fillStyle='#ccc'; x.fillText(c.R,c.x,c.y+100);
    x.beginPath();
    x.arc(c.x,c.y,25,(c.t%100)/100*2*Math.PI,0);
    x.strokeStyle='rgba(255,255,255,.5)'; x.stroke();
    if(c.R==='observer') c.o.forEach((v,i)=>{
      x.beginPath(); x.moveTo(c.x,c.y);
      x.lineTo(v.c1.x,v.c1.y); x.lineTo(v.c2.x,v.c2.y);
      x.strokeStyle=`rgba(55,255,215,${.4+i*.1})`; x.stroke();
    });
  }

  function U(){
    x.clearRect(0,0,W,H);
    M.forEach(a=>{
      a.pNS(); a.m(W,H); D(a);
      M.forEach(b=>a!==b&&a.i(b));
    });
    M.forEach(a=>{
      if(a.t===0){
        x.beginPath();
        x.arc(a.x,a.y,50,0,2*Math.PI);
        x.fillStyle='rgba(255,255,255,.3)'; x.fill();
      }
    });
  }

  (function A(){ U(); requestAnimationFrame(A); })();
})();
