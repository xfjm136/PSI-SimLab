/* Linked scientific views. Every plotted value is computed by PSI's numerical core. */
'use strict';
const P=PSI, $=id=>document.getElementById(id);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const color={ink:'#202020',muted:'#6f6f6f',grid:'#e5e5e5',blue:'#404040',teal:'#777777',orange:'#b43a3a',red:'#b43a3a',gray:'#a0a0a0'};
let lang='zh';
try { lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('psi-language')||'zh'; } catch {}
if(!['zh','en'].includes(lang))lang='zh';
const T=(zh,en)=>lang==='zh'?zh:en, U=()=>NOTEBOOK_CONTENT[lang].ui;
const defaults=[{velocity:-12},{threshold:.25,point:0},{noise:.25,v:4,h:-8,epoch:1},{error:8,reject:false,badEdge:8,reference:0},{length:.25,targetX:.5,targetY:.5},{season:5,modelType:'linear'}];
const states=defaults.map(s=>({...s})), seeds=defaults.map(()=>P.randomSeed());
let stage=0,data,progress=1,playing=false,lastTime=0,speed=1,searchMode=false,raf=0,lastPaint=0;
let heatCache=null,atmoWeights=[],currentView={},chartHandlers={};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
let autoPlay=!reduced;
let seriesFrames=[],seriesScales=null,networkScales=null;
const titles=[['相位与 LOS 位移','Phase and LOS displacement'],['振幅离散度与候选点','Amplitude dispersion and candidates'],['速度—高程联合搜索','Joint velocity–height search'],['弧偏差与网络平差','Arc bias and network adjustment'],['大气预测与改正','Atmospheric prediction and correction'],['线性与年周期拟合','Linear and annual fits']];
const descriptions=[
 ['线性位移对应的连续相位、主值与整周数。时间范围 0–3 年。','Continuous phase, principal value and whole cycles for linear motion over 0–3 years.'],
 ['同一组振幅序列在不同观测期数、门限下的筛选结果。地图支持选点。','Candidate selection across acquisition counts and thresholds, using the same amplitude series. Pixels are selectable.'],
 ['同一组缠绕观测下的参数候选、残差相量与相干性。热图支持手动选取候选。','Parameter candidates, residual phasors and coherence for the same wrapped observations. Candidates can be selected on the heatmap.'],
 ['指定弧偏差下的相对速度、闭合差与平差残差。网络支持选弧，参考点可切换。','Relative velocities, closure errors and residuals under a selected arc bias, with a changeable reference.'],
 ['混合相位、空间预测和改正误差的并列比较。各图使用同一色标，采样位置保持不变。','Mixed phase, spatial prediction and correction error on a shared scale, with fixed sample locations.'],
 ['逐期加入观测，分别重新拟合线性与年周期模型，比较参数、分量和残差。','Linear and annual models refitted as acquisitions accumulate; comparison of parameters, components and residuals.']
];
const scopes=[
 ['λ = 56 mm；朝向卫星为正。几何示意中的位移已放大；不含大气与地形项。','λ = 56 mm; motion toward the satellite is positive. Schematic motion is exaggerated; no atmosphere or topography.'],
 ['180 像元 × 28 期。回波 = 固定散射体 + 圆对称复高斯噪声；振幅取模。低离散度仅用于初筛。','180 pixels × 28 acquisitions. Echo = fixed scatterer + circular complex Gaussian noise; amplitude is its modulus. Dispersion is a screening statistic.'],
 ['28 期；真值 v = −8 mm/yr，h = 12 m。网格步长 1 mm/yr、1 m。热图预计算，播放重现遍历顺序。','28 acquisitions; truth v = −8 mm/yr, h = 12 m. Grid steps: 1 mm/yr and 1 m. Playback replays a precomputed search.'],
 ['等权连续速度平差。异常弧位置可选；剔除使用已知标签，不是自动异常检测。','Equal-weight adjustment of continuous velocities. The biased arc is selectable; rejection uses its known label, not automatic detection.'],
 ['大气残差已预先分离；零均值简单克里金。播放比例是改正应用比例，不是物理时间。','Atmospheric residuals are already isolated; zero-mean simple kriging. Playback shows correction fraction, not physical time.'],
 ['36 期月度合成位移；速度真值 −8 mm/yr。从 12 期开始逐期重拟合；短序列的参数可能不稳定。LOS 不等于垂直沉降。','36 synthetic monthly displacements; true velocity −8 mm/yr. Refits start at 12 acquisitions; short-series parameters may be unstable. LOS motion is not vertical subsidence.']
];
const derivationAddenda=[
 {zh:[
  `从雷达往返传播相位开始：ψ = −4πR/λ，因此两期相位差为 Δψ = −4πΔR/λ。按本节符号约定，d = −ΔR，代入后得到形变相位 φ_def = 4πd/λ。`,
  `干涉仪只记录主值 φ = W(φ_def)。反算时需加入整周数：d = λ(φ + 2πk)/(4π)。相邻主值相同的位移相差 λ/2；λ = 56 mm 时，位移周期为 28 mm。`
 ],en:[
  `Start from the two-way radar phase, ψ = −4πR/λ. The phase difference between acquisitions is Δψ = −4πΔR/λ. With this chapter's sign convention, d = −ΔR, giving the deformation phase φ_def = 4πd/λ.`,
  `The interferogram records only the principal value φ = W(φ_def). Inverting it requires the integer cycle count: d = λ(φ + 2πk)/(4π). Equal principal values can represent displacements separated by λ/2; at λ = 56 mm, the period is 28 mm.`
 ]},
 {zh:[
  `把 N 期振幅写成样本 {Aᵢ}，离散度为 D_A = √[Σ(Aᵢ − μ_A)²/N] / μ_A。筛选可写为 Iᵢ = 1(D_A,ᵢ ≤ τ)，保留数量是 ΣIᵢ；改变 τ 会改变点数，但不会改变各像元的观测序列。`,
  `算例先生成复回波 zᵢ = 1 + nᵣ,ᵢ + jnᵢ,ᵢ，再取 Aᵢ = |zᵢ|。在固定散射分量占优的小噪声条件下，振幅相对波动可近似反映相位噪声，因此 D_A 可作快速筛选量；此近似不构成相位稳定性的充分条件。`
 ],en:[
  `For N amplitude samples {Aᵢ}, dispersion is D_A = √[Σ(Aᵢ − μ_A)²/N] / μ_A. Screening can be written Iᵢ = 1(D_A,ᵢ ≤ τ), with ΣIᵢ retained pixels. Changing τ changes the count, not the underlying series.`,
  `The example generates complex echoes zᵢ = 1 + nᵣ,ᵢ + jnᵢ,ᵢ and then takes Aᵢ = |zᵢ|. When the fixed-scatterer term dominates and noise is small, relative amplitude fluctuation can approximate phase noise, making D_A a quick screen; it is not sufficient evidence of phase stability.`
 ]},
 {zh:[
  `对试探参数 (v,h)，先计算残差 rᵢ = φᵢ − φ̂ᵢ，再映射为单位相量 uᵢ = exp(jrᵢ)。目标函数 γ(v,h) = |Σuᵢ/N|；相量越集中，γ 越接近 1，方向则给出残差的共同偏移。`,
  `在离散网格上取 (v̂,ĥ) = arg max γ(v,h)。若所有残差再加同一常数 δ，平均相量只整体旋转 exp(jδ)，其模 γ 不变。因此峰值表示残差集中，不能单独说明绝对相位无偏，也不能排除相邻网格峰或模型误设。`
 ],en:[
  `For a trial (v,h), compute residuals rᵢ = φᵢ − φ̂ᵢ and map them to unit phasors uᵢ = exp(jrᵢ). The objective is γ(v,h) = |Σuᵢ/N|. Concentrated phasors give γ near 1; their direction represents a common residual offset.`,
  `The grid estimate is (v̂,ĥ) = arg max γ(v,h). Adding a constant δ to every residual rotates the mean phasor by exp(jδ) without changing its magnitude. A peak therefore indicates concentration, not necessarily zero absolute bias; neighboring peaks and model misspecification remain possible.`
 ]},
 {zh:[
  `每条有向弧 e: i→j 对应关联矩阵一行，在 i 列为 −1、j 列为 +1，因此 b_e = v_j − v_i + ε_e，整体写为 b = Gv + ε。最小化 (b−Gv)ᵀP(b−Gv)，对 v 求导并令其为零，得到 GᵀPG v̂ = GᵀPb。`,
  `由于 G·1 = 0，所有点速度同时加上常数不会改变弧差，法方程缺少一个基准自由度。固定参考点或施加等价约束后才可解。对闭合回路求有向弧和时，点速度项逐项抵消，闭合差主要反映观测误差或异常弧。`
 ],en:[
  `Each directed arc e: i→j contributes one incidence-matrix row, −1 at i and +1 at j, so b_e = v_j − v_i + ε_e and b = Gv + ε. Minimizing (b−Gv)ᵀP(b−Gv), differentiating with respect to v, and setting the result to zero gives GᵀPG v̂ = GᵀPb.`,
  `Because G·1 = 0, adding a constant to every point velocity leaves all arc differences unchanged; the normal equations lack one datum. Fixing a reference point or applying an equivalent constraint resolves it. In an oriented loop sum, point-velocity terms cancel, so closure error primarily reflects measurement error or a biased arc.`
 ]},
 {zh:[
  `令目标位置的线性预测为 â(x) = wᵀr。将信号协方差记为 C、目标与样本的协方差记为 c(x)，并把独立采样噪声写成 σₙ²I，则预测误差方差对权重的梯度为 2(C + σₙ²I)w − 2c(x)。令梯度为零，得到 w = (C + σₙ²I)⁻¹c(x)。`,
  `代回预测式得 â(x) = c(x)ᵀ(C + σₙ²I)⁻¹r。ℓ 增大时，远处样本的协方差下降得更慢，预测通常更平滑；ℓ 过大则可能抹平局部变化。最终相位改正按 φ_corr = φ_raw − â 计算，效果需结合误差而非平滑程度判断。`
 ],en:[
  `Let the target estimate be â(x) = wᵀr. Write the signal covariance as C, target-to-sample covariance as c(x), and independent sample noise as σₙ²I. The gradient of prediction-error variance with respect to w is 2(C + σₙ²I)w − 2c(x). Setting it to zero gives w = (C + σₙ²I)⁻¹c(x).`,
  `Substitution gives â(x) = c(x)ᵀ(C + σₙ²I)⁻¹r. As ℓ grows, covariance decays more slowly with distance and predictions tend to be smoother; an overly large ℓ can suppress local variation. The phase correction is φ_corr = φ_raw − â and should be judged by error, not smoothness alone.`
 ]},
 {zh:[
  `线性模型的设计矩阵第 i 行是 [1,tᵢ]；加入年周期后扩为 [1,tᵢ,sin(2πtᵢ),cos(2πtᵢ)]。写成 d = Aβ + ε 后，最小二乘解满足 AᵀAβ̂ = Aᵀd，在 A 满列秩时 β̂ = (AᵀA)⁻¹Aᵀd。`,
  `若周期项系数为 a、b，则周期振幅为 √(a²+b²)，相位可由 atan2(b,a) 表示。增加参数通常不会增大训练残差 RMS，因此比较时还应看残差结构、速度变化及模型复杂度；虚线部分是当前参数外推，不是观测。`
 ],en:[
  `The linear design matrix has row [1,tᵢ]; adding an annual term gives [1,tᵢ,sin(2πtᵢ),cos(2πtᵢ)]. With d = Aβ + ε, least squares satisfies AᵀAβ̂ = Aᵀd, and for full column rank β̂ = (AᵀA)⁻¹Aᵀd.`,
  `For annual coefficients a and b, amplitude is √(a²+b²) and phase can be written atan2(b,a). Extra parameters usually do not increase training RMS, so compare residual structure, velocity change, and model complexity as well; dashed segments are extrapolations, not observations.`
 ]}
];
function range(key,label,min,max,step,value,unit='') {return `<div class="control"><label for="control-${key}">${label}<output id="value-${key}">${value} ${unit}</output></label><input id="control-${key}" type="range" data-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;}
function presets(items){return `<div class="preset-row">${items.map(([id,label])=>`<button type="button" data-preset="${id}">${label}</button>`).join('')}</div>`;}
function buildControls(){
 const s=states[stage];let html='';
 if(stage===0)html=range('velocity',T('LOS 速度','LOS velocity'),-25,25,1,s.velocity,'mm/yr')+presets([['toward',T('朝向卫星','Toward satellite')],['away',T('远离卫星','Away from satellite')]]);
 if(stage===1)html=range('threshold',T('离散度门限','Dispersion threshold'),.05,.65,.01,s.threshold)+presets([['stable',T('查看低离散度点','Low dispersion')],['unstable',T('查看高离散度点','High dispersion')]]);
 if(stage===2)html=range('v',T('试探速度 v','Trial velocity v'),-20,20,1,s.v,'mm/yr')+range('h',T('试探高程 h','Trial height h'),-30,30,1,s.h,'m')+range('noise',T('相位噪声 σ','Phase noise σ'),0,1.5,.05,s.noise,'rad')+range('epoch',T('对照观测期','Compared acquisition'),1,28,1,s.epoch)+presets([['wrong',T('偏离真值','Wrong candidate')],['best',T('查看最优','Inspect optimum')],['noisy',T('高噪声','High noise')]]);
 if(stage===3)html=range('error',T('注入弧偏差','Injected arc bias'),0,16,.5,s.error,'mm/yr')+`<div class="control"><label for="reference">${T('参考点（固定为 0）','Reference point (fixed at 0)')}</label><select id="reference" data-key="reference">${Array.from({length:7},(_,i)=>`<option value="${i}" ${s.reference===i?'selected':''}>${T('点','Point')} ${i}</option>`).join('')}</select></div><label class="check"><input type="checkbox" data-key="reject" ${s.reject?'checked':''}>${T('剔除选中的已知异常弧','Reject the selected known biased arc')}</label>`;
 if(stage===4)html=range('length',T('空间相关长度 ℓ','Correlation length ℓ'),.05,.65,.02,s.length)+presets([['short',T('短相关长度','Short range')],['long',T('长相关长度','Long range')]]);
 if(stage===5)html=range('season',T('真实季节幅度','True seasonal amplitude'),0,10,.5,s.season,'mm')+`<div class="control"><label for="modelType">${T('当前拟合模型','Active fit')}</label><select id="modelType" data-key="modelType"><option value="linear" ${s.modelType==='linear'?'selected':''}>${T('线性 · 2 参数','Linear · 2 parameters')}</option><option value="seasonal" ${s.modelType==='seasonal'?'selected':''}>${T('线性 + 年周期 · 4 参数','Linear + annual · 4 parameters')}</option></select></div>`+presets([['noSeason',T('无季节信号','No seasonality')],['seasonal',T('遗漏周期项','Omitted seasonality')]]);
 $('controls').innerHTML=html;
 $('controls').querySelectorAll('[data-key]').forEach(el=>el.addEventListener('input',()=>{
  const key=el.dataset.key;if(stage===2&&searchMode){const c=afCandidate();s.v=c.v;s.h=c.h;}s[key]=el.type==='checkbox'?el.checked:key==='modelType'?el.value:Number(el.value);
  if(el.type==='range')$('value-'+key).textContent=el.value+' '+el.dataset.unit;
  stop();progress=1;searchMode=false;if(stage!==2||key==='noise')recompute();paint();
 }));
 $('controls').querySelectorAll('[data-preset]').forEach(el=>el.addEventListener('click',()=>applyPreset(el.dataset.preset)));
}
function applyPreset(id){
 const s=states[stage];stop();progress=1;searchMode=false;
 if(id==='toward')s.velocity=12;if(id==='away')s.velocity=-12;
 if(id==='stable'||id==='unstable'){const sorted=[...data.points].sort((a,b)=>a.da-b.da);s.point=(id==='stable'?sorted[0]:sorted.at(-1)).id;}
 if(id==='wrong'){s.v=4;s.h=-8;}if(id==='best'){s.v=data.best.v;s.h=data.best.h;}
 if(id==='noisy')s.noise=1.2;if(id==='short')s.length=.05;if(id==='long')s.length=.65;
 if(id==='noSeason')s.season=0;if(id==='seasonal'){s.season=7;s.modelType='linear';}
 recompute();buildControls();paint();
}
function recompute(){
 const s=states[stage],seed=seeds[stage];heatCache=null;
 if(stage===0){const t=Array.from({length:121},(_,i)=>i/40);data={t,continuous:t.map(t=>P.model(t,0,s.velocity,0))};data.wrapped=data.continuous.map(P.wrap);}
 if(stage===1){
  const points=P.candidates(seed),maxDA=Math.max(...points.flatMap(pt=>Array.from({length:27},(_,i)=>P.dispersion(pt.a.slice(0,i+2)))));
  const histMax=Math.max(.8,Math.ceil(maxDA*20)/20);
  const histPeak=Math.max(...Array.from({length:27},(_,i)=>{const bins=Array(16).fill(0);points.forEach(pt=>bins[Math.min(15,Math.floor(P.dispersion(pt.a.slice(0,i+2))/histMax*16))]++);return Math.max(...bins);}));
  data={points,histMax,histPeak};
 }
 if(stage===2){const obs=P.observations({noise:s.noise,seed});data={obs,...P.searchAF(obs)};let best=0;data.prefixBest=data.cells.map((g,i)=>{if(g>data.cells[best])best=i;return best;});}
 if(stage===3){
  data=P.network(s.error,s.reject,s);const values=[...data.truth,...data.estimate],res=data.edges.filter(e=>!(s.reject&&e.bad)).map(e=>e.value-(data.estimate[e.j]-data.estimate[e.i]));
  networkScales={lo:Math.floor(Math.min(...values))-2,hi:Math.ceil(Math.max(...values))+2,residual:Math.max(1,...res.map(Math.abs))*1.2};
 }
 if(stage===4){data=P.atmosphere(s.length,seed);updateWeights();}
 if(stage===5){data={linear:P.timeSeries({...s,seed,modelType:'linear'}),seasonal:P.timeSeries({...s,seed,modelType:'seasonal'})};seriesFrames=Array.from({length:25},(_,i)=>fitPrefix(data.linear,12+i));
  const fits=seriesFrames.flatMap(f=>[f.linear,f.seasonal]),predict=(fit,t)=>fit.x[0]+fit.x[1]*t+(fit.x.length===4?fit.x[2]*Math.sin(P.TAU*t)+fit.x[3]*Math.cos(P.TAU*t):0),fitted=fits.flatMap(f=>data.linear.t.map(t=>predict(f,t))),components=fits.flatMap(f=>data.linear.t.flatMap(t=>[f.x[0]+f.x[1]*t,f.x.length===4?f.x[2]*Math.sin(P.TAU*t)+f.x[3]*Math.cos(P.TAU*t):0]));
  seriesScales={lo:Math.floor(Math.min(...data.linear.y,...fitted)/5)*5-2,hi:Math.ceil(Math.max(...data.linear.y,...fitted)/5)*5+2,componentLo:Math.floor(Math.min(...components)/5)*5-2,componentHi:Math.ceil(Math.max(...components)/5)*5+2,residual:Math.max(2,...fits.flatMap(f=>f.residual).map(Math.abs))*1.15};}
}
function fitPrefix(observation,n){
 const t=observation.t.slice(0,n),y=observation.y.slice(0,n),truth=observation.truth.slice(0,n),fits={};
 for(const modelType of ['linear','seasonal']){
  const A=t.map(t=>modelType==='linear'?[1,t]:[1,t,Math.sin(P.TAU*t),Math.cos(P.TAU*t)]),fit=P.leastSquares(A,y);
  fits[modelType]={...fit,t,y,truth,rms:Math.sqrt(P.mean(fit.residual.map(v=>v*v)))};
 }
 return fits;
}
function updateWeights(){const s=states[4],c=data.pts.map(([x,y])=>Math.exp(-Math.hypot(x-s.targetX,y-s.targetY)/s.length));atmoWeights=P.solve(data.K,c);}
function card(id,title,tag='',wide=false,interactive=false){return `<section class="chart-card ${wide?'wide':''} ${interactive?'interactive':''}"><header><span class="chart-title">${title}</span><span class="chart-tag">${tag}</span></header><canvas id="${id}" role="img" aria-label="${title}" ${interactive?'tabindex="0"':''}></canvas></section>`;}
function buildCharts(){
 chartHandlers={};let html='';
 if(stage===0)html=card('geometry',T('01 / 视线向位移','01 / LOS displacement'),'LOS · mm')+card('circle',T('02 / 相位与整周','02 / Phase and cycles'),'φ = 4πd / λ')+card('phase',T('03 / 连续相位与主值','03 / Continuous and wrapped phase'),'t / yr · φ / rad');
 if(stage===1)html=card('map',T('01 / 候选点地图 · 点击选点','01 / Candidate map · select a pixel'),'[0, 1]²',false,true)+card('amplitude',T('02 / 所选像元的振幅','02 / Selected pixel amplitudes'),'epoch · a.u.')+card('echo',T('03 / 复数回波与噪声','03 / Complex echo and noise'),'z = 1 + nᵣ + jnᵢ')+card('histogram',T('04 / 离散度分布与门限','04 / Dispersion and threshold'),'Dₐ = σₐ / μₐ');
 if(stage===2)html=card('heat',T('01 / 参数空间 · 点击试探','01 / Parameter space · select a trial'),'γ ∈ [0, 1]',false,true)+card('phasors',T('02 / 残差单位相量','02 / Residual unit phasors'),'|mean exp(jr)| = γ')+card('model',T('03 / 同一观测下的模型比较','03 / Model vs. observations'),'wrapped phase / rad',false,true);
 if(stage===3)html=card('network',T('01 / 有向网络 · 点击弧','01 / Directed network · select an arc'),'Δv / mm·yr⁻¹',false,true)+card('velocity',T('02 / 相对点速度','02 / Relative point velocities'),'mm/yr')+card('arcResidual',T('03 / 平差后各弧残差','03 / Post-fit arc residuals'),'mm/yr');
 if(stage===4)html=card('raw',T('01 / 混合相位 · 点击位置','01 / Mixed phase · select a location'),'rad',false,true)+card('corrected',T('02 / 应用改正后的相位','02 / Corrected phase'),'rad',false,true)+card('prediction',T('03 / 预测大气与样本权重','03 / Atmosphere and sample weights'),'rad',false,true)+card('errorMap',T('04 / 相对形变真值的误差','04 / Error against deformation truth'),'rad');
 if(stage===5)html=card('fit',T('01 / 两种模型，同一观测','01 / Two models, same observations'),'mm')+card('components',T('02 / 当前模型的分量','02 / Active model components'),'mm')+card('residual',T('03 / 两种模型的残差','03 / Residual comparison'),'mm');
 $('charts').innerHTML=html;
 $('charts').dataset.count=String($('charts').children.length);
 const items=stage===2?[[color.blue,T('当前试探 ○','Trial ○')],[color.orange,T('已搜索最优 □','Running best □')],[color.teal,T('合成真值 +','Synthetic truth +')]]:stage===3?[[color.blue,T('估计','Estimate')],[color.teal,T('真值','Truth')],[color.red,T('含偏差弧','Biased arc')]]:stage===4?[[color.blue,T('负相位','Negative phase')],[color.orange,T('正相位','Positive phase')],[color.teal,T('选中位置 +','Selected location +')]]:stage===0?[[color.blue,T('主值相位 / 当前位移','Wrapped phase / displacement')],[color.teal,T('连续相位','Continuous phase')],[color.orange,T('±π / 相位角','±π / phase angle')]]:stage===1?[[color.blue,T('所选像元','Selected pixel')],[color.teal,T('保留候选 / 均值 ± 标准差','Retained / mean ± standard deviation')],[color.orange,T('均值 / 门限 / 噪声','Mean / threshold / noise')]]:stage===5?[[color.ink,T('观测','Observations')],[color.blue,T('线性拟合','Linear fit')],[color.teal,T('年周期拟合','Annual fit')],[color.orange,T('合成真值','Synthetic truth')]]:[[color.blue,T('观测 / 当前值','Observation / current')],[color.teal,T('模型 / 保留','Model / retained')],[color.orange,T('参考 / 门限','Reference / threshold')]];
 $('legend').innerHTML=items.map(([c,label])=>`<span><i style="background:${c}"></i>${label}</span>`).join('');
 $('charts').querySelectorAll('canvas').forEach(c=>{
  c.addEventListener('pointerdown',e=>{const fn=chartHandlers[c.id];if(!fn)return;const b=c.getBoundingClientRect();fn((e.clientX-b.left)/b.width,(e.clientY-b.top)/b.height);});
 });
 // Equivalent keyboard controls remain available in the sidebar for all continuous parameters.
 const interactive=$('charts').querySelectorAll('[tabindex]');interactive.forEach(c=>c.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const delta=e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:1,s=states[stage];stop();
  if(stage===1){s.point=(s.point+delta+180)%180;}
  if(stage===2&&c.id==='model'){s.epoch=clamp(s.epoch+delta,1,28);buildControls();paint();return;}
  if(stage===2){if(e.key==='ArrowLeft'||e.key==='ArrowRight')s.v=clamp(s.v+delta,-20,20);else s.h=clamp(s.h+delta,-30,30);progress=1;searchMode=false;}
  if(stage===3){s.badEdge=(s.badEdge+delta+14)%14;recompute();}
  if(stage===4){if(e.key==='ArrowLeft'||e.key==='ArrowRight')s.targetX=clamp(s.targetX+delta*.025);else s.targetY=clamp(s.targetY-delta*.025);updateWeights();}
  buildControls();paint();
 }));
}
function setup(id){const c=$(id),b=c.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(c.width!==Math.round(b.width*dpr)||c.height!==Math.round(b.height*dpr)){c.width=Math.round(b.width*dpr);c.height=Math.round(b.height*dpr);}const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,b.width,b.height);return{g,w:b.width,h:b.height};}
function text(g,str,x,y,size=10,fill=color.muted,align='left'){size*=Math.min(1.5,Math.max(1,(g.canvas.clientHeight||300)/300));g.font=`${size}px ${size<11?'Consolas,monospace':'sans-serif'}`;g.fillStyle=fill;g.textAlign=align;g.fillText(String(str),x,y);}
function line(g,x1,y1,x2,y2,fill=color.grid,width=1,dash=[]){g.beginPath();g.strokeStyle=fill;g.lineWidth=width;g.setLineDash(dash);g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);}
function dot(g,x,y,r=3,fill=color.blue,stroke=null){g.beginPath();g.arc(x,y,r,0,P.TAU);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=1.5;g.stroke();}}
function cross(g,x,y,fill=color.teal,r=6){line(g,x-r,y,x+r,y,fill,2);line(g,x,y-r,x,y+r,fill,2);}
function arrow(g,x,y,xx,yy,fill=color.blue,width=1.5){line(g,x,y,xx,yy,fill,width);const a=Math.atan2(yy-y,xx-x);line(g,xx,yy,xx-6*Math.cos(a-.45),yy-6*Math.sin(a-.45),fill,width);line(g,xx,yy,xx-6*Math.cos(a+.45),yy-6*Math.sin(a+.45),fill,width);}
function axis(g,w,h,{xmin=0,xmax=3,ymin=-1,ymax=1,xlabel='',ylabel='',top=25,bottom=34,left=42,right=15,xticks=null,yticks=null}={}){
 const a={x:left,y:top,w:w-left-right,h:h-top-bottom};a.X=v=>a.x+(v-xmin)/(xmax-xmin)*a.w;a.Y=v=>a.y+a.h-(v-ymin)/(ymax-ymin)*a.h;
 for(const v of (yticks||Array.from({length:5},(_,i)=>ymin+(ymax-ymin)*i/4))){line(g,a.x,a.Y(v),a.x+a.w,a.Y(v));text(g,Number(v.toFixed(1)),a.x-7,a.Y(v)+3,9,color.muted,'right');}
 for(const v of (xticks||Array.from({length:5},(_,i)=>xmin+(xmax-xmin)*i/4))){text(g,Number(v.toFixed(1)),a.X(v),a.y+a.h+15,9,color.muted,'center');}
 text(g,ylabel,a.x,13,9);text(g,xlabel,a.x+a.w,h-5,9,color.muted,'right');return a;
}
function series(g,a,x,y,fill=color.blue,{dots=false,dash=[],limit=x.length,width=1.7,wrapped=false}={}){
 g.save();g.beginPath();g.rect(a.x-4,a.y-4,a.w+8,a.h+8);g.clip();
 if(dots){for(let i=0;i<limit;i++)dot(g,a.X(x[i]),a.Y(y[i]),2.5,fill);}
 else {g.beginPath();g.strokeStyle=fill;g.lineWidth=width;g.setLineDash(dash);for(let i=0;i<limit;i++){if(i===0||(wrapped&&Math.abs(y[i]-y[i-1])>Math.PI))g.moveTo(a.X(x[i]),a.Y(y[i]));else g.lineTo(a.X(x[i]),a.Y(y[i]));}g.stroke();}g.restore();
}
function metric(label,value,unit=''){return `<div class="metric"><span>${label}</span><b>${value}<small> ${unit}</small></b></div>`;}
function report(metrics,explanation,progressText){const html=metrics.map(x=>metric(...x)).join('');if($('metrics').innerHTML!==html)$('metrics').innerHTML=html;if($('explanation').textContent!==explanation)$('explanation').textContent=explanation;$('progressLabel').textContent=progressText;if(!playing)$('plotSummary').textContent=explanation;}
function drawPhase(){
 const s=states[0],t=progress*3,d=s.velocity*t,phi=P.model(t,0,s.velocity,0),wrapped=P.wrap(phi),k=Math.round((phi-wrapped)/P.TAU);
 let {g,w,h}=setup('geometry');const x0=w*.25,y0=h*.72,x1=w*.78,y1=h*.22;
 line(g,20,y0+22,w-20,y0+22,color.gray,2);line(g,x0,y0,x1,y1,color.gray,1,[4,4]);
 const ux=(x1-x0)/Math.hypot(x1-x0,y1-y0),uy=(y1-y0)/Math.hypot(x1-x0,y1-y0),scale=Math.min(w,h)*.0025;
 dot(g,x0,y0,7,'white',color.gray);const px=x0+d*scale*ux,py=y0+d*scale*uy;dot(g,px,py,7,color.blue);arrow(g,x0,y0,px,py,color.blue,2);
 g.save();g.translate(x1,y1);g.rotate(-.45);g.fillStyle=color.ink;g.fillRect(-8,-7,16,14);g.fillStyle=color.blue;g.fillRect(-28,-5,16,10);g.fillRect(12,-5,16,10);g.restore();
 text(g,T('卫星','Satellite'),x1,y1-19,11,color.ink,'center');text(g,'ΔR = '+(-d).toFixed(1)+' mm',w/2,h-34,11,color.muted,'center');text(g,'d = '+d.toFixed(1)+' mm',w/2,h-15,12,color.blue,'center');text(g,T('位置示意 · 位移放大','Schematic · exaggerated motion'),15,20,10);text(g,'+ LOS',x1-20,y1+35,10,color.teal,'right');
 ({g,w,h}=setup('circle'));const cx=w*.43,cy=h*.47,r=Math.min(w*.27,h*.30);
 dot(g,cx,cy,r,null,color.gray);line(g,cx-r-10,cy,cx+r+10,cy);line(g,cx,cy-r-10,cx,cy+r+10);arrow(g,cx,cy,cx+r*Math.cos(phi),cy-r*Math.sin(phi),color.blue,3);
 g.beginPath();g.strokeStyle=color.orange;g.lineWidth=3;g.arc(cx,cy,r*.45,0,-wrapped,wrapped>0);g.stroke();text(g,'0',cx+r+14,cy+4);text(g,'π/2',cx,cy-r-10,9,color.muted,'center');text(g,'k = '+k,w-18,32,13,color.teal,'right');text(g,'φ = '+phi.toFixed(2)+' rad',w/2,h-35,12,color.ink,'center');text(g,'W(φ) = '+wrapped.toFixed(2)+' rad',w/2,h-15,11,color.blue,'center');
 ({g,w,h}=setup('phase'));const bound=Math.max(4,...data.continuous.map(Math.abs)),a=axis(g,w,h,{ymin:-bound,ymax:bound,xlabel:'t / yr',ylabel:'φ / rad'}),n=Math.max(1,Math.floor(progress*120)+1);
 series(g,a,data.t,data.continuous,color.teal,{limit:n});series(g,a,data.t,data.wrapped,color.blue,{limit:n,wrapped:true});line(g,a.x,a.Y(Math.PI),a.x+a.w,a.Y(Math.PI),color.orange,1,[3,3]);line(g,a.x,a.Y(-Math.PI),a.x+a.w,a.Y(-Math.PI),color.orange,1,[3,3]);line(g,a.X(t),a.y,a.X(t),a.y+a.h,color.gray,1,[3,3]);dot(g,a.X(t),a.Y(phi),4,color.teal);dot(g,a.X(t),a.Y(wrapped),4,color.blue);
 currentView={t,displacement_mm:d,continuousPhase:phi,wrappedPhase:wrapped,cycles:k};
 report([[T('当前位移','Displacement'),d.toFixed(1),'mm'],[T('整周数 k','Whole cycles k'),k],[T('主值相位','Wrapped phase'),wrapped.toFixed(2),'rad'],[T('一个整周','One full cycle'),'28','mm']],T(`当前位移 ${d.toFixed(1)} mm，对应连续相位 ${phi.toFixed(2)} rad。仪器只保留 ${wrapped.toFixed(2)} rad 的主值；补回 ${k} 个整周才能恢复这里的连续相位。图中的跳变来自缠绕，位移本身连续。`,`Displacement ${d.toFixed(1)} mm produces phase ${phi.toFixed(2)} rad. The instrument retains ${wrapped.toFixed(2)} rad; adding ${k} whole cycles recovers this continuous phase. Wrapping jumps do not imply discontinuous motion.`),'t = '+t.toFixed(2)+' yr');
}
function drawCandidates(){
 const s=states[1],n=2+Math.floor(progress*26),points=data.points.map(pt=>({...pt,da:P.dispersion(pt.a.slice(0,n))})),pt=points[s.point],kept=points.filter(pt=>pt.da<=s.threshold),values=pt.a.slice(0,n),mu=P.mean(values),sigma=mu*pt.da;
 let {g,w,h}=setup('map');const box={x:25,y:15,w:w-50,h:h-45};
 g.fillStyle='#f3f3f3';g.fillRect(box.x,box.y,box.w,box.h);for(let i=1;i<5;i++){line(g,box.x+i*box.w/5,box.y,box.x+i*box.w/5,box.y+box.h,'white');line(g,box.x,box.y+i*box.h/5,box.x+box.w,box.y+i*box.h/5,'white');}
 points.forEach(p=>dot(g,box.x+p.x*box.w,box.y+p.y*box.h,p.da<=s.threshold?3:2,p.da<=s.threshold?'#777777':'#c9c9c9'));dot(g,box.x+pt.x*box.w,box.y+pt.y*box.h,7,null,color.blue);text(g,'ID '+pt.id,box.x+pt.x*box.w,clamp(box.y+pt.y*box.h-11,12,h-20),10,color.blue,'center');text(g,T('点击像元 / 方向键切换','Select pixel / arrow keys'),25,h-10,9);
 const mapWidth=w,mapHeight=h;chartHandlers.map=(x,y)=>{const px=x*mapWidth,py=y*mapHeight;s.point=points.reduce((best,p)=>Math.hypot(box.x+p.x*box.w-px,box.y+p.y*box.h-py)<Math.hypot(box.x+best.x*box.w-px,box.y+best.y*box.h-py)?p:best).id;paint();};
 ({g,w,h}=setup('amplitude'));const a=axis(g,w,h,{xmin:1,xmax:28,ymin:0,ymax:Math.max(2.4,...pt.a)*1.08,xlabel:'epoch',ylabel:'amplitude / a.u.',xticks:[1,7,14,21,28]}),epochs=Array.from({length:28},(_,i)=>i+1);
 g.fillStyle='#ededed';g.fillRect(a.x,a.Y(mu+sigma),a.w,a.Y(mu-sigma)-a.Y(mu+sigma));line(g,a.x,a.Y(mu),a.x+a.w,a.Y(mu),color.orange,1,[4,3]);series(g,a,epochs,pt.a,color.blue,{limit:n});series(g,a,epochs,pt.a,color.blue,{limit:n,dots:true});line(g,a.X(n),a.y,a.X(n),a.y+a.h,color.gray,1,[3,3]);dot(g,a.X(n),a.Y(pt.a[n-1]),5,'white',color.blue);text(g,'μ ± σ',a.x+a.w-5,a.Y(mu+sigma)-5,9,color.teal,'right');
 ({g,w,h}=setup('echo'));
 const maxCoord=Math.max(1.4,...pt.samples.flatMap(z=>[Math.abs(z.re),Math.abs(z.im)]))+.15,span=Math.min(w-70,h-60),left=(w-span)/2,top=20,scale=span/(2*maxCoord),X=v=>left+span/2+v*scale,Y=v=>top+span/2-v*scale;
 line(g,X(-maxCoord),Y(0),X(maxCoord),Y(0),color.gray);line(g,X(0),Y(-maxCoord),X(0),Y(maxCoord),color.gray);text(g,'Re',X(maxCoord),Y(0)-6,9,color.muted,'right');text(g,'Im',X(0)+6,Y(maxCoord),9);
 dot(g,X(1),Y(0),4,color.teal);text(g,'1 + 0j',X(1),Y(0)+15,9,color.teal,'center');
 pt.samples.slice(0,n).forEach(z=>dot(g,X(z.re),Y(z.im),2.5,'#a3a3a3'));
 const z=pt.samples[n-1];arrow(g,X(0),Y(0),X(z.re),Y(z.im),color.blue,2);arrow(g,X(1),Y(0),X(z.re),Y(z.im),color.orange,1.5);dot(g,X(z.re),Y(z.im),4,color.blue);text(g,'|z| = '+pt.a[n-1].toFixed(3),w/2,h-12,11,color.blue,'center');
 ({g,w,h}=setup('histogram'));const bins=Array(16).fill(0);points.forEach(pt=>bins[Math.min(15,Math.floor(pt.da/data.histMax*16))]++);const b=axis(g,w,h,{xmin:0,xmax:data.histMax,ymin:0,ymax:data.histPeak+5,xlabel:'Dₐ',ylabel:T('像元数','pixels')});bins.forEach((v,i)=>{g.fillStyle=color.gray;g.fillRect(b.X(i*data.histMax/16)+2,b.Y(v),b.w/16-4,b.Y(0)-b.Y(v));});line(g,b.X(s.threshold),b.y,b.X(s.threshold),b.y+b.h,color.orange,2);dot(g,b.X(pt.da),b.y+7,4,color.blue);text(g,'τ = '+s.threshold.toFixed(2),b.X(s.threshold)+5,b.y+16,10,color.orange);
 currentView={epochs:n,selectedPixel:pt.id,dispersion:pt.da,retained:kept.length};
 report([[T('当前期数','Acquisitions'),n,'/ 28'],[T('保留像元','Retained'),kept.length,'/ 180'],['Dₐ',pt.da.toFixed(3)],[T('振幅标准差','Amplitude σ'),sigma.toFixed(3)]],T(`像元 ${pt.id}：均值 ${mu.toFixed(3)}，标准差 ${sigma.toFixed(3)}，Dₐ = ${pt.da.toFixed(3)}，${pt.da<=s.threshold?'通过':'未通过'}当前门限。地图与直方图使用当前 ${n} 期观测计算，短序列的筛选结果可能随新观测变化。`,`Pixel ${pt.id}: mean ${mu.toFixed(3)}, standard deviation ${sigma.toFixed(3)}, Dₐ = ${pt.da.toFixed(3)}; ${pt.da<=s.threshold?'passes':'fails'} the threshold. Map and histogram use the current ${n} acquisitions; short-series selections may change as data accumulate.`),n+' / 28 '+T('期','epochs'));
}
function afCandidate(){
 const count=searchMode?Math.max(1,Math.ceil(progress*data.cells.length)):data.cells.length,s=states[2];
 const idx=searchMode?(progress>=1?data.prefixBest[count-1]:count-1):(s.h+30)*41+s.v+20,v=data.vs[idx%41],h=data.hs[Math.floor(idx/41)],bestIdx=data.prefixBest[count-1];
 return {idx,count,v,h,gamma:data.cells[idx],bestIdx,residual:data.obs.phase.map((p,i)=>p-P.model(data.obs.t[i],data.obs.B[i],v,h))};
}
function heatColor(v){const gray=Math.round(232-128*v);return `rgb(${gray},${gray},${gray})`;}
function drawAF(){
 const s=states[2],c=afCandidate(),selected=s.epoch-1,bv=data.vs[c.bestIdx%41],bh=data.hs[Math.floor(c.bestIdx/41)];
 let {g,w,h}=setup('heat');const a=axis(g,w,h,{xmin:-20.5,xmax:20.5,ymin:-30.5,ymax:30.5,xlabel:'v / mm·yr⁻¹',ylabel:'h / m',bottom:40,xticks:[-20,-10,0,10,20],yticks:[-30,-15,0,15,30]}),cw=a.w/41,ch=a.h/61;
 if(!heatCache){heatCache=document.createElement('canvas');heatCache.width=41;heatCache.height=61;const ctx=heatCache.getContext('2d');data.cells.forEach((v,i)=>{ctx.fillStyle=heatColor(v);ctx.fillRect(i%41,60-Math.floor(i/41),1,1);});}
 g.fillStyle='#f0f0f0';g.fillRect(a.x,a.y,a.w,a.h);g.imageSmoothingEnabled=false;
 const rows=Math.floor(c.count/41),rest=c.count%41;if(rows)g.drawImage(heatCache,0,61-rows,41,rows,a.x,a.y+a.h-rows*ch,a.w,rows*ch);if(rest)g.drawImage(heatCache,0,60-rows,rest,1,a.x,a.y+a.h-(rows+1)*ch,rest*cw,ch);
 cross(g,a.X(-8),a.Y(12),color.teal,6);g.strokeStyle=color.orange;g.lineWidth=2;g.strokeRect(a.X(bv)-6,a.Y(bh)-6,12,12);dot(g,a.X(c.v),a.Y(c.h),6,'white',color.blue);
 const hw=w,hh=h;chartHandlers.heat=(x,y)=>{if(x*hw<a.x||x*hw>a.x+a.w||y*hh<a.y||y*hh>a.y+a.h)return;stop();searchMode=false;progress=1;s.v=clamp(Math.floor((x*hw-a.x)/cw)-20,-20,20);s.h=clamp(30-Math.floor((y*hh-a.y)/ch),-30,30);buildControls();paint();};
 text(g,T('浅 → 深：γ 0 → 1','Light → dark: γ 0 → 1'),a.x,h-6,9);
 ({g,w,h}=setup('phasors'));const cx=w/2,cy=h*.43,r=Math.min(w*.29,h*.28);
 dot(g,cx,cy,r,null,color.gray);line(g,cx-r-12,cy,cx+r+12,cy);line(g,cx,cy-r-12,cx,cy+r+12);text(g,'Re',cx+r+15,cy+4,9);text(g,'Im',cx+5,cy-r-12,9);
 c.residual.forEach((v,i)=>{line(g,cx,cy,cx+r*Math.cos(v),cy-r*Math.sin(v),i===selected?color.orange:'#a3a3a3',i===selected?2.5:1);dot(g,cx+r*Math.cos(v),cy-r*Math.sin(v),i===selected?4:2,i===selected?color.orange:color.blue);});
 const selectedResidual=P.wrap(c.residual[selected]);g.beginPath();g.strokeStyle=color.teal;g.lineWidth=2;g.arc(cx,cy,r*.4,0,-selectedResidual,selectedResidual>0);g.stroke();
 const ex=P.mean(c.residual.map(Math.cos)),ey=P.mean(c.residual.map(Math.sin));arrow(g,cx,cy,cx+r*ex,cy-r*ey,color.orange,3);text(g,'γ = '+c.gamma.toFixed(3),cx,h-39,17,color.ink,'center');text(g,'r['+s.epoch+'] = '+selectedResidual.toFixed(2)+' rad',cx,h-19,11,color.teal,'center');text(g,'arg(mean) = '+Math.atan2(ey,ex).toFixed(2)+' rad',cx,h-4,9,color.muted,'center');
 ({g,w,h}=setup('model'));const model=data.obs.t.map((t,i)=>P.wrap(P.model(t,data.obs.B[i],c.v,c.h))),b=axis(g,w,h,{xmin:0,xmax:2.5,ymin:-Math.PI,ymax:Math.PI,xlabel:'t / yr',ylabel:'wrapped phase / rad'});
 // Only dots are used: connecting wrapped samples would imply an unobserved phase path.
 data.obs.t.forEach((t,i)=>{dot(g,b.X(t),b.Y(data.obs.phase[i]),i===selected?4:2.5,color.ink);dot(g,b.X(t),b.Y(model[i]),i===selected?5:3.5,null,i===selected?color.teal:color.blue);});
 const tx=b.X(data.obs.t[selected]);line(g,tx,b.y,tx,b.y+b.h,color.teal,1,[3,3]);
 chartHandlers.model=(x)=>{const target=x*w;let best=0;data.obs.t.forEach((t,i)=>{if(Math.abs(b.X(t)-target)<Math.abs(b.X(data.obs.t[best])-target))best=i;});s.epoch=best+1;$('control-epoch').value=s.epoch;$('value-epoch').textContent=s.epoch;paint();};text(g,T('实心：观测 · 空心：试探模型','Filled: observed · hollow: trial model'),b.x+8,b.y+11,10,color.muted);
 if(searchMode){$('control-v').value=c.v;$('control-h').value=c.h;$('value-v').textContent=c.v+' mm/yr';$('value-h').textContent=c.h+' m';}
 currentView={mode:searchMode?'grid-search':'manual',candidate:c,selectedEpoch:s.epoch,selectedResidual,meanResidualAngle:Math.atan2(ey,ex),runningBest:{v:bv,h:bh,gamma:data.cells[c.bestIdx]},velocityError:c.v-data.obs.velocity,heightError:c.h-data.obs.height};
 report([[T('当前试探 γ','Trial γ'),c.gamma.toFixed(3)],[T('已搜索最优 γ','Best scanned γ'),data.cells[c.bestIdx].toFixed(3)],[T('试探速度误差','Trial velocity error'),(c.v+8).toFixed(0),'mm/yr'],[T('试探高程误差','Trial height error'),(c.h-12).toFixed(0),'m']],T(`当前试探 v = ${c.v} mm/yr、h = ${c.h} m，残差相量平均长度为 ${c.gamma.toFixed(3)}。已搜索最优为 (${bv}, ${bh})，γ = ${data.cells[c.bestIdx].toFixed(3)}。相量集中表示模型更一致，但高 γ 本身不保证参数唯一或正确。`,`Trial v = ${c.v} mm/yr, h = ${c.h} m gives mean phasor length ${c.gamma.toFixed(3)}. Best scanned: (${bv}, ${bh}), γ = ${data.cells[c.bestIdx].toFixed(3)}. Concentration indicates consistency; a high γ alone does not establish a unique or correct solution.`),searchMode?c.count+' / '+data.cells.length:T('手动试探','Manual trial'));
}
function drawNetwork(){
 const s=states[3],applied=s.error*progress,n=P.network(applied,s.reject,s);currentView=n;
 let {g,w,h}=setup('network');const coords=n.pts.map(([x,y])=>[24+x*(w-48),13+y*(h-48)]),selected=n.edges[s.badEdge];
 n.edges.forEach((e,k)=>{const [x,y]=coords[e.i],[xx,yy]=coords[e.j],f=e.bad?color.red:color.gray;line(g,x,y,xx,yy,f,e.bad?2.5:1,e.bad&&s.reject?[3,4]:[]);const dx=xx-x,dy=yy-y;arrow(g,x+dx*.45,y+dy*.45,x+dx*.62,y+dy*.62,f,1);if(e.bad){text(g,e.value.toFixed(1),(x+xx)/2+5,(y+yy)/2-8,10,color.red);}});
 coords.forEach(([x,y],i)=>{dot(g,x,y,9+Math.min(12,Math.abs(n.estimate[i]-n.truth[i])*4),null,'#b43a3a30');dot(g,x,y,7,i===s.reference?'white':color.blue,i===s.reference?color.teal:null);text(g,i,x,y-15,11,color.ink,'center');text(g,n.estimate[i].toFixed(1),x+10,y+15,10,color.blue);});
 text(g,T(`弧 ${selected.i} → ${selected.j}：+${applied.toFixed(1)} mm/yr · 圆环：估计误差`,`Arc ${selected.i} → ${selected.j}: +${applied.toFixed(1)} mm/yr · rings: estimation error`),w/2,h-12,10,color.muted,'center');
 const nw=w,nh=h;chartHandlers.network=(x,y)=>{const px=x*nw,py=y*nh;let best=Infinity,index=0;n.edges.forEach((e,k)=>{const [ax,ay]=coords[e.i],[bx,by]=coords[e.j],dx=bx-ax,dy=by-ay,t=clamp(((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)),distance=Math.hypot(px-ax-t*dx,py-ay-t*dy);if(distance<best){best=distance;index=k;}});if(best>18)return;s.badEdge=index;recompute();paint();};
 ({g,w,h}=setup('velocity'));const vals=[...n.truth,...n.estimate],a=axis(g,w,h,{xmin:-.5,xmax:6.5,ymin:networkScales.lo,ymax:networkScales.hi,xlabel:T('点编号','point ID'),ylabel:'v / mm·yr⁻¹',xticks:[0,1,2,3,4,5,6]});
 n.truth.forEach((v,i)=>{line(g,a.X(i),a.Y(v),a.X(i),a.Y(n.estimate[i]),color.orange,2);dot(g,a.X(i)-3,a.Y(v),4,null,color.teal);dot(g,a.X(i)+3,a.Y(n.estimate[i]),3,color.blue);});
 ({g,w,h}=setup('arcResidual'));const residual=n.edges.map(e=>e.value-(n.estimate[e.j]-n.estimate[e.i])),bound=networkScales.residual,b=axis(g,w,h,{xmin:-.5,xmax:13.5,ymin:-bound,ymax:bound,xlabel:T('弧编号','arc ID'),ylabel:'residual / mm·yr⁻¹',xticks:[0,2,4,6,8,10,12,13]});
 line(g,b.x,b.Y(0),b.x+b.w,b.Y(0),color.gray);residual.forEach((v,i)=>{if(s.reject&&i===s.badEdge){cross(g,b.X(i),b.Y(0),color.red,4);return;}line(g,b.X(i),b.Y(0),b.X(i),b.Y(v),i===s.badEdge?color.red:color.blue,Math.max(3,b.w/35));});
 const cycles=[];for(let i=0;i<7;i++)for(let j=i+1;j<7;j++)for(let k=j+1;k<7;k++){const find=(a,b)=>n.edges.find(e=>!((s.reject)&&e.bad)&&((e.i===a&&e.j===b)||(e.i===b&&e.j===a)));const e1=find(i,j),e2=find(j,k),e3=find(k,i);if(e1&&e2&&e3){const val=(e,a)=>e.i===a?e.value:-e.value;cycles.push(val(e1,i)+val(e2,j)+val(e3,k));}}
 const closure=Math.max(0,...cycles.map(Math.abs));currentView={...n,appliedBias:applied,maxTriangleClosure:closure};
 report([[T('当前注入偏差','Applied bias'),applied.toFixed(1),'mm/yr'],[T('点速度 RMSE','Velocity RMSE'),n.rmse.toFixed(2),'mm/yr'],[T('最大三角闭合差','Max triangle closure'),closure.toFixed(2),'mm/yr'],[T('有效弧数','Active arcs'),s.reject?13:14]],T(`偏差施加在弧 ${selected.i} → ${selected.j}。${s.reject?'该弧已按已知标签剔除，其他弧恢复一致。':'平差把弧之间的不一致分配到多个点，右图的连线表示各点估计与真值之差。'}参考点 ${s.reference} 固定为零，所有点速度与真值均相对该点表达。`,`Bias is on arc ${selected.i} → ${selected.j}. ${s.reject?'The known biased arc is excluded; the remaining arcs are consistent.':'Adjustment spreads inconsistency across multiple points; connecting segments show estimation errors.'} Point ${s.reference} is fixed at zero; both estimates and truth use this reference.`),Math.round(progress*100)+'% '+T('偏差','bias'));
}
function phaseColor(v,min=-2.2,max=2.2){const f=clamp(Math.abs(v)/(v<0?-min:max)),base=v<0?[180,95,95]:[112,112,112];return `rgb(${base.map(c=>Math.round(246+(c-246)*f)).join(',')})`;}
function fieldPlot(id,field,{weights=false}={}){
 const {g,w,h}=setup(id),s=states[4],size=data.size,ww=Math.min(w-54,h-65),hh=ww,x=(w-ww)/2,y=12;
 for(let j=0;j<size;j++)for(let i=0;i<size;i++){g.fillStyle=phaseColor(field[j*size+i]);const left=Math.max(0,(i-.5)/(size-1)),right=Math.min(1,(i+.5)/(size-1)),top=Math.max(0,(j-.5)/(size-1)),bottom=Math.min(1,(j+.5)/(size-1));g.fillRect(x+left*ww,y+top*hh,(right-left)*ww+.5,(bottom-top)*hh+.5);}
 data.pts.forEach(([px,py],i)=>{const weight=atmoWeights[i];if(weights&&Math.abs(weight)>.015)line(g,x+s.targetX*ww,y+s.targetY*hh,x+px*ww,y+py*hh,weight>=0?'#ffffffaa':'#b43a3a88',Math.min(3,.5+Math.abs(weight)*6));dot(g,x+px*ww,y+py*hh,weights?2+Math.sqrt(Math.abs(weight))*7:1.6,'white',weights?(weight>=0?color.ink:color.red):null);});
 cross(g,x+s.targetX*ww,y+s.targetY*hh,color.teal,7);text(g,'0',x-7,y+4,9,color.muted,'right');text(g,'1',x-7,y+hh,9,color.muted,'right');text(g,'x, y ∈ [0, 1]',x+ww,y+hh+13,9,color.muted,'right');
 for(let i=0;i<80;i++){g.fillStyle=phaseColor(-2.2+4.4*i/79);g.fillRect(x+i*ww/80,h-26,ww/80+.5,5);}text(g,'−2.2',x,h-8,9);text(g,'0',x+ww/2,h-8,9,color.muted,'center');text(g,'+2.2 rad',x+ww,h-8,9,color.muted,'right');
 if(id!=='errorMap')chartHandlers[id]=(px,py)=>{if(px*w<x||px*w>x+ww||py*h<y||py*h>y+hh)return;s.targetX=clamp((px*w-x)/ww);s.targetY=clamp((py*h-y)/hh);updateWeights();paint();};
}
function drawAtmosphere(){
 const corrected=data.raw.map((v,i)=>v-progress*data.prediction[i]),error=corrected.map((v,i)=>v-data.truth[i]),rms=P.rmse(corrected,data.truth),prediction=atmoWeights.reduce((sum,w,i)=>sum+w*data.values[i],0);
 fieldPlot('raw',data.raw);fieldPlot('corrected',corrected);fieldPlot('prediction',data.prediction,{weights:true});fieldPlot('errorMap',error);
 currentView={fraction:progress,corrected,rmse:rms,target:[states[4].targetX,states[4].targetY],weights:atmoWeights,targetPrediction:prediction};
 report([[T('改正前 RMSE','Before RMSE'),data.before.toFixed(3),'rad'],[T('当前 RMSE','Current RMSE'),rms.toFixed(3),'rad'],[T('所选位置预测','Selected prediction'),prediction.toFixed(3),'rad'],[T('样本数','Samples'),'45']],T(`已应用 ${Math.round(progress*100)}% 的预测大气改正，误差 RMSE 从 ${data.before.toFixed(3)} 变为 ${rms.toFixed(3)} rad。第三图圆点大小表示所选位置的权重绝对值，红色轮廓表示负权重。四图共用 ±2.2 rad 色标，超范围值饱和显示；误差图使用合成形变真值。`,`Applied ${Math.round(progress*100)}% of the predicted correction; RMSE changes from ${data.before.toFixed(3)} to ${rms.toFixed(3)} rad. Sample size in panel 3 represents absolute weight; red outlines indicate negative weights. All maps share ±2.2 rad with saturation outside this range; errors use synthetic deformation truth.`),Math.round(progress*100)+'% '+T('改正','correction'));
}
function drawTimeSeries(){
 const s=states[5],n=12+Math.floor(progress*24),fits=seriesFrames[n-12],d=fits[s.modelType],lo=seriesScales.lo,hi=seriesScales.hi;
 const ti=d.t.at(-1),times=data.linear.t,predict=(fit,t)=>fit.x[0]+fit.x[1]*t+(fit.x.length===4?fit.x[2]*Math.sin(P.TAU*t)+fit.x[3]*Math.cos(P.TAU*t):0),linearCurve=times.map(t=>predict(fits.linear,t)),seasonalCurve=times.map(t=>predict(fits.seasonal,t));
 let {g,w,h}=setup('fit');const a=axis(g,w,h,{ymin:lo,ymax:hi,xlabel:'t / yr',ylabel:'LOS / mm'});
 series(g,a,times,data.linear.truth,color.orange,{dash:[2,3],width:1});
 series(g,a,times.slice(0,n),linearCurve.slice(0,n),color.blue,{width:s.modelType==='linear'?2.5:1});series(g,a,times.slice(n-1),linearCurve.slice(n-1),color.blue,{dash:[4,3],width:s.modelType==='linear'?2.5:1});
 series(g,a,times.slice(0,n),seasonalCurve.slice(0,n),color.teal,{width:s.modelType==='seasonal'?2.5:1});series(g,a,times.slice(n-1),seasonalCurve.slice(n-1),color.teal,{dash:[4,3],width:s.modelType==='seasonal'?2.5:1});series(g,a,d.t,d.y,color.ink,{dots:true});
 line(g,a.X(ti),a.y,a.X(ti),a.y+a.h,color.gray,1,[3,3]);dot(g,a.X(ti),a.Y(d.y.at(-1)),5,'white',color.ink);
 ({g,w,h}=setup('components'));const trend=times.map(t=>d.x[0]+d.x[1]*t),season=times.map(t=>s.modelType==='seasonal'?d.x[2]*Math.sin(P.TAU*t)+d.x[3]*Math.cos(P.TAU*t):0),b=axis(g,w,h,{ymin:seriesScales.componentLo,ymax:seriesScales.componentHi,xlabel:'t / yr',ylabel:'mm'});
 series(g,b,times.slice(0,n),trend.slice(0,n),color.blue);series(g,b,times.slice(n-1),trend.slice(n-1),color.blue,{dash:[4,3]});series(g,b,times.slice(0,n),season.slice(0,n),color.teal);series(g,b,times.slice(n-1),season.slice(n-1),color.teal,{dash:[4,3]});line(g,b.X(ti),b.y,b.X(ti),b.y+b.h,color.gray,1,[3,3]);dot(g,b.X(ti),b.Y(trend[n-1]),4,color.blue);dot(g,b.X(ti),b.Y(season[n-1]),4,color.teal);text(g,T('实线：观测期 · 虚线：外推','Solid: observed · dashed: extrapolated'),b.x+3,b.y+10,9);
 ({g,w,h}=setup('residual'));const bound=seriesScales.residual,c=axis(g,w,h,{ymin:-bound,ymax:bound,xlabel:'t / yr',ylabel:'residual / mm'});
 series(g,c,d.t,fits.linear.residual,color.blue);series(g,c,d.t,fits.seasonal.residual,color.teal);line(g,c.x,c.Y(0),c.x+c.w,c.Y(0),color.gray,1,[3,3]);line(g,c.X(ti),c.y,c.X(ti),c.y+c.h,color.gray,1,[3,3]);dot(g,c.X(ti),c.Y(fits.linear.residual.at(-1)),4,color.blue);dot(g,c.X(ti),c.Y(fits.seasonal.residual.at(-1)),4,color.teal);
 currentView={model:s.modelType,fittedEpochs:n,fit:d,comparison:fits};
 report([[T('当前速度估计','Active velocity'),d.x[1].toFixed(2),'mm/yr'],[T('速度偏差','Velocity error'),(d.x[1]+8).toFixed(2),'mm/yr'],[T('线性残差 RMS','Linear residual RMS'),fits.linear.rms.toFixed(2),'mm'],[T('周期残差 RMS','Annual residual RMS'),fits.seasonal.rms.toFixed(2),'mm']],T(`当前拟合使用前 ${n} 期观测。线性模型 RMS ${fits.linear.rms.toFixed(2)} mm，年周期模型 RMS ${fits.seasonal.rms.toFixed(2)} mm。实线拟合已观测期，长虚线是按当前参数外推，橙色点虚线为合成真值。模型会随新增观测重估；短序列中的趋势与周期可能混淆。`,`Both models use the first ${n} acquisitions. Linear RMS ${fits.linear.rms.toFixed(2)} mm; annual RMS ${fits.seasonal.rms.toFixed(2)} mm. Solid segments fit observed epochs; long dashes extrapolate current parameters; the orange dotted line is synthetic truth. Fits update with new acquisitions, and trend and seasonality may be difficult to separate in short series.`),n+' / 36 '+T('期','epochs'));
}
function renderDerivation(){
 const c=NOTEBOOK_CONTENT[lang].chapters[stage];
 $('mathContent').innerHTML=`<div class="math-heading"><h2>${c.title}</h2><p>${c.lead}</p></div><div class="math-layout"><div class="proof"><p>${c.description}</p><dl class="notation">${c.notation.map(([symbol,meaning])=>`<div><dt>${symbol}</dt><dd>${meaning}</dd></div>`).join('')}</dl>${c.formulas.map(f=>`<div class="formula">${f}</div>`).join('')}<div class="derivation-prose">${c.steps.map(s=>`<p>${s}</p>`).join('')}<h3 class="derivation-label">${T('补充推导','Derivation details')}</h3>${derivationAddenda[stage][lang].map(s=>`<p>${s}</p>`).join('')}</div></div><aside class="method-notes"><h3>${T('本节范围','Scope')}</h3><p>${c.scope}</p><h3>${T('参考文献','References')}</h3><div class="related-links">${c.refs.map(n=>{const r=NOTEBOOK_CONTENT.references[n-1];return `<a href="https://doi.org/${r.doi}" target="_blank" rel="noopener noreferrer">[${n}] ${r.authors.split(',')[0]} · ${r.year} ↗</a>`;}).join('')}</div></aside></div>`;
}
function renderChapterLinks(){
 const related=[[2,5],[2,3],[0,3],[1,5],[3,5],[0,4]][stage];
 const reasons={ '0-2':['相位参数','Phase parameters'],'0-5':['位移时序','Displacement series'],'1-2':['候选点参数','Candidate parameters'],'1-3':['候选点网络','Candidate network'],'2-0':['相位观测','Phase observations'],'2-3':['弧差值与网络','Arc differences'],'3-1':['候选点分布','Candidate distribution'],'3-5':['速度与时序','Velocity and time series'],'4-3':['空间网络','Spatial network'],'4-5':['改正后的时序','Corrected time series'],'5-0':['位移与相位','Displacement and phase'],'5-4':['大气残差','Atmospheric residuals']};
 $('chapterLinks').innerHTML=`<span>${T('相关章节','Related')}</span>`+related.map(i=>`<button data-related="${i}">${String(i+1).padStart(2,'0')} · ${reasons[stage+'-'+i][lang==='zh'?0:1]} ↗</button>`).join('');
 $('chapterLinks').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setStage(+b.dataset.related,true)));
 $('chapterSelect').innerHTML=U().tabs.map((name,i)=>`<option value="${i}" ${stage===i?'selected':''}>${String(i+1).padStart(2,'0')} · ${name}</option>`).join('');
 $('chapterSelect').setAttribute('aria-label',T('切换章节','Switch chapter'));
}
function renderStage(){
 $('labPanel').dataset.stage=stage;renderChapterLinks();
 $('stageLabel').textContent=String(stage+1).padStart(2,'0')+' / '+['OBSERVE','SELECT','ESTIMATE','CONNECT','PREDICT','VALIDATE'][stage];
 $('stageTitle').textContent=titles[stage][lang==='zh'?0:1];$('stageDescription').textContent=descriptions[stage][lang==='zh'?0:1];$('scopeNote').textContent=scopes[stage][lang==='zh'?0:1];
 $('labPanel').setAttribute('aria-labelledby','tab-'+stage);
 document.querySelectorAll('[data-tab]').forEach(b=>{const active=+b.dataset.tab===stage;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
 $('resample').hidden=![1,2,4,5].includes(stage);$('previous').disabled=stage===0;$('next').disabled=stage===5;$('experimentCounter').textContent=String(stage+1).padStart(2,'0')+' / 06';
 $('timeline').setAttribute('aria-label',stage===2?T('网格搜索进度','Grid-search progress'):stage===3?T('偏差应用比例','Applied bias fraction'):stage===4?T('改正应用比例','Applied correction fraction'):T('观测进度','Observation progress'));
 buildControls();buildCharts();renderDerivation();paint();
}
function paint(){
 if(!$('charts').children.length)return;
 [drawPhase,drawCandidates,drawAF,drawNetwork,drawAtmosphere,drawTimeSeries][stage]();
 $('timeline').value=Math.round(progress*1000);$('timeline').setAttribute('aria-valuetext',$('progressLabel').textContent);
 $('play').textContent=playing?'Ⅱ '+T('暂停','Pause'):'▶ '+(stage===2?T('搜索参数','Search grid'):progress>=1?T('播放过程','Replay'):T('继续播放','Resume'));
}
function startPlayback(){playing=true;lastTime=0;paint();cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);}
function stop(){playing=false;lastTime=0;cancelAnimationFrame(raf);}
function tick(time){
 if(!playing)return;
 if(!document.hidden&&labVisible){if(!lastTime)lastTime=time;progress=Math.min(1,progress+Math.min(100,time-lastTime)*speed/(stage===2?12000:8000));lastTime=time;if(time-lastPaint>45||progress>=1){paint();lastPaint=time;}if(progress>=1){if(stage===2){const c=afCandidate();states[2].v=c.v;states[2].h=c.h;}stop();paint();return;}}
 else lastTime=0;
 raf=requestAnimationFrame(tick);
}
function setStage(i,focus=false){
 stop();stage=clamp(i,0,5);progress=autoPlay?0:1;searchMode=stage===2&&autoPlay;recompute();renderStage();if(autoPlay)startPlayback();
 const tab=$('tab-'+stage);$('tabs').scrollLeft=tab.offsetLeft-($('tabs').clientWidth-tab.clientWidth)/2;
 if($('tabs').getBoundingClientRect().top<64||focus)$('labPanel').scrollIntoView({behavior:'instant',block:'start'});
 try {const url=new URL(location.href);url.searchParams.set('stage',stage+1);history.replaceState(null,'',url);}catch{}
 if(focus)$('tab-'+stage).focus({preventScroll:true});
}
function setLanguage(){
 document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=T('PSI-SimLab · PS-InSAR 动画笔记','PSI-SimLab · PS-InSAR visual notes');
 const labels={autoPlayLabel:T('切章自动播放','Play on entry'),jumpLabel:T('跳转','Chapter'),navLab:T('章节目录','Chapters'),heroTitle:'PSI-SimLab',enter:T('浏览章节 ↓','Chapters ↓'),labEyebrow:'CONTENTS',labTitle:T('章节与算例','Chapters and examples'),controlTitle:T('实验参数 / PARAMETERS','EXPERIMENT PARAMETERS'),reset:T('重置','Reset'),resample:T('重新采样','Resample'),download:T('导出数据 ↓','Export data ↓'),explanationTitle:T('本次结果 / COMPARISON','CURRENT COMPARISON'),mathSummary:T('公式与推导','Equations and derivation'),previous:T('← 上一节','← Previous'),next:T('下一节 →','Next →'),refsTitle:T('参考文献','References'),footerText:T('PS-InSAR 交互学习笔记','Interactive PS-InSAR notebook')};
 Object.entries(labels).forEach(([id,label])=>$(id).textContent=label);
 $('language').textContent=lang==='zh'?'EN':'中文';$('language').setAttribute('aria-label',T('Switch to English','切换至中文'));$('speed').setAttribute('aria-label',T('播放速度','Playback speed'));$('resample').title=T('更换随机样本；调整参数保留当前样本。','Generate a new sample. Parameter changes retain the current sample.');
 $('tabs').innerHTML=U().tabs.map((title,i)=>`<button class="tab" role="tab" id="tab-${i}" data-tab="${i}" aria-controls="labPanel" aria-selected="${i===stage}" tabindex="${i===stage?0:-1}"><small>${String(i+1).padStart(2,'0')} / ${['OBSERVE','SELECT','ESTIMATE','CONNECT','PREDICT','VALIDATE'][i]}</small><span>${title}</span></button>`).join('');
 document.querySelectorAll('[data-tab]').forEach(b=>{b.addEventListener('click',()=>setStage(+b.dataset.tab));b.addEventListener('keydown',e=>{let next=+b.dataset.tab;if(e.key==='ArrowRight')next=(next+1)%6;else if(e.key==='ArrowLeft')next=(next+5)%6;else if(e.key==='Home')next=0;else if(e.key==='End')next=5;else return;e.preventDefault();setStage(next,true);});});
 $('referenceList').innerHTML=NOTEBOOK_CONTENT.references.map(r=>`<li>${r.authors} (${r.year}). <em>${r.title}</em>. ${r.venue}. <a href="https://doi.org/${r.doi}" target="_blank" rel="noopener noreferrer">DOI ↗</a></li>`).join('');
 renderStage();
 try{localStorage.setItem('psi-language',lang);const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}catch{}
}
const musicToggle=$('musicToggle'),musicPanel=$('musicPanel'),neteasePlayer=$('neteasePlayer');
function setMusicPanel(open){
 musicPanel.hidden=!open;musicToggle.setAttribute('aria-expanded',String(open));musicToggle.setAttribute('aria-pressed',String(open));
 musicToggle.setAttribute('aria-label',open?T('关闭网易云播放器','Close NetEase player'):T('打开网易云背景音乐','Open NetEase background music'));
 if(open&&!neteasePlayer.src)neteasePlayer.src='https://music.163.com/outchain/player?type=0&id=8489059263&auto=0&height=430';
 if(!open)neteasePlayer.removeAttribute('src');
}
musicToggle.addEventListener('click',()=>setMusicPanel(musicPanel.hidden));
$('musicClose').addEventListener('click',()=>setMusicPanel(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!musicPanel.hidden)setMusicPanel(false);});
$('autoPlay').addEventListener('change',e=>{autoPlay=e.target.checked;if(!autoPlay){stop();paint();}});
$('play').addEventListener('click',()=>{
 if(playing){stop();if(stage===2){const c=afCandidate();states[2].v=c.v;states[2].h=c.h;}paint();return;}
 if(stage===2&&!searchMode){searchMode=true;progress=0;}else if(progress>=1)progress=0;
 startPlayback();
});
$('timeline').addEventListener('input',e=>{stop();progress=+e.target.value/1000;if(stage===2){searchMode=true;const c=afCandidate();states[2].v=c.v;states[2].h=c.h;}paint();});
$('speed').addEventListener('change',e=>{speed=+e.target.value;});
$('reset').addEventListener('click',()=>{states[stage]={...defaults[stage]};setStage(stage);});
$('resample').addEventListener('click',()=>{const old=seeds[stage],next=P.randomSeed();seeds[stage]=next===old?(old+1)>>>0:next;stop();progress=1;searchMode=false;recompute();buildControls();paint();});
$('language').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';setLanguage();});
$('previous').addEventListener('click',()=>{setStage(stage-1,true);$('lab').scrollIntoView({behavior:reduced?'instant':'smooth'});});
$('next').addEventListener('click',()=>{setStage(stage+1,true);$('lab').scrollIntoView({behavior:reduced?'instant':'smooth'});});
$('download').addEventListener('click',()=>{
 const algorithms=['phase-wrapping','amplitude-dispersion','ambiguity-function-grid','relative-network-least-squares','zero-mean-simple-kriging','linear-seasonal-least-squares'];
 const payload={project:'PSI-SimLab',schemaVersion:4,language:lang,experiment:stage+1,algorithm:algorithms[stage],synthetic:true,seed:[1,2,4,5].includes(stage)?seeds[stage]:null,parameters:states[stage],constants:{wavelength_m:.056,range_m:800000,incidence_deg:35},scope:scopes[stage][lang==='zh'?0:1],playbackProgress:progress,currentView,results:data};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`psi-experiment-${String(stage+1).padStart(2,'0')}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
let labVisible=true;
new IntersectionObserver(entries=>{labVisible=entries[0].isIntersecting;if(!labVisible)lastTime=0;}).observe($('charts'));
new ResizeObserver(()=>{if(data)paint();}).observe($('charts'));
document.addEventListener('visibilitychange',()=>{lastTime=0;});
try{const requested=Number(new URLSearchParams(location.search).get('stage'));if(Number.isInteger(requested)&&requested>=1&&requested<=6)stage=requested-1;}catch{}
recompute();setLanguage();$('chapterSelect').addEventListener('change',e=>setStage(+e.target.value,true));$('autoPlay').checked=autoPlay;if(autoPlay){progress=0;searchMode=stage===2;startPlayback();}
