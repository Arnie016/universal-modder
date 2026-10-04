import assert from 'node:assert/strict';import {ExplosionInbox} from '../src/explosion-inbox.mjs';
const box=new ExplosionInbox();const event=(id,at=1000)=>({id,receivedAt:at,source:{t:'explosion',src:'tnt',r:4},hostPosition:[12.5,.5,14.5]});
assert.deepEqual(box.accept({stream:'a',latest:1,events:[event(1)]},1001),[],'initial history skipped');
assert.equal(box.accept({stream:'a',latest:2,events:[event(1),event(2)]},1002).length,1);
assert.equal(box.accept({stream:'a',latest:2,events:[event(2)]},1003).length,0,'duplicate skipped');
assert.equal(box.accept({stream:'a',latest:3,events:[event(3)]},20000).length,0,'stale effects skipped');
assert.equal(box.accept({stream:'b',latest:9,events:[event(9)]},1005).length,0,'new server history skipped');
assert.equal(box.accept({stream:'b',latest:10,events:[event(10)]},1006).length,1);
console.log('PASS: current blast once, duplicate/stale/reload/restart histories suppressed');
