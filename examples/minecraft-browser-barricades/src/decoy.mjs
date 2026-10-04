// Two confirmed Minecraft planks power a host-game acoustic decoy.
export class Decoy {
 constructor(){this.enabled=false;this.next=0;this.pulses=0;}
 tick({ids,connected,playing,now}){
  if(!this.enabled||!connected||!playing||ids?.[0]!=='minecraft:oak_planks'||ids?.[4]!=='minecraft:oak_planks'){this.next=0;return false;}
  if(now<this.next)return false;
  this.next=now+2500;this.pulses++;return true;
 }
}
