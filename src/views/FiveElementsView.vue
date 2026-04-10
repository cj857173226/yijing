<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { WUXING_DATA, type WuXingDetail } from '@/data/wuxing';

const router = useRouter();
const activeElement = ref<WuXingDetail>(WUXING_DATA['木']);

// 计算当前高亮的关系
const relationship = computed(() => activeElement.value.relationship);

// 五行元素顺序 (用于圆形排布)
const elementOrder = ['木', '火', '土', '金', '水'];

const selectElement = (name: string) => {
  activeElement.value = WUXING_DATA[name];
};

const getElementClass = (name: string) => {
  const rel = relationship.value;
  if (activeElement.value.name === name) return 'active';
  if (rel.sheng === name) return 'sheng'; // 我生者
  if (rel.shouSheng === name) return 'shousheng'; // 生我者
  if (rel.ke === name) return 'ke'; // 我克者
  if (rel.shouKe === name) return 'shouke'; // 克我者
  return '';
};

const getRelationText = (name: string) => {
  const rel = relationship.value;
  if (rel.sheng === name) return '我生 (消耗)';
  if (rel.shouSheng === name) return '生我 (源头)';
  if (rel.ke === name) return '我克 (掌控)';
  if (rel.shouKe === name) return '克我 (制约)';
  return '';
};
</script>

<template>
  <div class="wuxing-view">
    <nav class="top-nav">
      <button class="btn-back" @click="router.push('/')">← 返回实验室</button>
    </nav>

    <header class="page-header">
      <h1 class="gradient-text">五行生克</h1>
      <p class="subtitle">宇宙动态平衡的底层逻辑</p>
    </header>

    <main class="wuxing-grid">
      <!-- 左侧：动态生克模型 -->
      <section class="wuxing-lab">
        <div class="cycle-container">
          
          <!-- 静态能量极轨基底 -->
          <div class="base-orbits">
            <div class="orbit-circle"></div>
          </div>

          <div 
            v-for="(name, index) in elementOrder" 
            :key="name"
            class="element-node"
            :class="[getElementClass(name), `pos-${index}`]"
            @click="selectElement(name)"
          >
            <!-- 关系标签 -->
            <transition name="badge-pop">
              <div v-if="activeElement.name !== name" class="relation-badge">
                {{ getRelationText(name) }}
              </div>
            </transition>

            <!-- 环绕光效层 -->
            <div class="element-aura" :style="{ background: `radial-gradient(circle, ${WUXING_DATA[name].glow} 0%, transparent 70%)` }"></div>
            
            <div class="node-wrapper">
              <div class="node-ring"></div>
              <div class="node-circle" :style="{ color: WUXING_DATA[name].color }">
                <span class="node-name">{{ name }}</span>
              </div>
            </div>
            
            <div class="node-label">{{ WUXING_DATA[name].direction }}</div>
          </div>
          
          <!-- 中心核心：能量中枢 -->
          <div class="lab-center">
            <div class="center-content">
              <div class="center-ring"></div>
              <div class="center-text glass-panel">
                <span class="label">当前主司</span>
                <span class="val" :style="{ color: activeElement.color, textShadow: `0 0 15px ${activeElement.color}` }">{{ activeElement.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="relationship-legend glass-panel">
          <div class="legend-item"><span class="badge fill-sheng">生我</span> 源头能量</div>
          <div class="legend-item"><span class="badge outline-sheng">我生</span> 能量输出</div>
          <div class="legend-item"><span class="badge outline-ke">我克</span> 掌控对象</div>
          <div class="legend-item"><span class="badge fill-ke">克我</span> 受到制约</div>
        </div>
      </section>

      <!-- 右侧：全量类象解析（代码保持不变） -->
      <section class="wuxing-detail">
        <Transition name="fade-slide" mode="out-in">
          <div :key="activeElement.name" class="detail-card glass-panel" :style="{ borderTopColor: activeElement.color }">
            <div class="detail-header">
              <h2 :style="{ color: activeElement.color, textShadow: `0 0 20px ${activeElement.glow}` }">{{ activeElement.name }}属性解析</h2>
              <div class="element-tag">{{ activeElement.yinyang || '平衡' }} · {{ activeElement.virtue }}</div>
            </div>

            <div class="attribute-grid">
              <div class="attr-box">
                <label>自然特质</label>
                <p>{{ activeElement.nature }} / {{ activeElement.meaning }}</p>
              </div>
              <div class="attr-box">
                <label>方位/时令</label>
                <p>{{ activeElement.direction }} / {{ activeElement.season }}</p>
              </div>
              <div class="attr-box">
                <label>脏腑/神志</label>
                <p>{{ activeElement.organPrimary }}/{{ activeElement.organSecondary }} · {{ activeElement.emotion }}</p>
              </div>
              <div class="attr-box">
                <label>五色/五味/五音</label>
                <p>{{ activeElement.colorName }} / {{ activeElement.taste }} / {{ activeElement.sound }}</p>
              </div>
            </div>

            <div class="relation-map">
              <h3>能量流动关系</h3>
              <div class="rel-flow">
                <div class="rel-item">
                  <label>生我 (源头)</label>
                  <p :style="{ color: WUXING_DATA[activeElement.relationship.shouSheng].color }">{{ activeElement.relationship.shouSheng }}</p>
                </div>
                <div class="rel-arrow">→</div>
                <div class="rel-item active">
                  <label>本体</label>
                  <p :style="{ color: activeElement.color }">{{ activeElement.name }}</p>
                </div>
                <div class="rel-arrow">→</div>
                <div class="rel-item">
                  <label>我生 (消耗)</label>
                  <p :style="{ color: WUXING_DATA[activeElement.relationship.sheng].color }">{{ activeElement.relationship.sheng }}</p>
                </div>
              </div>
            </div>

            <p class="description">{{ activeElement.description }}</p>
          </div>
        </Transition>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
$color-sheng: #2ecc71; // 相生的灵动绿
$color-ke: #ff4d4d;    // 相克的警戒红

.wuxing-view {
  min-height: 100vh;
  padding: 40px;
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
}

.top-nav { margin-bottom: 30px; }
.btn-back { background: transparent; border: 1px solid rgba($yang-gold, 0.3); color: $yang-gold; padding: 6px 16px; border-radius: 20px; cursor: pointer; }

.page-header { text-align: center; margin-bottom: 60px; }

.wuxing-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: center;
}

// 动态交互图
.cycle-container {
  position: relative;
  width: 500px;
  height: 500px;
  margin: 0 auto;
}

.base-orbits {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  .orbit-circle {
    width: 380px;
    height: 380px;
    border: 1px dashed rgba(255,255,255,0.08);
    border-radius: 50%;
  }
}

.element-node {
  position: absolute;
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  .relation-badge {
    position: absolute;
    top: -25px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    transition: all 0.4s;
  }

  .element-aura {
    position: absolute;
    width: 200%;
    height: 200%;
    border-radius: 50%;
    opacity: 0.1;
    transition: all 0.6s;
    pointer-events: none;
  }

  .node-wrapper {
    position: relative;
    width: 90px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .node-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    transition: all 0.6s;
  }

  .node-circle {
    width: 70px;
    height: 70px;
    border: 2px solid currentColor;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    transition: all 0.4s;
    position: relative;
    z-index: 2;
    
    .node-name { 
      font-size: 1.8rem; 
      font-family: "Ma Shan Zheng", serif;
      filter: drop-shadow(0 0 5px currentColor);
    }
  }

  .node-label { font-size: 0.8rem; color: $text-muted; margin-top: 10px; opacity: 0.5; transition: opacity 0.3s; }

  // ----------- 关系状态样式 ----------- //

  // 1. 选中本体
  &.active {
    transform: scale(1.15);
    z-index: 5;
    .element-aura { opacity: 0.6; transform: scale(1.2); }
    .node-ring { border: 2px solid $yang-gold; border-style: dashed; animation: rotate-slow 8s linear infinite; width: 130%; height: 130%; }
    .node-circle { background: rgba(0,0,0,0.9); box-shadow: 0 0 30px currentColor; border-width: 3px; }
    .node-label { opacity: 1; color: $yang-gold; font-weight: bold; }
  }

  // 2. 生我 (源泉: 实心绿牌 + 顺转实环)
  &.shousheng {
    .relation-badge { background: $color-sheng; color: #000; box-shadow: 0 0 15px rgba($color-sheng, 0.4); }
    .node-ring { border-color: $color-sheng; opacity: 0.8; animation: rotate-slow 6s linear infinite; width: 110%; height: 110%; }
    .node-circle { box-shadow: 0 0 15px rgba($color-sheng, 0.2); }
  }

  // 3. 我生 (消耗: 空心绿牌 + 逆转虚环)
  &.sheng {
    .relation-badge { background: rgba(0,0,0,0.6); border: 1px solid $color-sheng; color: $color-sheng; }
    .node-ring { border-color: $color-sheng; opacity: 0.4; border-style: dashed; animation: rotate-slow 10s linear infinite reverse; }
  }

  // 4. 克我 (制约: 实心红牌 + 急促闪烁)
  &.shouke {
    .relation-badge { background: $color-ke; color: #fff; box-shadow: 0 0 15px rgba($color-ke, 0.5); }
    .node-ring { border: 2px solid $color-ke; border-style: dotted; animation: pules-ring 1s infinite alternate; width: 115%; height: 115%; }
    .node-circle { box-shadow: inset 0 0 20px rgba($color-ke, 0.3); }
  }

  // 5. 我克 (掌控: 空心红牌 + 静止压制)
  &.ke {
    .relation-badge { background: rgba(0,0,0,0.6); border: 1px solid $color-ke; color: $color-ke; }
    .node-ring { border-color: $color-ke; opacity: 0.3; border-style: dashed; }
    .node-circle { filter: grayscale(50%); }
  }

  // 圆形定位
  &.pos-0 { top: 0; left: 50%; transform: translateX(-50%); }
  &.pos-1 { top: 110px; right: -20px; }
  &.pos-2 { bottom: 0; right: 60px; }
  &.pos-3 { bottom: 0; left: 60px; }
  &.pos-4 { top: 110px; left: -20px; }
}

// 动画
.badge-pop-enter-active, .badge-pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.badge-pop-enter-from, .badge-pop-leave-to { opacity: 0; transform: translateY(10px) scale(0.8); }

@keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pules-ring { from { transform: scale(1); opacity: 0.5; } to { transform: scale(1.05); opacity: 1; } }

.lab-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  
  .center-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .center-ring {
      position: absolute;
      width: 140px;
      height: 140px;
      border: 1px solid rgba($yang-gold, 0.2);
      border-radius: 50%;
      border-right-color: transparent;
      border-left-color: transparent;
      animation: rotate-slow 8s linear infinite;
    }

    .center-text {
      padding: 15px 30px;
      text-align: center;
      border-radius: 100px;
      border: 1px solid rgba($yang-gold, 0.15);
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(10px);
      
      .label { display: block; font-size: 0.75rem; color: $text-muted; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.1em; }
      .val { font-size: 2rem; font-family: "Ma Shan Zheng", serif; font-weight: bold; }
    }
  }
}

.relationship-legend {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  background: rgba(0,0,0,0.3);
  border-radius: 100px;
  flex-wrap: wrap;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: $text-secondary;
    
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: bold;
      &.fill-sheng { background: $color-sheng; color: #000; }
      &.outline-sheng { border: 1px solid $color-sheng; color: $color-sheng; }
      &.outline-ke { border: 1px solid $color-ke; color: $color-ke; }
      &.fill-ke { background: $color-ke; color: #fff; }
    }
  }
}

// 右侧详情卡片
.detail-card {
  padding: 40px;
  border-top: 4px solid $yang-gold;
  border-radius: 24px;
  min-height: 600px;

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    h2 { font-size: 2.5rem; letter-spacing: 0.1em; }
    .element-tag { padding: 4px 12px; border: 1px solid rgba($yang-gold, 0.2); border-radius: 6px; font-size: 0.8rem; color: $text-muted; }
  }
}

.attribute-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
  .attr-box {
    label { font-size: 0.75rem; color: $text-muted; margin-bottom: 8px; display: block; }
    p { font-size: 1.1rem; color: $yang-gold; }
  }
}

.relation-map {
  background: rgba(0,0,0,0.2);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 30px;
  h3 { font-size: 1rem; color: $text-muted; margin-bottom: 20px; }
  .rel-flow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .rel-item {
      text-align: center;
      label { font-size: 0.7rem; color: $text-muted; opacity: 0.6; }
      p { font-size: 1.2rem; font-weight: bold; margin-top: 5px; }
      &.active p { color: $yang-light; text-shadow: 0 0 10px $yang-glow; }
    }
    .rel-arrow { color: $text-muted; font-size: 1.2rem; opacity: 0.3; }
  }
}

.description { line-height: 1.8; color: $text-secondary; font-size: 1rem; }

// 动画
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

@keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .wuxing-grid { grid-template-columns: 1fr; }
  .cycle-container { width: 350px; height: 350px; }
  .element-node { width: 80px; height: 80px; .node-circle { width: 60px; height: 60px; .node-name { font-size: 1.2rem; } } }
}
</style>
