import * as THREE from 'three';
// Source-confirmed two-block circuit. No optimistic placement powers the lamp.
export function installWorkLight(scene) {
 const lamp = new THREE.Group();lamp.position.set(11.8,2.8,14.5);
 const housing = new THREE.Mesh(new THREE.BoxGeometry(.5,.32,.22),new THREE.MeshStandardMaterial({color:0x403c31,roughness:.85}));
 const lens = new THREE.Mesh(new THREE.PlaneGeometry(.38,.2),new THREE.MeshStandardMaterial({color:0xffdba0,emissive:0xffc478,emissiveIntensity:0}));lens.position.z=.12;
 const light = new THREE.PointLight(0xffd4a1,0,9,2);light.position.z=.4;
 lamp.add(housing,lens,light);scene.add(lamp);
 return {lamp,light,lens,exposure(position,rayWall) {
  if(light.intensity===0)return 0;
  const origin=light.getWorldPosition(new THREE.Vector3());
  const target=new THREE.Vector3(position.x,position.y+1.2,position.z);
  const delta=target.sub(origin),distance=delta.length();
  if(distance>=7||distance<.001)return 0;
  const direction=delta.divideScalar(distance);
  if(rayWall(origin,direction,distance)<distance-.05)return 0;
  return 1-distance/7;
 },update({ids,connected}) {
  const powered=connected&&ids?.[1]==='minecraft:oak_planks'&&ids?.[5]==='minecraft:oak_planks';
  light.intensity=powered?45:0;lens.material.emissiveIntensity=powered?3:0;
  return !connected?'Work light offline':powered?'Work light on · visible to infected':'Work light off · build slots 2 and 6';
 }};
}
