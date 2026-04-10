<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref<'elements' | 'bagua'>('elements');

const BAGUA_DATA = [
  { name: '乾', preNum: 1, postDir: '西北', nature: '天', postSymbol: '☰' },
  { name: '兑', preNum: 2, postDir: '西', nature: '泽', postSymbol: '☱' },
  { name: '离', preNum: 3, postDir: '南', nature: '火', postSymbol: '☲' },
  { name: '震', preNum: 4, postDir: '东', nature: '雷', postSymbol: '☳' },
  { name: '巽', preNum: 5, postDir: '东南', nature: '风', postSymbol: '☴' },
  { name: '坎', preNum: 6, postDir: '北', nature: '水', postSymbol: '☵' },
  { name: '艮', preNum: 7, postDir: '东北', nature: '山', postSymbol: '☶' },
  { name: '坤', preNum: 8, postDir: '西南', nature: '地', postSymbol: '☷' },
];

const elements = [
  { name: '木', nature: '生长、伸展', sheng: '火', ke: '土', color: '#2ecc71', icon: '🌲' },
  { name: '火', nature: '升腾、温暖', sheng: '土', ke: '金', color: '#e74c3c', icon: '🔥' },
  { name: '土', nature: '承载、受纳', sheng: '金', ke: '水', color: '#f1c40f', icon: '⛰️' },
  { name: '金', nature: '肃杀、变革', sheng: '水', ke: '木', color: '#ecf0f1', icon: '⚔️' },
  { name: '水', nature: '滋润、下行', sheng: '木', ke: '火', color: '#3498db', icon: '💧' },
];

</script>

<template>
  <div class="basics-view">
    <nav class="top-nav">
      <button class="btn-back" @click="router.push('/')">← 返回门户</button>
    </nav>

    <header class="page-header">
      <h1 class="gradient-text">易学入门基石</h1>
      <p class="subtitle">不学基础，卦都看不懂 · 从入门到精通的第一步</p>
    </header>

    <div class="tabs-container">
      <div class="tabs">
        <button :class="{ active: activeTab === 'elements' }" @click="activeTab = 'elements'">
          <span class="num">01</span> 阴阳五行
        </button>
        <button :class="{ active: activeTab === 'bagua' }" @click="activeTab = 'bagua'">
          <span class="num">02</span> 先后天八卦
        </button>
      </div>
    </div>

    <main class="content-area">
      <!-- 阴阳五行部分 -->
      <transition name="fade-slide" mode="out-in">
        <section v-if="activeTab === 'elements'" class="elements-section">
          <div class="theory-grid">
            <!-- 阴阳论 -->
            <div class="card glass-panel yinyang-card">
              <div class="card-header">
                <span class="icon">☯</span>
                <h3>阴阳：万物底层逻辑</h3>
              </div>
              <div class="yinyang-content">
                <div class="yinyang-logic">
                  <div class="logic-item">
                    <label>阳</label>
                    <span>动、刚、进、吉</span>
                  </div>
                  <div class="logic-divider">VS</div>
                  <div class="logic-item">
                    <label>阴</label>
                    <span>静、柔、退、凶</span>
                  </div>
                </div>
                <p class="summary">易经的核心就在于观察“阴阳”的消长变化。动静刚柔，皆在其中。</p>
              </div>
            </div>

            <!-- 五行论 -->
            <div class="card glass-panel wuxing-card">
              <div class="card-header">
                <span class="icon">⚡</span>
                <h3>五行：生克与能量平衡</h3>
              </div>
              <div class="wuxing-summary">
                <p><strong>金木水火土</strong> 并非五种物质，而是五种动态的“气”。</p>
                <div class="shengke-rules">
                  <div class="rule">
                    <h4>相生 (生产/助推)</h4>
                    <p>木生火 → 火生土 → 土生金 → 金生水 → 水生木</p>
                  </div>
                  <div class="rule">
                    <h4>相克 (制约/平衡)</h4>
                    <p>金克木 → 木克土 → 土克水 → 水克火 → 火克金</p>
                  </div>
                </div>
                <button class="btn-link" @click="router.push('/five-elements')">进入交互图谱 →</button>
              </div>
            </div>
          </div>
          
          <!-- 旺衰简述 -->
          <div class="wangshuai-box glass-panel">
            <h4>旺衰：能量的时空状态</h4>
            <p>同样的五行由于处于不同的季节（时令），力量会发生巨大变化：</p>
            <div class="wang-grid">
              <div class="wang-item"><strong>旺</strong>：当令者（如春季木旺）</div>
              <div class="wang-item"><strong>相</strong>：我生者（源头强）</div>
              <div class="wang-item"><strong>休</strong>：生我者（退休）</div>
              <div class="wang-item"><strong>囚</strong>：克我者（被囚）</div>
              <div class="wang-item"><strong>死</strong>：我克者（最弱）</div>
            </div>
          </div>
        </section>

        <!-- 八卦体系部分 -->
        <section v-else class="bagua-section">
          <div class="bagua-comparison">
            <!-- 先天八卦 -->
            <div class="bagua-card glass-panel pre-heaven">
              <div class="badge">先天为体</div>
              <h3>先天八卦 (数)</h3>
              <p class="desc">揭示宇宙万物的自然数理顺序。用于梅花易数起卦。</p>
              <div class="bagua-list">
                <div v-for="item in BAGUA_DATA" :key="item.name" class="bagua-item">
                  <span class="symbol">{{ item.postSymbol }}</span>
                  <span class="name">{{ item.name }}</span>
                  <span class="val">{{ item.preNum }}</span>
                </div>
              </div>
              <div class="mnemonic">口诀：乾一兑二离三震四，巽五坎六艮七坤八</div>
            </div>

            <!-- 后天八卦 -->
            <div class="bagua-card glass-panel post-heaven">
              <div class="badge yellow">后天为用</div>
              <h3>后天八卦 (位)</h3>
              <p class="desc">揭示人世间的空间方位与时间交替。用于解卦判定方位。</p>
              <div class="bagua-list">
                <div v-for="item in BAGUA_DATA" :key="item.name" class="bagua-item">
                  <span class="symbol">{{ item.postSymbol }}</span>
                  <span class="name">{{ item.name }}</span>
                  <span class="val">{{ item.postDir }}</span>
                </div>
              </div>
              <div class="mnemonic">口诀：坎北离南，震东兑西</div>
            </div>
          </div>
        </section>
      </transition>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.basics-view {
  min-height: 100vh;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.top-nav { margin-bottom: 30px; }
.btn-back { 
  background: transparent; 
  border: 1px solid rgba($yang-gold, 0.3); 
  color: $yang-gold; 
  padding: 8px 20px; 
  border-radius: 20px; 
  cursor: pointer; 
  transition: all 0.3s;
  &:hover { background: rgba($yang-gold, 0.1); border-color: $yang-gold; }
}

.page-header { 
  text-align: center; 
  margin-bottom: 50px; 
  .gradient-text { font-size: 3rem; margin-bottom: 10px; }
  .subtitle { color: $text-muted; letter-spacing: 0.1em; }
}

.tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  .tabs {
    display: flex;
    background: rgba(255,255,255,0.05);
    padding: 6px;
    border-radius: 50px;
    border: 1px solid rgba($yang-gold, 0.1);
    
    button {
      padding: 12px 30px;
      border: none;
      background: transparent;
      color: $text-secondary;
      cursor: pointer;
      border-radius: 50px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;

      .num { font-size: 0.7rem; font-family: 'Inter', sans-serif; opacity: 0.5; border: 1px solid currentColor; padding: 2px 6px; border-radius: 4px; }

      &.active {
        background: $yang-gold;
        color: #000;
        box-shadow: 0 5px 20px rgba($yang-gold, 0.3);
        .num { opacity: 1; border-color: rgba(0,0,0,0.3); }
      }
    }
  }
}

// ---------------- 阴阳五行 ----------------
.theory-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.card {
  padding: 40px;
  border-radius: 24px;
  .card-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
    .icon { font-size: 2.2rem; color: $yang-gold; filter: drop-shadow(0 0 10px $yang-gold); }
    h3 { font-size: 1.5rem; letter-spacing: 0.05em; }
  }
}

.yinyang-logic {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(0,0,0,0.2);
  padding: 30px;
  border-radius: 20px;

  .logic-item {
    text-align: center;
    label { display: block; font-size: 1.5rem; font-family: 'Ma Shan Zheng', serif; color: $yang-gold; margin-bottom: 10px; }
    span { font-size: 0.9rem; color: $text-secondary; }
  }
  .logic-divider { font-size: 0.8rem; color: $text-muted; opacity: 0.5; font-weight: bold; }
}

.wuxing-summary {
  p { margin-bottom: 20px; color: $yang-light; }
  .shengke-rules {
    display: flex;
    flex-direction: column;
    gap: 15px;
    .rule {
      h4 { font-size: 0.9rem; color: $yang-gold; margin-bottom: 5px; border-left: 3px solid currentColor; padding-left: 10px; }
      p { font-size: 0.85rem; color: $text-muted; margin: 0; font-family: 'Inter', sans-serif; }
    }
  }
}

.btn-link {
  margin-top: 30px;
  background: rgba($yang-gold, 0.1);
  border: 1px solid rgba($yang-gold, 0.3);
  color: $yang-gold;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover { background: rgba($yang-gold, 0.2); }
}

.wangshuai-box {
  padding: 30px;
  border-radius: 24px;
  h4 { margin-bottom: 20px; color: $yang-gold; }
  p { font-size: 0.9rem; color: $text-muted; margin-bottom: 25px; }
  .wang-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    .wang-item {
      padding: 15px;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      font-size: 0.85rem;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.05);
      strong { color: $yang-light; display: block; margin-bottom: 5px; font-size: 1.1rem; }
    }
  }
}

// ---------------- 八卦体系 ----------------
.bagua-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.bagua-card {
  padding: 40px;
  border-radius: 24px;
  position: relative;
  .badge {
    position: absolute; top: 20px; right: 20px; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; background: rgba($jade-green, 0.2); color: $jade-green; border: 1px solid $jade-green;
    &.yellow { background: rgba($yang-gold, 0.1); color: $yang-gold; border-color: $yang-gold; }
  }
  h3 { font-size: 1.8rem; margin-bottom: 15px; }
  .desc { font-size: 0.9rem; color: $text-muted; margin-bottom: 30px; line-height: 1.6; min-height: 3em; }

  .bagua-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 30px;
    .bagua-item {
      background: rgba(255,255,255,0.03);
      padding: 15px 10px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      border: 1px solid rgba(255,255,255,0.05);
      transition: all 0.3s;
      &:hover { border-color: $yang-gold; transform: translateY(-3px); }
      .symbol { font-size: 1.5rem; color: $yang-gold; }
      .name { font-weight: bold; }
      .val { font-size: 0.75rem; color: $text-muted; }
    }
  }
  .mnemonic { font-size: 0.85rem; color: $text-muted; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; font-style: italic; }
}

@keyframes fade-slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: scale(0.98) translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: scale(0.98) translateY(-10px); }

@media (max-width: 900px) {
  .theory-grid, .bagua-comparison, .wang-grid { grid-template-columns: 1fr; }
  .basics-view { padding: 20px; }
}
</style>
