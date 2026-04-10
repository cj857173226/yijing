<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const modules = [
  {
    id: 'basics',
    title: '易理入门',
    subtitle: '阴阳五行 · 先后天八卦',
    description: '从零开始建立易学思维，掌握起卦解卦的底层逻辑。',
    path: '/basics',
    active: true,
    tag: '必学'
  },
  {
    id: 'hexagrams',
    title: '周易六十四卦',
    subtitle: '天地大道 · 乾坤易理',
    description: '深入探索易经哲学，揭示宇宙万物变易之规律。',
    path: '/hexagrams',
    active: true,
    tag: '经典'
  },
  {
    id: 'divination',
    title: '六爻占卜',
    subtitle: '三枚铜钱 · 问天地',
    description: '以三枚铜钱起六爻，通过本卦与变卦，探寻事物的走向与结果。',
    path: '/divination',
    active: true,
    tag: '互动'
  },
  {
    id: 'wuxing_logic',
    title: '阴阳五行',
    subtitle: '生克制化 · 气质流通',
    description: '通过交互图谱理解金木水火土的动态制衡。',
    path: '/five-elements',
    active: true,
    tag: '核心'
  },
  {
    id: 'ganzhi',
    title: '天干地支',
    subtitle: '时空坐标 · 万物节律',
    description: '系统化展示干支体系背后的时空规律与生命奥秘。',
    path: '/ganzhi',
    active: true,
    tag: '基础'
  },
  {
    id: 'plum-blossom',
    title: '梅花易数',
    subtitle: '心易神占 · 随机应变',
    description: '通过时间、数字或随机事件起卦，领略邵康节心易奥秘。',
    path: '/meihua',
    active: true,
    tag: '进阶'
  }
];

const enterModule = (path: string, active: boolean) => {
  if (active) {
    router.push(path);
  }
};
</script>

<template>
  <div class="portal-container">
    <header class="portal-header">
      <div class="logo-area">
        <div class="taichi-icon">☯</div>
      </div>
      <h1 class="portal-title">易经数字化实验室</h1>
      <p class="portal-subtitle">DIGITAL YIJING LABORATORY</p>
      <div class="header-divider">
        <span class="line"></span>
        <span class="dot"></span>
        <span class="line"></span>
      </div>
    </header>

    <main class="portal-grid">
      <div 
        v-for="mod in modules" 
        :key="mod.id"
        class="portal-card"
        :class="{ 'is-inactive': !mod.active }"
        @click="enterModule(mod.path, mod.active)"
      >
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-tag" v-if="mod.tag">{{ mod.tag }}</div>
          <div class="card-icon">{{ { basics: '源', hexagrams: '卦', divination: '爻', wuxing_logic: '象', ganzhi: '干', 'plum-blossom': '梅' }[mod.id] || '易' }}</div>
          <h2 class="card-title">{{ mod.title }}</h2>
          <p class="card-subtitle">{{ mod.subtitle }}</p>
          <p class="card-desc">{{ mod.description }}</p>
          <div class="card-action" v-if="mod.active">
            立即开启 
            <span class="arrow">→</span>
          </div>
          <div class="card-action is-coming" v-else>
            探索中...
          </div>
        </div>
      </div>
    </main>

    <footer class="portal-footer">
      <p>传承千年智慧 · 解译数字未来</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.portal-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
}

.portal-header {
  text-align: center;
  margin-bottom: 80px;

  .taichi-icon {
    font-size: 3rem;
    color: $yang-gold;
    margin-bottom: 20px;
    animation: spin-slow 20s linear infinite;
    display: inline-block;
  }

  .portal-title {
    font-size: 4rem;
    font-family: 'Ma Shan Zheng', serif;
    letter-spacing: 0.25em;
    margin-bottom: 8px;
    padding: 0 10px;
    line-height: 1.2;
    // 强制显示背景
    background: linear-gradient(to bottom, $yang-light, $yang-gold 60%, $yang-deep);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: $yang-gold; // 回退方案
    filter: drop-shadow(0 0 30px rgba($yang-gold, 0.2));
  }

  .portal-subtitle {
    font-size: 0.9rem;
    color: $text-secondary;
    letter-spacing: 0.5em;
    opacity: 0.6;
    margin-bottom: 30px;
  }

  .header-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    
    .line {
      width: 100px;
      height: 1px;
      background: linear-gradient(to right, transparent, $yang-gold, transparent);
      opacity: 0.3;
    }
    .dot {
      width: 4px;
      height: 4px;
      background: $yang-gold;
      border-radius: 50%;
      box-shadow: 0 0 8px $yang-gold;
    }
  }
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  width: 100%;
}

.portal-card {
  position: relative;
  height: 400px;
  border-radius: 24px;
  background: rgba($yin-dark, 0.4);
  border: 1px solid rgba($yang-gold, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.2, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba($yang-gold, 0.1),
      transparent
    );
    transform: skewX(-25deg);
    transition: none;
    pointer-events: none;
    z-index: 3;
  }

  &:hover:not(.is-inactive) {
    transform: translateY(-10px);
    border-color: rgba($yang-gold, 0.5);
    background: rgba($yin-dark, 0.7);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.5),
      0 0 20px rgba($yang-gold, 0.1);

    &::before {
      opacity: 1;
    }

    &::after {
      left: 150%;
      transition: left 0.8s ease-in-out;
    }

    .card-icon {
      transform: scale(1.1) rotate(5deg);
      color: $yang-gold;
      opacity: 1;
      filter: drop-shadow(0 0 15px rgba($yang-gold, 0.4));
    }
  }

  &.is-inactive {
    cursor: default;
    opacity: 0.5;
    filter: grayscale(1);
  }

  // 增加呼吸浮动效果
  &:nth-child(1) { animation: float-slow 6s ease-in-out infinite; }
  &:nth-child(2) { animation: float-slow 6s ease-in-out infinite 0.5s; }
  &:nth-child(3) { animation: float-slow 6s ease-in-out infinite 1s; }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-tag {
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba($yang-gold, 0.1);
  border: 1px solid rgba($yang-gold, 0.2);
  font-size: 0.75rem;
  color: $yang-gold;
}

.card-icon {
  font-size: 3.5rem;
  font-family: 'Ma Shan Zheng', serif;
  color: $text-secondary;
  opacity: 0.4;
  margin-bottom: 30px;
  transition: all 0.5s ease;
}

.card-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: $yang-light;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.card-subtitle {
  font-size: 0.9rem;
  color: $yang-gold;
  opacity: 0.7;
  margin-bottom: 24px;
  letter-spacing: 0.1em;
}

.card-desc {
  font-size: 0.95rem;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: auto;
  opacity: 0.8;
}

.card-action {
  font-size: 0.9rem;
  font-weight: 600;
  color: $yang-gold;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 30px;

  .arrow {
    transition: transform 0.3s ease;
  }

  &.is-coming {
    color: $text-muted;
  }
}

.portal-footer {
  margin-top: 100px;
  font-size: 0.85rem;
  color: $text-muted;
  letter-spacing: 0.2em;
  opacity: 0.5;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .portal-container {
    padding: 40px 20px;
  }
  .portal-header {
    margin-bottom: 50px;
    .portal-title {
      font-size: 2.5rem;
    }
  }
}
</style>
