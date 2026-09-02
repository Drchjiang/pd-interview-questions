const questions = 
[
{
"id": 1,
"question": "什么是high fanout nets，和其它net相比有什么不同？",
"answer": "HFN顾名思义就是有非常大扇出的net，例如clock、set/reset、scan enable，他们的扇出超过了set_max_fanout设置的值。HFNS（high fanout net synthesis）被用来平衡负载。过高的负载会影响延时和transition。HFNS通常用在placement阶段，也可以用在synthesis阶段。",
"explanation": "高扇出网络（HFN）在数字后端中非常普遍，例如时钟网络、复位网络和扫描使能信号，其扇出数可能成百上千。当扇出超过工艺库规定的最大扇出约束时，驱动单元的负载电容会急剧增加，导致信号transition变慢，进而影响时序和功耗。HFNS（高扇出网络综合）通过在布局阶段或综合阶段插入多级缓冲树（buffer tree）来分散负载，使每个驱动单元的负载在合理范围内。这样做能改善信号质量，避免后续布线阶段因transition违例而难以修复。实际项目中，时钟树综合（CTS）专门处理时钟网络，而HFNS主要针对其他高扇出信号，如复位信号，通常在placement阶段先进行HFNS，以优化时序和拥塞。"
},
{
"id": 2,
"question": "什么是uncertainty，在物理实现pre_cts到post_cts有什么不同？",
"answer": "uncertainty是指时钟相对于理想位置的偏差，uncertainty指定了时钟边沿发生的窗口。在物理实现过程中uncertainty建模了jitter+margin+skew（prects）。在CTS之前，uncertainty包括skew，而在CTS之后工具可以计算出实际的skew，就可以减少uncertainty的值。对于setup/hold，uncertainty的设置也是不同的，因为hold分析中jitter对launchpath和capturepath的影响相同。下面列一个表格说明在prects/postcts，setup/hold的uncertainty值的设置。\nsetup: prects: jitter+margin+skew, postcts: jitter+margin\nhold: prects: margin+skew, postcts: margin",
"explanation": "Uncertainty是时钟边沿的不确定性窗口，包含时钟抖动（jitter）、设计裕量（margin）和时钟偏斜（skew）。在CTS之前，时钟树尚未构建，skew未知，因此必须将其计入uncertainty，以确保时序分析足够悲观。CTS之后，工具能准确知道时钟到达各触发器的实际延时差，即skew已确定，可以将这部分从uncertainty中扣除，只保留jitter和必要的设计余量。对于hold检查，由于launch时钟和capture时钟来自同一时钟源，jitter对两者的影响相同，可以相互抵消，因此hold的uncertainty通常不包含jitter，只需考虑margin（和skew）。经验值：pre-CTS setup uncertainty大约为0.1~0.2ns，post-CTS可降至0.05~0.1ns。这种区分有助于避免不必要的过度约束，同时保证时序安全性。"
},
{
"id": 3,
"question": "什么是工艺角（process corner）？",
"answer": "工艺角就是工艺参数变化的极端情况，通常包括不同工艺（process）、电压（voltage）和温度（temperature）的组合，用于时序分析。",
"explanation": "工艺角是PVT（Process、Voltage、Temperature）的特定组合，代表芯片制造和运行环境的最坏或最好情况。例如，最慢的工艺角（如ss_125C_0.9V）用于setup分析，最快的工艺角（如ff_-40C_1.1V）用于hold分析。由于现代工艺存在片上变异（OCV），通常还会使用双角（如ff/ss）和双模（功能/测试），形成MCMM矩阵。工艺角的选择直接关系到时序签核的全面性，必须覆盖所有可能场景。"
},
{
"id": 4,
"question": "什么是physical-only cell?",
"answer": "physical only cell 是指在物理实现过程中没有逻辑关系的 Cell，例如 tap cell、decap cell、endcap cell、filler cell、tie cell。",
"explanation": "Physical-only cell不参与逻辑仿真，只存在于物理版图中，用于满足制造、可靠性和电源完整性要求。它们不包含在任何网表的功能描述中，但却是流片必需的。例如tap cell提供衬底和阱的偏置，防止闩锁；decap cell在电源网络变化时提供局部电容，抑制动态压降；endcap cell放置在标准单元行的两端，保证阱的连续；filler cell填充空隙，确保光刻分辨率；tie cell固定悬空逻辑。这些单元由后端工具自动插入，是物理设计不可分割的一部分。"
},
{
"id": 5,
"question": "什么是Physical design？",
"answer": "Physical design（物理设计）是将电路描述（netlist）转化为物理版图的过程。在物理设计的过程中需要确定cell的位置（placement）和cell之间的走线（routing）。",
"explanation": "物理设计是数字后端流程的核心，承接逻辑综合的门级网表，输出可制造版图（GDSII）。其主要阶段包括：1) Floorplan，确定宏观布局和电源规划；2) Placement，确定标准单元位置；3) CTS，构建时钟树；4) Routing，完成信号布线；5) 时序收敛和物理验证。物理设计需要同时满足时序、面积、功耗、可制造性等多种约束，是芯片设计成败的关键。"
},
{
"id": 6,
"question": "10MHz设计和100MHz，哪个更加复杂？",
"answer": "100MHz，因为更高的频率意味着更小的周期，更难解决设计中的violations。",
"explanation": "100MHz时钟周期为10ns，而10MHz周期为100ns，高频设计允许的数据路径延迟更小，因此更难以满足setup约束。同时，高频设计对时钟偏斜、信号完整性、电源噪声等更敏感，需要更精细的优化和迭代。"
},
{
"id": 7,
"question": "什么是Floorplan？",
"answer": "Floorplan是物理设计中决定macro placement、power grid和IO placement的过程。",
"explanation": "Floorplan是物理设计的起始步骤，其质量直接影响后续布局布线效果。良好的floorplan需要考虑宏单元（macro）之间的数据流交互，避免过多飞线跨越造成拥塞；电源规划要结合IR drop和EM要求；IO布局要满足封装和接口约束。一个合理的floorplan能显著缩短设计收敛周期。"
},
{
"id": 8,
"question": "如果你的设计存在IR drop和congestion问题，你该如何去修复？",
"answer": "1、增加strap width 2、增加strap数量 3、使用合适的blockage",
"explanation": "IR drop问题通常由电源网络电阻过大导致，可以通过加宽电源线宽度、增加电源条纹数量、优化电源网络拓扑来降低电阻，从而提高供电电压稳定性。对于congestion（拥塞）问题，常见修复方法包括：在拥塞区域放置placement blockage限制单元密度，调整宏单元位置以腾出布线通道，或采用拥塞驱动的布局策略。这些措施需要综合权衡，可能需要多次迭代。"
},
{
"id": 9,
"question": "什么是Tie-high和Tie-low cell？",
"answer": "Tie-high和Tie-low cell用来将某些pin连接到power和ground。",
"explanation": "Tie cell（或称tie-off cell）用于将逻辑门的输入端口固定为逻辑‘1’或‘0’，避免悬空产生不确定状态。它们通常由专用电路实现，能在电源和地之间提供低阻抗连接，同时防止噪声。在可测试设计中，扫描链未用端口也需要tie到固定值。这些cell在物理实现中作为标准单元的一部分，必须满足电源连接要求。"
},
{
"id": 10,
"question": "在做CTS之前需要进行哪些检查？",
"answer": "1、是否完成了placement 2、power和ground是否pre-routed 3、预估的congestion是否acceptable 4、预估的timing是否acceptable 5、预估的max transition/capacitance是否没有violations 6、High fan-out net",
"explanation": "CTS是物理设计的关键节点，之前必须确保布局合法、电源网络已预布线、拥塞程度可接受、时序预估基本收敛、逻辑DRC违例已清除，并且高扇出网络已做初步处理。否则，CTS引入的大量时钟缓冲器会加剧拥塞，导致新的时序违例，甚至布线无法完成。因此，CTS前的检查是保证后续流程顺利的必要步骤。"
},
{
"id": 11,
"question": "什么是power gating cells？",
"answer": "power gating用来避免静态功耗。power gating cells是指: power switches、level shifters、retention registers、isolation cells 和 power controller 等",
"explanation": "Power gating是低功耗设计中的关键技术，通过切断电源域的供电来消除漏电功耗。功率开关（power switch）常作为粗粒度开关，置于电源线和虚拟地之间。Level shifter用于不同电压域之间的信号电平转换，确保信号正确传递。Retention register在断电时利用备用电源保持状态，以便唤醒后恢复。Isolation cell在关断域的电源切断时输出确定值，防止噪声传播。Power controller负责管理开关时序和状态。这些单元组合使用，实现细粒度的功耗管理。"
},
{
"id": 12,
"question": "什么是MCMM（multi corner multi mode）？",
"answer": "组合mode & corner用于特定的时序分析（setup/hold）",
"explanation": "MCMM是指同时考虑多种工作模式（如功能模式、扫描测试模式）和多种工艺角（如ss、tt、ff，以及电压、温度组合）的时序分析方法。不同模式下的时钟和约束不同，不同工艺角下的延时也不同。通过并行分析所有组合，可以全面覆盖设计在各种条件下的时序表现，避免遗漏关键违例。这种方法已成为先进工艺下时序签核的标准。"
},
{
"id": 13,
"question": "什么是virtual clock？",
"answer": "物理上不存在的Clock，用于设置input delay和output delay",
"explanation": "虚拟时钟常用于定义芯片输入输出端口与外部环境的时序关系。例如，定义输入信号相对于虚拟时钟的到达时间，或输出信号相对于虚拟时钟的要求时间。虚拟时钟没有实际的时钟源，也不连接到任何触发器，但能为接口时序建立基准，使STA能正确检查外部路径的时序约束。"
},
{
"id": 14,
"question": "什么是EM（Electromigration）？",
"answer": "当金属中流过较大的电流时，会发现电迁移现象，导致金属出现短路或者断路。",
"explanation": "电迁移是金属原子在电子流作用下发生定向迁移，导致金属线逐渐变薄甚至断裂，或形成小丘造成短路。EM是芯片可靠性的重要风险，尤其在高温和高电流密度下更容易发生。设计时必须根据工艺库提供的EM规则，限制金属线的电流密度，通过增加线宽、加厚金属、多通孔等方式缓解。EDA工具会进行EM检查，确保所有金属线满足可靠性要求。"
},
{
"id": 15,
"question": "zero skew是可能的么？",
"answer": "不可能，因为电路中时钟源经过不同的路径到达触发器，无法保证skew为0",
"explanation": "零偏斜在理论上需要所有时钟路径长度完全相等，但实际中受工艺偏差、负载差异、布线环境等影响，不可能精确达到。此外，即使路径长度相等，由于时钟树单元的延时不一致，也可能产生微小偏斜。因此工程上只要求skew控制在特定范围（如50ps以内），并利用useful skew来优化时序。"
},
{
"id": 16,
"question": "在cts之后需要检查什么？",
"answer": "1、skew report 2、clock tree report 3、timing report(setup/hold) 4、power & area",
"explanation": "CTS完成后，时钟树已经建立，需要评估其质量：检查skew是否符合目标、插入延迟是否合理、时钟树功耗和面积是否可接受。同时，由于时钟树引入了实际延迟，必须先重新分析时序，查看setup/hold是否满足。此外，还需检查DRC违例，确保时钟树本身不引起新问题。"
},
{
"id": 17,
"question": "什么是Synthesis？",
"answer": "Synthesis是将RTL转化为电路实现的门级网表的过程",
"explanation": "综合是前端设计转化为后端可实现的中间步骤，分为逻辑综合（RTL到门级网表，不关心物理布局）和物理综合（结合布局信息优化时序和拥塞）。综合过程包括：读入RTL、库和约束，进行逻辑优化和映射，输出门级网表。综合结果的质量直接影响后端物理设计的收敛难度。"
},
{
"id": 18,
"question": "如果设计使用的是7层金属，哪一层用来时钟走线？",
"answer": "Metal4和Metal5，因为clock会消耗设计中 30% - 40% 的功耗，高层金属RC值较小。Metal6和Metal7被用来power和ground走线，Metal1和Metal2会有大量的信号线",
"explanation": "时钟网络具有巨大的负载，使用高层金属能显著降低连线电阻，减少延时和功耗。但最高层金属通常留给电源网络和全局信号，以获取更好的IR drop和EM性能。底层金属（M1-M2）用于局部信号互连，走线密集。因此，M4和M5作为折中选择，既保证时钟性能，又不占用最珍贵的资源。实际设计会由工具根据NDR规则自动选择。"
},
{
"id": 19,
"question": "什么是antenna effect？",
"answer": "在芯片生产过程中，暴露的金属线就象是一根根天线，会收集电荷导致电位升高。天线越长，收集的电荷也就越多，电压就越高。若这片导体碰巧接了MOS的栅，那么高电压就可能把薄栅氧化层击穿，使电路失效。（百度百科）",
"explanation": "天线效应发生在等离子刻蚀工艺中，工艺过程中暴露的金属线会积累电荷，如果该金属连接到栅极，积累的电荷可能产生高电压，击穿薄栅氧化层，导致永久性损坏。缓解方法包括：在金属线上添加钳位二极管（antenna diode）以泄放电荷，改变金属走线顺序以减少暴露长度，或者插入跳线（layer hopping）来分段。EDA工具通过天线检查（antenna check）来报告违例，并在修复阶段自动处理。"
},
{
"id": 20,
"question": "什么是cloning和buffering？",
"answer": "cloning是一种通过复制cell，来优化高负载的方法。buffer是在高扇出网络上insert buffer，增加驱动能力。",
"explanation": "Cloning和buffering都是时序优化技术。Cloning通过复制原始单元（如缓冲器、逻辑门）将负载分散到多个副本，每个副本驱动一部分负载，从而降低每个单元的负载，改善transition和延时的同时，也减小了输出端的总电容。Buffering是在路径中插入缓冲器，可有效分割长连线，减少RC延时，同时提高驱动能力。两者常用于修复setup违例和解决DRC违例（max transition/fanout）。"
},
{
"id": 21,
"question": "为什么ASIC中更愿意使用NAND而不是NOR？",
"answer": "电子的迁移率是空穴迁移率的3倍，NAND比NOR更快，有更少的泄露功耗",
"explanation": "在CMOS工艺中，NMOS的载流子（电子）迁移率远高于PMOS的空穴迁移率。NAND门由并联的PMOS驱动输出高电平，串联的NMOS驱动输出低电平，而NOR门相反。由于NAND结构在输出低电平时NMOS串联，但NMOS强，所以NAND的速度和面积优于NOR。此外，NAND门有更少的PMOS面积，更低的漏电，因此成为ASIC首选的逻辑门。"
},
{
"id": 22,
"question": "什么是LVS（layout vs schematic）？",
"answer": "检查芯片物理版图是否和电路原理图对应",
"explanation": "LVS是物理验证的关键检查，它从版图中提取出电路连接关系（网表），然后与原始原理图（或网表）对比，确保两者等价。LVS能发现短路、开路、漏掉器件、错误连接等问题，是保证芯片功能正确性的重要关卡。"
},
{
"id": 23,
"question": "什么是shielding？",
"answer": "在aggressor和victim之间放置ground线可以将电荷泄露出去，降低cross-talk",
"explanation": "屏蔽（shielding）是一种降低串扰的有效方法。在攻击信号（aggressor）和受害信号（victim）之间插入一条地线（ground shielding），可以形成耦合电容的泄放通路，从而减小对受害信号的干扰。屏蔽线常用于时钟线、敏感数据总线等。但屏蔽会增加布线资源和面积，且影响走线密度，因此需要适度使用。"
},
{
"id": 24,
"question": "什么是latch-up？",
"answer": "门锁效应是由NMOS的有源区、P衬底、N阱、PMOS的有源区构成的n-p-n-p结构产生的，当其中一个三极管正偏时，就会构成正反馈形成门锁。避免门锁的方法就是要减小衬底和N阱的寄生电阻，使寄生的三极管不会处于正偏状态。（百度百科）",
"explanation": "Latch-up是CMOS结构中固有的寄生双极晶体管（PNPN）效应。当受到扰动（如浪涌电流、辐射、离子注入污染）时，一个寄生的三极管导通，形成正反馈，导致电流急剧增大，可能烧毁芯片。预防措施包括：增加N阱和P衬底的接触（tap cell），减小寄生电阻；采用guard ring隔离；使用SOI工艺彻底消除该结构；或采用合适的电源序列。"
},
{
"id": 25,
"question": "什么是isolation cell？",
"answer": "isolation cell是shut down模块和always on模块之间的接口。shutdown模块关掉了，always on模块仍在工作，但是可能always on模块需要shutdown模块的输出信号作为输入的。这时必须在给所有的边界信号加入isolation cell（ISO）。ISO的作用就是在电源关掉之后，可以保证输出的信号是一个确定值（1或0）。",
"explanation": "隔离单元（isolation cell）用于多电源域设计中，当某个电源域被关断时，其输出信号可能变为高阻或未知，这会污染常开域的输入。隔离单元通常由AND门或OR门实现，当隔离控制信号有效时，输出钳位到固定的逻辑电平（0或1）。这样可防止常开域的电路因为输入悬空而出现错误翻转或过大功耗。"
},
{
"id": 26,
"question": "什么是retention flop？",
"answer": "retention flop带有multiple supply的cell。用来保存模块电源关断之后的数据值。",
"explanation": "保持触发器（retention flop）是一种特殊的触发器，它有两个电源域：主电源（正常工作）和后备电源（保持）。当主电源关断时，后备电源维持内部存储节点状态，确保数据不丢失；当主电源恢复时，数据可继续使用。这种设计能大幅降低待机功耗，常用于移动设备芯片。"
},
{
"id": 27,
"question": "在CTS阶段需要完成那些工作？",
"answer": "1、pre-CTS需要Detailed placement database 2、指定CTS的latency和skew目标 3、指定CTS使用的buffer和inverter 4、指定NDR rules 5、解决Clock tree的DRC",
"explanation": "CTS阶段主要工作包括：基于详细的布局信息构建时钟树；设置时钟延迟和偏斜目标，通常由工具自动平衡；选择合适的时钟缓冲单元类型；定义非默认布线规则（NDR，如双倍间距、加宽线宽）以降低串扰和EM风险；最后要修复时钟树本身的DRC违例（如max transition、max capacitance）。CTS的结果直接影响时序收敛质量。"
},
{
"id": 28,
"question": "CTS的目的是什么？",
"answer": "1、最小化clock skew 2、最小化insertion delay 3、最小化功耗",
"explanation": "CTS的主要目标有三个：一是使时钟信号尽可能同时到达各触发器，减小时钟偏斜，从而提高时序裕量；二是尽量减少时钟源到触发器的延迟（插入延迟），降低整体时序压力；三是控制时钟树功耗，因为时钟树消耗大量动态功耗。实际设计中，这些目标有时相互冲突，需要权衡。"
},
{
"id": 29,
"question": "CTS对设计的影响是什么？",
"answer": "1、增加了clock buffer 2、可能增加Congestion 3、Non-clock cell可能会被移动到非理想位置 4、可能增加timing和max transition/capacitance的violations",
"explanation": "CTS会插入大量时钟缓冲器，增加单元数量和面积，可能加剧拥塞。工具在构建时钟树时，可能会移动非时钟单元来腾出空间，这可能导致部分单元位置恶化，影响时序。同时，时钟树的负载也可能引入新的transition和capacitance违例，需要额外修复。因此CTS后必须进行全面的时序和拥塞检查。"
},
{
"id": 30,
"question": "下面这些cell的作用分别是什么？tap cell, endcap cell, decap cell, filler cell, ICG cell, pad cell, jtag cell",
"answer": "tap cell：避免latch-up击穿的问题，endcap cell: endcap主要加在block level的row end（2边），使得std cell周围的环境一致，decap cell: decap就是去耦啊，特殊的filler cell，可以降低动态电压降，filler cell:用来连接Cell之间的gap，ICG cell: clocking gating cell避免动态功耗，pad cell:是电源和内部信号和外部的接口，jtag cell:检查IO的连接",
"explanation": "Tap cell（或well tap）用于连接衬底和电源/地，提供低阻路径抑制闩锁；Endcap cell放置在标准单元行两端，确保阱边界连续，防止工艺问题；Decap cell是去耦电容，能吸收电源瞬时噪声，降低动态压降；Filler cell填充空隙，保证光刻均匀性，本身无逻辑；ICG（integrated clock gating cell）在时钟路径上增加门控，关闭不必要的时钟翻转，降低动态功耗；Pad cell是芯片与封装之间的接口；JTAG cell用于边界扫描测试，提高可测性。"
},
{
"id": 32,
"question": "什么是hard macro？",
"answer": "版图固定的模块",
"explanation": "Hard macro是已完成物理版图的IP模块，如SRAM、PLL、模拟前端，其尺寸、形状、引脚位置固定，不可改动。后端设计时将其作为黑盒，只能整体放置，无法内部修改。"
},
{
"id": 33,
"question": "什么是soft macro？",
"answer": "版图不固定，电路描述",
"explanation": "Soft macro是以RTL或门级网表形式提供的IP模块，其物理版图可以由后端设计者根据芯片布局灵活生成，自由度较高。但需要重新综合和布局，可能引入额外时序风险。"
},
{
"id": 34,
"question": "什么是CTO？",
"answer": "clock tree optimization，优化clock的skew和insertion delay，在clock_opt阶段",
"explanation": "CTO（时钟树优化）是CTS后进行的优化步骤，旨在调整时钟树结构，例如更换缓冲器大小、移动时钟单元、改变插入点，以进一步改善skew和插入延迟，同时修复时钟树的DRC违例。CTO在clock_opt阶段执行，是时序收敛的重要环节。"
},
{
"id": 35,
"question": "normal和clock buffer有什么不同？",
"answer": "clock buffer有相同的rise和fall time，保证输入 50% 占空比的信号能够产生 50% 占空比的输出信号",
"explanation": "普通缓冲器（non-clock buffer）的上升和下降延时可能不对称，导致占空比失真。而时钟缓冲器专门设计成上升和下降延时相等，确保时钟信号从输入到输出保持50%的占空比，这对高速时钟至关重要。因此，时钟树中必须使用专用的时钟缓冲单元，避免使用普通缓冲器。"
},
{
"id": 36,
"question": "为什么我们应该在CTS之前解决setup violation，在CTS之后解决hold violation？",
"answer": "setup violation主要依赖于datapath，hold violation依赖于clock path。在CTS之前我们不知道确切的skew和transition信息，clock是ideal的。但这些信息足够我们分析setup。在CTS之后clock是propagated的，我们才开始分析hold",
"explanation": "Setup检查关注数据信号要在时钟沿之前到达，而数据路径的延时主要受布局和单元驱动影响，不依赖时钟树的精确延迟。在CTS之前，时钟被当作理想模型（延迟为0，无skew），但这种假设对setup分析足够悲观（因为实际时钟延迟会增加数据可用时间，对setup有利）。对于hold检查，数据信号要在时钟沿之后保持稳定，而时钟树的实际延迟（特别是skew）对hold裕量有直接影响。如果在CTS前就分析hold，可能因为skew未知而过于乐观，导致错误结论。因此，业界惯例是在CTS前修复setup，CTS后修复hold。"
},
{
"id": 37,
"question": "什么是global routing?",
"answer": "确定routing的channels",
"explanation": "全局布线是布线的第一阶段，将芯片划分为多个区域（如GRC），并为每个网络分配大致的走线通道，但不指定具体物理位置。其目的是评估拥塞和估算延时，为详细布线提供指导。"
},
{
"id": 38,
"question": "什么是detailed routing?",
"answer": "指定channel中走线的具体位置和金属层",
"explanation": "详细布线在全局布线的基础上，为每个网络确定具体的走线路径、金属层和通孔位置，必须满足设计规则约束（DRC），并尽量优化时序和信号完整性。详细布线是生成最终版图的关键步骤。"
},
{
"id": 39,
"question": "什么是cross talk?",
"answer": "物理上相邻的net由于电容耦合导致的不期望的效应",
"explanation": "串扰（crosstalk）是相邻金属线之间的耦合电容引起的信号干扰，可能导致受害线上的信号延时变化（延迟变化）或产生毛刺（glitch）。随着工艺缩小，线间距减小，串扰效应日益严重。通过增加间距、屏蔽、调整驱动强度等方法可以减少串扰。"
},
{
"id": 40,
"question": "什么是线负载模型？",
"answer": "在综合阶段计算延时的方式，根据fanout获取电阻电容。",
"explanation": "线负载模型（WLM）是综合阶段用于估算线延时的一种简单模型，它根据扇出数查表得到电阻和电容，进而计算RC延时。因为综合时没有实际物理信息，WLM只是粗略估计，误差较大。现代设计多采用物理综合或更先进的估计模型（如基于布局的RC估算）来提高精度。"
},
{
"id": 41,
"question": "hierarchical design和flat design有什么不同？",
"answer": "hierarchical design有子模块，flat design没有子模块",
"explanation": "层次化设计将设计划分为多个子模块，每个子模块独立综合和布局，再进行顶层集成。这种方式适合超大规模设计，便于团队协作和重用，但增加了接口约束的复杂性。扁平化设计将所有逻辑放在一个层面，无子模块，更适合中小规模设计，但迭代时间长。"
},
{
"id": 42,
"question": "在power analysis中发现存在IR drop问题之后，应该怎么解决？",
"answer": "1、增加金属线宽度 2、用更高的金属层走线电源线 3、用更多的power straps",
"explanation": "IR drop是由于电源网络电阻导致到达单元供电电压下降。解决方法包括：加宽电源线（增加电流容量）、使用高层金属（低电阻）走电源、增加电源条纹（straps）数量以提供更多并联通路。此外，还可以优化电源网格的拓扑，或者在某些区域增加去耦电容来缓解瞬时压降。"
},
{
"id": 43,
"question": "什么是body effect？",
"answer": "由于晶体管的衬底电压偏置导致阈值电压变化",
"explanation": "体效应是指当MOSFET的源极与衬底之间存在电压差时，阈值电压发生变化的现象。当衬底电压低于源极（NMOS）时，阈值电压增大，导致驱动能力下降，延时增加。设计时需注意体效应影响，尤其在堆叠管电路中。"
},
{
"id": 44,
"question": "什么是glitch？",
"answer": "Glitch是持续时间很短的短脉冲",
"explanation": "毛刺是组合逻辑中由于不同输入路径延时差异造成的瞬时输出变化，可能导致后续电路误触发或逻辑错误。在低功耗设计中，毛刺会引发不必要的翻转功耗。通过平衡逻辑路径、插入寄存器等方法可以减少毛刺。"
},
{
"id": 45,
"question": "SOI工艺的好处？",
"answer": "1、低寄生电容 2、高性能 3、减少短沟道效应 4、没有latch up 5、低阈值",
"explanation": "SOI（绝缘体上硅）工艺在硅衬底与有源区之间加入绝缘层，消除了寄生闩锁效应，减小了寄生电容，提高了速度，同时降低了短沟道效应，允许更低的阈值电压，从而降低功耗。所以SOI常用于高性能低功耗芯片。"
},
{
"id": 46,
"question": "macro placement的guidelines有哪些？",
"answer": "1、Fly-lines 2、port communication 3、macros are placed at boundaries 4、spacing between macros 5、macro alignment 6、orientation 7、blockages 8、avoid crisscross placement of macros",
"explanation": "宏单元布局需要遵循一系列指导原则：根据飞线密度和端口位置优化相邻关系，通常将宏单元放置在芯片边缘以减小对标准单元区域的干扰；宏单元之间需留适当间距便于布线；方向一致便于电源连接；必须考虑阻塞区域（blockage）；避免交叉放置以减少连线拥塞。这些原则有助于提高布线成功率和时序质量。"
},
{
"id": 47,
"question": "在pd需要做哪些检查？",
"answer": "1、check_library 2、check_timing 3、check_design 4、report_constraint 5、report_timing 6、report_qor",
"explanation": "物理设计过程中需要执行一系列检查命令确保设计符合预期。check_library验证库文件的完整性；check_timing检查设计是否存在未约束路径、时钟定义是否完整；check_design检查设计是否有未连接端口或冲突单元；report_constraint报告当前约束覆盖情况；report_timing报告时序路径；report_qor报告QoR（质量结果）如面积、功耗、性能等。这些检查帮助早期发现问题，避免流片风险。"
},
{
"id": 48,
"question": "Halo和blockage有什么不同？",
"answer": "Halo是macro周围的区域，不允许其他macro和std cell放置在这个范围内。如果macro移动，halo会随着移动。Blockage指定设计中区域，不允许其他macro和std cell放置在这个范围内。如果macro移动，blockage不会随着移动。",
"explanation": "Halo（也称keepout margin）是围绕宏单元的一个动态保护带，它附着在宏单元上，如果宏单元移动，Halo也跟着移动。而Blockage是静态的区域定义，它独立于宏单元，即宏单元移动后，Blockage仍然在原位置。两者都用于限制放置，但应用场景不同。Halo常用于防止宏单元之间太近或标准单元侵入宏单元，而Blockage常用于控制特定区域的密度，如防止单元放置在拥塞严重区域。"
},
{
"id": 49,
"question": "为什么在routing之前施加NDR rules？",
"answer": "有时候默认的走线很难避免cross talk, electromigration。在routing阶段修复cross talk和electromigration问题非常困难。所以我们应该在routing之前施加NDR rules (double space, double width)",
"explanation": "NDR（非默认规则）指定了特殊金属线的宽度、间距等。在布线前预定义NDR（如双倍宽度、双倍间距）可以提前预防串扰和电迁移问题。若等到布线后再修复，往往需要重新布线，影响收敛速度，甚至难以满足约束。因此，对关键网络（如时钟、数据总线、电源干线）提前施加NDR是标准做法。"
},
{
"id": 50,
"question": "blockage有哪些类型？",
"answer": "Hard blockage：不允许放置inverters, buffers和standard cells。Soft blockage：只允许放置inverters和buffers，阻止放置standard cells。Partial blockage：只允许放置一定百分比的inverters，buffers和standard cells。",
"explanation": "Hard blockage完全禁止任何标准单元（包括缓冲器和反相器）放置在指定区域，常用于预留布线通道或保护宏单元；Soft blockage允许放置缓冲器和反相器，但禁止标准逻辑单元，这种灵活性有助于时序优化；Partial blockage限制指定区域内单元放置的比例，例如只允许放置50%的单元，用于控制拥塞密度。这些blockage是布局优化的重要工具。"
},
{
"id": 51,
"question": "什么是congestion？",
"answer": "当available tracks少于required tracks时，就会发生congestion。",
"explanation": "拥塞是指某个区域的布线资源（可用的布线轨道）不足以满足所有网络的布线需求。拥塞会导致布线困难，甚至无法布通，影响时序和可制造性。通常使用拥塞图来评估，可通过调整布局、优化floorplan、增加金属层或使用NDR等缓解。"
},
{
"id": 52,
"question": "怎么去修复congestion？",
"answer": "1、congestion driven placement 2、调整congestion区域的cell density 3、使用合适的blockage 4、调整floorplan",
"explanation": "修复拥塞需多管齐下：1) 使用拥塞驱动的布局算法，让工具优先考虑拥塞因素；2) 降低高拥塞区域的单元密度，例如将部分单元移到空闲区域；3) 设置blockage限制单元放置；4) 调整floorplan，如移动宏单元、增加区域面积、改变shape等。实际中需要多次迭代优化。"
},
{
"id": 53,
"question": "physical verification有哪些类型？",
"answer": "LVS (Layout vs schematic)、DRC (Design rule check)、ERC (Electric rule check)",
"explanation": "物理验证确保版图符合工艺规则和电路设计意图：DRC检查几何尺寸是否满足工艺最小间距、最小宽度等；LVS验证版图连接关系与原理图一致；ERC检查电气规则，如电源短路、悬空、天线效应等。这些验证是流片前的必做步骤。"
},
{
"id": 54,
"question": "怎样一次同时修复setup和hold time violation?",
"answer": "我们无法一次同时修复setup和hold time violation. 但是, 我们可以在data path修复hold violation, 然后降低时钟频率修复setup.",
"explanation": "Setup和hold在本质上相互制约：增加路径延时能修复hold，但会恶化setup；减少延时能修复setup，但会恶化hold。通常，需要在数据路径上做调节，例如插入缓冲器增加延时来修hold，但会同时增加setup的延时，所以不能同时无矛盾地修复。若必须同时修，可采用时钟skew调整（useful skew）、改变触发器类型或重新设计逻辑。题目中的回答是一种折中策略，但在实际项目中，通常先满足setup（因为在CTS前），再处理hold（CTS后），如果hold违例严重，可通过插入延时单元修复，同时通过优化其他路径或调整时钟来保setup。"
},
{
"id": 55,
"question": "你怎么避免cross-talk?",
"answer": "1、增加aggressor和victim之间的距离 2、shielding 3、稳定的power 4、增加cell的驱动能力 5、layer jumping 6、增大victim net的宽度 7、guard ring 8、cell up sizing",
"explanation": "避免串扰的方法很多：增加线间距可直接降低耦合电容；屏蔽（ground线）可将耦合电荷泄放；稳定的电源减少噪声干扰；增强受害信号的驱动能力（upsize）可提高抗扰性；改变走线层（layer jumping）减少并行走线；加宽线宽降低电阻，提高噪声容限；采用guard ring保护敏感模拟模块；cell up sizing也可提高驱动，对噪声更具免疫力。实际设计中应结合使用多种手段。"
},
{
"id": 56,
"question": "有哪些类型的DRC?",
"answer": "logical DRCs: max transition, max capacitance, max fanout\nphysical DRCs: short, open, spacings, overlap",
"explanation": "逻辑DRC（或设计规则约束）是时序和功耗方面的限制，如最大转换时间、最大电容、最大扇出，违反时影响性能，需要优化驱动能力或插入缓冲器。物理DRC是版图几何规则，如金属间距、宽度、通孔覆盖等，违反会导致制造失败。这两类DRC分别由时序工具和物理验证工具检查。"
},
{
"id": 57,
"question": "什么是scan chain reordering?",
"answer": "在设计中重新连接scan chain以优化走线, 提高timing和congestion",
"explanation": "扫描链重排是在布局完成后，根据单元的实际物理位置重新连接扫描链，使寄存器之间的连线最短，减少绕线，降低拥塞，并改善扫描时钟的时序。注意，重排可能改变扫描路径的延迟，需要重新检查hold violation，必要时要插入扫描延迟单元。"
},
{
"id": 58,
"question": "什么是floorplan中的row?",
"answer": "物理设计中的standard cell被放置在row中。所有的row都具有相同的高度, 宽度可以不同。row中的standard cell可以从power rail中连接到vdd和vss。工艺库一般都是vdd-vss-vdd以共享vdd和vss。",
"explanation": "标准单元行（row）是标准单元放置的横向区域，单元的高度一致，宽度为轨道间距的整数倍。工艺库通常采用VDD-VSS-VDD的电源排列，即相邻行共享电源轨道，从而减少资源。行定义了标准单元的纵向对齐方式，便于供电和布局布线。"
},
{
"id": 59,
"question": "NDR的优点是什么?",
"answer": "1、避免EM 2、避免cross-talk",
"explanation": "NDR（非默认规则）通过增加线宽、间距、双通孔等措施，可有效降低电流密度，避免电迁移（EM）导致的可靠性问题；同时增加间距也减少耦合电容，抑制串扰。NDR虽然增加布线资源，但对关键网络（如时钟、电源）是必要的保护。"
},
{
"id": 60,
"question": "在reg2reg路径上存在setup violation时, 什么时候能insert buffer?",
"answer": "在路径上insert buffer可以降低线延时, 然后降低总的arrive time",
"explanation": "在长距离路径上插入缓冲器可以将长线分成几段，每段的RC延时更小，从而减小总延时。如果路径本身驱动负载很大，插入缓冲器还能提高驱动能力，优化transition。但在某些情况下，如路径较短时，插入缓冲器反而增加单元延时，可能恶化时序。因此需要权衡。"
},
{
"id": 61,
"question": "什么是partitioning?",
"answer": "将设计(design)划分成(blocks), 简化设计的placement&routing.",
"explanation": "划分（partitioning）是将大设计分解为多个较小的子模块，从而降低每个子模块的复杂度，便于并行开发和独立验证。划分后可以进行层次化物理设计，每个子模块单独布局布线，然后整合到顶层，有助于缩短设计周期和管理规模。"
},
{
"id": 62,
"question": "如何降低动态功耗？",
"answer": "1、减小电源电压 2、减少节点的电平切换 3、减小负载",
"explanation": "动态功耗公式为 P=αCV²f，因此降低电压V、减小活动因子α（翻转概率）、减少负载电容C，以及降低频率f都可以降低动态功耗。具体措施包括：门控时钟（减少切换）、优化电路拓扑（减少电容）、采用低电压设计（多电压域）、以及工艺选用低电容结构。"
},
{
"id": 63,
"question": "为什么插入double via？",
"answer": "减少由于通孔问题造成的良率损失",
"explanation": "双通孔（double via）是在同一连接处放置两个通孔，即使一个通孔失效，另一个仍能维持连接，从而大幅提升良率。通孔是芯片制造中易发生缺陷的环节，双通孔是提高可靠性的常用方法。代价是占用面积和可能增加拥塞。"
},
{
"id": 64,
"question": "什么是metal fill？",
"answer": "化学机械抛光(Chemical-mechanical polishing，简称CMP)是半导体工艺的一个步骤。某些没有任何互联金属线的区域会产生大片的凹陷区域。一种有效的方法就是去填充Dummy Metal Fill。",
"explanation": "金属填充（metal fill）是在版图空白区域添加不与任何信号连接的金属块（dummy），使金属密度均匀，防止CMP过程中凹陷，保证表面平坦，进而保证光刻精度。金属填充通常在布线完成后的后期阶段自动插入，且通常浮空或接地，不会影响电路功能。"
},
{
"id": 65,
"question": "功耗组成有哪些？",
"answer": "1、动态功耗：电容充放电导致的。2、泄漏功耗（静态）：泄露电流导致的功耗。3、开关短路功耗：CMOS开关时，由导通电流产生的功耗。",
"explanation": "总功耗分为动态功耗和静态功耗。动态功耗包括开关功耗（电容充放电）和短路功耗（晶体管开关瞬间的电流），与活动因子、电压、频率、电容相关；静态功耗主要是泄漏电流，包括亚阈值泄漏和栅极漏电，与工艺和温度有关。低功耗设计需从多个层面入手。"
},
{
"id": 66,
"question": "什么时候使用placement blockage？",
"answer": "1、定义std-cell和macro area的摆放区域 2、为buffer insertion预留通道 3、防止cell被摆放到macros旁边 4、解决macros旁边的congestion",
"explanation": "Placement blockage用于控制单元放置的位置。例如，为了预留布线通道或隔离宏单元，可设置hard blockage；为时序优化保留缓冲器插入位置，可设置soft blockage；为防止单元放在宏单元旁造成拥塞，也可用blockage限定。通过合理使用blockage，可以改善布局质量和拥塞。"
},
{
"id": 67,
"question": "global routing的类型有哪些？",
"answer": "1、timing driven 2、cross-talk driven 3、incremental global routing",
"explanation": "全局布线有不同的优化目标：timing driven全局布线优先考虑关键路径时序，为其分配较短路径；cross-talk driven考虑相邻线耦合，尽量拉开间距；incremental全局布线是在已有布线基础上局部调整，用于修复局部违例。这些类型可根据设计阶段和需求选择。"
},
{
"id": 68,
"question": "LVS阶段需要解决哪些violations？",
"answer": "1、shorts 2、opens 3、Missing text layers",
"explanation": "LVS违例包括短路（两个不同网络连在一起）、开路（应该连接的没连上）、缺失的文本层（标记丢失导致无法识别器件的连接），还有其他如器件类型错误、错误尺寸等。修复这些违例是确保版图与原理图一致的关键。"
},
{
"id": 69,
"question": "什么是clock latency？",
"answer": "clock latency是clock source和clock pin之间的延迟。clock latency包含clock source latency和clock network latency。从clock source到clock定义点的延迟称为clock source latency。从clock定义点到触发器的CK之间的延迟称为clock network latency",
"explanation": "时钟延迟（latency）是指从时钟源到触发器时钟端的总延迟，包括源延迟（时钟源到时钟定义点，可能是外部芯片、PLL输出等）和网络延迟（时钟定义点到各个寄存器时钟端）。latency影响时序分析，因为到达时间不同。"
},
{
"id": 70,
"question": "如何修复setup和hold violations？",
"answer": "setup：HVT的cell换成LVT的cell；增大cell的大小/驱动；调整cell的位置\nhold:增加datapath的延迟；减少datapath的驱动能力",
"explanation": "修复setup通常需要减少数据路径延时：使用LVT（低阈值）单元更快，增大驱动（upsize）加快充放电，调整位置缩短连线。修复hold则相反，需要增加数据路径延迟：插入延迟单元（delay buffer）、减小驱动能力（downsize）、增加连线长度。注意，修hold时不能破坏setup，所以需谨慎平衡。"
},
{
"id": 71,
"question": "floorplan需要哪些输入？",
"answer": "1、.v 2、.lib和.lef 3、.sdc 4、tlu+ file 5、设计的物理划分信息 6、height,width,aspect ratio、utilization 7、macro pad/pin position",
"explanation": "Floorplan输入包括网表、库（时序和物理）、约束文件、寄生参数文件、模块划分信息、芯片尺寸和利用率目标、宏单元和IO引脚位置等。这些信息用于确定芯片整体的布局规划。"
},
{
"id": 72,
"question": "floorplan输出是什么？",
"answer": "1、die/block area 2、I/O pad placed 3、Macro placed 4、power grid design 5、power pre routing 6、std-cell placement area",
"explanation": "Floorplan输出包括芯片/模块的边界尺寸、IO pad的位置、宏单元的位置、电源网格设计、电源预布线、标准单元可放置区域。这些输出是后续放置和布线的基础。"
},
{
"id": 73,
"question": "什么是keep-out margin？",
"answer": "fixed macro旁边围绕的区域，不允许放置std-cell和macro，只允许放置buffer和inverter",
"explanation": "Keep-out margin是宏单元周围的保护区域，用于防止标准单元和其他宏单元太靠近，避免干扰宏单元的时序或造成拥塞。通常在这个区域内只允许放置缓冲器或反相器，以便为宏单元提供驱动和隔离。"
},
{
"id": 74,
"question": "什么是IR drop？",
"answer": "每次金属都具有电阻，当电流通过金属就会产生IR drop.电阻越大，IR drop越大。",
"explanation": "IR drop是由于电源网络金属导线电阻引起的电压降，当电流流过时，到达单元供电端的电压低于电源电压。过大的IR drop会导致逻辑门延时增加，甚至逻辑错误。设计时需优化电源网络，保证供电电压稳定。"
},
{
"id": 75,
"question": "如何使用HVT和LVT cell降低泄露功耗？",
"answer": "HVT cell具有更大的延时和更少的泄露功耗；LVT cell具有更小的延时和更多的泄露功耗。我们可以在关键路径上使用LVT cell，在非关键路径上使用HVT cell。",
"explanation": "阈值电压（Vt）越高，漏电流越小，但延时增加。通过混合使用不同阈值单元，将高阈值（HVT）单元用于非关键路径，低阈值（LVT）单元用于关键路径，可以在保证性能的同时显著降低静态功耗。这是后端设计中常用的功耗优化手段。"
},
{
"id": 76,
"question": "什么是wire load model (WLM)?",
"answer": "WLM是基于设计大小和负载估计延时的方式。",
"explanation": "线负载模型（WLM）在综合阶段用于估算互连线的RC参数，它根据设计规模（如面积、扇出）查找表得到电阻和电容值，从而计算延时。由于没有实际物理信息，WLM精度有限，但在早期阶段能提供合理的估计，帮助综合优化。"
},
{
"id": 77,
"question": "什么是信号完整性（SI, signal integrity）？",
"answer": "SI表征信号传输信息可靠性，和抗相邻信号cross-talk(EM)干扰的能力",
"explanation": "信号完整性关注信号在传输过程中的质量，包括延迟、抖动、噪声、串扰等。在设计初期就要考虑SI，通过布局布线优化、屏蔽、驱动调整等确保信号可靠传输，避免逻辑错误。"
},
{
"id": 78,
"question": "负载电容增加会对Cell延时造成什么影响？",
"answer": "延时增加。负载电容增加，会增加充放电时间从而增加延时，可以利用此原理fix hold violation",
"explanation": "负载电容越大，单元输出端充放电所需时间越长，导致传播延时增加。在时序修复中，可以故意在数据路径上增加负载（如加电容或扇出）来增加延时，从而修复hold违例。但这也会使transition变差，需在允许范围内。"
},
{
"id": 79,
"question": "物理实现流程需要输入哪些文件？",
"answer": "逻辑库.lib、物理库.lef、工艺文件.tf、tlu+文件、门级网表.v、时序约束.sdc、scandef、upf",
"explanation": "物理设计输入包括：逻辑库（时序信息）、物理库（版图信息）、工艺文件（层定义）、RC寄生参数文件（tlu+）、门级网表、时序约束、扫描链定义文件（scandef）、低功耗意图文件（upf）等。这些文件缺一不可，共同支持后端流程。"
},
{
"id": 80,
"question": "PVT（process、voltage、temperature）对Cell的延时有什么影响？",
"answer": "工艺慢、电压低、温度高时延时变大；工艺快、电压高、温度低时延时变小。但温度有温度反转效应。",
"explanation": "PVT影响晶体管的开关速度和驱动能力。通常工艺越慢（ss corner）、电压越低、温度越高，单元延时越大；反之越小。但存在温度反转效应，即在高电压下，低温可能使延时反而增大（因为载流子迁移率提高但阈值电压也变化）。因此时序分析需要覆盖多个corner。"
},
{
"id": 81,
"question": "什么是tech file？",
"answer": "包含layer和via的名称、物理特性（宽度、高度、面积）、电学特性（电流密度）、单位精度、颜色、物理设计规则等",
"explanation": "技术文件（tech file）是描述工艺层和通孔属性的文件，包含各层的物理尺寸、电学参数、设计规则（如最小间距、宽度）、电迁移规则等。EDA工具根据tech file进行布线、DRC检查等。"
},
{
"id": 82,
"question": "什么是tlu+ file？",
"answer": "包含金属的RC参数用于计算线延时。如果没有tlu+文件，可以使用.ift（interconnect tech file）文件转换。加载tlu+文件时需要加载Max tlu+、Min tlu+、Typ tlu+和map文件，其中map文件映射tf文件和tlu+文件之间metal和via的名称。",
"explanation": "TLU+文件是封装了RC提取所需信息的数据库，用于精确计算互连线延时。它包含各层金属的单位电阻、电容、耦合电容等。通常需要worst、best、typical三种文件来覆盖不同工艺角。map文件用于将tech file中的层名映射到TLU+的层名。"
},
{
"id": 83,
"question": "什么是.lib file？",
"answer": ".lib是逻辑库，包含std和macro的时序信息、功能信息、逻辑设计规则（max transition、max capacitance、max fanout）、延时模型、功耗信息",
"explanation": "逻辑库（.lib）以表格形式提供单元的各种特性：包括输入到输出的延时（依据输入转换和负载电容查表）、时序检查（setup/hold）、功耗（内部功耗和泄漏功耗）、设计规则约束（如max_transition, max_capacitance）等。它是综合和STA的基础。"
},
{
"id": 84,
"question": "什么是.lef file？",
"answer": ".lef是物理库，包含std和macro的物理信息，例如宽度、高度、布局、走线方向、天线效应规则、blockage。物理设计工具会生成FRAM view用于自动布局布线、Cell view用于Tapeout。",
"explanation": "物理库（.lef）描述了单元的版图抽象信息，包括外形尺寸、引脚位置、走线层、天线规则、阻塞区域等。布局布线工具使用LEF获得单元物理信息，而最终流片需要完整的GDSII（由Cell view提供）。"
},
{
"id": 85,
"question": "cell和net的延时是怎么计算的？",
"answer": "Cell delay：从逻辑门输入到输出的延时，根据input slew(input transition)和output load查表\nNet delay：在完成布局布线后根据RC参数计算，越往后越精确。",
"explanation": "单元延时由输入转换时间和输出负载电容共同决定，通过查表（NLDM或CCS模型）获取。互连线延时在预布线阶段用估算模型，布线后用RC提取工具精确计算（如Elmore、AWE等）。延时精度随流程推进逐步提高，签核时使用最精确的寄生参数。"
},
{
"id": 89,
"question": "如果设计具有600个macro，你将怎么进行macro placement？",
"answer": "首先使用工具自动执行macro placement，然后根据飞线和数据流调整。如果macro2macro、input2macro连接较多，需要靠近摆放在边界；如果std2macro较多，考虑放在内部。另外可以使用blockage指导工具的placement engine",
"explanation": "大量宏单元布局需要综合运用工具自动化和人工调整。工具先基于连接密度进行初始布局，人工根据数据流优化。若宏单元之间连接密集，可放在边缘相近位置；若宏单元与标准单元交互多，则可放在内部但留足够空间。使用blockage可以强制工具遵守特定摆放规则。"
},
{
"id": 90,
"question": "如果模块初始利用率太高，需要做什么？",
"answer": "尝试多种macro placement，没有改善就增加模块的面积",
"explanation": "利用率过高会导致布局拥塞，布线困难。首先尝试优化宏单元布局，释放更多标准单元区域；如果仍无法改善，只能扩大芯片面积（如增加die尺寸）或重新划分模块。"
},
{
"id": 100,
"question": "为什么需要在placement之前完成power routing？",
"answer": "power plan是保证所有的macro和std具有足够稳健的电源供应。物理设计中需要完成power routing、clock routing和signal routing。在placement之前完成power routing是为了更好地利用congestion分析估计走线资源，否则即使完成std placement，但是没有走线资源也没有意义。",
"explanation": "电源网络是芯片的血液，必须在布局前规划好，否则标准单元无法获得稳定供电。预布线电源网络（power pre-routing）可确保电源路径畅通，并且电源线的占用会影响拥塞分析，提前规划能更准确地预估可布线性。"
},
{
"id": 101,
"question": "在哪些金属层完成power routing？",
"answer": "在最高金属层，因为高层金属电阻低，可以降低power mesh的IR drop，同时不占用低层金属的走线资源，防止congestion问题。",
"explanation": "高层金属（如M6/M7）厚度大、电阻低，适合走电源线，能有效降低IR drop。同时高层金属走线资源相对充裕，不占用底层信号线，减少拥塞。但高层金属过多会使电源网格太密，因此通常结合mid-layer（如M4/M5）做电源条带。"
},
{
"id": 102,
"question": "什么是PG ring、PG stripe、PG rail?",
"answer": "PG ring around the chip; PG stripe across the chip; PG rail to std cell",
"explanation": "电源环（PG ring）包围芯片或模块，提供外部电源接入；电源条带（PG stripe）横穿芯片，增强供电能力；电源轨（PG rail）位于标准单元行内，为每个单元提供VDD/VSS。这三层结构组成完整的电源分配网络。"
},
{
"id": 103,
"question": "什么是IR drop?",
"answer": "电源网络（VDD，VSS）通过金属走线，由于金属的电阻导致到达电源PIN的时候电压下降。IR drop会影响设计的功能和时序",
"explanation": "IR drop是电源网络电阻引起的电压降，当负载电流增大时，压降更严重。IR drop会导致逻辑门供电电压下降，延时增加，甚至功能失败。动态IR drop（dI/dt）由电流变化率引起，静态IR drop由平均电流引起。分析IR drop可确保电源网络稳健。"
},
{
"id": 104,
"question": "设计中存在哪些时序路径？",
"answer": "path1: input to register; path2: register to register; path3: register to output; path4: input to output",
"explanation": "时序路径分为四种：输入到寄存器（input2reg）、寄存器到寄存器（reg2reg）、寄存器到输出（reg2output）、输入到输出（input2output）。STA工具会分析所有路径，确保满足约束。"
},
{
"id": 105,
"question": "什么是End Cap Cell？",
"answer": "这种Cell没有信号连接，仅连接到power rail之间的VDD和VSS。用于维持N阱连续性，放置在std row边界",
"explanation": "端帽单元（endcap）放置在标准单元行的两端，用于保证阱的连续性和光刻一致性。它们没有逻辑功能，只连接电源和地，避免行末端出现阱断开。"
},
{
"id": 106,
"question": "什么是Well Tap Cell？",
"answer": "这种Cell分别将电源连接到衬底和N阱。通过在整个设计中以规则的间隔放置Well Tap Cell，以避免latch-up问题。",
"explanation": "阱接触单元（well tap）将N阱连接到VDD，P衬底连接到VSS，提供低阻抗偏置，防止寄生双极晶体管触发导致latch-up。它们必须按照工艺规则均匀分布，否则有风险。"
},
{
"id": 107,
"question": "EDA工具在placement阶段完成什么工作？",
"answer": "在placement阶段完成std cell的布局工作，macro placement工作在floorplan阶段完成。根据具体设计情况，Placement可以是timing-driven、congestion-driven或者power-driven。需完成coarse placement、legalization、High Fan-out Net Synthesis（HFNS）、时序功耗优化、area-recovery、scan reorder、tie cell insertion",
"explanation": "布局阶段分为全局布局（coarse）和详细布局（legalization）。全局布局将单元大致放到各区域，详细布局消除重叠，使单元落在合法位置。同时会进行高扇出网络综合、时序和功耗优化、扫描链重排、tie cell插入等，以满足约束。"
},
{
"id": 108,
"question": "什么是def文件？",
"answer": ".def文件包含macro、std cell、I/O pin等形状坐标、方向、布局信息，SCANDEF包含scan chain连接关系",
"explanation": "DEF（Design Exchange Format）文件用于传递物理设计数据，包括单元位置、方向、连线、电源网络等。SCANDEF是DEF的扩展，特别记录扫描链的连接。EDA工具间通过这些文件交换布局信息。"
},
{
"id": 109,
"question": "标准单元库中的9T和12T表示什么？",
"answer": "表示9 track和12 track，定义std cell的高度。12T面积大，功耗、延时小。展示了数字IC面积、功耗、性能的折中。",
"explanation": "T（track）是布线轨道数，单元高度以轨道数衡量。9T库单元高度较小，面积紧凑，但驱动较弱，功耗和延时稍高；12T库单元更高，驱动能力更强，功耗和延时更低，但面积较大。选择哪种库需根据性能、功耗、面积需求权衡。"
},
{
"id": 110,
"question": "什么是NLDM和CCS模型？",
"answer": "Cell的延时和input slew(transition)和output load相关。NLDM(Non linear delay model)和CCS(composite current source)模式就是用来估计Cell延时的，其中CCS更加准确。",
"explanation": "NLDM通过查找表（根据输入转换时间、输出负载电容）获取延时，简单高效。CCS模型考虑输出电流的波形，对深亚微米工艺更准确，能捕捉非线性电容效应。CCS更精确但计算量大，通常用于签核。"
},
{
"id": 111,
"question": "有哪些低功耗设计方法？",
"answer": "clock gating、multi power domain、power gating、multi Vt library",
"explanation": "低功耗设计方法包括：门控时钟（降低动态功耗）、多电压域（降低电压）、电源门控（降低漏电）、多阈值库（优化漏电）等。此外还有DVFS（动态电压频率调节）、低功耗工艺、无时钟逻辑等。"
},
{
"id": 112,
"question": "什么是placement blockage？",
"answer": "在placement和CTS阶段用来指导std cell、inv、buffer的摆放。",
"explanation": "Placement blockage是布局约束，限制单元放置区域，用于控制拥塞、保护宏单元、预留布线通道等。在CTS阶段也可用于控制时钟缓冲器的摆放，避免放在高拥塞区域。"
},
{
"id": 113,
"question": "怎么修复EM（Electromigration）问题？",
"answer": "Down size the driver、increase the metal width、add more via、spread cell",
"explanation": "EM修复可通过减小驱动单元的尺寸（降低电流密度）、增加金属线宽度（减小电阻和电流密度）、增加通孔数量（提高电流承载）、分散单元（减少局部电流集中）等方法实现。"
},
{
"id": 114,
"question": "什么是SOI工艺？",
"answer": "silicon on insulator，降低泄漏功耗。",
"explanation": "绝缘体上硅（SOI）是在硅衬底上植入绝缘层，将器件与衬底隔离。这种工艺减小了寄生电容，消除了闩锁效应，降低了漏电流，同时提高了速度，常用于高性能低功耗芯片。"
},
{
"id": 115,
"question": "placement完成之后需要check什么？",
"answer": "timing report、legality、congestion、utilization",
"explanation": "布局后需检查时序报告（预估是否满足）、布局合法性（无重叠、无误）、拥塞状况、利用率是否过高。这些检查确保布局质量，为下一步CTS和布线打好基础。"
},
{
"id": 116,
"question": "在placement之后有哪些fix setup violation的方法？",
"answer": "插入buffer，条件是wire delay下降 > cell delay上升；减少buffer，条件是cell delay下降 > wire delay上升；HVT换成SVT、LVT；增加驱动，upsize cell；调整cell的位置，减少wire delay；调整skew",
"explanation": "修复setup的方式有多种，需要权衡。插入buffer可分段长线，但增加单元延迟，只有收益大于成本才有效。减少buffer适合树型结构。更换低阈值单元、增大驱动、移动单元靠近接收端，以及调整时钟skew（useful skew）也能修复。"
},
{
"id": 117,
"question": "什么是follow pins？",
"answer": "标准单元的power rail，给标准单元供电",
"explanation": "Follow pins是标准单元内的电源轨引脚，这些引脚在物理上呈水平延伸，与标准单元行的电源轨道相连，为每个单元提供VDD和VSS。布局时确保follow pins与电源轨道对齐。"
},
{
"id": 118,
"question": "什么是timing borrowing？",
"answer": "由于latch的电平触发的特性，数据DIN在opening edge和closing edge之间到来都有效，无需在opening edge之前到来。但是，后面的时序路径会变得更加严格。",
"explanation": "时序借用发生在锁存器（latch）而不是触发器（flip-flop）。锁存器在电平有效期间透明，数据可以晚到但必须在关闭沿前稳定，因此前级路径可以借用后级的时间，但后级路径的裕量会减少。这有助于改善整体时序，但需要精确分析。"
},
{
"id": 119,
"question": "什么是logic restructuring？",
"answer": "重新组织逻辑，以满足设计需求（时序、功耗、面积等）。逻辑关系没变，但是时序得到了改善。",
"explanation": "逻辑重组通过改变逻辑门的连接方式（如调整树结构、减少关键路径逻辑级数），在不改变逻辑功能的情况下优化时序、面积或功耗。例如，将深堆叠的AND树改为平衡树，可缩短关键路径。"
},
{
"id": 120,
"question": "什么是coarse placement和legalization？",
"answer": "coarse placement(global placement)，此时将std cell粗略地放置在Core的GRC（global routing cell）里面以估计congestion，可能存在overlap；legalization (detail placement)将std cell放置在row上，消除overlap。",
"explanation": "粗略布局（coarse）将单元放到全局布线单元（GRC）中，不考虑重叠，用于估算拥塞。合法化（legalization）将单元放到标准单元行中，并消除所有重叠，保证满足设计规则。通常先coarse再legalization。"
},
{
"id": 121,
"question": "什么是MMMC？",
"answer": "MMMC是指multi mode multi corner, voltage: best、worst、typical = 3; temperature: best、worst、typical = 3; process: fast-fast, fast-slow, slow-fast, slow-slow, typical = 5; interconnect: max c、min c、max rc、min rc, typical = 5; mode: function、test = 2; Total = 3X3X5X5X2 = 450。不同mode和corner的时序分析都不一样，sign off需要满足所有的情况。",
"explanation": "MMMC（多模式多工艺角）全面覆盖芯片可能工作于的功能/测试模式以及工艺、电压、温度的极端组合。例如，测试模式下的时钟频率和约束不同，功能模式下可能有更多路径。通过并行分析所有组合，可确保芯片在各种条件下都能正常工作，但计算量大，需筛选代表性组合。"
},
{
"id": 122,
"question": "为什么不同一个大buffer驱动输出负载，而采用级联增加buffer大小的方式？",
"answer": "级联buffer可以更有效地驱动大负载，同时优化transition和延时，避免单个大buffer的过大功耗和面积。",
"explanation": "单一的大buffer驱动大负载时，由于输入电容也大，会导致前级路径的延时增大；同时大buffer的功耗和面积也大。采用级联小buffer，逐步放大驱动能力，每级buffer的输入电容较小，对前级影响小，同时输出驱动能力足够，能有效控制延时和功耗。"
},
{
"id": 123,
"question": "对于一个reg to reg的时序路径，如果使用insertion buffer方式修复setup违例，应该靠近launch flop还是capture flop？",
"answer": "capture flop，即end-point。因为靠近launch flop可能会影响其他以该launch flop为start-point的时序路径。",
"explanation": "插入缓冲器的位置会影响时序修复效果。如果靠近capture端，只会延迟本路径的数据到达时间（增加路径延时），不会影响以launch端为起点的其他路径。如果靠近launch端，则所有从该launch端出发的路径都会变慢，可能导致其他路径违例，所以应靠近capture端。"
},
{
"id": 124,
"question": "为什么标准单元的宽度是M2 pitch的整数倍？",
"answer": "最大化routing track.",
"explanation": "标准单元宽度设计为金属2（M2）布线间距（pitch）的整数倍，这样单元之间的引脚对齐，能最大化M2层的可用布线轨道，便于布线工具使用，减少浪费。"
},
{
"id": 125,
"question": "什么是多电压技术？",
"answer": "多电压技术是指根据设计对性能和功耗的需求，不同模块工作在不同的电压域。低功耗需求模块工作在低电压域（电压和动态功耗呈二次方关系），高性能需求模块工作在高电压域。实际上，由于多电压域技术增加设计的复杂性，插入level shifter cell以及电压对时序的影响，功耗和电压并不是理想的二次方关系，但是依然有比较大的功耗收益。",
"explanation": "多电压域（multi-voltage）将芯片划分为多个电源域，每个域使用不同的电源电压。低电压域用于非关键路径，降低动态功耗（与电压平方成正比）；高电压域用于关键路径，保证性能。需要插入电平转换器（level shifter）和隔离单元来处理跨域信号，增加了设计复杂度，但总体功耗收益显著。"
},
{
"id": 126,
"question": "placeopt阶段工具具体存在哪些优化技术？",
"answer": "timing optimization: 1、关键路径增加优化权重 2、timing driven option, high effort 3、允许使用LVT/ULVT cell 4、pin swapping。最差路径的输入pin靠近输出pin 5、insert buffer 6、cell sizing 7、cloning 8、逻辑重组。\ncongestion optimization: 1、cell padding 2、placement blockage 3、设置density 4、congestion driven option\n动态功耗优化: 1、优化transition time和load capacitance 2、优化toggle rate(switching activity)\n泄露功耗优化: 1、多阈值cell",
"explanation": "placeopt阶段会进行综合性的优化，包括时序、拥塞、动态功耗和泄漏功耗。时序优化通过逻辑重组、插buffer、调整单元尺寸、引脚交换等；拥塞优化通过单元填充、设置blockage、密度控制等；功耗优化通过减小翻转率、优化负载等。这些优化相互影响，需要权衡。"
},
{
"id": 127,
"question": "什么是线负载模型（WLM）？",
"answer": "通过在routing之前根据芯片的面积和扇出估计线电阻电容的方式估计线延时。",
"explanation": "线负载模型（WLM）是综合阶段的一种估算方法，它基于面积和扇出数，从预定义表格中查找电阻和电容值，来估算互连线的延时。由于缺乏物理信息，精度有限，但速度快，用于早期时序优化。"
},
{
"id": 128,
"question": "什么是cell density和pin density?",
"answer": "分别是特定区域的cell数和pin数，这是导致设计存在congestion问题的原因",
"explanation": "单元密度是区域内单元总面积占可用面积的比例，过高会导致无法放置更多单元；引脚密度是区域内引脚数量，过高会导致布线困难。两者都过高会导致拥塞。"
},
{
"id": 129,
"question": "什么是blockage？",
"answer": "blockage是对工具placement和routing的干预指导。\nhard placement blockage：不允许摆放任何std cell、inv、buffer，用来解决congestion问题\nsoft placement blockage：不允许摆放任何std cell、允许优化期间摆放inv、buffer\npartial placement blockage：可以控制某些模块中std cell的摆放，解决cell density问题\nrouting blockage: 指导某些金属层的走线\nHALO (keep out margin): 跟随在macro周围，不允许std cell的摆放，只允许inv和buffer摆放。",
"explanation": "Blockage是放置和布线的禁区，用于控制布局和布线行为。Hard blockage完全禁止单元，常用于保护宏单元或预留通道；Soft blockage允许缓冲器，便于优化；Partial blockage允许一定百分比；Routing blockage禁止某些层布线；HALO围绕宏单元动态移动，防止单元侵入。合理使用能大幅提升设计质量。"
},
{
"id": 130,
"question": "什么是HVT、LVT Cell？",
"answer": "HVT Cell: high threshold voltage cell, 更慢，泄露功耗更少，可以用来修复泄露功耗问题\nLVT Cell: low threshold voltage cell, 更快，泄露功耗更多，可以用来修复时序问题\nSVT Cell: 在HVT和LVT之间的折中",
"explanation": "阈值电压（Vt）越高，晶体管关断时泄漏电流越小，但导通时驱动能力下降，导致延时增大。HVT单元速度慢但功耗低；LVT单元速度快但功耗高；SVT则介于两者之间。根据时序裕量灵活选择，可在性能和功耗间取得最佳平衡。"
},
{
"id": 131,
"question": "什么是sdc文件？",
"answer": "SDC代表：Synopsys Design constraints, 用来指定设计意图，即设计约束，包括时序，功耗，面积。sdc文件是基于tcl格式的，文件中包括sdc version、sdc units、comments、operating condition、WLM、drive/load、design rule constraint、timing constraint、timing exceptions、area constraints、power constraints等等",
"explanation": "SDC文件是时序约束的核心，定义了时钟、输入输出延迟、例外路径、设计规则约束等。它贯穿综合、布局、布线、签核全流程。SDC的准确性和完整性对设计收敛至关重要。"
},
{
"id": 132,
"question": "什么是false path？",
"answer": "不需要满足setup/hold的时序路径，和功能无关。默认STA工具会分析所有路径，对于false path，需要人为指定timing exceptions。",
"explanation": "假路径（false path）是逻辑上不可能激活的路径，例如通过互斥选择器或静态配置的路径。如果不设置例外，工具会尽力优化这些路径，浪费资源，甚至导致过度约束。使用set_false_path或set_disable_timing可排除它们。"
},
{
"id": 133,
"question": "什么是STA？",
"answer": "静态时序分析，不需要动态仿真",
"explanation": "STA（静态时序分析）是一种穷举所有路径并计算延时的分析方法，无需仿真激励，速度极快，能覆盖所有路径，是数字设计时序验证的核心。但它不考虑逻辑功能，需要约束和例外来排除假路径。"
},
{
"id": 134,
"question": "什么是setup time？",
"answer": "在时钟边沿到来之前数据稳定的时间",
"explanation": "建立时间（setup time）是触发器为了正确采样数据，要求在时钟边沿到来之前数据必须保持稳定的最小时间。如果数据变化太晚，触发器可能采样到不确定值，导致功能错误。"
},
{
"id": 135,
"question": "什么是hold time？",
"answer": "在时钟边沿到来之后数据保持稳定的时间",
"explanation": "保持时间（hold time）是触发器要求数据在时钟边沿之后必须继续稳定的最小时间，防止数据因时钟边沿后变化而影响采样。如果数据变化太早，同样会出错。"
},
{
"id": 136,
"question": "什么是arrival time？",
"answer": "在datapath上数据到达的时间",
"explanation": "到达时间（arrival time）是信号从起点（如输入端口或launch触发器）沿着路径到终点（如capture触发器）的实际传播时间。在STA中，计算数据路径的到达时间与要求时间比较，判断时序违例。"
},
{
"id": 137,
"question": "什么是required time？",
"answer": "在clock path上时钟到达的时间",
"explanation": "要求时间（required time）是数据必须到达的最晚时间（针对setup）或最早时间（针对hold），它由时钟到达时间、周期、建立/保持时间决定。STA计算数据到达时间与要求时间的差得到slack。"
},
{
"id": 140,
"question": "什么是slack？",
"answer": "required time和arrival time之间的差",
"explanation": "Slack是时序裕量，正表示满足要求，负表示违例。对于setup，slack = required_time - arrival_time；对于hold，slack = arrival_time - required_time。优化时序的目标是消除负slack。"
},
{
"id": 141,
"question": "STA中有哪些datapath？",
"answer": "input2reg, reg2reg, reg2output, input2output",
"explanation": "STA分析四种标准路径：从输入端口到寄存器（input2reg）、从寄存器到寄存器（reg2reg）、从寄存器到输出端口（reg2output）、从输入到输出（input2output）。每种路径都有对应的约束方式。"
},
{
"id": 142,
"question": "有哪些timing constraints exceptions？",
"answer": "false path、multi cycle path、min/max path",
"explanation": "时序例外包括：假路径（set_false_path）表示不必检查；多周期路径（set_multicycle_path）表示允许数据使用多个时钟周期；最小/最大路径（set_min_delay/set_max_delay）用于约束特定路径的延迟范围。这些例外准确描述设计意图，避免过度约束。"
},
{
"id": 143,
"question": "什么是clock latency？",
"answer": "从时钟源（clock source）到触发器clock pin的延时",
"explanation": "时钟延迟包含源延迟（从芯片外部或PLL输出到时钟定义点）和网络延迟（从定义点到触发器时钟端）。源延迟由外部环境决定，网络延迟由时钟树决定。"
},
{
"id": 144,
"question": "什么是clock skew？",
"answer": "同一个clock source到不同clock pin的延时之差",
"explanation": "时钟偏斜是不同寄存器时钟端到达时间的差值。正偏斜表示数据到达更晚，有助于setup但可能损害hold；负偏斜则相反。CTS致力于减小skew，但有时也有意利用skew优化时序。"
},
{
"id": 146,
"question": "什么是cell delay或者propagation delay？",
"answer": "从cell的input到output的延时",
"explanation": "单元延迟是输入端口信号变化到输出端口信号变化的传播时间，受输入转换、输出负载、工艺角、电压、温度影响。它通过查表得到，是时序计算的基础。"
},
{
"id": 147,
"question": "什么是net delay？",
"answer": "从一个cell的output到下一个cell的input之间的线延时",
"explanation": "互连线延迟由金属线的RC参数决定，包括电阻和电容。布线前用估算模型，布线后用RC提取工具精确计算。线延迟在现代设计中占比越来越大。"
},
{
"id": 148,
"question": "什么是drive strength？",
"answer": "drive strength是描述cell对其输出端上负载电容充放电的能力。",
"explanation": "驱动强度与单元尺寸有关，尺寸大能提供更大电流，驱动电容负载更快，但输入电容和功耗也增大。库中通常有不同驱动强度的单元（如X1、X2、X4等）供选择。"
},
{
"id": 149,
"question": "什么是clock gating？",
"answer": "clock gating是降低同步设计中动态功耗的技术。通过增加额外的逻辑来修剪clock tree.",
"explanation": "门控时钟（clock gating）在模块不工作时关闭时钟，减少时钟树的翻转活动，从而降低动态功耗。常用集成时钟门控单元（ICG）实现，能有效节省功耗，但会引入额外的时钟延迟，需谨慎设计。"
},
{
"id": 150,
"question": "什么是OCV（on chip variation）？",
"answer": "由于PVT的不同，芯片上不同区域的延时不同。通过derate来建模，使得fast path更fast, slow path更加slow.",
"explanation": "OCV指芯片内部不同位置的工艺参数差异，导致延时变化。为保守起见，对路径加derate系数，如setup分析时数据路径乘以1.1（更慢），时钟路径乘以0.9（更快）。但整体OCV过于悲观，可结合CRPR（公共路径悲观消除）来减少过度悲观。"
},
{
"id": 151,
"question": "为什么我们需要STA？",
"answer": "STA提供更加快速，更加简单的方式来检查设计中所有路径中的时序。",
"explanation": "STA能穷举所有路径并计算时序，无需仿真激励，速度快，能发现潜在时序风险。它解决了动态仿真无法覆盖所有路径的问题，是数字设计不可或缺的工具。"
},
{
"id": 152,
"question": "什么是useful skew？",
"answer": "在clock path上增加的skew，用于修复setup timing.",
"explanation": "有用偏斜（useful skew）是故意在时钟路径上引入偏斜，例如将capture触发器的时钟提前或延迟，从而满足setup或hold要求。例如，延迟capture时钟可增加setup裕量，但可能影响其他路径。它是时序修复的常用技巧。"
},
{
"id": 153,
"question": "什么是CRPR（clock reconvergence pessimism removal）？",
"answer": "ocv模式有时也会太悲观，如果launch和capture有common path，那么这段common path的ocv就是一样的，所以开启了ocv模式后，需要同时开启crpr（clock reconvergence pessimism removal）",
"explanation": "CRPR用于移除OCV分析中公共时钟路径上的悲观量。当launch和capture时钟路径有一段相同（如时钟源到分叉点），这段路径上的延时差异其实不存在，OCV分析却可能人为地让launch慢、capture快，导致过度悲观。CRPR通过识别公共路径并补偿derate，提升时序分析的准确性。"
},
{
"id": 154,
"question": "什么是recovery time？",
"answer": "对于异步信号释放时，其在下一个时钟边沿之前最少需要稳定的时间。",
"explanation": "恢复时间（recovery time）类似建立时间，但用于异步控制信号（如复位、置位）释放时，要求它在时钟边沿前稳定，以防触发器进入亚稳态。如果恢复时间不满足，触发器可能无法正确离开复位状态。"
},
{
"id": 155,
"question": "什么是removal time？",
"answer": "对于异步信号释放时，其在上一个时钟边沿之后最少需要稳定的时间。",
"explanation": "移除时间（removal time）类似保持时间，用于异步控制信号撤销时，要求它在时钟边沿后保持稳定，防止触发器收到不确定的复位释放。满足恢复/移除时间可确保异步信号正确同步。"
},
{
"id": 156,
"question": "STA有哪些缺点？",
"answer": "结果比较悲观，需要定义timing requirements和timing exceptions，很难处理异步电路",
"explanation": "STA基于静态分析，不考虑实际逻辑功能，可能对假路径过度约束，因此需要精确的例外。此外，STA难以处理异步电路和时序约束的复杂性。但通过合理设置，STA仍是主流方法。"
},
{
"id": 157,
"question": "什么是多周期路径？",
"answer": "多周期路径（multi-cycle path）是一种timing exception，根据设计需求重新指定capture周期。通常，默认周期为1，即触发器之间的组合逻辑延时不能超过一个周期。默认情况，在下一周期检查setup违例，在当前周期检查hold违例。假设时钟周期为5ns，多周期设计需求为3个周期，则需要使用sdc约束改变setup检查周期：set_multicycle_path 3 - setup - from [get_pins <launch_flop>/Q] - to [get_pins <capture_flop>/D]；此时setup检查从5ns变为15ns，hold检查为setup检查的前一个周期为10ns，hold检查不符合设计需求，因为hold检查需要和launch flop同一个周期，使用sdc约束改变hold检查周期：set_multicycle_path 2 - hold - from [get_pins <launch_flop>/Q] - to [get_pins <capture_flop>/D]。",
"explanation": "多周期路径允许数据在多个时钟周期内传播，如信号处理中的超长组合逻辑。需分别设置setup和hold的周期数：setup周期数表示允许的周期数，hold周期数通常是setup周期数减1（因为hold检查应回到launch周期）。确保正确设置能避免不必要的时序违例。"
},
{
"id": 158,
"question": "为什么scan reorder能够减少congestion?",
"answer": "scan reorder是指在placement之后重新连接scan chain, 优化timing和congestion, 因为逻辑综合后的scan chain是任意连接的。在scan reorder之后, 需要更少的走线资源, 可以优化congestion问题, 但是减少的走线可能会造成hold时序违例, 可以通过插入buffer解决。",
"explanation": "综合时扫描链的连接基于逻辑关系，不考虑物理位置。布局后，寄存器位置已定，通过重排扫描链，使相邻寄存器的物理距离更近，减少长距离绕线，改善拥塞和时序。但重排会改变扫描路径延迟，可能产生hold违例，需插入delay buffer修复。"
},
{
"id": 159,
"question": "为什么需要进行IR drop分析？",
"answer": "IR drop会影响逻辑单元上的电压水平，会对设计的时序计算造成影响",
"explanation": "IR drop导致供电电压下降，单元延时增加，时序可能违例。动态IR drop还会引起时钟抖动。通过IR drop分析，可以评估电源网络是否足够稳定，并指导电源网络的优化，避免流片风险。"
},
{
"id": 160,
"question": "什么是逻辑DRC，怎么fix？",
"answer": "逻辑DRC(design rule constraints)包括max transition、max capacitance、max fanout\nmax transition:是指对负载充放电最长的时间。设计中output transition是input transition和output load的函数，设计的max_transition约束值也可以在库里面找到。修复max_transition违例通过提高驱动能力和降低负载电容电阻着手。\nmax_capacitance:最大负载电容约束，会影响延时计算。\nmax_fanout:最多能驱动的扇出数，会影响输出负载。上述这些逻辑DRC约束需要在综合的时候施加，工具修复这些约束的优先级要高于时序问题，其中max_transition最重要。",
"explanation": "逻辑DRC是设计规则约束，不同于物理DRC。它们限制电路的电气性能，如最大transition、最大电容、最大扇出。修复方式包括增大驱动单元尺寸、插入缓冲器、减少负载等。这些约束的优先级通常高于时序，因为违反会导致信号质量恶化。"
},
{
"id": 161,
"question": "后端设计中，cloning和buffering有什么区别？",
"answer": "都是时序优化技术。cloning是复制驱动cell；buffering是插入buffer。",
"explanation": "Cloning复制原单元，将负载分配到多个副本，每个副本驱动一部分，减少单个单元的负载，同时保持逻辑功能。Buffering是在路径中插入缓冲器，主要用于分割长线或提高驱动。两者异曲同工，但cloning适用于负载过大且需要多个副本的场景，而buffering适用于连线过长或驱动不足的场景。"
},
{
"id": 162,
"question": "什么是latency?",
"answer": "latency是时钟延时。source latency: 从时钟起始点到定义点的延时；network latency: 从时钟定义点到sink点的延时",
"explanation": "时钟延迟（latency）由源延迟和网络延迟组成。源延迟包括芯片外部或PLL输出到片上时钟定义点的延迟，网络延迟是从定义点到各寄存器时钟端的延迟。总体延迟影响时序分析中的时钟到达时间。"
}
]