import * as THREE from 'three';

export function buildSchool({scene, mat, box, cylinder, grass, stone, wood, trim}) {
  const collisionWalls=[];
  const stucco=mat('#d8cfbd',.92), wall=mat('#d4c7ae',.9), cap=mat('#e2d7bf',.82), darkWood=mat('#795f48',.82), timber=mat('#a98255',.78), glass=new THREE.MeshPhysicalMaterial({color:'#a8c7c7',roughness:.16,transparent:true,opacity:.34,transmission:.12,clearcoat:.8}), metal=mat('#51594f',.48,{metalness:.48});
  const floorClass=mat('#bcb5a6'), tile=mat('#c7c3b8'), rubber=mat('#756a5c'), lawn=grass;
  const addWall=(x1,z1,x2,z2,h=2.8,t=.18,m=wall,y0=0)=>{const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),w=box(scene,(x1+x2)/2,y0+h/2,(z1+z2)/2,len,h,t,m);w.rotation.y=-Math.atan2(dz,dx);collisionWalls.push({x1,z1,x2,z2,thickness:t});return w;};
  const floor=(x,z,w,d,m=tile,y=.08)=>box(scene,x,y,z,w,.16,d,m,false,true);
  const windowWall=(x1,z1,x2,z2)=>{addWall(x1,z1,x2,z2,.98,.18,wall,0);addWall(x1,z1,x2,z2,.42,.18,wall,2.36);addWall(x1,z1,x2,z2,1.28,.07,glass, .98);};
  const door=(x,z,angle=0,material=darkWood)=>{const g=new THREE.Group();g.position.set(x,.06,z);g.rotation.y=angle;scene.add(g);box(g,.48,1.08,0,.92,2.08,.12,material);box(g,.84,1.08,.085,.07,.07,.035,mat('#c6a56a',.35,{metalness:.65}));return g;};

  // School parcel follows the reference plan dimensions, with the garden's stone plinth and warm perimeter.
  box(scene,0,-.34,0,21,.8,40,mat('#827f73'),false,true);
  const plot=new THREE.Shape();plot.moveTo(-8.8,-19);plot.lineTo(8.8,-19);plot.lineTo(9.4,17.5);plot.lineTo(-10.2,19.2);plot.closePath();
  const site=new THREE.Mesh(new THREE.ShapeGeometry(plot),mat('#c2b8a5',.94));site.rotation.x=-Math.PI/2;site.position.y=.08;site.receiveShadow=true;scene.add(site);
  // Quiet paved circulation surface and joints.
  floor(0,0,19.1,37.9,stone,.12);
  for(let z=-18.2;z<18.4;z+=1.15)for(let x=-9.2;x<9;x+=1.3){
    const seam=box(scene,x,.205,z,1.24,.025,.025,mat('#aaa18e'),false,true);seam.rotation.y=(Math.floor((z+18.2)/1.15)%2)*.04;
  }
  const campusWall=mat('#c8bda7',.94);
  addWall(-8.8,-19,8.8,-19,2.9,.26,campusWall);addWall(-8.8,-19,-10.2,19.2,2.65,.26,campusWall);addWall(8.8,-19,9.4,17.5,2.65,.26,campusWall);
  addWall(-10.2,19.2,1.3,18.2,2.55,.26,campusWall);addWall(4.1,18,9.4,17.5,2.55,.26,campusWall);
  // A single welcoming, double-leaf gate at the front opening.
  for(const x of [1.35,4.05]){box(scene,x,1.28,18.06,.16,2.48,.2,darkWood);box(scene,x,2.58,18.06,.34,.14,.34,cap);}
  for(const x of [2.0,3.4]){box(scene,x,1.1,18.02,.075,2.05,.1,metal);}
  for(const z of [17.1,18.98])box(scene,2.7,1.05,z,2.7,.09,.12,metal);
  for(let i=0;i<15;i++)box(scene,1.48+i*.17,1.09,18.02,.035,1.86,.07,metal);
  // Gate plaque, ramp, sidewalk and a subdued street context.
  box(scene,2.7,2.85,18.02,3.15,.52,.16,darkWood);box(scene,2.7,2.85,17.92,2.96,.37,.025,mat('#4d5a47'));
  const ramp=box(scene,2.7,.12,19.65,3.1,.18,3.2,cap);ramp.rotation.x=-.035;
  box(scene,0,-.4,22.5,180,.38,9,mat('#565953'),false,true);box(scene,0,-.15,18.8,180,.14,1.2,cap,false,true);
  for(let x=-86;x<90;x+=9)box(scene,x,-.19,22.5,4,.02,.11,mat('#ded8c8'),false,false);

  // Forecourt: rubber play area on the left and green garden beds on the right.
  floor(-4.1,15.6,11,5.2,rubber,.18);floor(6.35,15.1,5.2,4.9,lawn,.18);
  // Low dividers guide circulation without blocking sightlines.
  addWall(1.8,18.1,1.8,12.6,1.18,.17,cap);addWall(3.6,18,3.6,12.6,1.18,.17,cap);
  // Playground fence, climbing frames, slide and double swing set.
  for(const x of [-8.9,1.05])box(scene,x,.74,15.6,.12,1.35,.12,darkWood);
  for(const z of [13.25,17.95])box(scene,-3.92,.45,z,10,.12,.12,darkWood);
  for(let i=1;i<20;i++)box(scene,-8.92+i*.5,.75,17.95,.045,1.05,.06,metal);
  for(const x of [-6.2,-2.7,.4]){box(scene,x,1.45,13.9,.14,2.6,.14,darkWood);box(scene,x+.85,1.45,13.9,.14,2.6,.14,darkWood);box(scene,x+.42,2.76,13.9,1.0,.14,.16,timber);}
  // Play tower, access stair, and a slide with a real supporting frame.
  box(scene,-5.15,.82,15.35,1.5,1.35,1.25,timber);box(scene,-5.15,1.55,15.35,1.95,.13,1.65,darkWood);
  for(let i=0;i<5;i++){const s=box(scene,-5.15,.3+i*.2,14.15+i*.27,1.02,.12,.27,timber);}
  const slide=box(scene,-5.15,.79,12.75,.9,.12,2.5,mat('#658c8b',.38,{metalness:.08}));slide.rotation.x=.43;
  for(const x of [-5.58,-4.72])box(scene,x,.46,12.8,.1,.75,.1,darkWood);
  for(const x of [-.8,.8]){box(scene,x,1.58,15.3,.12,2.85,.12,darkWood);}
  box(scene,0,3.0,15.3,2.0,.15,.16,darkWood);
  for(const x of [-.42,.42]){for(const z of [14.9,15.7]){const chain=cylinder(scene,x,.98,z,.018,.018,1.95,metal,8);}box(scene,x,.48,15.3,.48,.13,.34,mat('#a98255'));}
  // Landscaped green pocket, shade trees, benches, stepping stones and border shrubs.
  for(const [x,z,s] of [[7.6,15.6,.95],[5.1,14.3,.75]])addTree(x,z,s);
  for(const x of [4.45,8.15]){box(scene,x,.32,13.05,1.05,.08,.54,cap);}
  // Central block: two classroom wings separated by a walk-through corridor.
  floor(-3.9,4.8,11.4,5.6,floorClass,.19);floor(6.35,4.8,5.5,5.6,floorClass,.19);
  addWall(-9.6,2,-3.5,2);windowWall(-3.5,2,.2,2);addWall(.2,2,1.8,2);addWall(1.8,2,1.8,6.4);door(1.8,6.4,Math.PI/2);
  addWall(-9.6,7.6,1.8,7.6);addWall(-9.6,2,-9.6,7.6);windowWall(-6.5,7.6,-2.5,7.6);
  addWall(3.6,2,4.7,2);door(3.6,2,0);windowWall(4.7,2,7.8,2);addWall(7.8,2,9.1,2);addWall(9.1,2,9.1,7.6);addWall(3.6,7.6,9.1,7.6);windowWall(5,7.6,7.8,7.6);
  // Interior dividers and door leaves preserve the main central passage.
  addWall(-3.5,2,-3.5,7.6,2.8,.14,stucco);addWall(4.7,2,4.7,7.6,2.8,.14,stucco);
  addClassroomFurniture(-6.5,4.7,3,3);addClassroomFurniture(6.1,4.7,2,3);
  // Middle-left service kitchen and central sheltered play terrace.
  floor(-7.45,-1.8,3.7,5.3,tile,.19);addWall(-9.3,-4.5,-5.6,-4.5);addWall(-9.3,-4.5,-9.3,.8);addWall(-5.6,-4.5,-5.6,-.4);door(-5.6,-.4,Math.PI/2);addWall(-9.3,.8,-5.6,.8);
  box(scene,-8.55,.74,-1.85,1.15,.85,4.25,mat('#aaa99d'));box(scene,-8.55,1.2,-1.85,1.22,.08,4.32,cap);
  floor(-1.3,-2.3,6.4,5.6,stone,.19);
  for(const [x,z] of [[-4.2,-4.8],[-1.3,-4.8],[1.6,-4.8],[-4.2,.2],[-1.3,.2],[1.6,.2]])box(scene,x,1.65,z,.28,3.05,.28,darkWood);
  for(const z of [-4.8,-3.65,-2.5,-1.35,-.2])box(scene,-1.3,3.2,z,6.55,.16,.22,timber);
  // A large mid-garden and two toilet blocks along the right side.
  floor(3.95,-5.05,5.1,8.8,lawn,.18);for(const [x,z,s] of [[3.45,-6.6,1.0],[4.3,-2.7,.82]])addTree(x,z,s);
  for(const z of [-8.8,-6.5,-4.2,-1.9]){box(scene,5.95,.28,z,.7,.08,.48,cap);}
  floor(7.7,-5.65,2.4,8.3,tile,.2);addWall(6.5,-9.8,8.9,-9.8,2.5);addWall(8.9,-9.8,8.9,-1.5,2.5);addWall(6.5,-9.8,6.5,-1.5,2.5);
  for(let z=-8.2;z<=-1.5;z+=1.65){addWall(6.5,z,8.9,z,2.1,.14,stucco);door(6.5,z-.3,Math.PI/2);box(scene,8.35,.39,z-.85,.5,.48,.64,mat('#f3f0e8',.3));box(scene,8.35,.17,z-.85,.62,.12,.72,cap);}
  // Rear classroom wing with chamfered corridor and a small garden terrace.
  floor(-4.65,-15.3,5.9,7.4,floorClass,.19);floor(4.65,-15.3,5.9,7.4,floorClass,.19);
  addWall(-1.8,-19,-1.8,-14.2);addWall(-1.8,-14.2,-4.4,-11.6);addWall(-4.4,-11.6,-7.6,-11.6);door(-7.6,-11.6,0);addWall(-7.6,-11.6,-7.6,-19);addWall(-7.6,-19,-1.8,-19);
  addWall(1.8,-19,1.8,-14.2);addWall(1.8,-14.2,4.4,-11.6);addWall(4.4,-11.6,7.6,-11.6);door(7.6,-11.6,Math.PI);addWall(7.6,-11.6,7.6,-19);addWall(7.6,-19,1.8,-19);
  floor(-2.5,-9.8,7.2,3.2,lawn,.18);addTree(-4.4,-9.8,.82);
  for(let s=0;s<5;s++)box(scene,-.2,.2+s*.11,-8.6-s*.35,2.6,.16,.35,timber);
  addClassroomFurniture(-4.65,-15.2,3,3);addClassroomFurniture(4.65,-15.2,3,3);
  // Emergency route markers and one assembly area, placed clear of doors and play equipment.
  for(const z of [15.6,12.8,10.1])floorArrow(2.7,z,Math.PI/2);
  for(const x of [-2,-5.1,-8.1])floorArrow(x,10.8,Math.PI);
  floorArrow(2.7,8.9,Math.PI/2);floorArrow(2.7,-9.9,Math.PI/2);
  const assembly=new THREE.Mesh(new THREE.TorusGeometry(.8,.06,10,56),mat('#e1cf85',.5,{emissive:'#4f4827',emissiveIntensity:.12}));assembly.rotation.x=Math.PI/2;assembly.position.set(6.2,.27,12);scene.add(assembly);
  // Low flowering shrubs and clipped greenery frame edges, while leaving the gate and routes open.
  for(let x=-8.7;x<=8.7;x+=1.4){addShrub(x,-18.1,.56,x%2<1);if(x<-4.4||x>4.4)addShrub(x,17.3,.48,x%2>0);}
  for(let z=-16;z<=16;z+=2.1){addShrub(-8.95,z,.55);addShrub(8.1,z,.48);}

  function addClassroomFurniture(cx,cz,cols,rows){
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const x=cx-(cols-1)*1.65/2+c*1.65,z=cz-(rows-1)*1.5/2+r*1.5;
      box(scene,x,.76,z,.9,.1,.66,timber);for(const dx of [-.36,.36])for(const dz of [-.24,.24])box(scene,x+dx,.43,z+dz,.06,.62,.06,darkWood);
      for(const dx of [-.7,.7]){box(scene,x+dx,.51,z,.38,.08,.35,cap);for(const dz of [-.12,.12])box(scene,x+dx,.33,z+dz,.05,.36,.05,darkWood);}
    }
  }
  function addShrub(x,z,s=1,flower=false){const g=new THREE.Group();g.position.set(x,.2,z);g.scale.setScalar(s);scene.add(g);for(let i=0;i<7;i++){const a=i*2.4,r=.1+Math.random()*.2,m=new THREE.Mesh(new THREE.SphereGeometry(.22+Math.random()*.1,8,7),mat(['#526f43','#66864d','#789354','#425f3e'][i%4],.92));m.position.set(Math.cos(a)*r,.16+Math.random()*.19,Math.sin(a)*r);m.scale.y=.72;m.castShadow=true;g.add(m);}if(flower)for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.05,7,6),mat(i%2?'#e6d5ae':'#d8aaa2'));f.position.set((i-1)*.14,.4,.08);g.add(f);}return g;}
  function addTree(x,z,s=1){const g=new THREE.Group();g.position.set(x,.18,z);g.scale.setScalar(s);scene.add(g);cylinder(g,0,1.45,0,.16,.23,2.9,mat('#62503d'),10);for(let i=0;i<20;i++){const a=Math.random()*Math.PI*2,u=Math.random()*2-1,r=Math.sqrt(1-u*u),leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.48+Math.random()*.35,1),mat(['#526f43','#66864d','#789354','#425f3e','#899b59'][i%5],.9));leaf.position.set(Math.cos(a)*r*.9,2.5+u*.8,Math.sin(a)*r*.75);leaf.scale.y=.82;leaf.castShadow=true;g.add(leaf);}return g;}
  function floorArrow(x,z,yaw){const shape=new THREE.Shape();shape.moveTo(.38,0);shape.lineTo(-.12,.31);shape.lineTo(-.12,.16);shape.lineTo(-.42,.16);shape.lineTo(-.42,-.16);shape.lineTo(-.12,-.16);shape.lineTo(-.12,-.31);shape.closePath();const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat('#f3f0e5'));m.rotation.x=-Math.PI/2;m.rotation.z=yaw;m.position.set(x,.23,z);scene.add(m);}
  return {collisionWalls};
}

