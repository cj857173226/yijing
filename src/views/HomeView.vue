<script setup lang="ts">
import { useRouter } from 'vue-router';
import { HEXAGRAMS } from '@/data/hexagrams';

const router = useRouter();

const getLines = (binary: string) => binary.split('').reverse();

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`);
};
</script>

<template>
  <div class="home-view">
    <!-- 页头 -->
    <header class="page-header">
      <nav class="portal-nav">
        <button class="btn-portal" @click="router.push('/')">
          <span class="icon">⇐</span> 进入实验室入口
        </button>
      </nav>
      <div class="taichi-emblem" aria-hidden="true">
        <!-- 用CSS实现阴阳鱼 -->
        <div class="taichi-symbol">
          <div class="yin"></div>
          <div class="yang"></div>
          <div class="yang-dot"></div>
          <div class="yin-dot"></div>
        </div>
      </div>
      <h1 class="site-title gradient-text">易经六十四卦</h1>
      <p class="site-subtitle">THE 64 HEXAGRAMS OF THE I CHING</p>
      <div class="header-divider">
        <span class="divider-line"></span>
        <span class="divider-gem">◆</span>
        <span class="divider-line"></span>
      </div>
    </header>

    <!-- 卦象网格 -->
    <main class="hexagram-grid">
      <div
        v-for="gua in HEXAGRAMS"
        :key="gua.id"
        class="hexagram-card-container"
        @click="goToDetail(gua.id)"
      >
        <div class="hexagram-card-inner">
          
          <!-- 正面 -->
          <div class="card-face card-front">
            <!-- 卡片光效角标 -->
            <div class="card-corner top-left"></div>
            <div class="card-corner bottom-right"></div>

            <!-- 序号 -->
            <div class="gua-id">{{ gua.id.toString().padStart(2, '0') }}</div>

            <!-- 爻线图 -->
            <div class="gua-lines">
              <div
                v-for="(bit, i) in getLines(gua.binary)"
                :key="i"
                :class="['line', bit === '1' ? 'yang' : 'yin']"
              ></div>
            </div>

            <!-- 文字区 -->
            <div class="gua-label">
              <p class="gua-pinyin">{{ gua.pinyin }}</p>
              <h3 class="gua-name">{{ gua.name }}</h3>
              <p class="gua-nature">{{ gua.nature }}</p>
            </div>

            <!-- Hover 发光层 (翻转时闪耀) -->
            <div class="card-glow"></div>
          </div>

          <!-- 背面 -->
          <div class="card-face card-back">
            <h4 class="back-title">{{ gua.name }}卦</h4>
            <div class="back-divider"></div>
            <p class="back-desc">{{ gua.meaning }}</p>
            <span class="back-hint">点击查看详情 →</span>
          </div>
          
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
// ==================== 布局 ====================
.home-view {
  position: relative;
  z-index: 10;
  padding: 60px 32px 20px;
  max-width: 1480px;
  margin: 0 auto;
}

// ==================== 页头 ====================
.page-header {
  text-align: center;
  margin-bottom: 64px;
  position: relative;
}

.portal-nav {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;

  .btn-portal {
    background: rgba($yang-gold, 0.05);
    border: 1px solid rgba($yang-gold, 0.15);
    padding: 8px 16px;
    border-radius: 8px;
    color: $text-secondary;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 1rem;
      transition: transform 0.3s ease;
    }

    &:hover {
      background: rgba($yang-gold, 0.1);
      border-color: $yang-gold;
      color: $yang-gold;
      box-shadow: 0 0 15px rgba($yang-gold, 0.1);

      .icon {
        transform: translateX(-4px);
      }
    }
  }
}

// 太极标志 - 纯 CSS 阴阳鱼
.taichi-emblem {
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
}

.taichi-symbol {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  border: 2px solid $yang-gold;
  box-shadow: 0 0 30px rgba($yang-gold, 0.25), 0 0 60px rgba($yang-gold, 0.08);
  animation: spin-slow 30s linear infinite;

  .yin {
    position: absolute;
    left: 0; top: 0;
    width: 50%; height: 100%;
    background: $yin-dark;
  }
  .yang {
    position: absolute;
    right: 0; top: 0;
    width: 50%; height: 100%;
    background: $yang-light;
  }
  // 顶半圆：阴色
  .yin-dot {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 40px; height: 40px;
    border-radius: 50%;
    background: $yin-dark;
    // 内部小白点
    box-shadow: inset 0 0 0 10px $yang-light;
  }
  // 底半圆：阳色
  .yang-dot {
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 40px; height: 40px;
    border-radius: 50%;
    background: $yang-light;
    // 内部小黑点
    box-shadow: inset 0 0 0 10px $yin-dark;
  }
}

.site-title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  margin-bottom: 12px;
  filter: drop-shadow(0 0 20px rgba($yang-gold, 0.2));
  font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', serif;
  // 特殊流光渐变
  background: linear-gradient(
    to bottom,
    $yang-light 0%,
    $yang-gold 40%,
    $yang-deep 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.site-subtitle {
  font-size: 0.9rem;
  color: $text-secondary;
  opacity: 0.7;
  font-weight: 300;
  letter-spacing: 0.4em;
  margin-bottom: 32px;
  text-transform: uppercase;
}

.header-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: $yang-gold;
  font-size: 0.7rem;

  .divider-line {
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, $yang-gold);
    opacity: 0.4;

    &:last-child {
      transform: scaleX(-1);
    }
  }
}

// ==================== 卦象网格 ====================
.hexagram-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
}

// ==================== 单卦卡片 (3D 翻转) ====================
.hexagram-card-container {
  perspective: 1000px;
  aspect-ratio: 2 / 3;
  cursor: pointer;

  &:hover {
    .hexagram-card-inner {
      // Y轴翻转，并在 Z、Y 方向悬浮
      transform: translateY(-8px) rotateY(180deg);
    }
    
    .card-face {
      border-color: $border-hover;
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.6),
        0 0 30px rgba($yang-gold, 0.15);
    }

    .card-front {
      .card-glow { opacity: 1; }
      .card-corner { 
        opacity: 1; 
        border-color: $yang-gold; 
        width: 14px; 
        height: 14px;
      }
      .line.yang {
        background: $yang-light;
        box-shadow: 0 0 12px rgba($yang-gold, 0.6);
      }
    }
  }
}

.hexagram-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden; // 隐藏背面
  border-radius: 12px;
  overflow: hidden;
  background: radial-gradient(circle at 50% 10%, rgba($yin-mid, 0.5) 0%, rgba($yin-dark, 0.95) 100%);
  border: 1px solid $border-color;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.4s ease;
}

// ---------------- 前面板 ----------------
.card-front {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

// ---------------- 后面板 ----------------
.card-back {
  transform: rotateY(180deg);
  background: radial-gradient(circle at 50% 90%, rgba($yang-gold, 0.08) 0%, rgba($yin-dark, 0.98) 100%);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  .back-title {
    color: $yang-light;
    font-size: 1.15rem;
    font-family: 'Ma Shan Zheng', serif;
    margin-bottom: 12px;
    letter-spacing: 0.15em;
  }

  .back-divider {
    width: 30px;
    height: 1px;
    background: linear-gradient(90deg, transparent, $yang-gold, transparent);
    opacity: 0.8;
    margin-bottom: 16px;
  }

  .back-desc {
    color: $text-secondary;
    font-size: 0.8rem;
    line-height: 1.7;
    margin-bottom: auto; // 挤压上方
    // 文本截断
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6; 
    line-clamp: 6;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .back-hint {
    margin-top: 20px;
    font-size: 0.72rem;
    color: $yang-gold;
    opacity: 0.6;
    letter-spacing: 0.1em;
  }
}

// 更加锋利的角标装饰
.card-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: rgba($yang-gold, 0.4);
  border-style: solid;
  opacity: 0.6;
  transition: all 0.4s ease;

  &.top-left {
    top: 8px; left: 8px;
    border-width: 1.5px 0 0 1.5px;
  }
  &.bottom-right {
    bottom: 8px; right: 8px;
    border-width: 0 1.5px 1.5px 0;
  }
}

// 序号
.gua-id {
  font-size: 0.7rem;
  color: $text-muted;
  letter-spacing: 0.1em;
  font-family: 'Inter', monospace;
  align-self: flex-end;
}

// 爻线
.gua-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 56px;
  flex: 1;
  justify-content: center;

  .line {
    height: 5px;
    border-radius: 4px;
    transition: all 0.4s ease;

    &.yang {
      background: rgba($yang-gold, 0.85);
      box-shadow: 0 0 5px rgba($yang-gold, 0.2);
    }

    &.yin {
      display: flex;
      gap: 8px;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 100%;
        background: rgba($jade-green, 0.75);
        border-radius: 4px;
        transition: all 0.4s ease;
        box-shadow: 0 0 4px rgba($jade-green, 0.15);
      }
    }
  }
}

// 卦名文字
.gua-label {
  text-align: center;
  transition: transform 0.3s ease;

  .gua-pinyin {
    font-size: 0.65rem;
    color: rgba($text-muted, 0.7);
    margin-bottom: 1px;
    letter-spacing: 0.05em;
    font-family: 'Inter', sans-serif;
  }

  .gua-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: $text-primary;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    font-family: 'Ma Shan Zheng', serif;
    letter-spacing: 0.1em;
    line-height: 1.2;
  }

  .gua-nature {
    font-size: 0.7rem;
    color: $text-secondary;
    margin-top: 4px;
    letter-spacing: 0.05em;
    opacity: 0.8;
  }
}

// Hover 金光层
.card-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(ellipse at 50% 30%, rgba($yang-gold, 0.08) 0%, transparent 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

// ==================== 响应式 ====================
@media (max-width: 1400px) {
  .hexagram-grid { grid-template-columns: repeat(6, 1fr); }
}
@media (max-width: 1000px) {
  .hexagram-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 600px) {
  .home-view { padding: 40px 16px; }
  .site-title { font-size: 2rem; }
  .hexagram-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
}
</style>
