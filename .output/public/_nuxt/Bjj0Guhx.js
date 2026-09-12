import{d as H,V as U,X as J,Y as K,o as C,c as V,n as L,k as Q,a as n,e as Z,_ as ee,w as I,F as te,r as oe,f as ne,x as se,b as S,D as M,t as z}from"./D2sdp3JB.js";const ae=`
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  varying float vSeed;
  varying float vGlow;
  void main() {
    vSeed = aSeed;
    float t = uTime * (0.06 + aSeed * 0.09);
    vec3 p = position;
    float y = mod(p.y + t * 4.0 + aSeed * 20.0, 74.0) - 37.0;
    float sway = sin(uTime * 0.35 + aSeed * 6.2831) * 3.2 + uMouse.x * 7.0;
    float sway2 = cos(uTime * 0.28 + aSeed * 9.42) * 2.4 + uMouse.y * 5.0;
    vec3 pos = vec3(p.x + sway, y, p.z + sway2);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.55 + 0.9 * aSeed) * (260.0 / -mv.z);
    gl_PointSize = min(gl_PointSize, 90.0);
    vGlow = smoothstep(26.0, 6.0, length(pos.xz * vec2(0.9, 1.0)));
    gl_Position = projectionMatrix * mv;
  }
`,ie=`
  precision mediump float;
  varying float vSeed;
  varying float vGlow;
  uniform float uOpacity;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.08, d);
    vec3 col = mix(uA, uB, vSeed);
    col = mix(col, uC, smoothstep(0.2, 1.0, vSeed) * 0.55);
    float pulse = 0.72 + 0.28 * sin(vSeed * 40.0);
    col *= (0.5 + vGlow) * pulse;
    gl_FragColor = vec4(col, alpha * uOpacity * 0.55);
  }
`,re=H({__name:"VaporBackground",props:{className:{}},setup(k){const A=Q(null);let c;return U(()=>{const a=A.value;!a||typeof window>"u"||window.matchMedia("(prefers-reduced-motion: reduce)").matches||(async()=>{const o=await J(()=>import("./Dljb2UHm.js"),[],import.meta.url);if(!a)return;const v=window.matchMedia("(pointer: coarse)").matches||window.innerWidth<768||(navigator.maxTouchPoints??0)>1,X=navigator.hardwareConcurrency??8;let Y=v?X<=4?.55:.8:1;const h=v?160:300,O=Math.floor(h*.35);let r=Math.floor(h*Y);const q=v?1.5:2,w=document.createElement("canvas");w.style.cssText="width:100%;height:100%;display:block;",a.appendChild(w);const g=new o.WebGLRenderer({canvas:w,alpha:!0,antialias:!v,powerPreference:"high-performance"});g.setPixelRatio(Math.min(window.devicePixelRatio||1,q));const B=new o.Scene,x=new o.PerspectiveCamera(55,1,1,200);x.position.set(0,0,58);const i={x:0,y:0,tx:0,ty:0},_=e=>{const t="touches"in e?e.touches[0]?.clientX:e.clientX,l="touches"in e?e.touches[0]?.clientY:e.clientY;t==null||l==null||(i.tx=t/window.innerWidth*2-1,i.ty=l/window.innerHeight*2-1)};window.addEventListener("pointermove",_,{passive:!0}),window.addEventListener("touchmove",_,{passive:!0});let u=null,d=null,m=null;function E(e){d&&(d.dispose(),u&&B.remove(u)),d=new o.BufferGeometry;const t=new Float32Array(e*3),l=new Float32Array(e);for(let p=0;p<e;p++)t[p*3]=(Math.random()-.5)*62,t[p*3+1]=(Math.random()-.5)*74,t[p*3+2]=(Math.random()-.5)*22,l[p]=Math.random();d.setAttribute("position",new o.BufferAttribute(t,3)),d.setAttribute("aSeed",new o.BufferAttribute(l,1)),m={uTime:{value:0},uMouse:{value:new o.Vector2(0,0)},uSize:{value:v?5.6:6.4},uOpacity:{value:1},uA:{value:new o.Color("#7c5cf0")},uB:{value:new o.Color("#38bdf8")},uC:{value:new o.Color("#4ade80")}};const $=new o.ShaderMaterial({vertexShader:ae,fragmentShader:ie,uniforms:m,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending});u=new o.Points(d,$),B.add(u)}E(r);let P=0,T=performance.now(),j=0,y=!1;const b=new o.Clock;let F=0,f=!0;const R=()=>{if(F=requestAnimationFrame(R),!f||!m)return;Math.min(b.getDelta(),.05);const e=b.elapsedTime;i.x+=(i.tx-i.x)*.04,i.y+=(i.ty-i.y)*.04,m.uTime.value=e,m.uMouse.value.set(i.x,i.y),m.uOpacity.value=.75+.25*Math.sin(e*.4),g.render(B,x),P++;const t=performance.now();if(t-T>=1e3){const l=P/((t-T)/1e3);P=0,T=t,j++,j>2&&l<42&&r>O&&!y&&(y=!0,r=Math.max(O,Math.floor(r*.55)),E(r)),l>54&&y&&r<h&&(r=Math.min(h,Math.floor(r*1.5)),E(r),y=!1)}};R();const G=()=>{const e=a.clientWidth||1,t=a.clientHeight||1;g.setSize(e,t,!1),x.aspect=e/t,x.updateProjectionMatrix()};G();const N=new ResizeObserver(G);N.observe(a);const D=new IntersectionObserver(e=>{const t=e[0];t&&(f=t.isIntersecting,f&&b.getDelta())});D.observe(a);const W=()=>{document.hidden?f=!1:(f=!0,b.getDelta())};document.addEventListener("visibilitychange",W),c=()=>{cancelAnimationFrame(F),N.disconnect(),D.disconnect(),document.removeEventListener("visibilitychange",W),window.removeEventListener("pointermove",_),window.removeEventListener("touchmove",_),d?.dispose(),u&&u.material.dispose(),g.dispose(),w.remove()}})()}),K(()=>{c?.()}),(a,s)=>(C(),V("div",{ref_key:"holder",ref:A,"aria-hidden":"true",class:L(["pointer-events-none absolute inset-0 overflow-hidden",k.className])},null,2))}}),xe=Object.assign(re,{__name:"VaporBackground"}),le={class:"wrap mt-10"},ce={class:"mb-4 flex items-end justify-between"},de={class:"no-scrollbar snap-x-mandatory -mx-0 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-4"},ue={class:"relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10]"},me=["src","alt"],pe={class:"absolute inset-x-0 bottom-0 flex items-end justify-between p-4"},ve={class:"text-[17px] font-extrabold text-snow drop-shadow-md"},fe={class:"mt-0.5 text-[11px] text-mist tnum"},he={class:"text-[24px] drop-shadow-[0_0_14px_rgba(167,139,250,0.8)]"},we=H({__name:"CategorySlider",props:{cats:{}},setup(k){return(A,c)=>{const a=ee;return C(),V("div",le,[n("div",ce,[c[1]||(c[1]=n("div",null,[n("h2",{class:"text-[19px] font-extrabold text-snow"},"دسته‌بندی‌ها"),n("p",{class:"mt-1 text-[11.5px] text-dim"},"سریع‌ترین راه رسیدن به طعم دلخواهت")],-1)),Z(a,{to:"/categories",class:"pressable rounded-xl px-2 py-2 text-[12px] font-extrabold text-vio"},{default:I(()=>[...c[0]||(c[0]=[ne(" همه دسته‌ها ← ",-1)])]),_:1})]),n("div",de,[(C(!0),V(te,null,oe(k.cats,(s,o)=>(C(),se(a,{key:s.slug,to:`/shop?category=${s.slug}`,class:L(["group relative block w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/10 lg:w-auto",o===0?"lg:col-span-1":""])},{default:I(()=>[n("div",ue,[n("img",{src:s.image??"",alt:s.name,loading:"lazy",decoding:"async",class:"absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"},null,8,me),n("div",{class:L(["absolute inset-0 bg-gradient-to-t to-transparent",S(M)[s.slug]?.tint==="neon"?"from-ink via-neon/15":S(M)[s.slug]?.tint==="ice"?"from-ink via-ice/15":S(M)[s.slug]?.tint==="blush"?"from-ink via-blush/15":"from-ink via-vio/20"])},null,2),n("div",pe,[n("div",null,[n("p",ve,z(s.name),1),n("p",fe,z(s.count)+" محصول",1)]),n("span",he,z(S(M)[s.slug]?.emoji??"✨"),1)])])]),_:2},1032,["to","class"]))),128))])])}}}),_e=Object.assign(we,{__name:"VaporCategorySlider"});export{_e as C,xe as V};
