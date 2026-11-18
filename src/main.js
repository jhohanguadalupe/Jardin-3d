import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mount = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#b8c2bc');
scene.fog = new THREE.FogExp2('#b8c2bc', 0.004);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, .1, 180);
camera.position.set(0, 1.72, 8.5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
mount.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .055;
controls.target.set(0, 1.68, 0); controls.minDistance = 2; controls.maxDistance = 70; controls.enablePan = false;
controls.maxPolarAngle = Math.PI * .49; controls.minPolarAngle = .12;
controls.rotateSpeed = .42; controls.zoomSpeed = .78; controls.panSpeed = .5;

scene.add(new THREE.HemisphereLight(0xe5f0ff, 0x59604a, 2.05));
const sun = new THREE.DirectionalLight(0xffe7c1, 3.1);
sun.position.set(-16, 28, 15); sun.castShadow = true;
sun.shadow.mapSize.set(3072, 3072); sun.shadow.camera.left = -30; sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30; sun.shadow.bias = -.00018;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xd5e9f3, .7); fill.position.set(14, 12, -18); scene.add(fill);

const mat = (color, roughness=.84, extra={}) => new THREE.MeshStandardMaterial({color, roughness, ...extra});
const stone = mat('#b8ae98'), stoneLight = mat('#d0c6ae'), grout = mat('#756e60'), wallMat = mat('#c9bda3'), wallTop = mat('#e2d7bf');
const soilMat = mat('#493b2b'), grassMat = mat('#ffffff',1), grass2 = mat('#718b52',1), leafMats=['#526f43','#66864d','#789354','#425f3e','#899b59'].map(c=>mat(c,.92)), bark=mat('#62503d');
function box(parent, x,y,z, sx,sy,sz, material, cast=true, receive=true){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=receive;parent.add(m);return m;}
function cylinder(parent,x,y,z,rt,rb,h,material,seg=10){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
// Subtle tile/soil textures are generated locally so the scene stays self-contained.
function noiseTexture(base, fleck, count=1300, size=256){const c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,size,size);for(let i=0;i<count;i++){ctx.globalAlpha=.08+Math.random()*.22;ctx.fillStyle=fleck;const s=.5+Math.random()*2;ctx.fillRect(Math.random()*size,Math.random()*size,s,s);}ctx.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
function lawnTexture(){const c=document.createElement('canvas');c.width=c.height=512;const q=c.getContext('2d');q.fillStyle='#729a51';q.fillRect(0,0,512,512);
 const patches=['rgba(44,92,39,.13)','rgba(143,166,84,.17)','rgba(92,132,56,.16)','rgba(166,174,97,.10)'];
 for(let i=0;i<250;i++){const x=Math.random()*512,y=Math.random()*512,r=8+Math.random()*34,g=q.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,patches[i%patches.length]);g.addColorStop(1,'rgba(100,140,60,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r,0,Math.PI*2);q.fill();}
 for(let i=0;i<18000;i++){const x=Math.random()*512,y=Math.random()*512,len=2+Math.random()*9;q.strokeStyle=patches[Math.floor(Math.random()*patches.length)];q.globalAlpha=.24+Math.random()*.35;q.lineWidth=.45+Math.random()*.9;q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(x+(Math.random()-.5)*2,y-len*.55,x+(Math.random()-.5)*3,y-len);q.stroke();}
 q.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;}
const grassTexture=lawnTexture();grassTexture.repeat.set(1,1);
function lawnRelief(){const c=document.createElement('canvas');c.width=c.height=512;const q=c.getContext('2d');q.fillStyle='#808080';q.fillRect(0,0,512,512);for(let i=0;i<22000;i++){const x=Math.random()*512,y=Math.random()*512,len=2+Math.random()*8;q.strokeStyle=Math.random()>.5?'rgba(220,220,220,.32)':'rgba(45,45,45,.28)';q.lineWidth=.45+Math.random()*.8;q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(x+1,y-len*.55,x+(Math.random()-.5)*2,y-len);q.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
grassMat.bumpMap=lawnRelief();grassMat.bumpScale=.018;
const stoneTexture=noiseTexture('#b9ad96','#6c6558',1800);stoneTexture.repeat.set(4,5);
const stuccoTexture=noiseTexture('#d8cfbd','#a99f8c',9500);stuccoTexture.repeat.set(5,5);
const timberTexture=noiseTexture('#795f48','#c4a078',5500);timberTexture.repeat.set(4,6);
grassMat.map=grassTexture;stone.map=stoneTexture;
// Garden base, paved courtyard, clipped grass beds, and low masonry edges.
box(scene,0,-1.14,0,32.22,.6,25.5,mat('#8d897c'),false,true);
box(scene,0,.015,0,31.8,.12,25.0,mat('#b6ad9a'),false,true);
box(scene,-6,.105,4,15,.12,10.8,grout,false,true);
const patio = box(scene,-6,.17,4,14.8,.12,10.6,stone,false,true);
// A gentle, varied paver pattern with narrow joints.
const pavers=new THREE.InstancedMesh(new THREE.BoxGeometry(.72,.075,.68),stone,520);pavers.receiveShadow=true;const paverDummy=new THREE.Object3D();let paverIndex=0;
for(let z=-1.05,row=0;z<9.2;z+=.72,row++)for(let x=-13.2+(row%2)*.38;x<1.35;x+=.76){paverDummy.position.set(x,.245,z);paverDummy.rotation.y=(Math.random()-.5)*.012;paverDummy.updateMatrix();pavers.setMatrixAt(paverIndex,paverDummy.matrix);pavers.setColorAt(paverIndex,new THREE.Color(['#c7bda8','#bcb29f','#d0c5af','#b2a994'][Math.floor(Math.random()*4)]));paverIndex++;}scene.add(pavers);
box(scene,7.05,.12,4,12.4,.2,10.8,soilMat,false,true);
box(scene,7.05,.22,4,12.1,.12,10.5,grassMat,false,true);
// The playable lawn is a short maintained turf, represented by a layered color and fine relief texture.
// Slim coping around the lawn and a path that connects patio and play lawn.
box(scene,.95,.31,4,.18,.35,10.8,wallTop); box(scene,13.12,.31,4,.18,.35,10.8,wallTop);
box(scene,7.05,.31,-1.4,12.2,.35,.18,wallTop); box(scene,7.05,.31,9.37,12.2,.35,.18,wallTop);
for(let z=-1.25;z<=1.25;z+=.42){box(scene,.8,.3,z,.6,.08,.38,stoneLight,false,true);}

// Open-roof cutaway rooms retain every wall while allowing the plan to be read.
const roomFloor=mat('#cfc8b9'), woodFloor=mat('#997a58',.9,{map:timberTexture}), interiorWall=mat('#d8cfbd',.95,{map:stuccoTexture}), trim=mat('#795f48',.82,{map:timberTexture}), glass=new THREE.MeshPhysicalMaterial({color:'#a8c7c7',roughness:.12,metalness:.08,transparent:true,opacity:.38,transmission:.15,clearcoat:.8});
function room(x,z,w,d,name,type='class'){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 box(g,0,.19,0,w,.22,d,type==='kitchen'?mat('#c9c8bb'):roomFloor,false,true);
 // Full-height rear and side walls, with a garden-facing wall, door and windows.
 box(g,0,1.47,-d/2,w,2.95,.16,interiorWall);box(g,-w/2,1.47,0,.16,2.95,d,interiorWall);box(g,w/2,1.47,0,.16,2.95,d,interiorWall);
 // A full-height garden-side facade leaves a real doorway between wall sections.
 const doorX=-w*.32,doorWidth=1.5,leftWidth=w/2+doorX-doorWidth/2,rightWidth=w/2-doorX-doorWidth/2;
 box(g,-w/2+leftWidth/2,1.47,d/2,leftWidth,2.95,.16,interiorWall);box(g,doorX+doorWidth/2+rightWidth/2,1.47,d/2,rightWidth,2.95,.16,interiorWall);
 box(g,doorX,1.47,d/2,.13,2.95,.15,trim);box(g,doorX+doorWidth,1.47,d/2,.13,2.95,.15,trim);box(g,doorX+doorWidth/2,.1,d/2,doorWidth,.16,.2,trim);box(g,doorX+doorWidth/2,2.91,d/2,doorWidth,.16,.18,trim);
 const door=box(g,doorX+.66,1.35,d/2+.02,1.27,2.1,.09,mat('#8a6445',.72,{map:timberTexture}));door.rotation.y=-.16;
 for(const y of [.79,1.65])box(g,doorX+.66,y,d/2+.075,.92,.055,.025,mat('#b88c5c'),false,false);
 const knob=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),mat('#c19a55',.3,{metalness:.7}));knob.position.set(doorX+1.12,1.3,d/2+.12);g.add(knob);
 // tall exterior windows with mullions
 for(let wx=-w*.22;wx<w*.38;wx+=Math.max(1.4,w*.26)){box(g,wx,2.02,-d/2-.012,1.25,1,.045,glass,false,false);box(g,wx,2.02,-d/2-.045,.055,1.08,.08,trim,false,false);box(g,wx,2.02,-d/2-.045,1.3,.055,.08,trim,false,false);box(g,wx,2.02,-d/2-.045,.045,1,.08,trim,false,false);box(g,wx,1.48,-d/2-.045,1.38,.09,.2,wallTop,false,false);}
 // two garden-side windows, with deep timber reveals, stone sills and room plaque
 for(const wx of [w*.05,w*.3]){box(g,wx,2.02,d/2+.012,1.12,1,.045,glass,false,false);box(g,wx,2.02,d/2+.05,.055,1.08,.08,trim,false,false);box(g,wx,2.02,d/2+.05,1.18,.055,.08,trim,false,false);box(g,wx,2.02,d/2+.05,.045,1,.08,trim,false,false);box(g,wx,1.48,d/2+.05,1.28,.09,.2,wallTop,false,false);}
 box(g,0,2.7,d/2+.02,Math.min(w*.65,3.6),.34,.08,mat('#4d5a47'),false,false);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#4d5a47';ctx.fillRect(0,0,512,96);ctx.fillStyle='#f3edda';ctx.font='600 30px Arial';ctx.textAlign='center';ctx.fillText(name.toLocaleUpperCase('es'),256,61);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const sign=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(w*.65,3.6),.3),new THREE.MeshBasicMaterial({map:tex}));sign.position.set(0,2.7,d/2+.067);g.add(sign);
 if(type==='class'||type==='dining'){
  const cols=Math.max(2,Math.floor(w/1.5)), rows=Math.max(2,Math.floor(d/1.5));
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const tx=-w*.36+c*(w*.72/Math.max(cols-1,1)),tz=-d*.29+r*(d*.58/Math.max(rows-1,1));
   box(g,tx,.78,tz,.92,.09,.7,mat('#a98255'));for(const [cx,cz] of [[-.36,-.27],[.36,-.27],[-.36,.27],[.36,.27]])box(g,tx+cx,.48,tz+cz,.07,.52,.07,trim);
   for(const dx of [-.73,.73]){box(g,tx+dx,.52,tz,.36,.08,.34,mat('#c3a779'));for(const dz of [-.11,.11])box(g,tx+dx,.36,tz+dz,.055,.35,.055,trim);}
  }
 }else if(type==='kitchen'){
  box(g,0,.76,-d*.35,w*.76,.7,.55,mat('#aaa99d'));box(g,-w*.32,.76,0,.55,.7,d*.55,mat('#aaa99d'));box(g,0,1.15,-d*.35,w*.78,.08,.58,stoneLight);box(g,-w*.32,1.15,0,.58,.08,d*.56,stoneLight);
  for(let x=-w*.28;x<w*.3;x+=.9)box(g,x,1.25,-d*.34,.035,.05,.035,trim);
  const sink=box(g,.2,1.21,-d*.35,.75,.035,.4,mat('#677c7a',.22));sink.castShadow=false;
 }else{
  for(const x of [-.55,.55]){box(g,x,.9,-.1,.07,1.2,.06,trim);box(g,x,.55,.48,.85,.07,.75,woodFloor);}
 }
 return g;
}
room(-10.2,-5.85,6.4,5.1,'Aula 01','class');room(-3.5,-5.85,6.4,5.1,'Aula 02','class');room(3.2,-5.85,6.4,5.1,'Comedor','dining');room(10,-5.85,6.3,5.1,'Cocina','kitchen');
for(const x of [-6.85,-.15,6.63])box(scene,x,1.48,-5.85,.2,2.96,5.1,interiorWall);
// Small restroom block beside the patio, with two private stalls and a washbasin.
const washroom=new THREE.Group();washroom.position.set(-.7,0,-1.2);scene.add(washroom);
box(washroom,0,.17,0,2.7,.18,2.85,mat('#cbc8ba'),false,true);
box(washroom,0,1.25,-1.42,2.7,2.5,.14,interiorWall);box(washroom,-1.28,1.25,0,.14,2.5,2.85,interiorWall);box(washroom,1.28,1.25,0,.14,2.5,2.85,interiorWall);
box(washroom,-.88,1.25,1.36,.8,2.5,.14,interiorWall);box(washroom,.97,1.25,1.36,.62,2.5,.14,interiorWall);
const restroomDoor=box(washroom,.08,1.3,1.37,1.03,2.08,.08,mat('#8a6445',.72,{map:timberTexture}));restroomDoor.rotation.y=-.12;
box(washroom,-.4,1.15,.05,.09,2.1,.1,interiorWall);
for(const x of [-.85,.62]){box(washroom,x,1.2,-.7,.72,2.25,.08,trim);box(washroom,x,1.35,.12,.52,.48,.08,mat('#f1eee4'));const bowl=new THREE.Mesh(new THREE.SphereGeometry(.31,12,9),mat('#f2f0e8',.25));bowl.position.set(x, .54,.15);bowl.scale.set(1,.63,1.05);washroom.add(bowl);}
box(washroom,.73,.93,.95,.7,.12,.42,stoneLight);cylinder(washroom,.73,1.22,.95,.09,.09,.42,mat('#87877b'),12);

// Full perimeter walls define a private, enclosed garden with one street entrance.
const boundary=mat('#c8bda7',.95,{map:stuccoTexture}), boundaryCap=mat('#e1d4bc'), gateMetal=mat('#4e554c',.45,{metalness:.55});
box(scene,0,1.2,-10.25,29,2.4,.3,boundary);box(scene,-14.4,1.2,0,.3,2.4,20.5,boundary);box(scene,14.4,1.2,0,.3,2.4,20.5,boundary);
box(scene,-12.2,1.2,10.25,4.4,2.4,.3,boundary);box(scene,4.4,1.2,10.25,20,2.4,.3,boundary);
// Paired wrought-metal gate leaves with a solid frame, close-set bars and brass pull handles.
for(const center of [-8.83,-6.77]){
 for(const dx of [-.96,.96])box(scene,center+dx,1.15,10.08,.11,2.12,.13,gateMetal);
 for(const y of [.17,1.05,2.13])box(scene,center,y,10.08,2.02,.11,.13,gateMetal);
 for(let i=0;i<11;i++)box(scene,center-.82+i*.164,1.14,10.08,.045,1.82,.09,gateMetal);
 for(const dx of [-.93,.93])for(const y of [.42,1.85]){const hinge=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.16,12),mat('#b0a18a',.36,{metalness:.65}));hinge.rotation.x=Math.PI/2;hinge.position.set(center+dx,y,9.99);scene.add(hinge);}
}
for(const x of [-7.97,-7.63]){const handle=new THREE.Mesh(new THREE.SphereGeometry(.065,12,8),mat('#c69b54',.28,{metalness:.72}));handle.position.set(x,1.1,9.98);scene.add(handle);}
for(const x of [-14.4,-10,-5.6,14.4])box(scene,x,2.45,10.25,.42,2.55,.42,boundaryCap);
box(scene,0,2.42,-10.25,29,.12,.42,boundaryCap);box(scene,-14.4,2.42,0,.42,.12,20.5,boundaryCap);box(scene,14.4,2.42,0,.42,.12,20.5,boundaryCap);
// Calle P, sidewalk and nearby homes anchor the walled garden in a real block.
box(scene,0,-.94,0,240,.12,240,mat('#918d7e'),false,true);
const asphaltTexture=noiseTexture('#464945','#77786e',12000);asphaltTexture.repeat.set(12,8);
box(scene,0,-.67,16.8,180,.38,9,mat('#686b65',1,{map:asphaltTexture}),false,true);
box(scene,0,-.43,12.2,180,.16,1,mat('#b8b3a5'),false,true);box(scene,0,-.43,21.4,180,.16,1,mat('#b8b3a5'),false,true);
box(scene,0,-.2,14.9,180,.24,.2,mat('#d0caba'),false,true);box(scene,0,-.2,18.7,180,.24,.2,mat('#d0caba'),false,true);
for(let x=-86;x<90;x+=9)box(scene,x,-.46,16.8,4,.025,.12,mat('#d9d5c7'),false,false);
for(let x=-88;x<90;x+=2.2)box(scene,x,-.345,13.5,.035,.012,2.5,mat('#9a9688'),false,false);
const ramp=new THREE.Mesh(new THREE.BoxGeometry(4.3,.16,2.6),mat('#b9b19f'));ramp.position.set(-7.8,-.27,11.35);ramp.rotation.x=-.09;ramp.receiveShadow=true;scene.add(ramp);
function streetText(text,x,y,z,rotation=0){const c=document.createElement('canvas');c.width=512;c.height=128;const q=c.getContext('2d');q.fillStyle='#f4f0e4';q.font='700 66px Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(text,256,64);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(5,.95),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.rotation.z=rotation;m.position.set(x,y,z);scene.add(m);}
streetText('CALLE P',0,-.465,16.8);
function home(x,z,w=11,d=8,h=5,color='#d4c6ad'){
 const g=new THREE.Group();g.position.set(x,-.88,z);scene.add(g);box(g,0,h/2,0,w,h,d,mat(color),false,true);box(g,0,h+.12,0,w+.35,.26,d+.35,mat('#827d70'),false,true);
 for(let yy=1.5;yy<h-1;yy+=2.1)for(let xx=-w/2+1.4;xx<w/2-1;xx+=2.5){box(g,xx,yy,d/2+.015,1.15,1,.06,glass,false,false);box(g,xx,yy,d/2+.055,1.23,.08,.08,trim,false,false);box(g,xx,yy,d/2+.055,.07,1.05,.08,trim,false,false);}
 box(g,-w*.3,1.1,d/2+.04,1.1,2.2,trim,false,false);return g;
}
home(-25,-21,12,10,5.2,'#cbbda7');home(-9,-23,13,9,4.6,'#d9cbb6');home(9,-23,13,9,5.1,'#c6c7b8');home(25,-20,12,11,4.8,'#d1c3ad');home(-25,1,11,12,4.8,'#c8c7b7');home(25,1,11,12,5.3,'#d6c7ae');
for(const x of [-33,-17,17,33]){cylinder(scene,x,-.04,11.8,.09,.12,2.1,mat('#5c5b51'),10);cylinder(scene,x,-.04,12.9,.16,.16,.25,mat('#e2d19d'),12);}
// Warm timber pergola shades the patio, leaving the rooms and doors unobstructed.
for(const x of [-11.2,-7.1,-3,1.1]){box(scene,x,2.15,1.2,.19,3.7,.19,mat('#786047'));box(scene,x,2.15,5.8,.19,3.7,.19,mat('#786047'));}
for(const z of [1.2,2.35,3.5,4.65,5.8]) box(scene,-5.05,4,z,12.5,.18,.2,mat('#80684b'));
// Flowering beds along walls, stepping stones, and pollinator-friendly color.
function addShrub(x,z,scale=1,flower=false){
 const g=new THREE.Group();g.position.set(x,.3,z);g.scale.setScalar(scale);scene.add(g);
 for(let i=0;i<8;i++){const a=i*2.4,r=.1+Math.random()*.22;const m=new THREE.Mesh(new THREE.SphereGeometry(.25+Math.random()*.14,8,7),leafMats[i%leafMats.length]);m.position.set(Math.cos(a)*r,.18+Math.random()*.27,Math.sin(a)*r);m.scale.y=.75;m.castShadow=true;m.receiveShadow=true;g.add(m);}
 if(flower) for(let i=0;i<5;i++){const a=i*2.4;const bloom=new THREE.Mesh(new THREE.SphereGeometry(.065,7,6),mat(['#e8d4a3','#d5a0a0','#e9dfc4'][i%3],.55));bloom.position.set(Math.cos(a)*.24,.52,Math.sin(a)*.24);g.add(bloom);}
 return g;
}
for(let x=-12.6;x<13.6;x+=1.15){
 addShrub(x,-9.72,.72,Math.random()>.5);
 // Keep the full gate opening and its marked evacuation route clear of planting.
 if(x < -10.8 || x > -4.8)addShrub(x,9.73,.75,Math.random()>.42);
}
for(let z=-8.5;z<9;z+=1.3){addShrub(-13.85,z,.8,Math.random()>.6);addShrub(13.85,z,.78,Math.random()>.55);}
// Procedural broad-canopy trees with gently swaying branch clusters.
const swayGroups=[];
function addTree(x,z,s=1){
 const root=new THREE.Group();root.position.set(x,.25,z);root.scale.setScalar(s);scene.add(root);
 cylinder(root,0,1.65,0,.2,.3,3.2,bark,12);
 for(let i=0;i<4;i++){const a=i*Math.PI*.5+.4;const branch=cylinder(root,Math.cos(a)*.42,2.85,Math.sin(a)*.42,.09,.17,1.75,bark,8);branch.rotation.z=Math.cos(a)*-.5;branch.rotation.x=Math.sin(a)*.5;}
 const canopy=new THREE.Group();canopy.position.y=3.1;root.add(canopy);swayGroups.push({group:canopy,phase:Math.random()*6.28,amp:.018+Math.random()*.014});
 for(let i=0;i<27;i++){const u=Math.random()*2-1,a=Math.random()*6.28,r=Math.sqrt(1-u*u),rad=.72+Math.random()*.95;const m=new THREE.Mesh(new THREE.SphereGeometry(.63+Math.random()*.43,16,12),leafMats[Math.floor(Math.random()*leafMats.length)]);m.position.set(Math.cos(a)*r*rad,(u*.88)+Math.random()*.25,Math.sin(a)*r*rad);m.scale.set(1.12,.82,1);m.castShadow=true;m.receiveShadow=true;canopy.add(m);}
 return root;
}
addTree(-13.2,-.8,.92);addTree(-12.8,7.1,.95);addTree(13.35,-.9,.82);addTree(12.9,7.4,.93);addTree(1.45,-1.4,.68);
// Layered flowering borders frame the maintained, short lawn.
for(let i=0;i<46;i++){const x=(i%23)*.57-12.3,z=i<23?-8.92:8.92;addShrub(x,z,.55+Math.random()*.3,true);}
// Quiet reflecting-water feature on the courtyard, with concentric stone rim.
const fountain=new THREE.Group();fountain.position.set(-3.4,.3,1.2);scene.add(fountain);
cylinder(fountain,0,.12,0,1.05,1.08,.24,stoneLight,32);cylinder(fountain,0,.27,0,.87,.92,.12,mat('#77786e'),32);
const water=new THREE.Mesh(new THREE.CylinderGeometry(.82,.86,.06,48),new THREE.MeshPhysicalMaterial({color:'#668786',roughness:.16,metalness:.15,transparent:true,opacity:.9,clearcoat:1,clearcoatRoughness:.08}));water.position.y=.37;fountain.add(water);
cylinder(fountain,0,.72,0,.18,.31,.72,stoneLight,20);cylinder(fountain,0,1.12,0,.44,.17,.16,stoneLight,24);
const jet=new THREE.Mesh(new THREE.CylinderGeometry(.008,.028,.42,8),new THREE.MeshBasicMaterial({color:'#d8e9e7',transparent:true,opacity:.5}));jet.position.y=1.38;fountain.add(jet);
const rippleMat=new THREE.MeshBasicMaterial({color:'#d8ebe1',transparent:true,opacity:.32,side:THREE.DoubleSide});const ripples=[];
for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.12+i*.12,.012,6,48),rippleMat.clone());r.rotation.x=Math.PI/2;r.position.y=.43+i*.002;ripples.push(r);fountain.add(r);}
// Benches in warm timber with dark metal supports.
function bench(x,z,rot=0){const g=new THREE.Group();g.position.set(x,.3,z);g.rotation.y=rot;scene.add(g);for(let i=0;i<4;i++)box(g,0,.52+i*.105,0,1.8,.08,.13,mat(i===3?'#9a7950':'#b58b5b'));for(const xx of [-.68,.68]){box(g,xx,.28,-.05,.08,.5,.08,mat('#50483c'));box(g,xx,.83,-.36,.08,.55,.08,mat('#50483c'));}box(g,0,.75,-.34,1.8,.08,.12,mat('#b58b5b'));}
bench(-8.2,3.3,Math.PI/2);bench(-1.2,8.2,0);bench(1.9,4,Math.PI/2);
// A recognizable timber play tower: raised deck, pitched canopy, ladder and slide.
const playWood=mat('#8c6847',.72), playWoodLight=mat('#bb8b53',.68), safetyBlue=mat('#4e90a0',.48), safetyOrange=mat('#dc934e',.52), safetyGreen=mat('#8ba65c',.7,{side:THREE.DoubleSide,emissive:'#1b2411',emissiveIntensity:.12});
for(const x of [3.65,5.75])for(const z of [.05,2.15])box(scene,x,1.15,z,.16,2.3,.16,playWood);
box(scene,4.7,1.55,1.1,2.4,.2,2.45,playWoodLight);
// Keep the west rail closed; the east rail has a gate-sized opening onto the side walkway.
box(scene,3.65,2.03,1.1,.12,.82,2.15,playWood);
box(scene,5.75,2.03,.56,.12,.82,1.02,playWood);box(scene,5.75,2.03,2.02,.12,.82,.26,playWood);
// Front rail stays intact; a centered opening on the rear receives the stair landing.
box(scene,4.7,2.05,2.13,2.05,.78,.1,playWood);
box(scene,4.0,2.05,.08,.55,.78,.1,playWood);box(scene,5.4,2.05,.08,.55,.78,.1,playWood);
// Joined gable canopy: both slopes rise into a capped ridge and rest on the posts.
for(const side of [-1,1]){
 const roofAngle=-side*.36;
 const roof=box(scene,4.7+side*.62,2.95,1.1,1.55,.13,2.7,safetyGreen);roof.rotation.z=roofAngle;
 const soffit=box(scene,4.7+side*.61,2.855,1.1,1.43,.025,2.56,mat('#d2bc91',.82,{emissive:'#342a17',emissiveIntensity:.08}));soffit.rotation.z=roofAngle;
 const fascia=box(scene,4.7+side*.57,2.72,2.43,1.55,.16,.12,playWood);fascia.rotation.z=roofAngle;
 const rafter=box(scene,4.7+side*.57,2.73,1.1,1.53,.11,.12,playWood);rafter.rotation.z=roofAngle;
}
for(const x of [3.65,5.75])for(const z of [.05,2.15]){
 box(scene,x,2.48,z,.16,.42,.16,playWood);
 const bolt=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),mat('#b8945c',.32,{metalness:.62}));bolt.position.set(x,2.42,z+.09);scene.add(bolt);
}
box(scene,4.7,3.24,1.1,.17,.16,2.85,playWoodLight);
// Rear stair climbs to the playhouse, leaving the front and slide runout open.
for(let i=0;i<7;i++){const z=-2.45+i*.34,y=.36+i*.195;box(scene,4.7,y,z,1.06,.13,.34,playWoodLight);}
box(scene,4.7,1.55,-.2,1.12,.18,.62,playWoodLight);
for(const x of [4.04,5.36]){
 const stringer=box(scene,x,.94,-1.35,.11,.12,2.5,playWood);stringer.rotation.x=-.54;
 const handrail=box(scene,x,1.57,-1.35,.1,.1,2.5,playWoodLight);handrail.rotation.x=-.54;
 for(const [y,z] of [[.42,-2.5],[1.63,-.2]])box(scene,x,y,z,.11,.11,.12,playWood);
}
// Full side catwalk reaches from the tower opening to the slide boarding lip.
box(scene,6.29,1.55,.775,.78,.18,2.21,playWoodLight);
// Closely spaced anti-slip timber cleats run across the whole elevated route.
for(let z=-.2;z<=1.66;z+=.32)box(scene,6.29,1.67,z,.72,.055,.065,playWood);
// Guard the exposed outer edge; leave the final opening beside the slide entry clear.
for(const z of [-.22,.32,.86,1.28])box(scene,6.66,2.12,z,.10,.94,.10,playWood);
for(const y of [1.91,2.49])box(scene,6.66,y,.53,.10,.09,1.62,playWoodLight);
// Solid lower toe board prevents feet from slipping through the rail.
box(scene,6.66,1.78,.53,.10,.16,1.62,playWood);
// One continuous molded slide chute runs down to lawn level, with its landing clear.
const chuteProfile=new THREE.Shape();chuteProfile.moveTo(-.42,0);chuteProfile.lineTo(.42,0);chuteProfile.lineTo(.42,.21);chuteProfile.lineTo(.32,.21);chuteProfile.lineTo(.24,.085);chuteProfile.lineTo(-.24,.085);chuteProfile.lineTo(-.32,.21);chuteProfile.lineTo(-.42,.21);chuteProfile.closePath();
const slideBed=new THREE.Mesh(new THREE.ExtrudeGeometry(chuteProfile,{depth:3.15,steps:1,bevelEnabled:true,bevelSegments:2,bevelSize:.018,bevelThickness:.018}),mat('#43889a',.34,{metalness:.06}));
// Shift the slide toward the side walkway so its upper lip physically overlaps the landing.
slideBed.position.set(7.10,1.59,1.82);slideBed.rotation.x=.44;slideBed.castShadow=true;slideBed.receiveShadow=true;scene.add(slideBed);
// A timber support frame carries the chute midway down its slope; the outlet meets the grass.
for(const x of [6.73,7.47]){box(scene,x,.59,3.4,.12,.64,.12,playWood);box(scene,x,.32,3.4,.32,.08,.32,playWoodLight);}
box(scene,7.10,.87,3.4,.82,.12,.12,playWood);
// Rope climbing net fixed between stout timber uprights.
for(const x of [7.55,8.75]){box(scene,x,1.08,1.05,.13,2.16,.13,playWood);}
for(let i=0;i<5;i++){const x=7.66+i*.24;const rope=cylinder(scene,x,1.03,1.05,.025,.025,1.82,mat('#d7c9a9'),7);}
for(const y of [.34,.7,1.06,1.42,1.78])box(scene,8.15,y,1.05,1.12,.035,.035,mat('#d7c9a9'));
// Two child swings: a timber A-frame, metal crossbar, hanging chains and seats.
for(const x of [9.15,12.3])for(const z of [-1.45,1.05]){const leg=box(scene,x,1.8,z,.15,3.6,.15,playWood);leg.rotation.z=x<10?-.16:.16;}
box(scene,10.72,3.58,-.2,3.55,.2,.2,playWood);
for(const x of [10.05,11.38]){for(const dx of [-.34,.34])cylinder(scene,x+dx,2.15,-.2,.018,.018,2.65,gateMetal,8);box(scene,x, .79,-.2,.64,.14,.38,[safetyOrange,safetyBlue][Math.round(x)%2]);}
// A low, bright seesaw and two animal spring riders finish the play area.
const beam=box(scene,9.25,.82,6.45,3.5,.16,.34,safetyOrange);beam.rotation.z=-.08;
for(const x of [7.72,10.75]){box(scene,x,.47,6.45,.12,.6,.12,playWood);box(scene,x,.62,6.45,.62,.1,.42,playWoodLight);}
for(const [x,z,color] of [[3.45,6.3,'#c86e57'],[12,6.25,'#507f93']]){
 const spring=new THREE.Mesh(new THREE.TorusGeometry(.15,.035,8,16),mat('#7c776c'));spring.position.set(x,.42,z);scene.add(spring);cylinder(scene,x,.66,z,.045,.045,.52,gateMetal,10);
 const body=new THREE.Mesh(new THREE.SphereGeometry(.38,16,12),mat(color,.55));body.position.set(x,.99,z);body.scale.set(1.35,.72,.72);body.castShadow=true;scene.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.25,14,10),mat(color,.55));head.position.set(x+.34,1.13,z);head.castShadow=true;scene.add(head);
 for(const dx of [-.12,.12]){const ear=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),mat(color,.55));ear.position.set(x+.32+dx,1.35,z);ear.scale.set(.72,1.4,.65);scene.add(ear);const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),mat('#f7f0dd',.3));eye.position.set(x+.53,1.18,z+dx*.65);scene.add(eye);}
 for(const dx of [-.48,.48])cylinder(scene,x+dx,1.25,z,.025,.025,.35,playWood,8);
 box(scene,x,.89,z-.48,.28,.12,.12,playWoodLight);
}
// Warm low bollard lights guide a calm evening route.
const lampMat=new THREE.MeshStandardMaterial({color:'#e8d6a5',emissive:'#e8c987',emissiveIntensity:1.4,roughness:.35});
for(const [x,z] of [[-.2,-7.8],[-.2,7.8],[1.2,-3.3],[1.2,3.3],[12.5,-5],[12.5,5]]){cylinder(scene,x,.52,z,.11,.13,.9,mat('#605a48'));const c=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),lampMat);c.position.set(x,1,z);scene.add(c);}

// 3D floating labels name each space and face the visitor as the camera turns.
function overheadSign(title,subtitle,x,y,z,width=3.3){
 const c=document.createElement('canvas');c.width=1024;c.height=160;const q=c.getContext('2d');
 q.clearRect(0,0,c.width,c.height);q.textAlign='center';q.textBaseline='middle';q.font='700 66px "DM Sans",Arial,sans-serif';
 q.shadowColor='rgba(5,12,8,.85)';q.shadowBlur=12;q.shadowOffsetY=4;q.lineWidth=5;q.strokeStyle='rgba(12,20,14,.72)';q.strokeText(title,512,80);q.fillStyle='#fffdf3';q.fillText(title,512,80);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,alphaTest:.025}));sprite.position.set(x,y,z);sprite.scale.set(width,width*.245,1);scene.add(sprite);return sprite;
}
overheadSign('Aula 01','',-10.2,5.1,-5.85,3.1);overheadSign('Aula 02','',-3.5,5.1,-5.85,3.1);
overheadSign('Comedor','',3.2,5.2,-5.85,3.3);overheadSign('Cocina','',10,5.1,-5.85,3.1);
overheadSign('Baños','',-.7,4.7,-1.2,2.6);overheadSign('El patio','',-7.4,5.6,3.7,3.6);overheadSign('Área de juegos','',7.6,5.3,3,4);
function informationSign(title,sub,x,y,z,w,h,facing=0,color='#334438'){
 const panel=new THREE.Group();panel.position.set(x,y,z);panel.rotation.y=facing;scene.add(panel);box(panel,0,0,0,w,h,.12,mat(color,.72),false,false);
 const c=document.createElement('canvas');c.width=640;c.height=220;const q=c.getContext('2d');q.fillStyle='#f5f0df';q.font='700 43px Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(title.toLocaleUpperCase('es'),320,83);q.fillStyle='#d5d29e';q.font='500 27px Arial';q.fillText(sub.toLocaleUpperCase('es'),320,153);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const faceMaterial=new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide});
 const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.16,h-.16),faceMaterial);face.position.z=.067;panel.add(face);
 const reverse=new THREE.Mesh(new THREE.PlaneGeometry(w-.16,h-.16),faceMaterial);reverse.position.z=-.067;reverse.rotation.y=Math.PI;panel.add(reverse);return panel;
}
informationSign('ENTRADA / SALIDA','Ruta de evacuación · Calle P',-7.8,3.15,10.03,4.4,.74,Math.PI,'#246f40');
function wayfindingPost(x,z){cylinder(scene,x,1.15,z,.065,.085,2.25,trim,10);informationSign('ORIENTACIÓN','Aulas · patio · juegos →',x+1.15,1.72,z,2.25,.72,0,'#334438');}
wayfindingPost(-12.3,7.5);
for(const x of [3.25,12.75])cylinder(scene,x,1.2,-1.05,.055,.08,1.65,gateMetal,10);
informationSign('Zona de juegos','Acompaña a los niños',4.1,2.1,-1.05,2.9,.76,0,'#5b4937');
// Emergency wayfinding follows the site from each occupied room to the exit gate.
const roomDoors=[[-10.2,-12.248],[-3.5,-5.548],[3.2,1.152],[10,7.984]];
for(const [x,doorX] of roomDoors){
 informationSign('SALIDA','Hacia el patio',doorX,2.48,-3.17,1.62,.52,0,'#208148');
 informationSign('DURANTE EL SISMO','Agáchate · cúbrete · sujétate',x,2.2,-8.22,2.8,.64,0,'#208148');
}
// Emergency instructions are mounted at eye level on the pergola supports.
informationSign('RUTA DE EVACUACIÓN','← Hacia la salida',-11.2,2.3,5.94,2.35,.62,0,'#208148');
informationSign('EN CASO DE SISMO','Agáchate · cúbrete · sujétate',-3,2.56,5.94,2.7,.68,0,'#208148');
// Green assembly marker on the open lawn, with a clearly labeled meeting point.
const safeRing=new THREE.Mesh(new THREE.TorusGeometry(1.05,.07,10,64),mat('#f0d477',.48,{emissive:'#755e21',emissiveIntensity:.13}));safeRing.rotation.x=Math.PI/2;safeRing.position.set(2.3,.34,7.75);scene.add(safeRing);
informationSign('ZONA SEGURA','En caso de sismo',2.3,2.65,8.65,2.8,.68,0,'#21804a');
informationSign('PUNTO DE REUNIÓN','Después de evacuar',2.3,1.86,8.65,2.8,.56,0,'#21804a');
// Inlaid evacuation arrows remain visible without cluttering the planting.
const arrowShape=new THREE.Shape();arrowShape.moveTo(.42,0);arrowShape.lineTo(-.12,.4);arrowShape.lineTo(-.12,.19);arrowShape.lineTo(-.5,.19);arrowShape.lineTo(-.5,-.19);arrowShape.lineTo(-.12,-.19);arrowShape.lineTo(-.12,-.4);arrowShape.closePath();
const arrowGeo=new THREE.ShapeGeometry(arrowShape);const evacuationMat=new THREE.MeshBasicMaterial({color:'#f8f7ed',side:THREE.DoubleSide});const evacuationBg=new THREE.MeshBasicMaterial({color:'#25804b',side:THREE.DoubleSide});
function floorArrow(x,z,yaw){const bg=new THREE.Mesh(arrowGeo,evacuationBg);bg.rotation.set(-Math.PI/2,0,yaw);bg.position.set(x,.301,z);bg.scale.set(1.2,1.2,1);scene.add(bg);const a=new THREE.Mesh(arrowGeo,evacuationMat);a.rotation.set(-Math.PI/2,0,yaw);a.position.set(x,.305,z);a.scale.set(.78,.78,1);scene.add(a);}
for(const z of [6.9,5,3,1])floorArrow(1.55,z,Math.PI/2);
floorArrow(.65,.8,Math.PI);
for(const x of [-1.2,-3.2,-5.2,-7.2])floorArrow(x,5.45,Math.PI);
for(const z of [7.35,8.2,9.05])floorArrow(-7.8,z,-Math.PI/2);
// Wall-mounted extinguisher and first-aid signs include the actual equipment.
informationSign('EXTINTOR','Equipo contra incendios',9.18,2.22,-3.08,2.25,.6,0,'#b53932');
cylinder(scene,9.18,.73,-3.0,.16,.18,.9,mat('#bd382e',.36),16);cylinder(scene,9.18,1.22,-3.0,.12,.11,.12,gateMetal,12);
box(scene,9.18,1.31,-3,.23,.08,.12,gateMetal);const hose=new THREE.Mesh(new THREE.TorusGeometry(.13,.025,6,16,Math.PI),mat('#292a27'));hose.position.set(9.31,.95,-2.96);hose.rotation.z=Math.PI/2;scene.add(hose);
informationSign('BAÑOS','Servicios',-.7,2.22,.32,1.65,.56,0,'#334438');
informationSign('BOTIQUÍN','Primeros auxilios',-2.12,1.92,-1.2,1.65,.56,-Math.PI/2,'#24834b');
box(scene,-2.18,1.08,-1.2,.14,.6,.52,mat('#f4f0df',.58));box(scene,-2.27,1.08,-1.2,.025,.38,.12,mat('#278349'));box(scene,-2.285,1.08,-1.2,.025,.12,.34,mat('#278349'));

const stops={garden:{position:[0,1.72,8.5],target:[1,1.68,0],name:'El jardín',detail:'Recorre el patio a nivel del suelo'},patio:{position:[-5,1.72,8],target:[-5,1.68,1],name:'El patio',detail:'Piedra cálida bajo la pérgola'},play:{position:[8,1.72,8],target:[8,1.68,1],name:'Área de juegos',detail:'Columpios, tobogán y trepador'},rooms:{position:[1,8,1],target:[1,1,-5.6],name:'Los ambientes',detail:'Aulas, comedor y cocina'},bathrooms:{position:[-.7,2.5,2.8],target:[-.7,1.2,-1.2],name:'Baños',detail:'Servicios junto al patio'},overview:{position:[0,30,35],target:[0,0,0],name:'Vista general',detail:'Jardín y entorno de Calle P'}};
let travelling=false, travelStart=0, fromPos=new THREE.Vector3(), fromTarget=new THREE.Vector3(), toPos=new THREE.Vector3(), toTarget=new THREE.Vector3();
function goTo(key){const stop=stops[key];if(!stop)return;document.querySelectorAll('.nav-stop').forEach(b=>b.classList.toggle('active',b.dataset.stop===key));document.querySelector('#placeName').textContent=stop.name;document.querySelector('#placeDetail').textContent=stop.detail;fromPos.copy(camera.position);fromTarget.copy(controls.target);toTarget.fromArray(stop.target);if(key==='overview')toPos.fromArray(stop.position);else toPos.copy(toTarget).add(camera.position.clone().sub(controls.target));travelStart=performance.now();travelling=true;document.querySelector('#intro').classList.add('hidden');}
document.querySelector('#explore').addEventListener('click',()=>goTo('garden'));
document.querySelectorAll('.nav-stop').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.stop)));
const keys=new Set();window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys.add(e.code);document.querySelector('#intro').classList.add('hidden');}});window.addEventListener('keyup',e=>keys.delete(e.code));
let toastTimer;function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
renderer.domElement.addEventListener('pointerdown',()=>document.querySelector('#intro').classList.add('hidden'),{once:true});
document.querySelector('#fullscreen').addEventListener('click',()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();});
// Optional gentle outdoor ambience, generated locally with filtered noise and no external audio.
let audioCtx=null, noiseSource=null, audioOn=false;
document.querySelector('#sound').addEventListener('click',()=>{
 audioOn=!audioOn;document.querySelector('#soundIcon').textContent=audioOn?'♫':'♬';document.querySelector('#sound').setAttribute('aria-label',audioOn?'Desactivar sonido ambiente':'Activar sonido ambiente');
 if(audioOn){try{audioCtx??=new AudioContext();const n=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate);const d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.09;noiseSource=audioCtx.createBufferSource();noiseSource.buffer=n;noiseSource.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=500;const gain=audioCtx.createGain();gain.gain.value=.12;noiseSource.connect(filter).connect(gain).connect(audioCtx.destination);noiseSource.start();toast('Sonido ambiente activado');}catch{toast('El sonido no está disponible en este navegador');}}
 else {try{noiseSource?.stop();noiseSource=null;}catch{}toast('Sonido ambiente desactivado');}
});

const clock=new THREE.Clock();let elapsed=0;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;
 if(travelling){const t=Math.min((performance.now()-travelStart)/1900,1),ease=t*t*(3-2*t);camera.position.lerpVectors(fromPos,toPos,ease);controls.target.lerpVectors(fromTarget,toTarget,ease);if(t>=1)travelling=false;}
 const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,camera.up).normalize();const step=dt*5.2;
let moved=false;if(keys.has('KeyW')||keys.has('ArrowUp')){camera.position.addScaledVector(forward,step);controls.target.addScaledVector(forward,step);moved=true;}if(keys.has('KeyS')||keys.has('ArrowDown')){camera.position.addScaledVector(forward,-step);controls.target.addScaledVector(forward,-step);moved=true;}if(keys.has('KeyA')||keys.has('ArrowLeft')){camera.position.addScaledVector(right,-step);controls.target.addScaledVector(right,-step);moved=true;}if(keys.has('KeyD')||keys.has('ArrowRight')){camera.position.addScaledVector(right,step);controls.target.addScaledVector(right,step);moved=true;}if(moved){travelling=false;const viewOffset=camera.position.clone().sub(controls.target);if(camera.position.y<3.2){camera.position.x=THREE.MathUtils.clamp(camera.position.x,-13.3,13.3);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-9.1,9.1);controls.target.copy(camera.position).sub(viewOffset);}else{controls.target.x=THREE.MathUtils.clamp(controls.target.x,-13.3,13.3);controls.target.z=THREE.MathUtils.clamp(controls.target.z,-9.1,9.1);camera.position.copy(controls.target).add(viewOffset);}}
 swayGroups.forEach(({group,phase,amp})=>{group.rotation.z=Math.sin(elapsed*.47+phase)*amp;group.rotation.x=Math.cos(elapsed*.38+phase)*amp*.6;});
 ripples.forEach((r,i)=>{const q=(elapsed*.23+i/3)%1;r.scale.setScalar(.55+q*1.7);r.material.opacity=(1-q)*.25;});
 controls.update();
 camera.position.x=THREE.MathUtils.clamp(camera.position.x,-48,48);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-48,48);
 camera.position.y=THREE.MathUtils.clamp(camera.position.y,1.52,55);renderer.render(scene,camera);
}
animate();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);});
setTimeout(()=>document.querySelector('#loading').classList.add('done'),850);
