export interface GanZhiDetail {
  name: string;
  wuxing: string;
  yinyang: string;
  direction: string;
  season: string;
  organ: string; // 对应脏腑
  meaning: string; // 核心含义
  personality: string; // 性格象义
}

export const GAN_DETAILS: Record<string, GanZhiDetail> = {
  '甲': { name: '甲', wuxing: '木', yinyang: '阳', direction: '东方', season: '春季', organ: '胆', meaning: '破土而出的希望', personality: '刚直、有向上心、不屈不挠' },
  '乙': { name: '乙', wuxing: '木', yinyang: '阴', direction: '东方', season: '春季', organ: '肝', meaning: '柔弱但坚韧的藤蔓', personality: '柔和、低调、顽强、善于应变' },
  '丙': { name: '丙', wuxing: '火', yinyang: '阳', direction: '南方', season: '夏季', organ: '小肠', meaning: '普照大地的太阳', personality: '热情、开朗、急躁、无私' },
  '丁': { name: '丁', wuxing: '火', yinyang: '阴', direction: '南方', season: '夏季', organ: '心', meaning: '温润明亮的灯火', personality: '温和、缜密、多疑、奉献' },
  '戊': { name: '戊', wuxing: '土', yinyang: '阳', direction: '中央', season: '四季末', organ: '胃', meaning: '厚重稳固的大地', personality: '沉稳、守信、固执、包容' },
  '己': { name: '己', wuxing: '土', yinyang: '阴', direction: '中央', season: '四季末', organ: '脾', meaning: '孕育万物的田园', personality: '含蓄、多才多艺、敏感、正直' },
  '庚': { name: '庚', wuxing: '金', yinyang: '阳', direction: '西方', season: '秋季', organ: '大肠', meaning: '锋利冷静的刚金', personality: '果断、义气、冷酷、刚健' },
  '辛': { name: '辛', wuxing: '金', yinyang: '阴', direction: '西方', season: '秋季', organ: '肺', meaning: '精致华贵的珠宝', personality: '敏感、自尊心强、求完美、冷傲' },
  '壬': { name: '壬', wuxing: '水', yinyang: '阳', direction: '北方', season: '冬季', organ: '膀胱', meaning: '奔流不息的江河', personality: '智慧、流动、豪放、难以捉摸' },
  '癸': { name: '癸', wuxing: '水', yinyang: '阴', direction: '北方', season: '冬季', organ: '肾', meaning: '润物无声的雨露', personality: '温润、内敛、浪漫、多愁善感' }
};

export const ZHI_DETAILS: Record<string, GanZhiDetail & { shengxiao: string, hour: string }> = {
  '子': { name: '子', wuxing: '水', yinyang: '阳', direction: '北', season: '冬', organ: '膀胱/肾', meaning: '万物滋生的开始', personality: '智慧、机敏、多动', shengxiao: '鼠', hour: '23:00 - 01:00' },
  '丑': { name: '丑', wuxing: '土', yinyang: '阴', direction: '北偏东', season: '冬末', organ: '脾/胃', meaning: '萌芽前的破土', personality: '稳重、执着、耐劳', shengxiao: '牛', hour: '01:00 - 03:00' },
  '寅': { name: '寅', wuxing: '木', yinyang: '阳', direction: '东偏北', season: '初春', organ: '胆/肝', meaning: '生机勃发的生长', personality: '勇敢、进取、刚毅', shengxiao: '虎', hour: '03:00 - 05:00' },
  '卯': { name: '卯', wuxing: '木', yinyang: '阴', direction: '正东', season: '仲春', organ: '肝', meaning: '万物出地的繁茂', personality: '温柔、文雅、敏捷', shengxiao: '兔', hour: '05:00 - 07:00' },
  '辰': { name: '辰', wuxing: '土', yinyang: '阳', direction: '东偏南', season: '季春', organ: '胃', meaning: '万物舒展的成熟', personality: '威严、自信、热烈', shengxiao: '龙', hour: '07:00 - 09:00' },
  '巳': { name: '巳', wuxing: '火', yinyang: '阴', direction: '南偏东', season: '初夏', organ: '心/小肠', meaning: '阳气极盛的散发', personality: '灵动、善辩、缜密', shengxiao: '蛇', hour: '09:00 - 11:00' },
  '午': { name: '午', wuxing: '火', yinyang: '阳', direction: '正南', season: '仲夏', organ: '心', meaning: '万物繁盛的顶峰', personality: '热情、奔放、急躁', shengxiao: '马', hour: '11:00 - 13:00' },
  '未': { name: '未', wuxing: '土', yinyang: '阴', direction: '南偏西', season: '季夏', organ: '脾', meaning: '果实成熟的阶段', personality: '温顺、稳重、内向', shengxiao: '羊', hour: '13:00 - 15:00' },
  '申': { name: '申', wuxing: '金', yinyang: '阳', direction: '西偏南', season: '初秋', organ: '大肠/肺', meaning: '万物初谢的收敛', personality: '活泼、好动、机灵', shengxiao: '猴', hour: '15:00 - 17:00' },
  '酉': { name: '酉', wuxing: '金', yinyang: '阴', direction: '正西', season: '仲秋', organ: '肺', meaning: '果实丰收的满足', personality: '干练、自尊、锐利', shengxiao: '鸡', hour: '17:00 - 19:00' },
  '戌': { name: '戌', wuxing: '土', yinyang: '阳', direction: '西偏北', season: '季秋', organ: '胃', meaning: '能量潜藏的等待', personality: '忠诚、厚道、守正', shengxiao: '狗', hour: '19:00 - 21:00' },
  '亥': { name: '亥', wuxing: '水', yinyang: '阴', direction: '北偏西', season: '冬初', organ: '肾', meaning: '万物收藏的循环', personality: '纯真、沉稳、博爱', shengxiao: '猪', hour: '21:00 - 23:00' }
};
