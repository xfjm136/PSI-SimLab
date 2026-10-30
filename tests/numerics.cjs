'use strict';
const assert=require('node:assert/strict'),P=require('../dist/core.js');
const near=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,`${a} ≠ ${b}`);
for(const x of [-100,-Math.PI,0,Math.PI,100]){assert.ok(P.wrap(x)>=-Math.PI&&P.wrap(x)<Math.PI);near(Math.cos(P.wrap(x)),Math.cos(x));}
near(P.model(1,0,28,0),2*Math.PI);near(P.dispersion([2,2,2]),0);near(P.coherence([0,0,0]),1);near(P.coherence([0,Math.PI/2,Math.PI,3*Math.PI/2]),0);
assert.deepEqual(P.observations({seed:2026}),P.observations({seed:2026}));
for(const [v,h] of [[-8,12],[5,-10],[0,0],[20,30]]){const obs=P.observations({velocity:v,height:h,noise:0}),best=P.searchAF(obs).best;near(best.v,v);near(best.h,h);near(best.gamma,1);}
assert.ok(P.network(8).rmse>0.5);near(P.network(8,true).rmse,0);near(P.network(0).rmse,0);near(P.network(8).closure,8);
assert.notDeepEqual(P.candidates(1),P.candidates(2));
assert.deepEqual(P.candidates(1),P.candidates(1));
assert.notDeepEqual(P.timeSeries({seed:1}).y,P.timeSeries({seed:2}).y);
assert.deepEqual(P.atmosphere(.25,81),P.atmosphere(.25,81));
const atmo=P.atmosphere(.25,81);assert.ok(atmo.after<atmo.before/2,'APS prediction should reduce known synthetic error');assert.ok(atmo.corrected.every(Number.isFinite));
for(const length of [.05,.25,.65])assert.ok(P.atmosphere(length,81).after< P.atmosphere(length,81).before);
const low=P.candidates(2026).filter(p=>p.da<=.15).length,high=P.candidates(2026).filter(p=>p.da<=.45).length;assert.ok(high>low);
const obs=P.timeSeries({season:5,modelType:'linear',seed:2026}),seasonal=P.timeSeries({season:5,modelType:'seasonal',seed:2026});assert.ok(seasonal.rms<obs.rms/2);near(P.timeSeries({season:5,noise:0,modelType:'seasonal',seed:2026}).x[1],-8);
console.log(JSON.stringify({status:'PASS',checks:'wrapping, units, dispersion, coherence, deterministic generation, AF recovery, network reference/closure, APS prediction, model misspecification',aps_rmse_before:atmo.before,aps_rmse_after:atmo.after,linear_rms:obs.rms,seasonal_rms:seasonal.rms},null,2));

// Changing the reference changes only the datum, not fitted arc differences.
for (const badEdge of [0, 8, 13]) {
 const base = P.network(8, false, {badEdge, reference: 0});
 for (let reference = 0; reference < 7; reference++) {
  const result = P.network(8, false, {badEdge, reference});
  near(result.estimate[reference], 0);
  for (const e of result.edges) near(result.estimate[e.j]-result.estimate[e.i], base.estimate[e.j]-base.estimate[e.i]);
  near(P.network(8, true, {badEdge, reference}).rmse, 0);
 }
}
// The displayed sample weights must reproduce the predictor at a grid location.
const gridIndex = 17 * atmo.size + 23, target = [23/(atmo.size-1),17/(atmo.size-1)];
const covariance = atmo.pts.map(([x,y])=>Math.exp(-Math.hypot(x-target[0],y-target[1])/.25));
const weights = P.solve(atmo.K, covariance);
near(weights.reduce((sum,w,i)=>sum+w*atmo.values[i],0),atmo.prediction[gridIndex]);
console.log('PASS: selectable biased arcs, reference invariance, kriging weight reconstruction.');

for (let badEdge = 0; badEdge < 14; badEdge++) {
 const adjusted = P.network(8, false, {badEdge});
 near(Math.abs(adjusted.closure), 8);
 near(P.network(8, true, {badEdge}).closure, 0);
 near(Math.abs(P.network(-5, false, {badEdge}).closure), 5);
}
