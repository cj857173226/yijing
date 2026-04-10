export interface WuXingDetail {
  name: string;
  color: string;
  glow: string;
  meaning: string;
  nature: string;    // 特性
  direction: string; // 方位
  season: string;    // 时令
  organPrimary: string; // 脏
  organSecondary: string; // 腑
  emotion: string;   // 情志
  taste: string;     // 五味
  colorName: string; // 五色
  sound: string;     // 五音
  virtue: string;    // 五常
  relationship: {
    sheng: string;   // 我生者
    shouSheng: string; // 生我者
    ke: string;      // 我克者
    shouKe: string;  // 克我者
  };
  description: string;
}

export const WUXING_DATA: Record<string, WuXingDetail> = {
  '木': {
    name: '木', color: '#2ecc71', glow: 'rgba(46, 204, 113, 0.4)',
    meaning: '生发、条达', nature: '曲直', direction: '东方', season: '春',
    organPrimary: '肝', organSecondary: '胆', emotion: '怒', taste: '酸',
    colorName: '青', sound: '角', virtue: '仁',
    relationship: { sheng: '火', shouSheng: '水', ke: '土', shouKe: '金' },
    description: '木代表生命的萌动与生长，具有向上、舒展、柔和而坚韧的特质。'
  },
  '火': {
    name: '火', color: '#e74c3c', glow: 'rgba(231, 76, 60, 0.4)',
    meaning: '温热、升腾', nature: '炎上', direction: '南方', season: '夏',
    organPrimary: '心', organSecondary: '小肠', emotion: '喜', taste: '苦',
    colorName: '赤', sound: '徵', virtue: '礼',
    relationship: { sheng: '土', shouSheng: '木', ke: '金', shouKe: '水' },
    description: '火代表能量的释放与扩散，具有光明、热烈、向上跳跃的特质。'
  },
  '土': {
    name: '土', color: '#f39c12', glow: 'rgba(243, 156, 18, 0.4)',
    meaning: '生化、承载', nature: '稼穑', direction: '中央', season: '长夏',
    organPrimary: '脾', organSecondary: '胃', emotion: '思', taste: '甘',
    colorName: '黄', sound: '宫', virtue: '信',
    relationship: { sheng: '金', shouSheng: '火', ke: '水', shouKe: '木' },
    description: '土代表万物的归宿与孕育，具有厚重、沉稳、中执包容的特质。'
  },
  '金': {
    name: '金', color: '#f1c40f', glow: 'rgba(241, 196, 15, 0.4)',
    meaning: '肃杀、收敛', nature: '从革', direction: '西方', season: '秋',
    organPrimary: '肺', organSecondary: '大肠', emotion: '悲', taste: '辛',
    colorName: '白', sound: '商', virtue: '义',
    relationship: { sheng: '水', shouSheng: '土', ke: '木', shouKe: '火' },
    description: '金代表事物的变革与收敛，具有坚硬、冷静、肃杀、清净的特质。'
  },
  '水': {
    name: '水', color: '#3498db', glow: 'rgba(52, 152, 219, 0.4)',
    meaning: '寒凉、滋润', nature: '润下', direction: '北方', season: '冬',
    organPrimary: '肾', organSecondary: '膀胱', emotion: '恐', taste: '咸',
    colorName: '黑', sound: '羽', virtue: '智',
    relationship: { sheng: '木', shouSheng: '金', ke: '火', shouKe: '土' },
    description: '水代表能量的潜藏与智慧，具有流动、寒凉、向下滋润的特质。'
  }
};
