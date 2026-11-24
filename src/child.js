import * as THREE from 'three';

const standard=(color,roughness=.78)=>new THREE.MeshStandardMaterial({color,roughness});
const shirt=standard('#eee9dc'), navy=standard('#344955'), skin=standard('#c99170'), pack=standard('#8e604b'), shoe=standard('#333431',.55), white=standard('#f4efe5');

function mesh(parent,geometry,material,x,y,z){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}

export function createChildCharacter(name='Tatiana',variant=0){
  const hairColors=['#29241f','#49362d','#30283a','#3b3029','#4c342a','#25272d'];
  const tieColors=['#d77b67','#d6b25f','#bb7183','#729c82','#7292b2','#c58b53'];
  const hair=standard(hairColors[variant%hairColors.length]),hairTie=standard(tieColors[variant%tieColors.length]);
  const root=new THREE.Group(), hips=new THREE.Group();hips.position.y=.62;root.add(hips);
  mesh(hips,new THREE.CylinderGeometry(.145,.225,.22,12),navy,0,-.025,0);
  const torso=new THREE.Group();torso.position.y=.1;hips.add(torso);
  mesh(torso,new THREE.CapsuleGeometry(.18,.34,5,12),shirt,0,.18,0);
  mesh(torso,new THREE.BoxGeometry(.16,.045,.18),navy,0,.38,.01);
  mesh(torso,new THREE.BoxGeometry(.23,.28,.13),pack,0,.17,-.17);
  mesh(torso,new THREE.BoxGeometry(.17,.08,.035),standard('#a98255'),0,.09,-.245);
  const headGroup=new THREE.Group();headGroup.position.y=.47;torso.add(headGroup);
  mesh(headGroup,new THREE.SphereGeometry(.16,20,16),skin,0,.12,0);
  const cap=mesh(headGroup,new THREE.SphereGeometry(.164,20,14,0,Math.PI*2,0,Math.PI*.57),hair,0,.135,-.012);cap.rotation.x=-.12;
  const backHair=mesh(headGroup,new THREE.SphereGeometry(.145,16,14),hair,0,.035,-.075);backHair.scale.set(1,.9,.72);
  for(const x of [-.125,.125])mesh(headGroup,new THREE.CapsuleGeometry(.038,.32,4,8),hair,x,-.09,-.045);
  const ponytail=mesh(headGroup,new THREE.CapsuleGeometry(.05,.32,4,8),hair,.105,-.16,-.15);ponytail.rotation.x=-.28;ponytail.rotation.z=-.18;
  mesh(headGroup,new THREE.SphereGeometry(.035,10,8),hairTie,.09,.005,-.105);
  mesh(headGroup,new THREE.SphereGeometry(.022,10,8),hairTie,.105,.22,.116);
  mesh(headGroup,new THREE.SphereGeometry(.018,10,8),skin,0,.09,.15);
  for(const x of [-.052,.052])mesh(headGroup,new THREE.SphereGeometry(.012,8,8),standard('#292622',.4),x,.13,.146);
  for(const x of [-.16,.16])mesh(headGroup,new THREE.SphereGeometry(.027,10,8),skin,x,.1,0);
  function limb(x,side,type){
    const pivot=new THREE.Group();pivot.position.set(x,type==='leg'?-.02:.33,0);(type==='leg'?hips:torso).add(pivot);
    const upper=type==='leg'?mesh(pivot,new THREE.CylinderGeometry(.072,.064,.21,10),navy,0,-.105,0):mesh(pivot,new THREE.CylinderGeometry(.047,.042,.18,10),shirt,0,-.09,0);
    const joint=new THREE.Group();joint.position.y=type==='leg'?-.2:-.18;pivot.add(joint);
    mesh(joint,new THREE.CylinderGeometry(type==='leg'?.047:.034,type==='leg'?.039:.03,type==='leg'?.2:.17,9),type==='leg'?skin:skin,0,-.09,0);
    if(type==='leg'){
      mesh(joint,new THREE.CylinderGeometry(.039,.039,.09,8),white,0,-.215,0);
      mesh(joint,new THREE.BoxGeometry(.095,.065,.18),shoe,0,-.278,.035);
    }else mesh(joint,new THREE.SphereGeometry(.04,10,8),skin,0,-.17,0);
    return {pivot,joint,side};
  }
  const leftLeg=limb(-.075,0,'leg'),rightLeg=limb(.075,1,'leg');
  const leftArm=limb(-.22,0,'arm'),rightArm=limb(.22,1,'arm');
  const bow=standard('#d77b67');
  for(const x of [-.035,.035]){const loop=mesh(torso,new THREE.SphereGeometry(.04,10,8),bow,x,.43,.153);loop.scale.set(1,.65,.45);}
  mesh(torso,new THREE.SphereGeometry(.02,10,8),hairTie,0,.43,.17);
  const nameCanvas=document.createElement('canvas');nameCanvas.width=512;nameCanvas.height=128;const nameCtx=nameCanvas.getContext('2d');
  nameCtx.textAlign='center';nameCtx.textBaseline='middle';nameCtx.font='700 76px "DM Sans",Arial,sans-serif';nameCtx.lineWidth=9;nameCtx.strokeStyle='rgba(19,30,22,.82)';nameCtx.strokeText(name,256,64);nameCtx.fillStyle='#fffdf4';nameCtx.fillText(name,256,64);
  const nameTexture=new THREE.CanvasTexture(nameCanvas);nameTexture.colorSpace=THREE.SRGBColorSpace;
  const nameTag=new THREE.Sprite(new THREE.SpriteMaterial({map:nameTexture,transparent:true,depthWrite:false}));nameTag.position.set(0,1.78,0);nameTag.scale.set(.92,.23,1);root.add(nameTag);
  return {root,hips,torso,headGroup,leftLeg,rightLeg,leftArm,rightArm,nameTag};
}
