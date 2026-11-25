import * as THREE from 'three';

export function buildSchool({scene, mat, box, cylinder, grass, stone, wood, trim}) {
  const collisionWalls=[];
  const stucco=mat('#e9e4d8',.96), wall=mat('#eee9df',.96), cap=mat('#e2d7bf',.82), darkWood=mat('#76543a',.82), timber=mat('#a98255',.78), blue=mat('#075a9e',.74), basePaint=mat('#245b67',.9), glass=new THREE.MeshPhysicalMaterial({color:'#a8c7c7',roughness:.16,transparent:true,opacity:.34,transmission:.12,clearcoat:.8}), metal=mat('#242c2e',.42,{metalness:.58});
  const floorClass=mat('#bebdb7',.96), tile=mat('#c8c7bf',.94), concrete=mat('#77776f',.98), soil=mat('#71583b',.98), rubber=mat('#756a5c'), lawn=grass;
  const addWall=(x1,z1,x2,z2,h=3.53,t=.18,m=wall,y0=0)=>{const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx),w=box(scene,(x1+x2)/2,y0+h/2,(z1+z2)/2,len,h,t,m);w.rotation.y=angle;w.userData.walkSolid=false;if(h>=2.5&&(m===wall||m===stucco)){const band=box(scene,(x1+x2)/2,y0+.25,(z1+z2)/2,len,.5,t+.025,basePaint);band.rotation.y=angle;band.userData.walkSolid=false;}collisionWalls.push({x1,z1,x2,z2,thickness:t});return w;};
  const floor=(x,z,w,d,m=tile,y=.08)=>{const f=box(scene,x,y,z,w,.16,d,m,false,true);f.userData.walkSolid=false;f.userData.walkSurface=true;return f;};
  const windowWall=(x1,z1,x2,z2)=>{addWall(x1,z1,x2,z2,.98,.18,wall,0);addWall(x1,z1,x2,z2,1.17,.18,wall,2.36);const pane=box(scene,(x1+x2)/2,1.62,(z1+z2)/2,Math.hypot(x2-x1,z2-z1),1.28,.07,glass,false,false);pane.rotation.y=-Math.atan2(z2-z1,x2-x1);const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx),g=new THREE.Group();g.position.set((x1+x2)/2,1.62,(z1+z2)/2);g.rotation.y=angle;scene.add(g);for(let x=-len/2+.12;x<len/2;x+=.24)box(g,x,0,.11,.045,1.25,.055,metal,false,false);for(const y of [-.55,0,.55])box(g,0,y,.11,len,.045,.055,metal,false,false);};
  const door=(x,z,angle=0,swing=0,material=blue)=>{const g=new THREE.Group();g.position.set(x,.06,z);g.rotation.y=angle+swing;scene.add(g);box(g,.48,1.08,0,.92,2.08,.12,material);box(g,.84,1.08,.085,.07,.07,.035,mat('#c6a56a',.35,{metalness:.65}));box(g,.48,2.15,0,1.12,.13,.22,blue);if(Math.abs(swing)>.01)g.traverse(object=>{if(object.isMesh)object.userData.walkSolid=false;});return g;};

  // School parcel follows the reference plan dimensions, with the garden's stone plinth and warm perimeter.
  box(scene,0,-.34,0,21,.8,40,mat('#827f73'),false,true);
  const plot=new THREE.Shape();plot.moveTo(-8.8,-19);plot.lineTo(8.8,-19);plot.lineTo(9.4,17.5);plot.lineTo(-10.2,19.2);plot.closePath();
  const site=new THREE.Mesh(new THREE.ShapeGeometry(plot),mat('#c2b8a5',.94));site.rotation.x=-Math.PI/2;site.position.y=.08;site.receiveShadow=true;scene.add(site);
  // Quiet paved circulation surface and joints.
  floor(0,0,19.1,37.9,stone,.12);
  for(let z=-18.2;z<18.4;z+=1.15)for(let x=-9.2;x<9;x+=1.3){
    const seam=box(scene,x,.205,z,1.24,.025,.025,mat('#aaa18e'),false,true);seam.rotation.y=(Math.floor((z+18.2)/1.15)%2)*.04;
  }
  const campusWall=wall;
  const storageDoorCenterX=-2.84,storageDoorCenterZ=10.575,storageDoorHalfWidth=.58;
  const storageDoorStartX=storageDoorCenterX-storageDoorHalfWidth,storageDoorEndX=storageDoorCenterX+storageDoorHalfWidth;
  addWall(-8.8,-19,8.8,-19,2.9,.26,campusWall);addWall(-8.8,-19,-9.597,2.75,2.65,.26,campusWall);addWall(-9.597,2.75,-10.069,15.64,3.53,.26,campusWall);addWall(-10.069,15.64,-10.2,19.2,3.53,.26,campusWall);addWall(8.8,-19,9.4,17.5,3.53,.26,campusWall);
  // The street-facing school wall is continuous except for the main entrance.
  addWall(-10.2,19.2,1.35,18.2,3.53,.3,wall);addWall(4.05,17.95,9.4,17.5,3.53,.3,wall);
  for(const [x,z] of [[1.38,18.18],[4.02,17.96]])box(scene,x,1.68,z,.2,3.28,.34,blue);
  box(scene,2.7,3.25,18.04,2.95,.2,.34,blue);
  // Heavy painted steel leaves sit partly open, revealing the dark school corridor beyond.
  const leftLeaf=new THREE.Group();leftLeaf.position.set(1.48,.08,18.12);leftLeaf.rotation.y=.58;scene.add(leftLeaf);
  box(leftLeaf,.64,1.43,0,1.28,2.78,.12,blue);box(leftLeaf,.64,.14,.08,1.28,.12,.055,mat('#06477e',.72));
  for(const y of [.34,.72,1.1,1.48,1.86,2.24,2.62])box(leftLeaf,.64,y,.075,1.27,.035,.035,mat('#176bac',.66));
  const rightLeaf=new THREE.Group();rightLeaf.position.set(3.92,.08,17.98);rightLeaf.rotation.y=-.58;scene.add(rightLeaf);
  box(rightLeaf,-.64,1.43,0,1.28,2.78,.12,blue);for(const y of [.34,.72,1.1,1.48,1.86,2.24,2.62])box(rightLeaf,-.64,y,.075,1.27,.035,.035,mat('#176bac',.66));
  for(const gateLeaf of [leftLeaf,rightLeaf])gateLeaf.traverse(object=>{if(object.isMesh)object.userData.walkSolid=false;});
  for(const [x,z] of [[1.48,18.12],[3.92,17.98]])cylinder(scene,x,1.1,z,.045,.045,2.05,mat('#715d38',.42,{metalness:.55}),10);
  // Gray sheet roof with painted rust marks; roof color details remain flat on the surface.
  const zinc=mat('#b8b5aa',.9,{metalness:.12});
  zinc.side=THREE.DoubleSide;
  const roofRustPaint=new THREE.MeshBasicMaterial({color:'#965036',side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
  // Keep the entrance canopy across the facade and place its connecting arm on the opposite patio edge.
  const roofGroup=new THREE.Group();roofGroup.position.set(-.4,0,17.15);roofGroup.rotation.y=.0866;scene.add(roofGroup);
  const roofFootprint=new THREE.Shape();
  roofFootprint.moveTo(-10.35,-2.35);roofFootprint.lineTo(9.5,-2.35);roofFootprint.lineTo(9.5,2.35);roofFootprint.lineTo(-3.05,2.35);roofFootprint.lineTo(-3.05,15.15);roofFootprint.lineTo(-8.07,15.15);roofFootprint.lineTo(-9.65,2.35);roofFootprint.lineTo(-10.35,2.35);roofFootprint.closePath();
  const roofPanel=new THREE.Mesh(new THREE.ExtrudeGeometry(roofFootprint,{depth:.09,bevelEnabled:false}),zinc);roofPanel.rotation.x=-Math.PI/2;roofPanel.position.y=3.53;roofPanel.castShadow=true;roofPanel.receiveShadow=true;roofGroup.add(roofPanel);
  for(const [x,w,d,z] of [[-8.85,.42,2.4,0],[-4.75,.58,2.7,0],[-1.95,.28,1.9,0],[1,.68,2.6,0],[3.85,.3,1.8,0],[-8,.32,1.8,-5.8],[-8.5,.55,2.2,-8.0],[-5.45,.3,1.8,-12.35],[6.65,.6,2.4,0],[8.85,.26,1.5,0],[-7.8,.26,1.5,-12.35]]){const patch=new THREE.Mesh(new THREE.PlaneGeometry(w,d),roofRustPaint);patch.rotation.x=-Math.PI/2;patch.position.set(x,3.627,z);roofGroup.add(patch);}
  const eave=box(roofGroup,0,3.44,2.33,19.95,.12,.16,mat('#77746c',.88));eave.rotation.x=.1;
  const classroomEave=box(roofGroup,-5.56,3.44,-15.15,5.02,.12,.16,mat('#77746c',.88));classroomEave.rotation.x=.1;
  for(const x of [-8.4,-4.2,.2,4.6,8.6]){const bracket=box(roofGroup,x+.4,3.12,1.68,.11,.11,.72,metal);bracket.rotation.x=-.34;}
  // Close the exposed classroom and bathroom roof openings with the same painted sheet finish.
  function paintedRoomRoof(cx,cz,width,depth){
    box(scene,cx,3.575,cz,width,.09,depth,zinc,false,true);
    for(const [dx,dz,w,d] of [[-.32,-depth*.28,.16,depth*.28],[.42,depth*.22,.22,depth*.18],[-.62,depth*.08,.1,depth*.32]]){
      const rustMark=new THREE.Mesh(new THREE.PlaneGeometry(w,d),roofRustPaint);rustMark.rotation.x=-Math.PI/2;rustMark.position.set(cx+dx,3.627,cz+dz);scene.add(rustMark);
    }
  }
  // Keep classroom roofs independent from the moved passage cover; leave the patio open.
  paintedRoomRoof(-3.9,4.625,11.7,6.55);
  paintedRoomRoof(6.35,4.8,5.5,5.6);
  paintedRoomRoof(-4.65,-15.3,5.9,7.4);paintedRoomRoof(4.65,-15.3,5.9,7.4);paintedRoomRoof(7.7,-5.65,2.55,8.5);
  // Keep the two rear classroom roofs independent; leave their central span uncovered.
  paintedRoomRoof(7.05,-10.75,1.1,1.7);
  paintedRoomRoof(4.725,-5.1125,3.55,7.425);
  paintedRoomRoof(4.725,-.025,3.55,2.75);
  paintedRoomRoof(7.7,-.025,2.4,2.75);
  // Large two-line institutional lettering and crest, aligned flush with the sloped street facade.
  const signCanvas=document.createElement('canvas');signCanvas.width=2400;signCanvas.height=512;const signCtx=signCanvas.getContext('2d');
  signCtx.clearRect(0,0,2400,512);signCtx.textBaseline='middle';signCtx.textAlign='left';signCtx.lineJoin='round';signCtx.shadowColor='rgba(162,133,57,.96)';signCtx.shadowOffsetX=11;signCtx.shadowOffsetY=10;signCtx.shadowBlur=1;signCtx.strokeStyle='#b69a50';signCtx.lineWidth=8;signCtx.fillStyle='#174d67';
  const schoolName='INSTITUCION EDUCATIVA N° 07 BELLAVISTA';let titleSize=104;signCtx.font=`900 ${titleSize}px Georgia,serif`;while(signCtx.measureText(schoolName).width>1880&&titleSize>64){titleSize-=2;signCtx.font=`900 ${titleSize}px Georgia,serif`;}
  signCtx.strokeText(schoolName,42,178);signCtx.fillText(schoolName,42,178);signCtx.font='900 128px Georgia,serif';signCtx.strokeText('INICIAL',760,372);signCtx.fillText('INICIAL',760,372);signCtx.shadowColor='transparent';
  signCtx.beginPath();signCtx.moveTo(2070,47);signCtx.lineTo(2328,75);signCtx.lineTo(2294,338);signCtx.lineTo(2198,445);signCtx.lineTo(2102,338);signCtx.closePath();signCtx.fillStyle='#164b68';signCtx.fill();signCtx.lineWidth=12;signCtx.strokeStyle='#d6ad53';signCtx.stroke();
  signCtx.fillStyle='#b74035';signCtx.fillRect(2105,89,188,107);signCtx.fillStyle='#f3e8c4';signCtx.fillRect(2105,201,188,91);signCtx.fillStyle='#123c5d';signCtx.fillRect(2105,297,188,65);signCtx.fillStyle='#fff';signCtx.textAlign='center';signCtx.font='700 70px Arial';signCtx.fillText('N° 07',2199,277);signCtx.font='700 78px Arial';signCtx.fillText('E',2199,160);
  const signTexture=new THREE.CanvasTexture(signCanvas);signTexture.colorSpace=THREE.SRGBColorSpace;const sign=new THREE.Mesh(new THREE.PlaneGeometry(11.05,2.35),new THREE.MeshBasicMaterial({map:signTexture,transparent:true,depthWrite:false}));sign.position.set(-4.4,2.08,18.87);sign.rotation.y=.086;scene.add(sign);
  // A broad accessible concrete approach with low side curbs, aligned to the doorway.
  const ramp=box(scene,2.7,.12,19.72,4.15,.18,3.75,mat('#c9c5b8',.94));ramp.rotation.x=-.025;ramp.userData.walkSolid=false;ramp.userData.walkSurface=true;
  for(const x of [.42,4.98])box(scene,x,.26,19.72,.16,.34,3.75,cap);
  const fieldCanvas=document.createElement('canvas');fieldCanvas.width=512;fieldCanvas.height=512;const fieldCtx=fieldCanvas.getContext('2d');fieldCtx.fillStyle='#586b43';fieldCtx.fillRect(0,0,512,512);
  const fieldColors=['rgba(31,64,32,.28)','rgba(104,105,69,.18)','rgba(66,91,43,.26)','rgba(93,75,50,.18)'];
  for(let i=0;i<260;i++){const x=Math.random()*512,y=Math.random()*512,r=6+Math.random()*38,g=fieldCtx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,fieldColors[i%fieldColors.length]);g.addColorStop(1,'rgba(88,107,67,0)');fieldCtx.fillStyle=g;fieldCtx.beginPath();fieldCtx.arc(x,y,r,0,Math.PI*2);fieldCtx.fill();}
  for(let i=0;i<3600;i++){fieldCtx.globalAlpha=.08+Math.random()*.24;fieldCtx.fillStyle=fieldColors[i%fieldColors.length];const size=.6+Math.random()*3.5;fieldCtx.fillRect(Math.random()*512,Math.random()*512,size,size);}fieldCtx.globalAlpha=1;
  const fieldTexture=new THREE.CanvasTexture(fieldCanvas);fieldTexture.wrapS=fieldTexture.wrapT=THREE.RepeatWrapping;fieldTexture.repeat.set(72,72);fieldTexture.colorSpace=THREE.SRGBColorSpace;
  const field=mat('#d1d6b5',1,{map:fieldTexture});
  const roadCanvas=document.createElement('canvas');roadCanvas.width=roadCanvas.height=256;const roadCtx=roadCanvas.getContext('2d');roadCtx.fillStyle='#817969';roadCtx.fillRect(0,0,256,256);for(let i=0;i<2300;i++){roadCtx.globalAlpha=.08+Math.random()*.24;roadCtx.fillStyle=i%2?'#b7aa8f':'#534e42';const size=.6+Math.random()*3;roadCtx.fillRect(Math.random()*256,Math.random()*256,size,size);}roadCtx.globalAlpha=1;
  const roadTexture=new THREE.CanvasTexture(roadCanvas);roadTexture.wrapS=roadTexture.wrapT=THREE.RepeatWrapping;roadTexture.repeat.set(54,3);roadTexture.colorSpace=THREE.SRGBColorSpace;
  // A single unpaved road runs along the school frontage; the surrounding land is open rural field.
  box(scene,0,-.55,0,300,.3,300,field,false,true);
  box(scene,0,-.4,22.5,180,.38,9,mat('#fffdf2',1,{map:roadTexture}),false,true);
  box(scene,0,-.15,18.8,180,.14,1.2,cap,false,true);
  for(const z of [17.2,27.8])box(scene,0,-.36,z,180,.08,1.0,mat('#a29578',1,{map:fieldTexture}),false,true);
  // Soft distant ridgelines give the small Bellavista campus a believable Andean setting.
  const hillMats=['#7e8768','#929478','#777f65'].map(c=>mat(c,1));
  for(const [x,z,sx,sy,sz,i] of [[-72,-91,36,8,22,0],[-28,-99,42,10,24,1],[22,-94,48,11,24,0],[78,-88,36,8,22,2],[-78,95,42,9,25,2],[-26,102,44,8,24,0],[34,97,48,11,25,1],[84,90,38,9,23,0]]){const hill=new THREE.Mesh(new THREE.IcosahedronGeometry(1,2),hillMats[i]);hill.position.set(x,-.1+sy*.38,z);hill.scale.set(sx,sy,sz);hill.receiveShadow=true;scene.add(hill);}
  // Only a few distant trees break up the open Bellavista countryside.
  for(const [x,z,s] of [[-38,-32,1.12],[35,-39,1.04],[-46,38,1.18],[42,45,.96]]){const tree=addTree(x,z,s);tree.position.y=-.4;}
  // Entry court: clear the former playground and safe-zone platform to make room for
  // the real covered walkway, ramp and narrow planting bed from the reference photo.
  const entryPaving=mat('#77766d',.96);
  floor(2.7,13.35,4.9,9.4,entryPaving,.15);
  // The passage side wall runs for the full depth of the existing entrance canopy.
  addWall(1.8,18.1,1.8,12.6,.22,.2,cap);
  addWall(.7,18.9,.7,15.72,3.55,.18,wall);
  addWall(4.7,18.9,4.7,15.72,3.55,.18,wall);
  // Expand the confirmed dining area toward the back wall and both patio sides,
  // while preserving clear gaps between seating groups for circulation.
  for(const cx of [-8,-5.2,-2.5])for(const cz of [8.9,11.5,14]){
    // Leave the row beside the PATIO sign completely open.
    if(cz===8.9)continue;
    box(scene,cx,.78,cz,.9,.12,.64,timber);
    for(const dx of [-.34,.34])for(const dz of [-.22,.22])box(scene,cx+dx,.4,cz+dz,.06,.68,.06,darkWood);
    for(const side of [-1,1]){
      const chairZ=cz+side*.55;
      box(scene,cx,.5,chairZ,.38,.1,.38,timber);
      for(const dx of [-.12,.12])for(const dz of [-.12,.12])box(scene,cx+dx,.27,chairZ+dz,.045,.46,.045,darkWood);
      box(scene,cx,.8,chairZ+side*.18,.38,.58,.07,timber);
    }
  }
  // Reverse-L dining-room partition on the upper/right side of the tables.
  // Keep 7 cm of clearance from the chairs on both legs; do not extend to the exterior wall.
  addWall(-8.6,10.575,storageDoorStartX,10.575,3.53,.18,wall);
  addWall(storageDoorEndX,10.575,-2.15,10.575,3.53,.18,wall);
  addWall(-2.15,10.575,-2.15,15,3.53,.18,wall);
  // Put the storage door at the right end of the horizontal wall, beside the girls' corridor.
  const storageDoorFrame=new THREE.Group();storageDoorFrame.position.set(storageDoorCenterX,0,storageDoorCenterZ);scene.add(storageDoorFrame);
  box(storageDoorFrame,-.52,1.12,0,.12,2.24,.22,blue);box(storageDoorFrame,.52,1.12,0,.12,2.24,.22,blue);box(storageDoorFrame,0,2.24,0,1.16,.16,.24,blue);
  const storageDoorHinge=new THREE.Group();storageDoorHinge.position.set(storageDoorStartX,.06,storageDoorCenterZ);storageDoorHinge.rotation.y=-Math.PI/2;scene.add(storageDoorHinge);
  const storageDoorLeaf=storageDoorHinge;
  box(storageDoorLeaf,.46,1.08,0,.92,2.08,.12,blue);
  box(storageDoorLeaf,.82,1.08,.08,.06,.08,.04,mat('#c6a56a',.35,{metalness:.65}));
  storageDoorLeaf.traverse(object=>{if(object.isMesh)object.userData.walkSolid=false;});
  const storageSignCanvas=document.createElement('canvas');storageSignCanvas.width=900;storageSignCanvas.height=180;
  const storageSignCtx=storageSignCanvas.getContext('2d');storageSignCtx.clearRect(0,0,900,180);storageSignCtx.textAlign='center';storageSignCtx.textBaseline='middle';storageSignCtx.font='800 104px Arial';storageSignCtx.fillStyle='#d86143';storageSignCtx.shadowColor='rgba(70,45,30,.32)';storageSignCtx.shadowOffsetY=5;storageSignCtx.shadowBlur=3;storageSignCtx.fillText('ALMACEN',450,90);
  const storageSignTexture=new THREE.CanvasTexture(storageSignCanvas);storageSignTexture.colorSpace=THREE.SRGBColorSpace;
  const storageSign=new THREE.Mesh(new THREE.PlaneGeometry(1.75,.35),new THREE.MeshBasicMaterial({map:storageSignTexture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));storageSign.position.set(storageDoorCenterX,2.55,storageDoorCenterZ+.13);scene.add(storageSign);
  // Keep the exit-side wall continuous; its doorway is separate from the storage.
  addWall(-10.2,15.72,.7,15.72,3.55,.18,wall);
  addWall(4.7,15.72,9.4,15.72,3.55,.18,wall);
  const directionCanvas=document.createElement('canvas');directionCanvas.width=900;directionCanvas.height=180;
  const directionCtx=directionCanvas.getContext('2d');directionCtx.clearRect(0,0,900,180);directionCtx.textAlign='center';directionCtx.textBaseline='middle';directionCtx.font='800 112px Arial';directionCtx.fillStyle='#d86143';directionCtx.shadowColor='rgba(70,45,30,.32)';directionCtx.shadowOffsetY=5;directionCtx.shadowBlur=3;directionCtx.fillText('DIRECCIÓN',450,90);
  const directionTexture=new THREE.CanvasTexture(directionCanvas);directionTexture.colorSpace=THREE.SRGBColorSpace;
  const directionSign=new THREE.Mesh(new THREE.PlaneGeometry(2.45,.49),new THREE.MeshBasicMaterial({map:directionTexture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
  // The marked classroom entrance becomes the office entrance; face its sign toward the patio.
  directionSign.position.set(6.4,3.16,7.72);scene.add(directionSign);
  // Place the enlarged safe planting bed at the far end of the patio, away from Direction.
  const safeBedSoil=box(scene,7.13,.38,12.6,3.56,.52,4.8,soil,false,true);safeBedSoil.userData.walkSurface=true;
  for(const x of [5.35,8.91]){const rim=box(scene,x,.48,12.6,.18,.72,4.8,cap);rim.userData.bedRim=true;}
  for(const z of [10.2,15]){const rim=box(scene,7.13,.48,z,3.56,.72,.18,cap);rim.userData.bedRim=true;}
  // Replace the seedlings with small, separate spots of grass and exposed earth.
  const safeGroundCanvas=document.createElement('canvas');safeGroundCanvas.width=512;safeGroundCanvas.height=512;
  const safeGroundCtx=safeGroundCanvas.getContext('2d');safeGroundCtx.fillStyle='#857053';safeGroundCtx.fillRect(0,0,512,512);
  const grassSpots=['#526b3e','#617748','#718552','#465f39'];
  const soilSpots=['#624a32','#9a7951','#70563b','#a58a64'];
  const rows=9,cols=9,cellW=512/cols,cellH=512/rows;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const x=(col+.5)*cellW+(Math.random()-.5)*9,y=(row+.5)*cellH+(Math.random()-.5)*9;
    const rx=11+Math.random()*5,ry=10+Math.random()*5;
    const spots=(row+col)%2===0?grassSpots:soilSpots;
    safeGroundCtx.globalAlpha=.9;safeGroundCtx.fillStyle=spots[(row*3+col)%spots.length];
    safeGroundCtx.beginPath();safeGroundCtx.ellipse(x,y,rx,ry,Math.random()*.5,0,Math.PI*2);safeGroundCtx.fill();
  }
  for(let i=0;i<1200;i++){
    safeGroundCtx.globalAlpha=.1+Math.random()*.16;safeGroundCtx.fillStyle=i%2?'#4b633c':'#9a7951';
    const size=.5+Math.random()*1.4;safeGroundCtx.fillRect(Math.random()*512,Math.random()*512,size,size);
  }
  safeGroundCtx.globalAlpha=1;
  const safeGroundTexture=new THREE.CanvasTexture(safeGroundCanvas);safeGroundTexture.colorSpace=THREE.SRGBColorSpace;
  const safeGround=new THREE.Mesh(new THREE.PlaneGeometry(3.42,4.66),new THREE.MeshStandardMaterial({map:safeGroundTexture,roughness:.98}));
  safeGround.rotation.x=-Math.PI/2;safeGround.position.set(7.13,.647,12.6);safeGround.receiveShadow=true;safeGround.userData.walkSolid=false;scene.add(safeGround);
  addWall(3.6,15.9,3.6,12.6,.22,.2,cap);
  // Continue the accessible ramp under the roof, leaving the passage free of rail bars.
  const lowerLanding=box(scene,2.7,.15,12.95,3.35,.16,.8,concrete);lowerLanding.userData.walkSolid=false;lowerLanding.userData.walkSurface=true;
  const innerLanding=box(scene,2.7,.39,8.18,3.35,.16,.72,concrete);innerLanding.userData.walkSolid=false;innerLanding.userData.walkSurface=true;
  const patioRamp=box(scene,2.7,.32,10.55,1.52,.16,4.18,concrete);patioRamp.rotation.x=.067;patioRamp.userData.walkSolid=false;patioRamp.userData.walkSurface=true;
  // Central block: two classroom wings separated by a walk-through corridor.
  floor(-3.9,4.8,11.4,5.6,floorClass,.19);floor(6.35,4.8,5.5,5.6,floorClass,.19);
  // Classroom wings and the walk-through corridor.
  // The office is entered from the neighboring classroom; keep the first aula's grille in place.
  addWall(-9.6,2,-7.55,2);door(-7.5,2,0,-Math.PI/2);box(scene,-7.05,2.875,2,1.01,1.31,.18,wall);addWall(-6.38,2,-2.18,2);door(-2.13,2,0,-Math.PI/2);box(scene,-1.675,2.875,2,1.01,1.31,.18,wall);addWall(-1.17,2,1.8,2);addWall(1.8,2,1.8,7.6);
  addWall(-9.6,7.6,-6.5,7.6);addWall(-6.5,7.6,-2.5,7.6);addWall(-2.5,7.6,1.8,7.6);addWall(-9.6,2,-9.6,7.6);
  const officeBlue=mat('#075a9e',.74),officeBlueLight=mat('#176bac',.66),officeBlueDark=mat('#06477e',.72);
  addWall(3.6,7.6,5.37,7.6);box(scene,6.4,2.875,7.6,2.06,1.31,.18,wall);addWall(7.43,7.6,9.1,7.6);
  for(const [hingeX,cx,swing,handleX] of [[5.47,5.92,Math.PI/2,.32],[7.33,6.88,-Math.PI/2,-.32]]){
    const leaf=new THREE.Group();leaf.position.set(hingeX,.06,7.485);leaf.rotation.y=swing;scene.add(leaf);
    const panelX=cx-hingeX;box(leaf,panelX,1.16,0,.9,2.32,.12,officeBlue);
    for(const y of [.73,1.62])box(leaf,panelX,y,-.07,.62,.55,.035,officeBlueDark);
    for(const y of [.73,1.62])box(leaf,panelX,y,-.09,.52,.45,.025,officeBlueLight);
    box(leaf,panelX+handleX,1.08,-.1,.045,.22,.045,mat('#c6a56a',.35,{metalness:.65}));
    leaf.traverse(object=>{if(object.isMesh)object.userData.walkSolid=false;});
  }
  box(scene,5.37,1.22,7.6,.12,2.44,.2,officeBlue);box(scene,7.43,1.22,7.6,.12,2.44,.2,officeBlue);box(scene,6.4,2.48,7.6,2.06,.16,.2,officeBlue);
  // Remove the unlabeled secondary door on this side of Direction; keep the signed double door.
  addWall(3.6,2,9.1,2);addWall(9.1,2,9.1,7.6);
  // Full-height divider separates the former gridded aula into two classrooms.
  floor(2.7,4.8,1.8,5.6,tile,.19);
  addWall(-3.5,2,-3.5,7.6,3.53,.14,stucco);
  addWall(4.7,2,4.7,7.6,3.53,.14,stucco);
  addKitchenFurniture();addClassroomFurniture(-.85,5.45,2,2);addClassroomFurniture(6.1,4.7,2,3);
  // Central sheltered play terrace; the former kitchen enclosure has been removed.
  floor(-2.25,-3.8,6.3,10.0,concrete,.19);
  const canopySteel=mat('#252c2c',.44,{metalness:.55}), canopyMetal=mat('#717771',.55,{metalness:.38});
  const canopyXs=[-8.7,-5.0,-1.3,2.4],canopyZs=[-8.45,1.05];
  for(const x of canopyXs)for(const z of canopyZs)box(scene,x,2.3,z,.18,4.2,.18,canopySteel);
  for(const z of canopyZs)box(scene,-3.15,4.34,z,11.5,.18,.18,canopySteel);
  for(const x of canopyXs)box(scene,x,4.34,-3.7,.16,.16,9.6,canopySteel);
  // Wide corrugated shelter with exposed dark trusses, like the covered school patio.
  box(scene,-3.15,4.5,-3.7,12.2,.12,10.25,canopyMetal);
  const canopyRib=mat('#a2a49e',.5,{metalness:.35});for(let x=-9.15;x<=2.85;x+=.25)box(scene,x,4.57,-3.7,.045,.075,10.2,canopyRib);
  for(const z of [-8.45,-3.75,.95]){
    box(scene,-3.15,4.23,z,11.5,.12,.14,canopySteel);
    for(const x of [-7.35,-3.35,.65])box(scene,x,4.23,z,.12,.62,.12,canopySteel);
    for(const [x,lean] of [[-8.35,1],[-6.35,-1],[-4.35,1],[-2.35,-1],[-.35,1],[1.65,-1]]){const brace=box(scene,x,4.32,z,.1,.62,.1,canopySteel);brace.rotation.z=lean*.45;}
  }
  // A raised soil bed with low seedlings sits beside the covered concrete patio.
  floor(3.95,-5.05,5.1,8.8,soil,.18);
  for(const x of [1.35,6.55])box(scene,x,.28,-5.05,.18,.35,8.95,cap);
  for(const z of [-9.45,-.65])box(scene,3.95,.28,z,5.2,.35,.18,cap);
  for(let row=0;row<4;row++)for(let col=0;col<6;col++){
    const x=1.85+col*.78,z=-8.75+row*2.1;
    cylinder(scene,x,.42,z,.025,.035,.42,mat('#547342'),7);
    for(let leaf=0;leaf<3;leaf++){const a=leaf*Math.PI*2/3,seedling=new THREE.Mesh(new THREE.SphereGeometry(.12,7,5),mat(leaf%2?'#719250':'#86a15c',.94));seedling.scale.set(1.3,.42,.55);seedling.position.set(x+Math.cos(a)*.11,.55+leaf*.012,z+Math.sin(a)*.11);seedling.userData.walkSolid=true;scene.add(seedling);}
  }
  floor(7.7,-5.65,2.4,8.3,tile,.2);addWall(6.5,-9.8,8.9,-9.8,3.53);addWall(8.9,-9.8,8.9,-1.5,3.53);addWall(6.5,-9.8,6.5,-1.5,3.53);
  for(let z=-8.2;z<=-1.5;z+=1.65){addWall(6.5,z,8.9,z,2.1,.14,stucco);door(6.5,z-.3,Math.PI/2,-Math.PI/2);box(scene,8.35,.39,z-.85,.5,.48,.64,mat('#f3f0e8',.3));box(scene,8.35,.17,z-.85,.62,.12,.72,cap);}
  // Rear classroom wing with chamfered corridor and a small garden terrace.
  floor(-4.65,-15.3,5.9,7.4,floorClass,.19);floor(4.65,-15.3,5.9,7.4,floorClass,.19);
  // Place the new Aula 01 door on the long visible corridor-facing wall (x=-1.8).
  addWall(-1.8,-19,-1.8,-16.7);addWall(-1.8,-15.7,-1.8,-14.2);door(-1.8,-15.7,Math.PI/2,Math.PI/3);addWall(-1.8,-16.7,-1.8,-15.7,1.31,.18,wall,2.22);
  addWall(-1.8,-14.2,-4.4,-11.6);addWall(-4.4,-11.6,-7.6,-11.6);door(-7.6,-11.6,0,Math.PI/2);addWall(-7.6,-11.6,-7.6,-19);addWall(-7.6,-19,-1.8,-19);
  // Mirror the corridor-facing door at the same longitudinal position in Aula 02.
  addWall(1.8,-19,1.8,-16.7);addWall(1.8,-15.7,1.8,-14.2);door(1.8,-16.7,-Math.PI/2,Math.PI/3);addWall(1.8,-16.7,1.8,-15.7,1.31,.18,wall,2.22);
  addWall(1.8,-14.2,4.4,-11.6);addWall(4.4,-11.6,7.6,-11.6);door(7.6,-11.6,Math.PI,-Math.PI/2);addWall(7.6,-11.6,7.6,-19);addWall(7.6,-19,1.8,-19);
  floor(-2.5,-9.8,7.2,3.2,lawn,.18);addTree(-4.4,-9.8,.82);
  addClassroomFurniture(-4.65,-15.2,3,3);addClassroomFurniture(4.65,-15.2,3,3);
  classroomBoard(-4.65,-18.84);classroomBoard(4.65,-18.84);
  // Emergency route markings continue from the entry ramp into the school.
  for(const z of [15.6,12.8])floorArrow(2.7,z,Math.PI/2);
  floorArrow(2.7,8.18,Math.PI/2,.48);floorArrow(2.7,-9.9,Math.PI/2);
  // Low flowering shrubs and clipped greenery frame edges, while leaving the gate and routes open.
  for(let x=-8.7;x<=8.7;x+=1.4)addShrub(x,-18.1,.56,x%2<1);
  for(let z=-16;z<=16;z+=2.1){const inDiningPatio=z>=8.8&&z<=16;if(!inDiningPatio)addShrub(-8.95,z,.55);if(!inDiningPatio&&(z<9.8||z>15.6))addShrub(8.1,z,.48);}

  function addClassroomFurniture(cx,cz,cols,rows){
    const chairColors=['#c84232','#dfc54e','#3e82a1','#60a36c'];
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const x=cx-(cols-1)*1.65/2+c*1.65,z=cz-(rows-1)*1.5/2+r*1.5;
      const chair=mat(chairColors[(r+c)%chairColors.length],.68);
      box(scene,x,.76,z,.9,.1,.66,mat('#d9caa6',.82));for(const dx of [-.36,.36])for(const dz of [-.24,.24])box(scene,x+dx,.43,z+dz,.06,.62,.06,timber);
      for(const dx of [-.7,.7]){box(scene,x+dx,.51,z,.38,.1,.35,chair);box(scene,x+dx,.69,z-.16,.38,.36,.08,chair);for(const dz of [-.12,.12])box(scene,x+dx,.33,z+dz,.05,.36,.05,timber);}
    }
  }
  function addKitchenFurniture(){
    const cabinet=mat('#9c7851',.82),counter=mat('#9aa09b',.54,{metalness:.16}),steel=mat('#515a59',.42,{metalness:.58}),fridgeMat=mat('#d8ddd8',.56);
    // L-shaped kitchen in the opposite perimeter-side aula (x=-9.6..-3.5), clear of its entry.
    box(scene,-8.95,.52,4.9,.72,.76,4.7,cabinet);box(scene,-8.95,.94,4.9,.78,.08,4.75,counter);
    box(scene,-6.65,.52,7.08,4.6,.76,.72,cabinet);box(scene,-6.65,.94,7.08,4.65,.08,.78,counter);
    // Sink and faucet on the outer-wall counter.
    box(scene,-8.95,.99,4.25,.5,.035,.64,steel);box(scene,-8.63,1.17,4.25,.045,.34,.045,steel);box(scene,-8.76,1.32,4.25,.3,.045,.045,steel);
    // Four-burner cooking surface on the rear counter.
    box(scene,-6.35,1.005,7.05,.92,.05,.62,steel);
    for(const x of [-6.59,-6.11])for(const z of [6.9,7.2])cylinder(scene,x,1.045,z,.1,.1,.035,mat('#252827',.48,{metalness:.48}),12);
    // Wall cupboards and refrigerator complete the cooking area.
    box(scene,-6.75,2.28,7.35,3.25,.66,.34,cabinet);
    box(scene,-4.55,1.02,5.2,.8,1.9,.86,fridgeMat);box(scene,-4.26,1.1,4.75,.045,.42,.045,steel);
  }
  function classroomBoard(x,z){
    const frame=mat('#24744e',.65),chalk=mat('#f6f4eb',.7),accent=[mat('#e6bc45'),mat('#ce5946'),mat('#5594ae'),mat('#78a95b')];
    box(scene,x,1.68,z,2.55,1.18,.13,frame,false,false);box(scene,x,1.68,z-.08,2.36,.94,.035,chalk,false,false);
    // Child-made drawings and a low book shelf add the lived-in classroom details from the photos.
    for(let i=0;i<4;i++)box(scene,x-.82+i*.55,1.72,z-.11,.32,.38,.025,accent[i],false,false);
    box(scene,x, .58,z+.34,2.2,1.0,.52,mat('#a98255'),false,false);box(scene,x,.83,z+.34,2.25,.09,.56,cap,false,false);
    for(let i=0;i<5;i++){const book=box(scene,x-.82+i*.4,1.04,z+.1,.28,.38,.28,accent[i%4],false,false);book.rotation.z=(i%2?-.06:.04);}
  }
  function addShrub(x,z,s=1,flower=false){const g=new THREE.Group();g.position.set(x,.2,z);g.scale.setScalar(s);scene.add(g);for(let i=0;i<7;i++){const a=i*2.4,r=.1+Math.random()*.2,m=new THREE.Mesh(new THREE.SphereGeometry(.22+Math.random()*.1,8,7),mat(['#526f43','#66864d','#789354','#425f3e'][i%4],.92));m.position.set(Math.cos(a)*r,.16+Math.random()*.19,Math.sin(a)*r);m.scale.y=.72;m.castShadow=true;m.userData.walkSolid=true;g.add(m);}if(flower)for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.05,7,6),mat(i%2?'#e6d5ae':'#d8aaa2'));f.position.set((i-1)*.14,.4,.08);f.userData.walkSolid=true;g.add(f);}return g;}
  function addTree(x,z,s=1){const g=new THREE.Group();g.position.set(x,.18,z);g.scale.setScalar(s);scene.add(g);cylinder(g,0,1.45,0,.16,.23,2.9,mat('#62503d'),10);for(let i=0;i<20;i++){const a=Math.random()*Math.PI*2,u=Math.random()*2-1,r=Math.sqrt(1-u*u),leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.48+Math.random()*.35,1),mat(['#526f43','#66864d','#789354','#425f3e','#899b59'][i%5],.9));leaf.position.set(Math.cos(a)*r*.9,2.5+u*.8,Math.sin(a)*r*.75);leaf.scale.y=.82;leaf.castShadow=true;leaf.userData.walkSolid=true;g.add(leaf);}return g;}
  function floorArrow(x,z,yaw,y=.23){const shape=new THREE.Shape();shape.moveTo(.38,0);shape.lineTo(-.12,.31);shape.lineTo(-.12,.16);shape.lineTo(-.42,.16);shape.lineTo(-.42,-.16);shape.lineTo(-.12,-.16);shape.lineTo(-.12,-.31);shape.closePath();const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat('#f3f0e5'));m.rotation.x=-Math.PI/2;m.rotation.z=yaw;m.position.set(x,y,z);scene.add(m);}
  const collisionObjects=[];scene.updateMatrixWorld(true);
  scene.traverse(object=>{if(!object.isMesh||!object.userData.walkSolid||object.userData.walkSurface)return;const bounds=new THREE.Box3().setFromObject(object);if(bounds.isEmpty()||bounds.max.y<=.28||bounds.min.y>=2.0||bounds.max.y-bounds.min.y<=.24)return;collisionObjects.push({minX:bounds.min.x,maxX:bounds.max.x,minY:bounds.min.y,maxY:bounds.max.y,minZ:bounds.min.z,maxZ:bounds.max.z,bedRim:!!object.userData.bedRim});});
  return {collisionWalls,collisionObjects};
}

