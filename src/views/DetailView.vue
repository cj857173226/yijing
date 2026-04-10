<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { HEXAGRAMS } from '@/data/hexagrams';

const route = useRoute();
const router = useRouter();

const gua = computed(() => {
  const id = Number(route.params.id);
  return HEXAGRAMS.find(h => h.id === id);
});

const prevGua = computed(() => {
  if (!gua.value) return null;
  const id = gua.value.id - 1;
  return id >= 1 ? HEXAGRAMS[id - 1] : null;
});

const nextGua = computed(() => {
  if (!gua.value) return null;
  const id = gua.value.id + 1;
  return id <= 64 ? HEXAGRAMS[id - 1] : null;
});

const getLines = (binary: string) => binary.split('').reverse();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/hexagrams');
  }
};
const goTo = (id: number) => router.push(`/detail/${id}`);

</script>

<template>
  <div v-if="gua" class="detail-view">

    <!-- 顶部导航条 -->
    <nav class="top-nav">
      <button class="btn-back" @click="goBack">
        <span class="btn-icon">←</span> 返回卦象总览
      </button>
      <div class="nav-pagination">
        <button 
          class="btn-page" 
          :disabled="!prevGua"
          @click="prevGua && goTo(prevGua.id)"
        >
          ← {{ prevGua?.name ?? '' }}
        </button>
        <span class="nav-pos">{{ gua.id }} / 64</span>
        <button 
          class="btn-page" 
          :disabled="!nextGua"
          @click="nextGua && goTo(nextGua.id)"
        >
          {{ nextGua?.name ?? '' }} →
        </button>
      </div>
    </nav>

    <!-- 主体布局 -->
    <main class="detail-main">

      <!-- 左侧：视觉主区域 -->
      <aside class="visual-panel">
        <div class="panel-inner glass-panel">
          <!-- 装饰圆环 -->
          <div class="deco-ring ring-a"></div>
          <div class="deco-ring ring-b"></div>

          <!-- 超大卦名 -->
          <div class="big-name gradient-text">{{ gua.name }}</div>

          <!-- 爻线大图 -->
          <div class="gua-lines-hero">
            <div
              v-for="(bit, i) in getLines(gua.binary)"
              :key="i"
              :class="['line', bit === '1' ? 'yang' : 'yin']"
            >
              <span v-if="bit === '1'" class="yao-label">阳爻</span>
              <span v-else class="yao-label">阴爻</span>
            </div>
          </div>

          <!-- 卦名信息 -->
          <div class="gua-meta">
            <p class="meta-id">第 {{ gua.id }} 卦</p>
            <p class="meta-pinyin">{{ gua.pinyin }}</p>
          </div>
        </div>
      </aside>

      <!-- 右侧：解释文字区 -->
      <section class="text-panel">

        <!-- 卦头 -->
        <div class="text-header">
          <div class="tag-row">
            <span class="badge">{{ gua.nature }}</span>
          </div>
          <h1 class="gua-title gradient-text">{{ gua.name }}卦</h1>
          <div class="title-deco">
            <span class="deco-line"></span>
            <span class="deco-gem">◆</span>
            <span class="deco-line"></span>
          </div>
        </div>

        <!-- 解释模块 -->
        <div class="explanation-blocks">
          <div class="block glass-panel">
            <div class="block-icon">卦</div>
            <div class="block-body">
              <h3>卦辞原文</h3>
              <p class="ancient-text">{{ gua.guaCi }}</p>
            </div>
          </div>

          <div class="block glass-panel">
            <div class="block-icon">象</div>
            <div class="block-body">
              <h3>象曰</h3>
              <p class="ancient-text">{{ gua.xiangYue }}</p>
            </div>
          </div>

          <div class="block glass-panel">
            <div class="block-icon">彖</div>
            <div class="block-body">
              <h3>彖曰</h3>
              <p class="ancient-text">{{ gua.tuanYue }}</p>
            </div>
          </div>

          <div class="block glass-panel block-wide">
            <div class="block-icon">✦</div>
            <div class="block-body">
              <h3>核心要义</h3>
              <p class="meaning-text">{{ gua.meaning }}</p>
            </div>
          </div>
        </div>

        <!-- 关联资讯 -->
        <div class="relations-row">
          <div class="rel-item glass-panel">
            <p class="rel-label">上卦（外卦）</p>
            <p class="rel-val">{{ gua.upGua }}</p>
          </div>
          <div class="rel-item glass-panel">
            <p class="rel-label">下卦（内卦）</p>
            <p class="rel-val">{{ gua.downGua }}</p>
          </div>
          <div class="rel-item glass-panel">
            <p class="rel-label">序列位置</p>
            <p class="rel-val">第 {{ gua.id }} 卦</p>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
// ==================== 布局 ====================
.detail-view {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  padding: 28px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

// ==================== 顶部导航 ====================
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  .btn-back {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $text-secondary;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 30px;
    border: 1px solid $border-color;
    background: transparent;
    transition: $transition-base;
    letter-spacing: 0.05em;

    &:hover {
      border-color: $yang-gold;
      color: $yang-gold;
      transform: translateX(-4px);
    }
  }

  .nav-pagination {
    display: flex;
    align-items: center;
    gap: 20px;

    .nav-pos {
      font-size: 0.85rem;
      color: $text-muted;
      letter-spacing: 0.1em;
    }

    .btn-page {
      color: $text-secondary;
      font-size: 0.85rem;
      cursor: pointer;
      background: transparent;
      transition: $transition-base;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid transparent;

      &:hover:not(:disabled) {
        color: $yang-gold;
        border-color: $border-color;
      }

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }
    }
  }
}

// ==================== 主体 ====================
.detail-main {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  align-items: start;
}

// ==================== 视觉面板 ====================
.visual-panel {
  position: sticky;
  top: 24px;
}

.panel-inner {
  // 顶部 padding 对齐右侧 badge 的视觉高度
  padding: 24px 36px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: radial-gradient(circle at 50% 10%, rgba($yin-mid, 0.6) 0%, rgba($yin-dark, 0.98) 100%);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba($yang-gold, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
}

.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba($yang-gold, 0.1);

  &.ring-a {
    width: 320px;
    height: 320px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: spin-slow 80s linear infinite;
  }
  &.ring-b {
    width: 220px;
    height: 220px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: spin-reverse 50s linear infinite;
  }
}

.big-name {
  font-size: 6rem;
  font-weight: 800;
  font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', serif;
  letter-spacing: 0.05em;
  line-height: 1;
  position: relative;
  z-index: 2;
  margin-bottom: 28px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8));
  background: linear-gradient(to bottom, $yang-light, $yang-gold 50%, $yang-deep);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gua-lines-hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 160px;
  position: relative;
  z-index: 2;
  margin-bottom: 40px;

  .line {
    position: relative;
    height: 14px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    transition: all 0.4s ease;

    .yao-label {
      position: absolute;
      right: -60px;
      font-size: 0.75rem;
      color: $text-muted;
      white-space: nowrap;
      letter-spacing: 0.1em;
    }

    &.yang {
      background: linear-gradient(90deg, $yang-deep, $yang-light, $yang-deep);
      box-shadow: 0 0 15px rgba($yang-gold, 0.4);
    }

    &.yin {
      background: transparent;
      gap: 20px;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 100%;
        border-radius: 7px;
        background: linear-gradient(90deg, rgba($jade-green, 0.4), $jade-green, rgba($jade-green, 0.4));
        box-shadow: 0 0 12px rgba($jade-green, 0.2);
      }
    }
  }
}

.gua-meta {
  position: relative;
  z-index: 2;
  
  .meta-id {
    font-size: 0.8rem;
    color: $text-muted;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }

  .meta-pinyin {
    font-size: 1.1rem;
    color: $yang-gold;
    font-style: italic;
    font-weight: 300;
    letter-spacing: 0.1em;
  }
}

// ==================== 文字面板 ====================
.text-panel {
  display: flex;
  flex-direction: column;
  gap: 0; // 使用各子元素自身的 margin 精确控制间距
}

.text-header {
  // badge 行高约 28px，与左侧卡片减去 padding 后视觉对齐
  margin-bottom: 16px;

  .tag-row {
    margin-bottom: 10px;
  }

  .badge {
    display: inline-block;
    padding: 4px 14px;
    border-radius: 100px;
    background: rgba($yang-gold, 0.1);
    border: 1px solid rgba($yang-gold, 0.3);
    color: $yang-gold;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
  }

  .gua-title {
    font-size: 2.8rem;
    font-weight: 800;
    font-family: 'Ma Shan Zheng', serif;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
    line-height: 1.1;
    background: linear-gradient(to right, $yang-light, $yang-gold 60%, $yang-deep);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .title-deco {
    display: flex;
    align-items: center;
    gap: 12px;
    color: $yang-gold;
    opacity: 0.4;
    font-size: 0.55rem;

    .deco-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, $yang-gold, transparent);
    }
  }
}

// ==================== 解释模块 ====================
.explanation-blocks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.block {
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  transition: $transition-base;
  border-radius: 12px;

  &:hover {
    border-color: rgba($yang-gold, 0.35);
    transform: translateX(4px);
    box-shadow: $glow-shadow;
  }

  // 移除 block-wide，所有卡片统一等宽
  &.block-wide {
    background: rgba($yang-gold, 0.03);
  }

  .block-icon {
    flex-shrink: 0;
    font-size: 1.1rem;
    color: $yang-gold;
    opacity: 0.8;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba($yang-gold, 0.08);
    border: 1px solid rgba($yang-gold, 0.15);
    margin-top: 2px;
  }

  .block-body {
    flex: 1;

    h3 {
      font-size: 1.1rem;
      color: $yang-gold;
      margin-bottom: 12px;
      letter-spacing: 0.1em;
    }

    p {
      color: $text-secondary;
      line-height: 1.8;
      font-size: 0.95rem;
    }

    .ancient-text {
      color: $yang-light;
      font-size: 1.05rem;
      letter-spacing: 0.05em;
      text-shadow: 0 0 10px rgba($yang-gold, 0.1);
    }

    .meaning-text {
      color: $text-secondary;
      border-left: 2px solid rgba($yang-gold, 0.3);
      padding-left: 15px;
      font-style: italic;
    }
  }
}

// ==================== 关联资讯 ====================
.relations-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.rel-item {
  padding: 16px 20px;
  text-align: center;
  border-radius: 12px;

  .rel-label {
    font-size: 0.75rem;
    color: $text-muted;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
  }

  .rel-val {
    font-size: 1rem;
    color: $yang-gold;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
}

// ==================== 响应式 ====================
@media (max-width: 1000px) {
  .detail-main {
    grid-template-columns: 1fr;
  }

  .visual-panel {
    position: static;
  }

  .top-nav {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
