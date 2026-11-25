import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildSchool } from './school.js?v=sembrio-zona-segura-20261125';
import { createChildCharacter } from './child.js?v=recorridos-diferentes-20261124';

const mount=document.querySelector('#scene');
const scene=new THREE.Scene();scene.background=new THREE.Color('#b8c2bc');scene.fog=new THREE.FogExp2('#b8c2bc',.0022);
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,240);camera.position.set(0,26,31);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;mount.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.055;controls.target.set(0,0,0);controls.minDistance=2;controls.maxDistance=86;controls.enablePan=false;controls.maxPolarAngle=Math.PI*.49;controls.minPolarAngle=.09;controls.rotateSpeed=.42;controls.zoomSpeed=.78;
controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE;controls.mouseButtons.RIGHT=THREE.MOUSE.ROTATE;renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
scene.add(new THREE.HemisphereLight(0xe7f0e8,0x565b49,2.0));const sun=new THREE.DirectionalLight(0xffe7c1,3.0);sun.position.set(-17,30,18);sun.castShadow=true;sun.shadow.mapSize.set(3072,3072);sun.shadow.camera.left=-28;sun.shadow.camera.right=28;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.bias=-.00018;scene.add(sun);const fill=new THREE.DirectionalLight(0xd8e8ef,.7);fill.position.set(15,12,-19);scene.add(fill);

const mat=(color,roughness=.84,extra={})=>new THREE.MeshStandardMaterial({color,roughness,...extra});
function box(parent,x,y,z,sx,sy,sz,material,cast=true,receive=true){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=receive;m.userData.walkSolid=true;parent.add(m);return m;}
function cylinder(parent,x,y,z,rt,rb,h,material,seg=10){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;m.userData.walkSolid=true;parent.add(m);return m;}
function noiseTexture(base,fleck,count=2200,size=256){const c=document.createElement('canvas');c.width=c.height=size;const q=c.getContext('2d');q.fillStyle=base;q.fillRect(0,0,size,size);for(let i=0;i<count;i++){q.globalAlpha=.06+Math.random()*.2;q.fillStyle=fleck;const s=.6+Math.random()*2.3;q.fillRect(Math.random()*size,Math.random()*size,s,s);}q.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
function grassTexture(){const c=document.createElement('canvas');c.width=c.height=512;const q=c.getContext('2d');q.fillStyle='#729150';q.fillRect(0,0,512,512);const patches=['rgba(49,91,43,.14)','rgba(161,169,99,.14)','rgba(111,144,75,.18)','rgba(45,80,40,.12)'];for(let i=0;i<240;i++){const x=Math.random()*512,y=Math.random()*512,r=8+Math.random()*32,g=q.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,patches[i%4]);g.addColorStop(1,'rgba(95,130,58,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r,0,Math.PI*2);q.fill();}for(let i=0;i<16000;i++){const x=Math.random()*512,y=Math.random()*512,len=2+Math.random()*8;q.strokeStyle=patches[Math.floor(Math.random()*4)];q.globalAlpha=.23+Math.random()*.32;q.lineWidth=.45+Math.random()*.8;q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(x+(Math.random()-.5)*2,y-len*.5,x+(Math.random()-.5)*3,y-len);q.stroke();}q.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;}
const lawn=mat('#fffdf4',1,{map:grassTexture()});const relief=document.createElement('canvas');relief.width=relief.height=256;const rc=relief.getContext('2d');rc.fillStyle='#808080';rc.fillRect(0,0,256,256);for(let i=0;i<8000;i++){const x=Math.random()*256,y=Math.random()*256,l=2+Math.random()*7;rc.strokeStyle=Math.random()>.5?'rgba(230,230,230,.28)':'rgba(40,40,40,.23)';rc.beginPath();rc.moveTo(x,y);rc.lineTo(x+(Math.random()-.5)*2,y-l);rc.stroke();}lawn.bumpMap=new THREE.CanvasTexture(relief);lawn.bumpScale=.014;
const stoneTex=noiseTexture('#c0b6a2','#686252',1800);stoneTex.repeat.set(5,8);const stone=mat('#d3c9b5',.9,{map:stoneTex});const timberTex=noiseTexture('#795f48','#c4a078',4800);timberTex.repeat.set(3,5);const wood=mat('#9d7950',.76,{map:timberTex}),trim=mat('#71583e',.82,{map:timberTex});

const school=buildSchool({scene,mat,box,cylinder,grass:lawn,stone,wood,trim});

// Area names remain white floating letters, styled like the garden's existing scene labels.
const labelGroup=new THREE.Group();scene.add(labelGroup);
function areaLabel(text,x,y,z,width=3,color='#fffdf4'){const c=document.createElement('canvas');c.width=1024;c.height=192;const q=c.getContext('2d');q.textAlign='center';q.textBaseline='middle';q.font='700 72px "DM Sans",Arial,sans-serif';q.shadowColor='rgba(7,15,10,.9)';q.shadowBlur=12;q.shadowOffsetY=5;q.lineWidth=5;q.strokeStyle='rgba(11,20,14,.66)';q.strokeText(text,512,96);q.fillStyle=color;q.fillText(text,512,96);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,alphaTest:.02}));s.position.set(x,y,z);s.scale.set(width,width*.22,1);labelGroup.add(s);}
 areaLabel('INGRESO',2.7,3.35,17.65,3.1);areaLabel('PATIO',2.7,4.2,9.2,2.8);areaLabel('COMEDOR',-5.2,4.1,12.4,3.4);areaLabel('ZONA SEGURA',7.13,3.4,12.6,3.8);areaLabel('COCINA',-6.5,4.0,4.7,2.8);areaLabel('AULA DE 3 AÑOS',-.85,4.0,5.45,3.2);areaLabel('ZONA NO SEGURA',-.85,3.2,5.45,3.0,'#e06b55');areaLabel('JUEGOS TECHADOS',-3.15,5.25,-3.7,4.8);areaLabel('BAÑOS',7.7,3.6,-5.6,2.8);areaLabel('AULA DE 4 AÑOS',-4.65,4.0,-15.2,3.2);areaLabel('AULA DE 5 AÑOS',4.65,4.0,-15.2,3.2);

const campusWaypoints=[
  [2.7,17.05],[2.7,12.5],[-3.9,12.25],[-7.2,12.3],[-4.1,12.3],[2.5,12.2],[4.15,12.0],[4.15,9.65],[3.3,9.2],[2.7,8.1],[2.7,1.1],[-2.5,.7],[-4.9,-.2],[-6.3,-.55],[-7.4,-1.7],[-7.1,-3.1],[-5.8,-2.8],[-4.7,-.7],[-1.2,-1.2],[-1.2,-5.5],[.7,-5.5],[.7,-9.85],[0,-12.2],[0,-17],[0,-12.2],[-1.5,-9.8],[-4,-8.5],[-1.2,-5.9],[.7,-5.9],[.7,-1],[.7,.15],[2.7,.15],[2.7,1],[2.7,8],[2.7,12],[2.7,17.05]
];
const studentNames=['Tatiana','Sandrita','Karen','Ana','Nelita','Aracely'];
const indices=(from,to,step=from<=to?1:-1)=>Array.from({length:Math.floor(Math.abs(to-from)/Math.abs(step))+1},(_,i)=>from+i*step);
const studentRouteIndices=[
  indices(1,34),
  [...indices(1,5),...indices(4,1,-1)],
  [1,6,7,8,9,...indices(10,18),...indices(17,10,-1),9,8,7,6,1],
  [...indices(1,18),...indices(17,1,-1)],
  [1,6,7,8,9,...indices(10,28),...indices(27,10,-1),9,8,7,6,1],
  indices(34,1,-1)
];
const spawnPositions=[[2.35,17.35],[3,17.35],[3.65,17.35],[2.35,16.55],[3,16.55],[3.65,16.55]];
const students=studentNames.map((name,index)=>{
  const spawn=spawnPositions[index],routeTargets=[[...spawn],[spawn[0],16.15],[2.7,15.55],...studentRouteIndices[index].map(i=>campusWaypoints[i]),[2.7,17.05],[...spawn]];
  const character=createChildCharacter(name,index),forward=new THREE.Vector3(0,0,-1);
  character.root.position.set(spawn[0],.2,spawn[1]);character.root.rotation.y=Math.atan2(forward.x,forward.z);scene.add(character.root);
  return {name,character,routeTargets,routeTargetIndex:1,navPath:null,navPathIndex:0,navKey:'',navRetry:0,navBlockedTime:0,avoidanceSide:index%2===0?1:-1,forward,startDelay:index*.7,emergencyPhase:null,emergencyDelay:index*.35,emergencyJumpVelocity:0,emergencySlot:10.6+index*.78};
});
let activeStudentIndex=0,child=students[0].character,childForward=students[0].forward;
let isWalking=true,followChild=false,controlled=false,manualMoving=false,labelsVisible=true,jumpRequested=false,jumpVelocity=0,drillActive=false;
const walkSpeed=1.12;
function rebuildPatrolFromChild(student=students[activeStudentIndex]){const p=student.character.root.position;let closest=1,best=Infinity;for(let i=0;i<student.routeTargets.length;i++){const point=student.routeTargets[i],distance=(point[0]-p.x)**2+(point[1]-p.z)**2;if(distance<best){best=distance;closest=i;}}student.routeTargetIndex=closest;student.navPath=null;student.navKey='';student.navRetry=0;}
function updateChild(dt,time){
  for(const student of students){
    const actor=student.character,p=actor.root.position;let patrolMoving=false;
    if(drillActive&&student.emergencyPhase){patrolMoving=updateEmergencyStudent(student,dt);}
    else if(isWalking&&!controlled){
      student.startDelay=Math.max(0,student.startDelay-dt);
      if(student.startDelay===0){const target=student.routeTargets[student.routeTargetIndex],arrived=moveStudentToward(student,target,dt,walkSpeed,`patrol-${student.routeTargetIndex}`);patrolMoving=student.lastMoveDistance>.001;if(arrived){student.routeTargetIndex=(student.routeTargetIndex+1)%student.routeTargets.length;student.navPath=null;student.navKey='';}}
    }
    else if(!drillActive&&student.emergencyPhase&&student.emergencyPhase!=='approach'){patrolMoving=updateEmergencyStudent(student,dt);}
    const active=student===students[activeStudentIndex],moving=active&&controlled?manualMoving:patrolMoving;
    if(moving){const phase=time*6.15,s=Math.sin(phase),op=Math.sin(phase+Math.PI);actor.leftLeg.pivot.rotation.x=s*.48;actor.rightLeg.pivot.rotation.x=op*.48;actor.leftLeg.joint.rotation.x=Math.max(0,-s)*.56;actor.rightLeg.joint.rotation.x=Math.max(0,-op)*.56;actor.leftArm.pivot.rotation.x=op*.34;actor.rightArm.pivot.rotation.x=s*.34;actor.leftArm.joint.rotation.x=-.18-Math.max(0,op)*.15;actor.rightArm.joint.rotation.x=-.18-Math.max(0,s)*.15;actor.hips.position.y=.62+Math.abs(Math.cos(phase))*.018;actor.torso.rotation.z=s*.025;actor.headGroup.rotation.y=Math.sin(time*.8)*.08;}
    else{actor.leftLeg.pivot.rotation.x=actor.rightLeg.pivot.rotation.x=0;actor.leftLeg.joint.rotation.x=actor.rightLeg.joint.rotation.x=0;actor.leftArm.pivot.rotation.x=actor.rightArm.pivot.rotation.x=0;actor.leftArm.joint.rotation.x=actor.rightArm.joint.rotation.x=-.18;actor.hips.position.y=.62;actor.torso.rotation.z=0;}
    if(active&&controlled&&p.y>.25||student.emergencyPhase?.startsWith('jump')||student.emergencyPhase?.startsWith('landing')){actor.leftLeg.pivot.rotation.x=actor.rightLeg.pivot.rotation.x=-.22;actor.leftArm.pivot.rotation.x=actor.rightArm.pivot.rotation.x=-.72;}
  }
}

const stops={entry:{position:[0,12,25],target:[0,1,13],name:'Ingreso y patio',detail:'Acceso principal, juegos y jardín'},central:{position:[4.8,3.2,14.5],target:[1.2,.9,9.1],name:'Bloque central',detail:'Patio cubierto, rampa y escaleras'},play:{position:[-10,7,21],target:[-3,1,14],name:'Juegos y patio',detail:'Área infantil y zonas de descanso'},green:{position:[8.4,2.8,17],target:[6.5,.62,15],name:'Áreas verdes',detail:'Jardín elevado y zona segura'},back:{position:[0,18,-5],target:[0,1,-14],name:'Aulas del fondo',detail:'Bloque posterior y pasadizo'},overview:{position:[0,42,43],target:[0,0,0],name:'Vista aérea',detail:'Distribución completa del colegio'}};
let travelling=false,travelStart=0,fromPos=new THREE.Vector3(),fromTarget=new THREE.Vector3(),toPos=new THREE.Vector3(),toTarget=new THREE.Vector3();
function goTo(key){const stop=stops[key];if(!stop)return;controlled=false;manualMoving=false;jumpVelocity=0;if(!students[activeStudentIndex].emergencyPhase)child.root.position.y=floorHeightAt(child.root.position.x,child.root.position.z);followChild=false;document.querySelectorAll('.nav-stop').forEach(b=>b.classList.toggle('active',b.dataset.stop===key));document.querySelector('#placeName').textContent=stop.name;document.querySelector('#placeDetail').textContent=stop.detail;fromPos.copy(camera.position);fromTarget.copy(controls.target);toPos.fromArray(stop.position);toTarget.fromArray(stop.target);travelStart=performance.now();travelling=true;document.querySelector('#intro').classList.add('hidden');syncControls();}
document.querySelector('#explore').addEventListener('click',()=>goTo('entry'));document.querySelectorAll('.nav-stop').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.stop)));
const journeyPanel=document.querySelector('#journey-panel'),menuToggle=document.querySelector('#menu-toggle');
menuToggle.addEventListener('click',()=>{const collapsed=journeyPanel.classList.toggle('collapsed');menuToggle.setAttribute('aria-expanded',String(!collapsed));menuToggle.setAttribute('aria-label',collapsed?'Abrir menú':'Cerrar menú');menuToggle.querySelector('.menu-toggle-chevron').textContent=collapsed?'⌄':'⌃';journeyPanel.setAttribute('aria-hidden',String(collapsed));journeyPanel.inert=collapsed;});
const mapPreview=document.querySelector('#map-preview'),mapLayer=document.querySelector('#campus-map-layer'),mapClose=document.querySelector('#map-close');
const mapSafetyOpen=document.querySelector('#map-safety-open'),mapSafetyLayer=document.querySelector('#map-safety-layer'),mapSafetyClose=document.querySelector('#map-safety-close');
function setMapOpen(open){mapLayer.classList.toggle('open',open);mapLayer.setAttribute('aria-hidden',String(!open));mapPreview.setAttribute('aria-expanded',String(open));if(open)mapClose.focus();else mapPreview.focus();}
function setMapSafetyOpen(open){mapSafetyLayer.classList.toggle('open',open);mapSafetyLayer.setAttribute('aria-hidden',String(!open));if(open)mapSafetyClose.focus();else mapSafetyOpen.focus();}
mapPreview.addEventListener('click',()=>setMapOpen(true));mapClose.addEventListener('click',()=>setMapOpen(false));
mapSafetyOpen.addEventListener('click',()=>setMapSafetyOpen(true));mapSafetyClose.addEventListener('click',()=>setMapSafetyOpen(false));
mapLayer.addEventListener('click',event=>{if(event.target===mapLayer)setMapOpen(false);});
mapSafetyLayer.addEventListener('click',event=>{if(event.target===mapSafetyLayer)setMapSafetyOpen(false);});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(mapSafetyLayer.classList.contains('open'))setMapSafetyOpen(false);else if(mapLayer.classList.contains('open'))setMapOpen(false);});
function syncControls(){const name=students[activeStudentIndex].name;document.querySelector('#follow-child').classList.toggle('active',followChild&&!controlled);document.querySelector('#follow-child').textContent=`Seguir a ${name}`;document.querySelector('#control-child').classList.toggle('active',controlled);document.querySelector('#control-child').textContent=controlled?'Dejar de controlar':`Controlar a ${name}`;document.querySelector('#touch-controls').setAttribute('aria-label',`Controles táctiles de ${name}`);document.querySelector('#toggle-walk').textContent=isWalking?'Pausar paseo':'Reanudar paseo';document.querySelector('#toggle-labels').textContent=labelsVisible?'Ocultar nombres':'Mostrar nombres';document.querySelector('#movement-hint').textContent=controlled?'FLECHAS: MOVER · SHIFT: CORRER · ESPACIO: SALTAR':'WASD PARA CAMINAR';document.querySelector('#touch-controls').classList.toggle('visible',controlled);document.querySelector('.experience').classList.toggle('controlling',controlled);}
document.querySelector('#follow-child').addEventListener('click',()=>{if(controlled||drillActive)return;followChild=!followChild;travelling=false;document.querySelector('#intro').classList.add('hidden');syncControls();});
let lastFollowTarget=new THREE.Vector3();
document.querySelector('#student-select').addEventListener('change',event=>{if(drillActive)return;const index=Number(event.currentTarget.value);if(!Number.isInteger(index)||!students[index])return;activeStudentIndex=index;child=students[index].character;childForward=students[index].forward;manualMoving=false;jumpRequested=false;jumpVelocity=0;travelling=false;if(controlled||followChild){const p=child.root.position,target=new THREE.Vector3(p.x,p.y+1.05,p.z);controls.target.copy(target);camera.position.copy(p).addScaledVector(childForward,-4.3);camera.position.y=p.y+3;lastFollowTarget.copy(target);}document.querySelector('#intro').classList.add('hidden');syncControls();toast(`Seleccionaste a ${students[index].name}`);});
document.querySelector('#control-child').addEventListener('click',()=>{if(drillActive)return;controlled=!controlled;if(controlled){isWalking=false;followChild=true;travelling=false;const p=child.root.position;controls.target.set(p.x,p.y+1.05,p.z);camera.position.copy(p).addScaledVector(childForward,-4.3);camera.position.y=p.y+3;lastFollowTarget.copy(controls.target);}else{followChild=false;manualMoving=false;jumpVelocity=0;child.root.position.y=floorHeightAt(child.root.position.x,child.root.position.z);rebuildPatrolFromChild();}document.querySelector('#intro').classList.add('hidden');syncControls();toast(controlled?'Flechas para caminar · Shift para correr · Espacio para saltar':`Control de ${students[activeStudentIndex].name} desactivado`);});
document.querySelector('#toggle-walk').addEventListener('click',()=>{if(drillActive)return;const wasControlled=controlled;if(wasControlled){controlled=false;followChild=false;manualMoving=false;rebuildPatrolFromChild();}if(!wasControlled&&!isWalking)rebuildPatrolFromChild();isWalking=!isWalking;syncControls();});
document.querySelector('#toggle-labels').addEventListener('click',()=>{labelsVisible=!labelsVisible;labelGroup.visible=labelsVisible;students.forEach(student=>{student.character.nameTag.visible=labelsVisible;});syncControls();});
const keys=new Set(),touchHeld=new Map();
window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(controlled)jumpRequested=true;return;}if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);document.querySelector('#intro').classList.add('hidden');if(followChild&&!controlled){followChild=false;syncControls();}}});
window.addEventListener('keyup',e=>keys.delete(e.code));
document.querySelectorAll('[data-touch-key]').forEach(button=>{
  button.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!controlled)return;const key=button.dataset.touchKey;keys.add(key);touchHeld.set(e.pointerId,{key,button});button.classList.add('pressed');button.setPointerCapture?.(e.pointerId);});
  const release=e=>{const held=touchHeld.get(e.pointerId);if(!held)return;keys.delete(held.key);held.button.classList.remove('pressed');touchHeld.delete(e.pointerId);};
  button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
});
document.querySelector('#touch-jump').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(controlled)jumpRequested=true;e.currentTarget.classList.add('pressed');});
document.querySelector('#touch-jump').addEventListener('pointerup',e=>e.currentTarget.classList.remove('pressed'));
document.querySelector('#touch-jump').addEventListener('pointercancel',e=>e.currentTarget.classList.remove('pressed'));
window.addEventListener('blur',()=>{keys.clear();touchHeld.forEach(({button})=>button.classList.remove('pressed'));touchHeld.clear();});
let toastTimer;function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
renderer.domElement.addEventListener('pointerdown',()=>document.querySelector('#intro').classList.add('hidden'),{once:true});
document.querySelector('#fullscreen').addEventListener('click',()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();});
let audioCtx=null,noiseSource=null,audioOn=false;document.querySelector('#sound').addEventListener('click',()=>{audioOn=!audioOn;document.querySelector('#soundIcon').textContent=audioOn?'♫':'♬';if(audioOn){try{audioCtx??=new AudioContext();const n=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.07;noiseSource=audioCtx.createBufferSource();noiseSource.buffer=n;noiseSource.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=520;const gain=audioCtx.createGain();gain.gain.value=.1;noiseSource.connect(filter).connect(gain).connect(audioCtx.destination);noiseSource.start();toast('Sonido ambiente activado');}catch{toast('El sonido no está disponible');}}else{try{noiseSource?.stop();noiseSource=null;}catch{}toast('Sonido ambiente desactivado');}});

const clock=new THREE.Clock();let elapsed=0;
function floorHeightAt(x,z){if(x>5.04&&x<9.22&&z>9.89&&z<15.31)return .64;if(x>1.02&&x<4.38&&z>7.82&&z<8.54)return .47;if(x>1.94&&x<3.46&&z>=8.45&&z<=12.65)return THREE.MathUtils.lerp(.47,.23,(z-8.45)/4.2);if(x>1.02&&x<4.38&&z>=12.55&&z<13.35)return .23;return .2;}
function collidesWithStatic(x,z,actorY=.2){
  if(x<-9.82||x>9.02||z<-18.65||z>18.55)return true;
  for(const w of school.collisionWalls){const dx=w.x2-w.x1,dz=w.z2-w.z1,len2=dx*dx+dz*dz;const t=THREE.MathUtils.clamp(((x-w.x1)*dx+(z-w.z1)*dz)/len2,0,1);const px=w.x1+t*dx,pz=w.z1+t*dz;if(Math.hypot(x-px,z-pz)<.31+w.thickness*.5)return true;}
  const radius=.31,bodyBottom=actorY+.04,bodyTop=actorY+1.55;
  for(const b of school.collisionObjects){if(b.bedRim&&actorY>=.5)continue;if(bodyTop<=b.minY||bodyBottom>=b.maxY)continue;const px=THREE.MathUtils.clamp(x,b.minX,b.maxX),pz=THREE.MathUtils.clamp(z,b.minZ,b.maxZ);if(Math.hypot(x-px,z-pz)<radius)return true;}
  return false;
}
function collidesWithWall(x,z,actorY=child.root.position.y){
  if(collidesWithStatic(x,z,actorY))return true;
  if(controlled&&students.some((student,index)=>index!==activeStudentIndex&&Math.hypot(x-student.character.root.position.x,z-student.character.root.position.z)<.62))return true;
  return false;
}
const gridStep=.28,gridMinX=-9.6,gridMinZ=-18.6,gridCols=Math.floor((9.0-gridMinX)/gridStep)+1,gridRows=Math.floor((18.5-gridMinZ)/gridStep)+1;
let navigationGrid=null;
function buildNavigationGrid(){const walkable=new Uint8Array(gridCols*gridRows);for(let row=0;row<gridRows;row++)for(let col=0;col<gridCols;col++){const x=gridMinX+col*gridStep,z=gridMinZ+row*gridStep;if(!collidesWithStatic(x,z,.2))walkable[row*gridCols+col]=1;}navigationGrid=walkable;}
function navPosition(id){return {x:gridMinX+(id%gridCols)*gridStep,z:gridMinZ+Math.floor(id/gridCols)*gridStep};}
function nearestNavNode(x,z){let col=Math.round((x-gridMinX)/gridStep),row=Math.round((z-gridMinZ)/gridStep),best=-1,bestDistance=Infinity;for(let radius=0;radius<=12&&best<0;radius++){for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){if(radius&&Math.max(Math.abs(dx),Math.abs(dz))!==radius)continue;const c=col+dx,r=row+dz;if(c<0||c>=gridCols||r<0||r>=gridRows)continue;const id=r*gridCols+c;if(!navigationGrid[id])continue;const p=navPosition(id),distance=(p.x-x)**2+(p.z-z)**2;if(distance<bestDistance){best=id;bestDistance=distance;}}}return best;}
function pathIsClear(a,b){const distance=Math.hypot(b.x-a.x,b.z-a.z),steps=Math.max(1,Math.ceil(distance/.14));for(let i=1;i<=steps;i++){const t=i/steps;if(collidesWithStatic(THREE.MathUtils.lerp(a.x,b.x,t),THREE.MathUtils.lerp(a.z,b.z,t),.2))return false;}return true;}
function buildWalkPath(startX,startZ,goalX,goalZ){
  if(!navigationGrid)buildNavigationGrid();const start=nearestNavNode(startX,startZ),goal=nearestNavNode(goalX,goalZ);if(start<0||goal<0)return null;
  const count=gridCols*gridRows,gScore=new Float32Array(count);gScore.fill(Infinity);const cameFrom=new Int32Array(count);cameFrom.fill(-1);const closed=new Uint8Array(count),heap=[];
  const heuristic=(id)=>{const x=id%gridCols,z=Math.floor(id/gridCols),gx=goal%gridCols,gz=Math.floor(goal/gridCols),dx=Math.abs(x-gx),dz=Math.abs(z-gz);return Math.max(dx,dz)+(Math.SQRT2-1)*Math.min(dx,dz);};
  const push=(node)=>{let i=heap.length;heap.push(node);while(i>0){const parent=(i-1)>>1;if(heap[parent].f<=node.f)break;heap[i]=heap[parent];i=parent;}heap[i]=node;};
  const pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let child=i*2+1;if(child>=heap.length)break;if(child+1<heap.length&&heap[child+1].f<heap[child].f)child++;if(heap[child].f>=last.f)break;heap[i]=heap[child];i=child;}heap[i]=last;}return first;};
  gScore[start]=0;push({id:start,g:0,f:heuristic(start)});const dirs=[[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1]];
  while(heap.length){const current=pop();if(closed[current.id]||current.g>gScore[current.id]+1e-4)continue;if(current.id===goal)break;closed[current.id]=1;const col=current.id%gridCols,row=Math.floor(current.id/gridCols);
    for(const [dx,dz] of dirs){const c=col+dx,r=row+dz;if(c<0||c>=gridCols||r<0||r>=gridRows)continue;const next=r*gridCols+c;if(!navigationGrid[next]||closed[next])continue;if(dx&&dz&&(!navigationGrid[row*gridCols+c]||!navigationGrid[r*gridCols+col]))continue;const cost=current.g+(dx&&dz?Math.SQRT2:1);if(cost+1e-4>=gScore[next])continue;cameFrom[next]=current.id;gScore[next]=cost;push({id:next,g:cost,f:cost+heuristic(next)});}
  }
  if(start!==goal&&cameFrom[goal]<0)return null;const raw=[];for(let id=goal;id>=0;id=cameFrom[id]){raw.push(navPosition(id));if(id===start)break;}raw.reverse();if(raw.length===0||raw[0].x!==navPosition(start).x||raw[0].z!==navPosition(start).z)return null;
  const smooth=[raw[0]];let anchor=0;while(anchor<raw.length-1){let next=raw.length-1;while(next>anchor+1&&!pathIsClear(raw[anchor],raw[next]))next--;smooth.push(raw[next]);anchor=next;}
  const exactStart={x:startX,z:startZ},exactGoal={x:goalX,z:goalZ};if(!collidesWithStatic(startX,startZ,.2)&&pathIsClear(exactStart,smooth[0]))smooth.unshift(exactStart);if(!collidesWithStatic(goalX,goalZ,.2)&&pathIsClear(smooth.at(-1),exactGoal))smooth.push(exactGoal);return smooth;
}
function studentTrafficIsClear(student,x,z,clearance=.53){return students.every(other=>other===student||Math.hypot(x-other.character.root.position.x,z-other.character.root.position.z)>=clearance);}
function moveStudentToward(student,goal,dt,speed,key){
  const p=student.character.root.position;student.lastMoveDistance=0;
  if(student.navKey!==key){student.navKey=key;student.navPath=null;student.navRetry=0;student.navPathIndex=0;student.navBlockedTime=0;}
  if(!student.navPath){student.navRetry=Math.max(0,student.navRetry-dt);if(student.navRetry>0)return false;student.navPath=buildWalkPath(p.x,p.z,goal[0],goal[1]);student.navRetry=student.navPath?0:.25;if(!student.navPath)return false;student.navPathIndex=student.navPath.length>1?1:0;}
  while(student.navPathIndex<student.navPath.length){const point=student.navPath[student.navPathIndex];if(Math.hypot(point.x-p.x,point.z-p.z)>.14)break;student.navPathIndex++;}
  if(student.navPathIndex>=student.navPath.length){student.navBlockedTime=0;return true;}
  const point=student.navPath[student.navPathIndex],distance=Math.hypot(point.x-p.x,point.z-p.z),step=Math.min(speed*dt,distance);if(step<1e-5)return false;
  const baseX=(point.x-p.x)/distance,baseZ=(point.z-p.z)/distance;
  // Probe a deterministic steering fan. Alternating side preference prevents pairs
  // of children from making the same sidestep and blocking one another in corridors.
  const candidateAngles=[0];for(let i=1;i<=7;i++){const angle=i*.19*student.avoidanceSide;candidateAngles.push(angle,-angle);}
  candidateAngles.push(1.42*student.avoidanceSide,-1.42*student.avoidanceSide,Math.PI*.5*student.avoidanceSide,-Math.PI*.5*student.avoidanceSide);
  const nearestStudentBefore=Math.min(Infinity,...students.filter(other=>other!==student).map(other=>Math.hypot(p.x-other.character.root.position.x,p.z-other.character.root.position.z)));
  let chosen=null,bestScore=-Infinity;
  for(const angle of candidateAngles){const dirX=baseX*Math.cos(angle)-baseZ*Math.sin(angle),dirZ=baseX*Math.sin(angle)+baseZ*Math.cos(angle),nx=p.x+dirX*step,nz=p.z+dirZ*step;
    // Sweep the full step so a frame hitch cannot skip through a narrow collider.
    let clear=true;const checks=Math.max(1,Math.ceil(step/.09));for(let sample=1;sample<=checks;sample++){const t=sample/checks,x=p.x+(nx-p.x)*t,z=p.z+(nz-p.z)*t;if(collidesWithStatic(x,z,p.y)||!studentTrafficIsClear(student,x,z)){clear=false;break;}}
    if(!clear)continue;const nextDistance=Math.hypot(point.x-nx,point.z-nz),progress=distance-nextDistance;
    const nearestStudentAfter=Math.min(Infinity,...students.filter(other=>other!==student).map(other=>Math.hypot(nx-other.character.root.position.x,nz-other.character.root.position.z))),detourGain=Number.isFinite(nearestStudentBefore)&&Number.isFinite(nearestStudentAfter)?nearestStudentAfter-nearestStudentBefore:0;
    if(progress<-step*.08&&detourGain<.003)continue;
    const sideBonus=Math.sign(angle)===student.avoidanceSide?0.012:0,score=progress-Math.abs(angle)*step*.075+sideBonus+Math.max(0,detourGain)*.5;if(score>bestScore){bestScore=score;chosen={nx,nz};}
  }
  if(!chosen){student.navBlockedTime+=dt;if(student.navBlockedTime>=.42){student.navPath=null;student.navPathIndex=0;student.navRetry=0;student.navBlockedTime=0;}return false;}
  student.navBlockedTime=0;const dx=chosen.nx-p.x,dz=chosen.nz-p.z;student.lastMoveDistance=Math.hypot(dx,dz);p.x=chosen.nx;p.z=chosen.nz;if(!student.emergencyPhase?.startsWith('jump')&&!student.emergencyPhase?.startsWith('landing'))p.y=floorHeightAt(p.x,p.z);student.forward.set(dx,0,dz).normalize();student.character.root.rotation.y=Math.atan2(dx,dz);return false;
}
function updateEmergencyStudent(student,dt){
  const actor=student.character,p=actor.root.position,phase=student.emergencyPhase;student.lastMoveDistance=0;
  if(phase==='approach'){
    if(drillActive){student.emergencyDelay=Math.max(0,student.emergencyDelay-dt);if(student.emergencyDelay>0)return false;}
    const arrived=moveStudentToward(student,[4.55,student.emergencySlot],dt,1.3,'drill-stage');if(arrived){student.emergencyPhase='jump-in';student.emergencyJumpVelocity=4.45;student.navPath=null;student.navKey='';return true;}return student.lastMoveDistance>.001;
  }
  const jumping=phase==='jump-in'||phase==='jump-out',landing=phase==='landing-in'||phase==='landing-out';if(!jumping&&!landing)return false;
  if(jumping){student.emergencyJumpVelocity-=12.5*dt;p.y+=student.emergencyJumpVelocity*dt;const targetX=phase==='jump-in'?5.82:4.55,delta=targetX-p.x,step=Math.min(Math.abs(delta),2.55*dt),nx=p.x+Math.sign(delta)*step;
    if(step>.0001&&!collidesWithStatic(nx,p.z,p.y)&&studentTrafficIsClear(student,nx,p.z,.53)){p.x=nx;student.lastMoveDistance=step;student.forward.set(Math.sign(delta),0,0);actor.root.rotation.y=Math.atan2(student.forward.x,student.forward.z);}
    if(Math.abs(targetX-p.x)<.035){student.emergencyPhase=phase==='jump-in'?'landing-in':'landing-out';student.navPath=null;}
  }else{student.emergencyJumpVelocity-=12.5*dt;p.y+=student.emergencyJumpVelocity*dt;}
  const ground=floorHeightAt(p.x,p.z);if(p.y<=ground&&student.emergencyJumpVelocity<=0){p.y=ground;student.emergencyJumpVelocity=0;if(student.emergencyPhase==='jump-in'){student.emergencyPhase='approach';student.navPath=null;student.navKey='';student.navRetry=0;}else if(student.emergencyPhase==='jump-out'){student.emergencyPhase=drillActive?'safe':null;}else if(student.emergencyPhase==='landing-in'){student.emergencyPhase=drillActive?'safe':'jump-out';if(student.emergencyPhase==='jump-out')student.emergencyJumpVelocity=4.45;}else if(student.emergencyPhase==='landing-out'){student.emergencyPhase=null;student.navPath=null;student.navKey='';}}
  return student.lastMoveDistance>.001;
}
function startEmergencyDrill(){
  if(drillActive)return;drillActive=true;controlled=false;followChild=false;manualMoving=false;jumpRequested=false;jumpVelocity=0;keys.clear();
  students.forEach((student,index)=>{const p=student.character.root.position,alreadyInside=p.x>5.45&&p.x<8.8&&p.z>10.45&&p.z<14.75&&p.y>=.5;student.emergencyPhase=alreadyInside?'safe':'approach';student.emergencyDelay=index*.35;student.emergencySlot=10.55+index*.78;student.emergencyJumpVelocity=0;student.navPath=null;student.navKey='';student.navRetry=0;if(!alreadyInside)p.y=floorHeightAt(p.x,p.z);});
  updateEmergencyControls();syncControls();document.querySelector('#intro').classList.add('hidden');toast('Simulacro iniciado · Todas van a la zona segura');
}
function stopEmergencyDrill(){
  if(!drillActive)return;drillActive=false;students.forEach(student=>{if(student.emergencyPhase==='approach'){student.emergencyPhase=null;student.navPath=null;student.navKey='';}else if(['safe','jump-in','landing-in'].includes(student.emergencyPhase)){student.emergencyPhase='jump-out';student.emergencyJumpVelocity=4.45;student.navPath=null;} });
  updateEmergencyControls();syncControls();toast('Simulacro detenido');
}
function updateEmergencyControls(){const start=document.querySelector('#start-drill'),stop=document.querySelector('#stop-drill'),status=document.querySelector('#emergency-status'),overlay=document.querySelector('#emergency-overlay');start.hidden=drillActive;stop.hidden=!drillActive;status.hidden=!drillActive;overlay.hidden=!drillActive;document.querySelector('.experience').classList.toggle('emergency-active',drillActive);document.querySelector('#student-select').disabled=drillActive;document.querySelector('#control-child').disabled=drillActive;document.querySelector('#follow-child').disabled=drillActive;document.querySelector('#toggle-walk').disabled=drillActive;}
document.querySelector('#start-drill').addEventListener('click',startEmergencyDrill);document.querySelector('#stop-drill').addEventListener('click',stopEmergencyDrill);
const emergencyBeacons=[];for(const [x,z] of [[2.7,11.7],[6.9,9.35],[-2.5,1],[5.6,-10]]){const bulb=new THREE.Mesh(new THREE.SphereGeometry(.17,12,10),new THREE.MeshBasicMaterial({color:'#ff1717'}));bulb.position.set(x,3.15,z);bulb.visible=false;scene.add(bulb);const glow=new THREE.PointLight(0xff1616,0,7,2);glow.position.copy(bulb.position);scene.add(glow);emergencyBeacons.push({bulb,glow});}
function updateEmergencyBeacons(time){const pulse=.5+.5*Math.sin(time*7);for(const beacon of emergencyBeacons){beacon.bulb.visible=drillActive&&pulse>.14;beacon.glow.intensity=drillActive?pulse*2.6:0;}}
function updateControlledChild(dt){
  manualMoving=false;if(!controlled)return;
  const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,camera.up).normalize();
  const move=new THREE.Vector3();if(keys.has('KeyW')||keys.has('ArrowUp'))move.add(forward);if(keys.has('KeyS')||keys.has('ArrowDown'))move.sub(forward);if(keys.has('KeyD')||keys.has('ArrowRight'))move.add(right);if(keys.has('KeyA')||keys.has('ArrowLeft'))move.sub(right);
  if(move.lengthSq()<.001)return;move.normalize();const sprinting=keys.has('ShiftLeft')||keys.has('ShiftRight');const step=move.multiplyScalar(dt*(sprinting?4.4:2.2)),p=child.root.position;
  let nx=p.x+step.x,nz=p.z+step.z;
  if(collidesWithWall(nx,nz)){if(!collidesWithWall(p.x+step.x,p.z))nz=p.z;else if(!collidesWithWall(p.x,p.z+step.z))nx=p.x;else return;}
  childForward.set(nx-p.x,0,nz-p.z).normalize();p.x=nx;p.z=nz;if(jumpVelocity===0)p.y=floorHeightAt(nx,nz);child.root.rotation.y=Math.atan2(childForward.x,childForward.z);manualMoving=true;
}
function updateJump(dt){const p=child.root.position,ground=floorHeightAt(p.x,p.z);if(students[activeStudentIndex].emergencyPhase){jumpRequested=false;jumpVelocity=0;return;}if(controlled&&jumpRequested&&p.y<=ground+.005&&jumpVelocity===0)jumpVelocity=4.25;jumpRequested=false;if(!controlled){jumpVelocity=0;p.y=ground;return;}if(jumpVelocity!==0){jumpVelocity-=12.5*dt;p.y+=jumpVelocity*dt;const landing=floorHeightAt(p.x,p.z);if(p.y<=landing){p.y=landing;jumpVelocity=0;}}else p.y=ground;}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;
  if(travelling){const t=Math.min((performance.now()-travelStart)/1700,1),ease=t*t*(3-2*t);camera.position.lerpVectors(fromPos,toPos,ease);controls.target.lerpVectors(fromTarget,toTarget,ease);if(t>=1)travelling=false;}
  updateControlledChild(dt);updateJump(dt);updateChild(dt,elapsed);updateEmergencyBeacons(elapsed);
  if(followChild){const p=child.root.position;if(controlled){const target=new THREE.Vector3(p.x,p.y+1.05,p.z),shift=target.clone().sub(lastFollowTarget);camera.position.add(shift);controls.target.copy(target);lastFollowTarget.copy(target);}else{const desired=p.clone().addScaledVector(childForward,-4.3);desired.y=p.y+3.0;camera.position.lerp(desired,.06);controls.target.lerp(new THREE.Vector3(p.x,p.y+1.05,p.z),.09);}}
  if(!controlled){const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,camera.up).normalize();const step=dt*4.7;let moved=false;
    if(keys.has('KeyW')||keys.has('ArrowUp')){camera.position.addScaledVector(forward,step);controls.target.addScaledVector(forward,step);moved=true;}if(keys.has('KeyS')||keys.has('ArrowDown')){camera.position.addScaledVector(forward,-step);controls.target.addScaledVector(forward,-step);moved=true;}if(keys.has('KeyA')||keys.has('ArrowLeft')){camera.position.addScaledVector(right,-step);controls.target.addScaledVector(right,-step);moved=true;}if(keys.has('KeyD')||keys.has('ArrowRight')){camera.position.addScaledVector(right,step);controls.target.addScaledVector(right,step);moved=true;}
    if(moved){travelling=false;followChild=false;syncControls();const offset=camera.position.clone().sub(controls.target);camera.position.x=THREE.MathUtils.clamp(camera.position.x,-11,11);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-22,22);controls.target.copy(camera.position).sub(offset);}
  }
  controls.update();camera.position.x=THREE.MathUtils.clamp(camera.position.x,-40,40);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-50,50);camera.position.y=THREE.MathUtils.clamp(camera.position.y,1.48,65);renderer.render(scene,camera);
}
animate();window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);});setTimeout(()=>document.querySelector('#loading').classList.add('done'),850);
