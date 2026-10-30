/* Bilingual study notes with native MathML equations. */
const NOTEBOOK_CONTENT = {
  "zh": {
    "ui": {
      "title": "PSI-SimLab",
      "navLab": "笔记与算例",
      "navTheory": "数学推导",
      "navRefs": "参考文献",
      "heroTitle": "PSI-SimLab",
      "heroSub": "PS-InSAR 学习笔记",
      "heroText": "相位观测、散射体筛选、参数估计与误差改正。",
      "enter": "阅读笔记 ↗",
      "read": "查看当前推导 ↓",
      "labTitle": "笔记与算例",
      "tabs": [
        "相位观测",
        "候选点筛选",
        "模糊度函数",
        "网络平差",
        "大气预测",
        "模型检验"
      ],
      "mathLabel": "笔记",
      "derive": "推导",
      "interpret": "说明",
      "scope": "算例设置",
      "related": "参考",
      "play": "播放",
      "pause": "暂停",
      "resume": "继续",
      "replay": "重播",
      "reset": "重置",
      "export": "导出数据 ↓",
      "ready": "计算完成",
      "paused": "已暂停",
      "running": "演示中",
      "timeline": "演示进度",
      "speed": "播放速度",
      "previous": "上一组",
      "next": "下一组",
      "step": "步骤",
      "refsTitle": "参考文献",
      "footer": "PS-InSAR 学习笔记",
      "synthetic": "合成数据 / 本地计算",
      "heroCaption": "合成形变场示意",
      "language": "切换至英文",
      "graph": "实验计算图",
      "metricLabels": [
        "整周对应位移",
        "第 3 年位移",
        "候选点数",
        "保留比例",
        "估计速度",
        "残余高程",
        "最大 γ",
        "速度误差",
        "点速度 RMSE",
        "原始回路闭合差",
        "剔除后回路",
        "已断开",
        "改正前 RMSE",
        "改正后 RMSE",
        "估计速度",
        "残差 RMS"
      ],
      "controls": [
        "视线向速度",
        "振幅离散度阈值",
        "相位噪声标准差",
        "异常弧偏差",
        "剔除已知异常弧",
        "相关长度 ℓ",
        "真实季节幅度",
        "拟合模型",
        "常数 + 线性（2 参数）",
        "常数 + 线性 + 年周期（4 参数）"
      ],
      "stages": [
        [
          "连续位移",
          "相位转换",
          "主值映射"
        ],
        [
          "振幅时序",
          "离散度计算",
          "门限筛选"
        ],
        [
          "参数网格",
          "相干性评估",
          "最大值定位"
        ],
        [
          "网络连接",
          "弧偏差",
          "基准约束平差"
        ],
        [
          "残差采样",
          "空间预测",
          "相位改正"
        ],
        [
          "设计矩阵",
          "时序拟合",
          "残差诊断"
        ]
      ],
      "notation": "记号",
      "resample": "重新随机",
      "dataPolicy": "换一组样本；参数保持不变"
    },
    "chapters": [
      {
        "title": "相位与视线向位移",
        "lead": "干涉相位由两期复数雷达观测的相位差得到，保留在一个周期内。位移相差半个波长时对应相同主值，整周数不能由单个主值确定。",
        "description": "以下约定朝向卫星的位移为正，记为 d；λ 为波长，W 表示将相位映射到 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo stretchy=\"true\">[</mo><mrow><mrow><mo>−</mo><mi>π</mi></mrow><mo>,</mo><mi>π</mi></mrow><mo stretchy=\"true\">)</mo></mrow></math></span>。去除参考地形后，相位仍包含形变、残余地形、大气和噪声等分量。",
        "steps": [
          "雷达信号往返传播，距离 R 对应的传播路径是 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mn>2</mn><mi>R</mi></mrow></math></span>。采用 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>ψ</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mn>4</mn><mi>π</mi><mi>R</mi></mrow><mi>λ</mi></mfrac></mrow></math></span> 的相位约定，两期观测之差为 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mo>Δ</mo><mi>ψ</mi></mrow><mo>=</mo><mfrac><mrow><mo>−</mo><mn>4</mn><mi>π</mi><mo>Δ</mo><mi>R</mi></mrow><mi>λ</mi></mfrac></mrow></math></span>。令 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>d</mi><mo>=</mo><mrow><mo>−</mo><mo>Δ</mo><mi>R</mi></mrow></mrow></math></span>，便得到形变相位 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>φ</mi><mi mathvariant=\"normal\">def</mi></msub><mo>=</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi></mrow><mi>λ</mi></mfrac><mi>d</mi></mrow></mrow></math></span>。",
          "本节干涉观测写成 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>φ</mi><mo>=</mo><mrow><mi mathvariant=\"normal\">W</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><msub><mi>φ</mi><mi mathvariant=\"normal\">def</mi></msub><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span>。反算位移时必须补回整数周：<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>d</mi><mo>=</mo><mfrac><mrow><mi>λ</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>φ</mi><mo>+</mo><mn>2</mn><mi>π</mi><mi>k</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mrow><mn>4</mn><mi>π</mi></mrow></mfrac></mrow></math></span>。当 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>λ</mi><mo>=</mo><mrow><mn>56</mn><mspace width=\".2em\"></mspace><mi mathvariant=\"normal\">mm</mi></mrow></mrow></math></span> 时，相差 28 mm 的位移会得到同样的主值相位；未知整数 k 需要结合其他观测或约束确定。"
        ],
        "interpretation": "速度增大后，连续相位更频繁地越过 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo>±</mo><mi>π</mi></mrow></math></span>。下图中的跳变来自主值映射，位移本身没有在这些时刻突变。两幅图共用时间游标，可以逐点对照。",
        "scope": "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mi>d</mi><mrow><mo stretchy=\"true\">(</mo><mi>t</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi>v</mi><mi>t</mi></mrow></mrow></math></span>，<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>λ</mi><mo>=</mo><mrow><mn>56</mn><mspace width=\".2em\"></mspace><mi mathvariant=\"normal\">mm</mi></mrow></mrow></math></span>。暂不加入高程、大气和噪声，单独观察相位缠绕。",
        "refs": [
          1,
          6
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mi>φ</mi><mo>=</mo><mrow><mi mathvariant=\"normal\">W</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi></mrow><mi>λ</mi></mfrac><mi>d</mi><mo>+</mo><msub><mi>φ</mi><mi mathvariant=\"normal\">topo</mi></msub><mo>+</mo><msub><mi>φ</mi><mi mathvariant=\"normal\">APS</mi></msub><mo>+</mo><mi>ε</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></div><span class=\"eqno\">(1)</span>"
        ],
        "noteTitle": "相位跳变",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>λ</mi></math></span>",
            "雷达波长"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>d</mi></math></span>",
            "视线向位移"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>k</mi></math></span>",
            "整周模糊度"
          ]
        ]
      },
      {
        "title": "振幅离散度选点",
        "lead": "振幅在时间上变化较小的像元，可以先作为候选点。常用指标是振幅标准差与均值的比值 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>D</mi><mi>A</mi></msub></math></span>。",
        "description": "对同一像元的 N 期振幅 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>A</mi><mi>i</mi></msub></math></span>，先求均值 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>μ</mi><mi>A</mi></msub></math></span> 和标准差 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>σ</mi><mi>A</mi></msub></math></span>，再计算相对波动幅度。 算例采用固定复散射体叠加圆对称复高斯噪声，振幅为复数回波的模，而不是将实高斯振幅截断为正值。",
        "steps": [
          "均值为 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mi>μ</mi><mi>A</mi></msub><mo>=</mo><mrow><mfrac><mn>1</mn><mi>N</mi></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><msub><mi>A</mi><mi>i</mi></msub></mrow></mrow></mrow></math></span>，标准差取 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mi>σ</mi><mi>A</mi></msub><mo>=</mo><msqrt><mrow><mfrac><mn>1</mn><mi>N</mi></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><msup><mrow><mo stretchy=\"true\">(</mo><mrow><msub><mi>A</mi><mi>i</mi></msub><mo>−</mo><msub><mi>μ</mi><mi>A</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow><mn>2</mn></msup></mrow></mrow></msqrt></mrow></math></span>。这里使用总体标准差，分母为 N。",
          "生成模型为 zᵢ = 1 + nᵣ,ᵢ + j nᵢ,ᵢ，两噪声分量独立且均服从 N(0, s²)，Aᵢ = |zᵢ|。复平面中的蓝色向量为回波，橙色向量为噪声，绿色点为固定散射体；未加入形变或时间相关噪声。",
          "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>D</mi><mi>A</mi></msub><mo>=</mo><mfrac><msub><mi>σ</mi><mi>A</mi></msub><msub><mi>μ</mi><mi>A</mi></msub></mfrac></mrow></math></span> 消除了平均振幅量级的影响。在强散射体占优、信噪比较高时，小扰动近似给出 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>σ</mi><mi>φ</mi></msub><mo>≈</mo><msub><mi>D</mi><mi>A</mi></msub></mrow></math></span>，因此可以用较低的 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>D</mi><mi>A</mi></msub></math></span> 初筛候选点。",
          "这个近似有条件限制。振幅稳定不保证相位稳定；部分相位稳定的像元也可能因振幅波动而被漏选。候选集仍需经过相位和网络检验。"
        ],
        "interpretation": "点击地图查看任意像元的振幅时序。播放时逐期积累观测，地图、离散度直方图和统计量同步更新；调整门限保留同一组样本。",
        "scope": "180 个像元，每个像元 28 期复数回波；实部、虚部噪声标准差相同。σφ ≈ Dₐ 是强散射体占优时的近似，少量观测的离散度估计可能不稳定。未做振幅定标或空间均衡选点。",
        "refs": [
          1,
          2,
          4,
          5
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msub><mi>D</mi><mi>A</mi></msub><mo>=</mo><mfrac><msub><mi>σ</mi><mi>A</mi></msub><msub><mi>μ</mi><mi>A</mi></msub></mfrac></mrow><mo>,</mo><mspace width=\"1em\"></mspace><mrow><msub><mi>σ</mi><mi>φ</mi></msub><mo>≈</mo><msub><mi>D</mi><mi>A</mi></msub></mrow></mrow></math></div><span class=\"eqno\">(2)</span>"
        ],
        "noteTitle": "阈值与点数",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>A</mi><mi>i</mi></msub></math></span>",
            "第 i 期振幅"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>D</mi><mi>A</mi></msub></math></span>",
            "振幅离散度"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>τ</mi></math></span>",
            "筛选门限"
          ]
        ]
      },
      {
        "title": "速度与高程残差的联合搜索",
        "lead": "缠绕相位不能直接代入普通线性回归。模糊度函数将残差写成单位相量，搜索使这些相量最集中的参数。",
        "description": "设 v 为线性速度，h 为高程残差，<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>t</mi><mi>i</mi></msub></math></span> 和 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>B</mi><mrow><mo>⊥</mo><mo>,</mo><mi>i</mi></mrow></msub></math></span> 分别为时间基线与垂直基线。按下面的几何约定，形变项与高程项相加得到试探相位。",
        "steps": [
          "对一组试探参数 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></math></span>，计算 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub><mo>=</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi><mi>v</mi><msub><mi>t</mi><mi>i</mi></msub></mrow><mi>λ</mi></mfrac><mo>+</mo><mfrac><mrow><mn>4</mn><mi>π</mi><msub><mi>B</mi><mrow><mo>⊥</mo><mo>,</mo><mi>i</mi></mrow></msub><mi>h</mi></mrow><mrow><mi>λ</mi><mi>R</mi><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mi>θ</mi><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mfrac></mrow></mrow></math></span>。界面的速度单位为 mm/yr，代入公式前换算为 m/yr。<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>B</mi><mo>⊥</mo></msub></math></span> 正向定义为与正高程残差产生正相位的方向。",
          "计算每期残差的单位相量 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mrow><mo stretchy=\"true\">(</mo><mrow><msub><mi>φ</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></math></span>。由于 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>φ</mi><mo>+</mo><mn>2</mn><mi>π</mi><mi>k</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mi>φ</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span>，加减整周不影响相量，因而可以直接使用缠绕观测。",
          "对这些相量求平均，再取模得到 γ。模型接近观测时，残差相量较集中，γ 较大。遍历速度—高程网格，取 γ 最大的网格点作为估计。",
          "γ 是平均残差相量的模，对所有残差加上相同常相位不敏感。因此 γ 高表示残差集中，而不要求它们都接近零；相量平均方向反映这个常相位。相同观测期在两图中联动标出。",
          "较高的 γ 仍不能证明解唯一。搜索范围、网格步长、时间采样和模型遗漏都可能影响结果。此处采用 AF 网格搜索，不包含整数最小二乘求解。"
        ],
        "interpretation": "点击热图手动试探参数；播放时蓝圈表示当前候选、橙框表示已搜索最优，绿色十字表示合成真值。相量图始终对应当前试探，搜索结束后显示最优候选。",
        "scope": "28 期观测。<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>v</mi><mo>∈</mo><mrow><mo stretchy=\"true\">[</mo><mrow><mn>−20</mn><mo>,</mo><mn>20</mn></mrow><mo stretchy=\"true\">]</mo></mrow></mrow></math></span> mm/yr，<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>h</mi><mo>∈</mo><mrow><mo stretchy=\"true\">[</mo><mrow><mn>−30</mn><mo>,</mo><mn>30</mn></mrow><mo stretchy=\"true\">]</mo></mrow></mrow></math></span> m，步长均为 1。真值为 −8 mm/yr、12 m；R = 800 km，θ = 35°，λ = 0.056 m。",
        "refs": [
          1,
          2,
          3
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi></mrow><mi>λ</mi></mfrac><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><msub><mi>t</mi><mi>i</mi></msub><mo>+</mo><mfrac><mrow><msub><mi>B</mi><mrow><mo>⊥</mo><mo>,</mo><mi>i</mi></mrow></msub><mi>h</mi></mrow><mrow><mi>R</mi><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mi>θ</mi><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mfrac></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></div><span class=\"eqno\">(3)</span>",
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mtable columnalign=\"left\" rowspacing=\"0.85em\"><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mrow><mi>γ</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mo stretchy=\"true\">|</mo><mrow><mfrac><mn>1</mn><mi>N</mi></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mrow><mo stretchy=\"true\">[</mo><mrow><msub><mi>φ</mi><mi>i</mi></msub><mo>−</mo><mrow><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow><mo stretchy=\"true\">]</mo></mrow></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mrow><mo stretchy=\"true\">|</mo></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mrow><mo stretchy=\"true\">(</mo><mrow><mover accent=\"true\"><mi>v</mi><mo stretchy=\"true\">^</mo></mover><mo>,</mo><mover accent=\"true\"><mi>h</mi><mo stretchy=\"true\">^</mo></mover></mrow><mo stretchy=\"true\">)</mo></mrow><mo>=</mo><mrow><munder><mi mathvariant=\"normal\">arg max</mi><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow></munder><mrow><mi>γ</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mrow></mstyle></mtd></mtr></mtable></math></div><span class=\"eqno\">(4)</span>"
        ],
        "noteTitle": "搜索过程",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>v</mi></math></span>",
            "线性速度"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>h</mi></math></span>",
            "高程残差"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>γ</mi></math></span>",
            "残差相干性"
          ]
        ]
      },
      {
        "title": "由弧差值求点速度",
        "lead": "相邻点之间可以估计相对速度。把各条弧的差值放入同一个网络，并固定参考点，即可求出点速度。",
        "description": "有向弧 i→j 的观测写成 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi mathvariant=\"bold\">b</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mrow><msub><mi>v</mi><mi>j</mi></msub><mo>−</mo><msub><mi>v</mi><mi>i</mi></msub><mo>+</mo><msub><mi>e</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></mrow></mrow></math></span>。关联矩阵 G 在起点列取 −1，在终点列取 +1，P 为观测权矩阵。 式 (5) 中 Gᵣ 表示删除参考点列后的关联矩阵，vᵣ 仅包含其余点的未知速度；观测网络连通且权阵正定时才可使用其中的逆矩阵。",
        "steps": [
          "最小化 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mi>J</mi><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">v</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><msup><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">b</mi><mo>−</mo><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"bold\">v</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">b</mi><mo>−</mo><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"bold\">v</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span>，得到正规方程 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msup><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mi mathvariant=\"bold\">G</mi><mover accent=\"true\"><mi mathvariant=\"bold\">v</mi><mo stretchy=\"true\">^</mo></mover></mrow><mo>=</mo><mrow><msup><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mi mathvariant=\"bold\">b</mi></mrow></mrow></math></span>。若给所有点速度加上同一个常数，弧差值不会改变，因此必须先确定基准。默认固定 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>v</mi><mn>0</mn></msub><mo>=</mo><mn>0</mn></mrow></math></span>。 可以切换参考点，将所选参考点速度固定为零；相应真值也转换到同一基准。",
          "无误差的闭合回路满足 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><msub><mi>b</mi><mn>12</mn></msub><mo>+</mo><msub><mi>b</mi><mn>26</mn></msub><mo>−</mo><msub><mi>b</mi><mn>16</mn></msub></mrow><mo>=</mo><mn>0</mn></mrow></math></span>。对弧 2→6 加入偏差后，回路不再闭合，平差会将这份不一致分配到网络中的相关参数。剔除该弧后重新求解，可以比较偏差的传播范围。 此处描述默认偏差弧；图上可选择其他弧。播放是在不同偏差幅度下重复求解，每帧都是一次完整平差，不代表误差在网络中的物理传播时间。"
        ],
        "interpretation": "点旁标注的是估计速度，RMSE 按七个点的合成真值计算。含偏差弧的位置在这里已知，勾选剔除只是比较其影响，不涉及自动异常定位。",
        "scope": "等权平差，参考点速度为零。处理的是连续速度参数，不是整数周模糊度。",
        "refs": [
          1,
          6
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mtable columnalign=\"left\" rowspacing=\"0.85em\"><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mi mathvariant=\"bold\">b</mi><mo>=</mo><mrow><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub><msub><mi mathvariant=\"bold\">v</mi><mi>r</mi></msub><mo>+</mo><mi mathvariant=\"bold\">e</mi></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mover accent=\"true\"><msub><mi mathvariant=\"bold\">v</mi><mi>r</mi></msub><mo stretchy=\"true\">^</mo></mover><mo>=</mo><mrow><msup><mrow><mo stretchy=\"true\">(</mo><mrow><msup><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow><mn>−1</mn></msup><msup><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mi mathvariant=\"bold\">b</mi></mrow></mrow></mstyle></mtd></mtr></mtable></math></div><span class=\"eqno\">(5)</span>"
        ],
        "noteTitle": "异常弧的影响",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">G</mi></math></span>",
            "关联矩阵"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">b</mi></math></span>",
            "弧速度差"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">P</mi></math></span>",
            "观测权矩阵"
          ]
        ]
      },
      {
        "title": "大气相位的空间预测",
        "lead": "假定时序处理中已经分离出大气残差，接下来需要把离散点上的残差预测到其他位置。这里使用零均值简单克里金。",
        "description": "记采样残差为 r，信号协方差矩阵为 C，目标位置与各采样点的协方差为 c(x)，采样噪声方差为 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup></math></span>。 预测器假定大气残差的先验均值为零，采样噪声相互独立且与信号独立；不施加权重和为 1 的普通克里金约束。",
        "steps": [
          "取线性预测 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mover accent=\"true\"><mi>a</mi><mo stretchy=\"true\">^</mo></mover><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">x</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><msup><mi mathvariant=\"bold\">w</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">r</mi></mrow></mrow></math></span>，其均方预测误差为 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mi mathvariant=\"bold\">C</mi><mrow><mo stretchy=\"true\">(</mo><mn>0</mn><mo stretchy=\"true\">)</mo></mrow></mrow><mo>−</mo><mn>2</mn><msup><mi mathvariant=\"bold\">w</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">c</mi><mo>+</mo><msup><mi mathvariant=\"bold\">w</mi><mi mathvariant=\"normal\">T</mi></msup><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">C</mi><mo>+</mo><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup><mi mathvariant=\"bold\">I</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mi mathvariant=\"bold\">w</mi></mrow></math></span>。",
          "对权重 w 求导并令其为零，得到 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">C</mi><mo>+</mo><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup><mi mathvariant=\"bold\">I</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mi mathvariant=\"bold\">w</mi></mrow><mo>=</mo><mi mathvariant=\"bold\">c</mi></mrow></math></span>，代回即可得到式中的预测器。协方差采用 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mi mathvariant=\"bold\">C</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mo>−</mo><mfrac><mrow><mo stretchy=\"true\">‖</mo><mrow><msub><mi mathvariant=\"bold\">x</mi><mi>i</mi></msub><mo>−</mo><msub><mi mathvariant=\"bold\">x</mi><mi>j</mi></msub></mrow><mo stretchy=\"true\">‖</mo></mrow><mi>ℓ</mi></mfrac></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span>，相关长度 ℓ 决定相邻点之间的信息传递范围。",
          "从混合相位中减去预测值：<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>φ</mi><mi mathvariant=\"normal\">corr</mi></msub><mo>=</mo><mrow><msub><mi>φ</mi><mi mathvariant=\"normal\">raw</mi></msub><mo>−</mo><mover accent=\"true\"><mi>a</mi><mo stretchy=\"true\">^</mo></mover></mrow></mrow></math></span>。由于形变真值在合成数据中已知，可以分别计算改正前后的网格 RMSE。实际数据中通常没有这样的全场真值。",
          "本例空间距离按 [0, 1] × [0, 1] 的归一化坐标计算，图中两轴等比例。预测协方差是建模假设；用于比较的解析大气场并不是从该协方差模型抽取的实现。中间帧为 φraw − α â（0 ≤ α ≤ 1）的改正比例比较，不表示实际大气逐渐消失。"
        ],
        "interpretation": "四幅图共用 ±2.2 rad 色标。点击位置查看预测权重；圆点大小表示权重绝对值，红色轮廓表示负权重。预测变平滑本身不能证明改正正确，误差图提供相对合成形变真值的对照。",
        "scope": "45 个大气残差样本，40×40 网格；信号方差 1 rad²，噪声标准差 0.12 rad。固定协方差模型，不估计变差函数或未知趋势。 形变真值在本节用等效相位（rad）表示；各图均为连续相位而非缠绕相位。",
        "refs": [
          1,
          3,
          6
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mtable columnalign=\"left\" rowspacing=\"0.85em\"><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mrow><mover accent=\"true\"><mi>a</mi><mo stretchy=\"true\">^</mo></mover><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">x</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><msup><mrow><mi mathvariant=\"bold\">c</mi><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">x</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mi mathvariant=\"normal\">T</mi></msup><msup><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">C</mi><mo>+</mo><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup><mi mathvariant=\"bold\">I</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mn>−1</mn></msup><mi mathvariant=\"bold\">r</mi></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle displaystyle=\"true\"><mrow><msub><mi mathvariant=\"bold\">C</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mo>−</mo><mfrac><mrow><mo stretchy=\"true\">‖</mo><mrow><msub><mi mathvariant=\"bold\">x</mi><mi>i</mi></msub><mo>−</mo><msub><mi mathvariant=\"bold\">x</mi><mi>j</mi></msub></mrow><mo stretchy=\"true\">‖</mo></mrow><mi>ℓ</mi></mfrac></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mstyle></mtd></mtr></mtable></math></div><span class=\"eqno\">(6)</span>"
        ],
        "noteTitle": "相关长度",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">C</mi></math></span>",
            "信号协方差"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>ℓ</mi></math></span>",
            "相关长度"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>σ</mi><mi>n</mi></msub></math></span>",
            "采样噪声标准差"
          ]
        ]
      },
      {
        "title": "线性模型与年周期项",
        "lead": "平均速度可以用直线拟合，但季节性变化会留在残差中。对同一组位移观测加入年周期项，可以检查模型遗漏对速度估计的影响。",
        "description": "线性模型为 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mi>d</mi><mrow><mo stretchy=\"true\">(</mo><mi>t</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi>c</mi><mo>+</mo><mi>v</mi><mi>t</mi></mrow></mrow></math></span>。加入年周期后得到下式，其中 a、b 分别为正弦和余弦系数。",
        "steps": [
          "设计矩阵的每一行分别取 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo stretchy=\"true\">[</mo><mrow><mn>1</mn><mo>,</mo><msub><mi>t</mi><mi>i</mi></msub></mrow><mo stretchy=\"true\">]</mo></mrow></math></span> 或 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mo stretchy=\"true\">[</mo><mrow><mn>1</mn><mo>,</mo><msub><mi>t</mi><mi>i</mi></msub><mo>,</mo><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><msub><mi>t</mi><mi>i</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>,</mo><mrow><mi mathvariant=\"normal\">cos</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><msub><mi>t</mi><mi>i</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow><mo stretchy=\"true\">]</mo></mrow></math></span>。两种模型都可写成 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi mathvariant=\"bold\">d</mi><mo>=</mo><mrow><mi mathvariant=\"bold\">A</mi><mi mathvariant=\"bold\">β</mi><mo>+</mo><mi mathvariant=\"bold\">ε</mi></mrow></mrow></math></span>，通过 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msup><mi mathvariant=\"bold\">A</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">A</mi><mover accent=\"true\"><mi mathvariant=\"bold\">β</mi><mo stretchy=\"true\">^</mo></mover></mrow><mo>=</mo><mrow><msup><mi mathvariant=\"bold\">A</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">d</mi></mrow></mrow></math></span> 求解，速度是 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mover accent=\"true\"><mi mathvariant=\"bold\">β</mi><mo stretchy=\"true\">^</mo></mover></math></span> 的第二项。",
          "残差为 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi mathvariant=\"bold\">e</mi><mo>=</mo><mrow><mi mathvariant=\"bold\">d</mi><mo>−</mo><mi mathvariant=\"bold\">A</mi><mover accent=\"true\"><mi mathvariant=\"bold\">β</mi><mo stretchy=\"true\">^</mo></mover></mrow></mrow></math></span>。下方按时间绘出残差，并报告 <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mi mathvariant=\"normal\">RMS</mi><mo>=</mo><msqrt><mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><msup><msub><mi>e</mi><mi>i</mi></msub><mn>2</mn></msup></mrow><mi>N</mi></mfrac></msqrt></mrow></math></span>。它与采用自由度 <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>N</mi><mo>−</mo><mi>p</mi></mrow></math></span> 的噪声标准差估计不同。",
          "增加参数通常能减小训练残差，因此还要看残差结构和速度偏差。若新增周期项解释了已有的周期结构，模型改进才有相应的物理依据。",
          "时间 t 的单位为年，年周期角频率为 2π rad/yr。播放使用前 12 至 36 期观测分别重新求解，不插值系数；同一帧中的两模型使用相同数据。图轴在本次样本的整个播放过程中固定。"
        ],
        "interpretation": "先保持线性模型，增大真实季节幅度，观察残差中的周期起伏及速度变化。再切换年周期模型，比较同一组观测的拟合结果。",
        "scope": "36 期月度 LOS 位移，真值速度 −8 mm/yr，噪声标准差 1 mm。观测视为已解缠、已改正；LOS 速度不直接等于垂直沉降速度。",
        "refs": [
          1,
          6,
          7
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mi>d</mi><mrow><mo stretchy=\"true\">(</mo><mi>t</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi>c</mi><mo>+</mo><mi>v</mi><mi>t</mi><mo>+</mo><mi>a</mi><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><mi>t</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>+</mo><mi>b</mi><mrow><mi mathvariant=\"normal\">cos</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><mi>t</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>+</mo><mi>ε</mi></mrow></mrow></math></div><span class=\"eqno\">(7)</span>"
        ],
        "noteTitle": "遗漏的周期项",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">A</mi></math></span>",
            "设计矩阵"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">β</mi></math></span>",
            "模型参数"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">e</mi></math></span>",
            "拟合残差"
          ]
        ]
      }
    ]
  },
  "en": {
    "ui": {
      "title": "PSI-SimLab",
      "navLab": "Notes & examples",
      "navTheory": "Derivation",
      "navRefs": "References",
      "heroTitle": "PSI-SimLab",
      "heroSub": "PS-InSAR study notes",
      "heroText": "Phase observations, scatterer selection, parameter estimation and error correction.",
      "enter": "Read the notes ↗",
      "read": "View current derivation ↓",
      "labTitle": "Notes and examples",
      "tabs": [
        "Phase model",
        "PSC selection",
        "Ambiguity function",
        "Network adjustment",
        "APS prediction",
        "Model diagnostics"
      ],
      "mathLabel": "Notes",
      "derive": "Derivation",
      "interpret": "Notes",
      "scope": "Example settings",
      "related": "References",
      "play": "Play",
      "pause": "Pause",
      "resume": "Resume",
      "replay": "Replay",
      "reset": "Reset",
      "export": "Export data ↓",
      "ready": "Complete",
      "paused": "Paused",
      "running": "Playing",
      "timeline": "Playback progress",
      "speed": "Playback speed",
      "previous": "Previous",
      "next": "Next",
      "step": "Step",
      "refsTitle": "References",
      "footer": "PS-InSAR study notes",
      "synthetic": "Synthetic data / Client-side computation",
      "heroCaption": "Synthetic displacement illustration",
      "language": "Switch to Chinese",
      "graph": "Computed experiment visualization",
      "metricLabels": [
        "Displacement per cycle",
        "Displacement at year 3",
        "Candidates retained",
        "Retention rate",
        "Estimated velocity",
        "Residual height",
        "Maximum γ",
        "Velocity error",
        "Point velocity RMSE",
        "Original loop closure",
        "Loop after exclusion",
        "Open loop",
        "RMSE before",
        "RMSE after",
        "Estimated velocity",
        "Residual RMS"
      ],
      "controls": [
        "LOS velocity",
        "Amplitude-dispersion threshold",
        "Phase-noise standard deviation",
        "Biased-arc offset",
        "Exclude known biased arc",
        "Correlation length ℓ",
        "True seasonal amplitude",
        "Fitted model",
        "Intercept + linear (2 parameters)",
        "Intercept + linear + annual (4 parameters)"
      ],
      "stages": [
        [
          "Linear displacement",
          "Phase conversion",
          "Principal-value mapping"
        ],
        [
          "Amplitude series",
          "Dispersion statistic",
          "Threshold selection"
        ],
        [
          "Parameter grid",
          "Coherence evaluation",
          "Maximum selection"
        ],
        [
          "Network connections",
          "Arc bias",
          "Datum-constrained adjustment"
        ],
        [
          "Residual samples",
          "Spatial prediction",
          "Phase correction"
        ],
        [
          "Design matrix",
          "Time-series fit",
          "Residual diagnostics"
        ]
      ],
      "notation": "Notation",
      "resample": "New sample",
      "dataPolicy": "Generate a new sample without changing the parameters"
    },
    "chapters": [
      {
        "title": "Phase and line-of-sight displacement",
        "lead": "Interferometric phase is the phase difference between two complex radar observations, represented within one cycle. Displacements separated by half a wavelength have the same principal value; a single principal value does not determine the integer cycle count.",
        "description": "Displacement d is positive toward the satellite. The wavelength is λ, and W maps phase to <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo stretchy=\"true\">[</mo><mrow><mrow><mo>−</mo><mi>π</mi></mrow><mo>,</mo><mi>π</mi></mrow><mo stretchy=\"true\">)</mo></mrow></math></span>. After reference topography is removed, deformation, residual height, atmosphere and noise can still contribute to the observation.",
        "steps": [
          "The signal travels a round-trip path of <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mn>2</mn><mi>R</mi></mrow></math></span>. Using <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>ψ</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mn>4</mn><mi>π</mi><mi>R</mi></mrow><mi>λ</mi></mfrac></mrow></math></span>, the difference between two acquisitions is <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mo>Δ</mo><mi>ψ</mi></mrow><mo>=</mo><mfrac><mrow><mo>−</mo><mn>4</mn><mi>π</mi><mo>Δ</mo><mi>R</mi></mrow><mi>λ</mi></mfrac></mrow></math></span>. Defining <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>d</mi><mo>=</mo><mrow><mo>−</mo><mo>Δ</mo><mi>R</mi></mrow></mrow></math></span> gives <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>φ</mi><mi mathvariant=\"normal\">def</mi></msub><mo>=</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi></mrow><mi>λ</mi></mfrac><mi>d</mi></mrow></mrow></math></span>.",
          "The recorded value is <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>φ</mi><mo>=</mo><mrow><mi mathvariant=\"normal\">W</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><msub><mi>φ</mi><mi mathvariant=\"normal\">def</mi></msub><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span>. Recovering displacement requires an integer: <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>d</mi><mo>=</mo><mfrac><mrow><mi>λ</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>φ</mi><mo>+</mo><mn>2</mn><mi>π</mi><mi>k</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mrow><mn>4</mn><mi>π</mi></mrow></mfrac></mrow></math></span>. At <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>λ</mi><mo>=</mo><mrow><mn>56</mn><mspace width=\".2em\"></mspace><mi mathvariant=\"normal\">mm</mi></mrow></mrow></math></span>, displacements separated by 28 mm have the same principal-value phase. Other observations or constraints are needed to determine k."
        ],
        "interpretation": "Higher velocity makes continuous phase cross <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo>±</mo><mi>π</mi></mrow></math></span> more often. The jumps in the lower plot come from wrapping; displacement does not jump at those times. A shared cursor lets you compare individual observations.",
        "scope": "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mi>d</mi><mrow><mo stretchy=\"true\">(</mo><mi>t</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi>v</mi><mi>t</mi></mrow></mrow></math></span> and <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>λ</mi><mo>=</mo><mrow><mn>56</mn><mspace width=\".2em\"></mspace><mi mathvariant=\"normal\">mm</mi></mrow></mrow></math></span>. Height error, atmosphere and noise are omitted to isolate phase wrapping.",
        "refs": [
          1,
          6
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mi>φ</mi><mo>=</mo><mrow><mi mathvariant=\"normal\">W</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi></mrow><mi>λ</mi></mfrac><mi>d</mi><mo>+</mo><msub><mi>φ</mi><mi mathvariant=\"normal\">topo</mi></msub><mo>+</mo><msub><mi>φ</mi><mi mathvariant=\"normal\">APS</mi></msub><mo>+</mo><mi>ε</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></div><span class=\"eqno\">(1)</span>"
        ],
        "noteTitle": "Wrap discontinuities",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>λ</mi></math></span>",
            "Radar wavelength"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>d</mi></math></span>",
            "LOS displacement"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>k</mi></math></span>",
            "Integer-cycle ambiguity"
          ]
        ]
      },
      {
        "title": "Selection by amplitude dispersion",
        "lead": "Pixels with relatively stable amplitudes can be retained as candidates. A common screening statistic is <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>D</mi><mi>A</mi></msub></math></span>, the ratio of amplitude standard deviation to its mean.",
        "description": "For N amplitude samples <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>A</mi><mi>i</mi></msub></math></span> from one pixel, first calculate the mean <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>μ</mi><mi>A</mi></msub></math></span> and standard deviation <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>σ</mi><mi>A</mi></msub></math></span>, then normalize the variation. The example adds circular complex Gaussian noise to a fixed complex scatterer and uses the echo modulus as amplitude, rather than clipping real Gaussian amplitudes.",
        "steps": [
          "Use <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mi>μ</mi><mi>A</mi></msub><mo>=</mo><mrow><mfrac><mn>1</mn><mi>N</mi></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><msub><mi>A</mi><mi>i</mi></msub></mrow></mrow></mrow></math></span> and <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mi>σ</mi><mi>A</mi></msub><mo>=</mo><msqrt><mrow><mfrac><mn>1</mn><mi>N</mi></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><msup><mrow><mo stretchy=\"true\">(</mo><mrow><msub><mi>A</mi><mi>i</mi></msub><mo>−</mo><msub><mi>μ</mi><mi>A</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow><mn>2</mn></msup></mrow></mrow></msqrt></mrow></math></span>. The denominator is N: this is the population standard deviation.",
          "The generating model is zᵢ = 1 + nᵣ,ᵢ + j nᵢ,ᵢ with independent N(0, s²) components and Aᵢ = |zᵢ|. Blue vectors show echoes, orange vectors show noise, and the green point is the fixed scatterer. No deformation or temporal noise correlation is included.",
          "The ratio <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>D</mi><mi>A</mi></msub><mo>=</mo><mfrac><msub><mi>σ</mi><mi>A</mi></msub><msub><mi>μ</mi><mi>A</mi></msub></mfrac></mrow></math></span> removes the mean amplitude scale. With a dominant strong scatterer and high SNR, a small-perturbation approximation gives <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>σ</mi><mi>φ</mi></msub><mo>≈</mo><msub><mi>D</mi><mi>A</mi></msub></mrow></math></span>, providing a basis for screening.",
          "The approximation has limits. Stable amplitude does not guarantee stable phase, and some phase-stable pixels can be rejected because their amplitudes vary. Phase and network checks are still needed."
        ],
        "interpretation": "Select any pixel to inspect its amplitude series. Playback accumulates acquisitions and updates the map, dispersion histogram and statistics. Threshold changes retain the same sample.",
        "scope": "180 pixels with 28 complex echoes each; equal real and imaginary noise standard deviations. The relation σφ ≈ Dₐ assumes a dominant scatterer; short sequences can give unstable dispersion estimates. No amplitude calibration or spatially balanced selection.",
        "refs": [
          1,
          2,
          4,
          5
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msub><mi>D</mi><mi>A</mi></msub><mo>=</mo><mfrac><msub><mi>σ</mi><mi>A</mi></msub><msub><mi>μ</mi><mi>A</mi></msub></mfrac></mrow><mo>,</mo><mspace width=\"1em\"></mspace><mrow><msub><mi>σ</mi><mi>φ</mi></msub><mo>≈</mo><msub><mi>D</mi><mi>A</mi></msub></mrow></mrow></math></div><span class=\"eqno\">(2)</span>"
        ],
        "noteTitle": "Threshold and candidate count",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>A</mi><mi>i</mi></msub></math></span>",
            "Amplitude at epoch i"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>D</mi><mi>A</mi></msub></math></span>",
            "Amplitude dispersion"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>τ</mi></math></span>",
            "Selection threshold"
          ]
        ]
      },
      {
        "title": "Joint search for velocity and residual height",
        "lead": "Wrapped phase cannot be used directly in ordinary linear regression. The ambiguity function represents residuals as unit phasors and searches for the parameters that concentrate them.",
        "description": "Let v be linear velocity, h residual height, <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>t</mi><mi>i</mi></msub></math></span> temporal baseline and <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>B</mi><mrow><mo>⊥</mo><mo>,</mo><mi>i</mi></mrow></msub></math></span> perpendicular baseline. Under the geometry convention below, deformation and height contributions add to form the trial phase.",
        "steps": [
          "For each trial pair <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></math></span>, calculate <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub><mo>=</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi><mi>v</mi><msub><mi>t</mi><mi>i</mi></msub></mrow><mi>λ</mi></mfrac><mo>+</mo><mfrac><mrow><mn>4</mn><mi>π</mi><msub><mi>B</mi><mrow><mo>⊥</mo><mo>,</mo><mi>i</mi></mrow></msub><mi>h</mi></mrow><mrow><mi>λ</mi><mi>R</mi><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mi>θ</mi><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mfrac></mrow></mrow></math></span>. Convert the displayed velocity from mm/yr to m/yr before substitution. Positive <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>B</mi><mo>⊥</mo></msub></math></span> is defined to give positive phase for positive residual height.",
          "Compute <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mrow><mo stretchy=\"true\">(</mo><mrow><msub><mi>φ</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></math></span> for each acquisition. Since <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>φ</mi><mo>+</mo><mn>2</mn><mi>π</mi><mi>k</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mi>φ</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span>, whole-cycle offsets do not change a phasor, allowing the use of wrapped observations.",
          "Average the phasors and take the magnitude γ. Residuals tend to concentrate when the trial model agrees with the observations. Search the velocity–height grid and retain the candidate with the largest γ.",
          "The magnitude γ is invariant to a common residual phase offset. High coherence means concentration, not necessarily residuals near zero; the mean phasor direction expresses that offset. A selected acquisition is highlighted in both views.",
          "A high γ does not establish uniqueness. Bounds, grid spacing, acquisition times and omitted signals can affect the result. This is an AF grid search, without an integer least-squares solver."
        ],
        "interpretation": "Select a heatmap cell to explore a trial. During search, the blue circle is the trial, the orange square is the running optimum, and the green cross is synthetic truth. Phasors follow the trial; the final view shows the optimum.",
        "scope": "28 observations. <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>v</mi><mo>∈</mo><mrow><mo stretchy=\"true\">[</mo><mrow><mn>−20</mn><mo>,</mo><mn>20</mn></mrow><mo stretchy=\"true\">]</mo></mrow></mrow></math></span> mm/yr and <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>h</mi><mo>∈</mo><mrow><mo stretchy=\"true\">[</mo><mrow><mn>−30</mn><mo>,</mo><mn>30</mn></mrow><mo stretchy=\"true\">]</mo></mrow></mrow></math></span> m, both at unit spacing. Truth: −8 mm/yr and 12 m. R = 800 km, θ = 35°, λ = 0.056 m.",
        "refs": [
          1,
          2,
          3
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mfrac><mrow><mn>4</mn><mi>π</mi></mrow><mi>λ</mi></mfrac><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><msub><mi>t</mi><mi>i</mi></msub><mo>+</mo><mfrac><mrow><msub><mi>B</mi><mrow><mo>⊥</mo><mo>,</mo><mi>i</mi></mrow></msub><mi>h</mi></mrow><mrow><mi>R</mi><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mi>θ</mi><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mfrac></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></div><span class=\"eqno\">(3)</span>",
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mtable columnalign=\"left\" rowspacing=\"0.85em\"><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mrow><mi>γ</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mo stretchy=\"true\">|</mo><mrow><mfrac><mn>1</mn><mi>N</mi></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mi>j</mi><mrow><mo stretchy=\"true\">[</mo><mrow><msub><mi>φ</mi><mi>i</mi></msub><mo>−</mo><mrow><msub><mover accent=\"true\"><mi>φ</mi><mo stretchy=\"true\">^</mo></mover><mi>i</mi></msub><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow><mo stretchy=\"true\">]</mo></mrow></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mrow><mo stretchy=\"true\">|</mo></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mrow><mo stretchy=\"true\">(</mo><mrow><mover accent=\"true\"><mi>v</mi><mo stretchy=\"true\">^</mo></mover><mo>,</mo><mover accent=\"true\"><mi>h</mi><mo stretchy=\"true\">^</mo></mover></mrow><mo stretchy=\"true\">)</mo></mrow><mo>=</mo><mrow><munder><mi mathvariant=\"normal\">arg max</mi><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow></munder><mrow><mi>γ</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi>v</mi><mo>,</mo><mi>h</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mrow></mstyle></mtd></mtr></mtable></math></div><span class=\"eqno\">(4)</span>"
        ],
        "noteTitle": "Reading the search",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>v</mi></math></span>",
            "Linear velocity"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>h</mi></math></span>",
            "Residual height"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>γ</mi></math></span>",
            "Residual coherence"
          ]
        ]
      },
      {
        "title": "Point velocities from arc differences",
        "lead": "Neighboring points provide relative velocity estimates. Combining arc differences in a network and fixing a reference point gives point velocities.",
        "description": "For directed arc i→j, write <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi mathvariant=\"bold\">b</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mrow><msub><mi>v</mi><mi>j</mi></msub><mo>−</mo><msub><mi>v</mi><mi>i</mi></msub><mo>+</mo><msub><mi>e</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></mrow></mrow></math></span>. The incidence matrix G has −1 at the starting point and +1 at the endpoint; P contains observation weights. In equation (5), Gᵣ is the incidence matrix with the reference column removed and vᵣ contains only the remaining unknown velocities. The inverse requires a connected network and positive-definite observation weights.",
        "steps": [
          "Minimizing <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mi>J</mi><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">v</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><msup><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">b</mi><mo>−</mo><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"bold\">v</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">b</mi><mo>−</mo><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"bold\">v</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span> gives <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msup><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mi mathvariant=\"bold\">G</mi><mover accent=\"true\"><mi mathvariant=\"bold\">v</mi><mo stretchy=\"true\">^</mo></mover></mrow><mo>=</mo><mrow><msup><mi mathvariant=\"bold\">G</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mi mathvariant=\"bold\">b</mi></mrow></mrow></math></span>. Adding the same constant to every point velocity leaves all arc differences unchanged, so a datum must be fixed. By default, <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>v</mi><mn>0</mn></msub><mo>=</mo><mn>0</mn></mrow></math></span>. A different reference can be selected; both estimates and truth are expressed relative to that point.",
          "An error-free loop satisfies <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><msub><mi>b</mi><mn>12</mn></msub><mo>+</mo><msub><mi>b</mi><mn>26</mn></msub><mo>−</mo><msub><mi>b</mi><mn>16</mn></msub></mrow><mo>=</mo><mn>0</mn></mrow></math></span>. Biasing arc 2→6 breaks this closure, and adjustment distributes the inconsistency across related parameters. Exclude the arc and solve again to compare its effect. This describes the default biased arc; other arcs can be selected. Each playback frame is a complete adjustment at a different bias amplitude, not a physical propagation time."
        ],
        "interpretation": "Labels next to points give estimated velocities. RMSE uses the known synthetic truth at all seven points. The biased arc is known in advance; excluding it compares its effect rather than demonstrating automatic outlier detection.",
        "scope": "Equal weights and a zero-velocity reference. The adjusted quantities are continuous velocities, not integer-cycle ambiguities.",
        "refs": [
          1,
          6
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mtable columnalign=\"left\" rowspacing=\"0.85em\"><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mi mathvariant=\"bold\">b</mi><mo>=</mo><mrow><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub><msub><mi mathvariant=\"bold\">v</mi><mi>r</mi></msub><mo>+</mo><mi mathvariant=\"bold\">e</mi></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mover accent=\"true\"><msub><mi mathvariant=\"bold\">v</mi><mi>r</mi></msub><mo stretchy=\"true\">^</mo></mover><mo>=</mo><mrow><msup><mrow><mo stretchy=\"true\">(</mo><mrow><msup><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow><mn>−1</mn></msup><msup><msub><mi mathvariant=\"bold\">G</mi><mi>r</mi></msub><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">P</mi><mi mathvariant=\"bold\">b</mi></mrow></mrow></mstyle></mtd></mtr></mtable></math></div><span class=\"eqno\">(5)</span>"
        ],
        "noteTitle": "Effect of the biased arc",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">G</mi></math></span>",
            "Incidence matrix"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">b</mi></math></span>",
            "Arc velocity differences"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">P</mi></math></span>",
            "Weight matrix"
          ]
        ]
      },
      {
        "title": "Spatial prediction of atmospheric phase",
        "lead": "Assume atmospheric residuals have already been separated in time. Their values at scattered samples must then be predicted at other positions. This example uses zero-mean simple kriging.",
        "description": "Let r contain sampled residuals, C the signal covariance, c(x) the covariance between a target and the samples, and <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup></math></span> the sample-noise variance. The predictor assumes a zero prior mean and independent sampling noise, independent of the signal. Unlike ordinary kriging, weights are not constrained to sum to one.",
        "steps": [
          "For a linear prediction <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mover accent=\"true\"><mi>a</mi><mo stretchy=\"true\">^</mo></mover><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">x</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><msup><mi mathvariant=\"bold\">w</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">r</mi></mrow></mrow></math></span>, the mean squared prediction error is <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mi mathvariant=\"bold\">C</mi><mrow><mo stretchy=\"true\">(</mo><mn>0</mn><mo stretchy=\"true\">)</mo></mrow></mrow><mo>−</mo><mn>2</mn><msup><mi mathvariant=\"bold\">w</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">c</mi><mo>+</mo><msup><mi mathvariant=\"bold\">w</mi><mi mathvariant=\"normal\">T</mi></msup><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">C</mi><mo>+</mo><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup><mi mathvariant=\"bold\">I</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mi mathvariant=\"bold\">w</mi></mrow></math></span>.",
          "Differentiating with respect to w gives <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">C</mi><mo>+</mo><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup><mi mathvariant=\"bold\">I</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mi mathvariant=\"bold\">w</mi></mrow><mo>=</mo><mi mathvariant=\"bold\">c</mi></mrow></math></span>. Substitution gives the predictor in the equation. With <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><msub><mi mathvariant=\"bold\">C</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mo>−</mo><mfrac><mrow><mo stretchy=\"true\">‖</mo><mrow><msub><mi mathvariant=\"bold\">x</mi><mi>i</mi></msub><mo>−</mo><msub><mi mathvariant=\"bold\">x</mi><mi>j</mi></msub></mrow><mo stretchy=\"true\">‖</mo></mrow><mi>ℓ</mi></mfrac></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></math></span>, correlation length ℓ sets the distance over which samples contribute information.",
          "Subtract the prediction: <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msub><mi>φ</mi><mi mathvariant=\"normal\">corr</mi></msub><mo>=</mo><mrow><msub><mi>φ</mi><mi mathvariant=\"normal\">raw</mi></msub><mo>−</mo><mover accent=\"true\"><mi>a</mi><mo stretchy=\"true\">^</mo></mover></mrow></mrow></math></span>. Synthetic deformation is known, so grid RMSE can be calculated before and after correction. Such full-field truth is usually unavailable for real data.",
          "Distances use normalized [0, 1] × [0, 1] coordinates, displayed with equal spatial scales. The covariance is a modelling assumption; the analytic reference atmosphere is not sampled from that covariance. Intermediate frames compare φraw − α â for 0 ≤ α ≤ 1, rather than an atmosphere physically fading away."
        ],
        "interpretation": "All four maps share a ±2.2 rad scale. Select a location to inspect weights; marker size shows absolute weight and red outlines indicate negative weights. Smoothness alone does not establish correctness; the error map compares against synthetic deformation truth.",
        "scope": "45 atmospheric samples and a 40×40 grid. Signal variance: 1 rad²; noise standard deviation: 0.12 rad. The covariance is fixed; no variogram or unknown trend is estimated. Deformation truth is represented as equivalent phase in rad; all maps show continuous, not wrapped, phase.",
        "refs": [
          1,
          3,
          6
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mtable columnalign=\"left\" rowspacing=\"0.85em\"><mtr><mtd><mstyle displaystyle=\"true\"><mrow><mrow><mover accent=\"true\"><mi>a</mi><mo stretchy=\"true\">^</mo></mover><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">x</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><msup><mrow><mi mathvariant=\"bold\">c</mi><mrow><mo stretchy=\"true\">(</mo><mi mathvariant=\"bold\">x</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mi mathvariant=\"normal\">T</mi></msup><msup><mrow><mo stretchy=\"true\">(</mo><mrow><mi mathvariant=\"bold\">C</mi><mo>+</mo><msup><msub><mi>σ</mi><mi>n</mi></msub><mn>2</mn></msup><mi mathvariant=\"bold\">I</mi></mrow><mo stretchy=\"true\">)</mo></mrow><mn>−1</mn></msup><mi mathvariant=\"bold\">r</mi></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle displaystyle=\"true\"><mrow><msub><mi mathvariant=\"bold\">C</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mrow><mi mathvariant=\"normal\">exp</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mo>−</mo><mfrac><mrow><mo stretchy=\"true\">‖</mo><mrow><msub><mi mathvariant=\"bold\">x</mi><mi>i</mi></msub><mo>−</mo><msub><mi mathvariant=\"bold\">x</mi><mi>j</mi></msub></mrow><mo stretchy=\"true\">‖</mo></mrow><mi>ℓ</mi></mfrac></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow></mstyle></mtd></mtr></mtable></math></div><span class=\"eqno\">(6)</span>"
        ],
        "noteTitle": "Correlation length",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">C</mi></math></span>",
            "Signal covariance"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi>ℓ</mi></math></span>",
            "Correlation length"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><msub><mi>σ</mi><mi>n</mi></msub></math></span>",
            "Sample-noise standard deviation"
          ]
        ]
      },
      {
        "title": "Linear motion and an annual term",
        "lead": "A straight line estimates average velocity, but seasonal motion can remain in its residuals. Adding an annual term to the same observations shows how an omitted signal affects velocity.",
        "description": "The linear model is <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mi>d</mi><mrow><mo stretchy=\"true\">(</mo><mi>t</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi>c</mi><mo>+</mo><mi>v</mi><mi>t</mi></mrow></mrow></math></span>. The equation below adds sine and cosine coefficients a and b for an annual cycle.",
        "steps": [
          "Use design-matrix rows <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo stretchy=\"true\">[</mo><mrow><mn>1</mn><mo>,</mo><msub><mi>t</mi><mi>i</mi></msub></mrow><mo stretchy=\"true\">]</mo></mrow></math></span> or <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mo stretchy=\"true\">[</mo><mrow><mn>1</mn><mo>,</mo><msub><mi>t</mi><mi>i</mi></msub><mo>,</mo><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><msub><mi>t</mi><mi>i</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>,</mo><mrow><mi mathvariant=\"normal\">cos</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><msub><mi>t</mi><mi>i</mi></msub></mrow><mo stretchy=\"true\">)</mo></mrow></mrow></mrow><mo stretchy=\"true\">]</mo></mrow></math></span>. Both models have the form <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi mathvariant=\"bold\">d</mi><mo>=</mo><mrow><mi mathvariant=\"bold\">A</mi><mi mathvariant=\"bold\">β</mi><mo>+</mo><mi mathvariant=\"bold\">ε</mi></mrow></mrow></math></span>. Solve <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><msup><mi mathvariant=\"bold\">A</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">A</mi><mover accent=\"true\"><mi mathvariant=\"bold\">β</mi><mo stretchy=\"true\">^</mo></mover></mrow><mo>=</mo><mrow><msup><mi mathvariant=\"bold\">A</mi><mi mathvariant=\"normal\">T</mi></msup><mi mathvariant=\"bold\">d</mi></mrow></mrow></math></span>; velocity is the second element of <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mover accent=\"true\"><mi mathvariant=\"bold\">β</mi><mo stretchy=\"true\">^</mo></mover></math></span>.",
          "Residuals are <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi mathvariant=\"bold\">e</mi><mo>=</mo><mrow><mi mathvariant=\"bold\">d</mi><mo>−</mo><mi mathvariant=\"bold\">A</mi><mover accent=\"true\"><mi mathvariant=\"bold\">β</mi><mo stretchy=\"true\">^</mo></mover></mrow></mrow></math></span>. The lower plot shows them in time, with <span class=\"math-block\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mi mathvariant=\"normal\">RMS</mi><mo>=</mo><msqrt><mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><msup><msub><mi>e</mi><mi>i</mi></msub><mn>2</mn></msup></mrow><mi>N</mi></mfrac></msqrt></mrow></math></span>. This differs from a noise-standard-deviation estimate using <span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>N</mi><mo>−</mo><mi>p</mi></mrow></math></span> degrees of freedom.",
          "More parameters usually reduce training residuals. Check residual structure and velocity error as well. An annual term has a physical justification when it accounts for a periodic signal in the observations.",
          "Time t is in years, so the annual angular frequency is 2π rad/yr. Playback refits prefixes of 12–36 acquisitions without interpolating coefficients. Both models use the same data at each frame, with fixed plotting scales throughout the sample."
        ],
        "interpretation": "Keep the linear model and increase the true seasonal amplitude. Watch the periodic residuals and estimated velocity, then select the annual model to compare fits to the same observations.",
        "scope": "36 monthly LOS observations. True velocity: −8 mm/yr; noise standard deviation: 1 mm. Data are treated as unwrapped and corrected. LOS velocity is not automatically vertical subsidence.",
        "refs": [
          1,
          6,
          7
        ],
        "formulas": [
          "<div class=\"equation-scroll\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><mrow><mrow><mi>d</mi><mrow><mo stretchy=\"true\">(</mo><mi>t</mi><mo stretchy=\"true\">)</mo></mrow></mrow><mo>=</mo><mrow><mi>c</mi><mo>+</mo><mi>v</mi><mi>t</mi><mo>+</mo><mi>a</mi><mrow><mi mathvariant=\"normal\">sin</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><mi>t</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>+</mo><mi>b</mi><mrow><mi mathvariant=\"normal\">cos</mi><mo>⁡</mo><mrow><mo stretchy=\"true\">(</mo><mrow><mn>2</mn><mi>π</mi><mi>t</mi></mrow><mo stretchy=\"true\">)</mo></mrow></mrow><mo>+</mo><mi>ε</mi></mrow></mrow></math></div><span class=\"eqno\">(7)</span>"
        ],
        "noteTitle": "An omitted seasonal signal",
        "notation": [
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">A</mi></math></span>",
            "Design matrix"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">β</mi></math></span>",
            "Model parameters"
          ],
          [
            "<span class=\"math-inline\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mi mathvariant=\"bold\">e</mi></math></span>",
            "Fit residuals"
          ]
        ]
      }
    ]
  },
  "references": [
    {
      "authors": "van Leijen, F. J.",
      "year": 2014,
      "title": "Persistent Scatterer Interferometry based on geodetic estimation theory",
      "venue": "Doctoral thesis, Delft University of Technology",
      "doi": "10.4233/uuid:5dba48d7-ee26-4449-b674-caa8df93e71e",
      "zh": "测地估计、时间与空间模糊度、质量描述。",
      "en": "Geodetic estimation, temporal and spatial ambiguities, and quality description."
    },
    {
      "authors": "Ferretti, A., Prati, C., & Rocca, F.",
      "year": 2001,
      "title": "Permanent scatterers in SAR interferometry",
      "venue": "IEEE Transactions on Geoscience and Remote Sensing, 39(1), 8–20",
      "doi": "10.1109/36.898661",
      "zh": "永久散射体方法与振幅离散度筛选。",
      "en": "Permanent-scatterer analysis and amplitude-dispersion screening."
    },
    {
      "authors": "Ferretti, A., Prati, C., & Rocca, F.",
      "year": 2000,
      "title": "Nonlinear subsidence rate estimation using permanent scatterers in differential SAR interferometry",
      "venue": "IEEE Transactions on Geoscience and Remote Sensing, 38(5), 2202–2212",
      "doi": "10.1109/36.868878",
      "zh": "时序建模、大气相位与非线性形变。",
      "en": "Time-series modeling, atmospheric phase and nonlinear deformation."
    },
    {
      "authors": "Hooper, A., Zebker, H., Segall, P., & Kampes, B.",
      "year": 2004,
      "title": "A new method for measuring deformation on volcanoes and other natural terrains using InSAR persistent scatterers",
      "venue": "Geophysical Research Letters, 31, L23611",
      "doi": "10.1029/2004GL021737",
      "zh": "基于相位特征的散射体检测；用于比较筛选思路。",
      "en": "Phase-based detection; included as a comparison with amplitude screening."
    },
    {
      "authors": "Hooper, A., Segall, P., & Zebker, H.",
      "year": 2007,
      "title": "Persistent scatterer interferometric synthetic aperture radar for crustal deformation analysis, with application to Volcán Alcedo, Galápagos",
      "venue": "Journal of Geophysical Research: Solid Earth, 112, B07407",
      "doi": "10.1029/2006JB004763",
      "zh": "空间相位相关性与模型依赖性；本项目未实现该完整方法。",
      "en": "Spatial phase correlation and model dependence; this project does not implement the full method."
    },
    {
      "authors": "Hanssen, R. F.",
      "year": 2001,
      "title": "Radar Interferometry: Data Interpretation and Error Analysis",
      "venue": "Springer, Remote Sensing and Digital Image Processing, vol. 2",
      "doi": "10.1007/0-306-47633-9",
      "zh": "干涉观测模型、误差传播与大气统计背景。",
      "en": "Interferometric observation models, error propagation and atmospheric statistics."
    },
    {
      "authors": "Colesanti, C., Ferretti, A., Novali, F., Prati, C., & Rocca, F.",
      "year": 2003,
      "title": "SAR monitoring of progressive and seasonal ground deformation using the permanent scatterers technique",
      "venue": "IEEE Transactions on Geoscience and Remote Sensing, 41(7), 1685–1701",
      "doi": "10.1109/TGRS.2003.813278",
      "zh": "线性与季节性形变分析；对应第六组实验。",
      "en": "Progressive and seasonal deformation; relevant to Experiment 06."
    }
  ]
};
