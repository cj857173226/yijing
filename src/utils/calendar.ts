/**
 * 易经计算工具类
 */

// 十天干
export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const GAN_PINYIN: Record<string, string> = { '甲': 'jiǎ', '乙': 'yǐ', '丙': 'bǐng', '丁': 'dīng', '戊': 'wù', '己': 'jǐ', '庚': 'gēng', '辛': 'xīn', '壬': 'rén', '癸': 'guǐ' };

// 十二地支
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const ZHI_PINYIN: Record<string, string> = { '子': 'zǐ', '丑': 'chǒu', '寅': 'yín', '卯': 'mǎo', '辰': 'chén', '巳': 'sì', '午': 'wǔ', '未': 'wèi', '申': 'shēn', '酉': 'yǒu', '戌': 'xū', '亥': 'hài' };

// 五行
export const WU_XING: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '寅': '木', '卯': '木', '巳': '火', '午': '火', '辰': '土', '戌': '土', '丑': '土', '未': '土', '申': '金', '酉': '金', '亥': '水', '子': '水'
};
// 生肖
export const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/**
 * 获取当前时间的干支信息 (简化版计算)
 * 注意：真正精确的干支需要节气转换，这里提供用于起卦逻辑的基准计算
 */
export function getGanZhi(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  // 年干支计算 (以1900年为基准)
  const yearOffset = year - 1900 + 36;
  const yearGan = TIAN_GAN[yearOffset % 10];
  const yearZhi = DI_ZHI[yearOffset % 12];
  const yearZhiIdx = (yearOffset % 12) + 1; // 用于起卦

  // 时支
  const hourIdx = Math.floor((hour + 1) % 24 / 2);
  const hourZhi = DI_ZHI[hourIdx];
  const hourZhiIdx = hourIdx + 1; // 用于起卦

  return {
    year: `${yearGan}${yearZhi}`,
    yearNum: yearZhiIdx, // 年支数
    month,
    day,
    hour: hourZhi,
    hourNum: hourZhiIdx // 时支数
  };
}

/**
 * 梅花易数时间起卦核心逻辑
 * 公式：(年支数 + 月 + 日) % 8 = 上卦 (余0为8)
 *      (年支数 + 月 + 日 + 时支数) % 8 = 下卦
 *      (年支数 + 月 + 日 + 时支数) % 6 = 动爻
 */
export function getMeiHuaFromTime(date: Date = new Date()) {
  const gz = getGanZhi(date);
  
  let upNum = (gz.yearNum + gz.month + gz.day) % 8;
  if (upNum === 0) upNum = 8;

  let downNum = (gz.yearNum + gz.month + gz.day + gz.hourNum) % 8;
  if (downNum === 0) downNum = 8;

  let moveNum = (gz.yearNum + gz.month + gz.day + gz.hourNum) % 6;
  if (moveNum === 0) moveNum = 6;

  return { upNum, downNum, moveNum, gz };
}
