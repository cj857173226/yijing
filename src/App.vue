<style>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
</style>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="yijing-root">
    <!-- 背景装饰层 -->
    <div class="bg-scene" aria-hidden="true">
      <div class="bg-grid"></div>
      <!-- 模拟数字屏幕扫描线 -->
      <div class="scanlines"></div>
      <!-- 全局渐暗边框 -->
      <div class="vignette"></div>
      
      <!-- 阴阳太极背景装饰 -->
      <div class="bg-taichi">
        <div class="ring ring-outer"></div>
        <div class="ring ring-mid"></div>
        <div class="center-glow"></div>
      </div>

      <!-- 背景星云光斑 -->
      <div class="bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <RouterView v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </transition>
    </RouterView>

    <footer class="site-footer">
      <div class="footer-divider"></div>
      <p>六十四卦 · 天地大道 &nbsp;|&nbsp; &copy; 2026 易经数字化实验室</p>
    </footer>
  </div>
</template>

<style lang="scss">
// ==================== Root Layout ====================
.yijing-root {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

// ==================== 全局背景氛围 ====================
.bg-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-color: $yin-black;
  background-image:
    radial-gradient(circle at 50% 50%, rgba($yin-dark, 0.8) 0%, $yin-black 100%);
}

// 动态微光网格
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba($yang-gold, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba($yang-gold, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(circle at 50% 50%, black, transparent 80%);
  opacity: 0.4;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  z-index: 1;
  pointer-events: none;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 2;
  pointer-events: none;
}

.bg-taichi {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.6;

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid rgba($yang-gold, 0.1);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  }

  .ring-outer {
    width: 1000px;
    height: 1000px;
    border: 1px dashed rgba($yang-gold, 0.08);
    animation: spin-slow 120s linear infinite;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, transparent, rgba($yang-gold, 0.05), transparent);
    }
  }

  .ring-mid {
    width: 650px;
    height: 650px;
    border: 1px solid rgba($yang-gold, 0.12);
    animation: spin-reverse 90s linear infinite;
  }

  .center-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba($yang-gold, 0.08) 0%, transparent 75%);
    filter: blur(40px);
    animation: pulse-glow 10s ease-in-out infinite;
  }
}

.bg-orbs {
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.5;
    mix-blend-mode: screen;
    animation: pulse-glow 15s ease-in-out infinite;
  }

  .orb-1 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba($yang-gold, 0.12), transparent);
    top: -200px;
    right: -100px;
  }

  .orb-2 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba($jade-green, 0.1), transparent);
    bottom: -150px;
    left: -100px;
    animation-delay: -5s;
  }

  .orb-3 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba($cinnabar, 0.08), transparent);
    top: 30%;
    left: 20%;
    animation-delay: -8s;
  }
}

// ==================== Footer ====================
.site-footer {
  position: relative;
  z-index: 10;
  padding: 48px 20px;
  text-align: center;
  color: $text-muted;
  font-size: 0.85rem;
  letter-spacing: 0.05em;

  .footer-divider {
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent, $yang-gold, transparent);
    margin: 0 auto 24px;
    opacity: 0.4;
  }
}

// ==================== Page Transitions ====================
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
