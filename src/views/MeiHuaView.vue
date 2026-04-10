<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { getMeiHuaFromTime, getGanZhi } from '@/utils/calendar';
import { HEXAGRAMS } from '@/data/hexagrams';

const router = useRouter();

// 八卦基础数据 (用于梅花易数映射)
const BAGUA_MAP: Record<number, { name: string, symbol: string }> = {
  1: { name: '乾', symbol: '☰' },
  2: { name: '兑', symbol: '☱' },
  3: { name: '离', symbol: '☲' },
  4: { name: '震', symbol: '☳' },
  5: { name: '巽', symbol: '☴' },
  6: { name: '坎', symbol: '☵' },
  7: { name: '艮', symbol: '☶' },
  8: { name: '坤', symbol: '☷' }
};

// 八卦转二进制爻位 (从下往上)
const BAGUA_BINARY: Record<number, string> = {
  1: '111', 2: '011', 3: '101', 4: '001', 5: '110', 6: '010', 7: '100', 8: '000'
};

const activeTab = ref<'time' | 'number'>('time');
const numInput = ref({ up: '', down: '', move: '' });
const result = ref<any>(null);

// 执行时间起卦
const castByTime = () => {
  const { upNum, downNum, moveNum, gz } = getMeiHuaFromTime();
  generateResult(upNum, downNum, moveNum, `当前时间：${gz.year}年 ${gz.hour}时`);
};

// 执行报数起卦
const castByNumber = () => {
  const up = parseInt(numInput.value.up) || 1;
  const down = parseInt(numInput.value.down) || 1;
  const move = parseInt(numInput.value.move) || 1;
  
  let upG = up % 8; if (upG === 0) upG = 8;
  let downG = down % 8; if (downG === 0) downG = 8;
  let moveG = move % 6; if (moveG === 0) moveG = 6;
  
  generateResult(upG, downG, moveG, `报数起卦：${up}, ${down}, ${move}`);
};

const generateResult = (up: number, down: number, move: number, source: string) => {
  const mainBinary = BAGUA_BINARY[down] + BAGUA_BINARY[up];
  const mainGua = HEXAGRAMS.find(h => h.binary === mainBinary);
  
  // 计算变卦
  const bits = mainBinary.split('');
  bits[move - 1] = bits[move - 1] === '1' ? '0' : '1';
  const changeBinary = bits.join('');
  const changeGua = HEXAGRAMS.find(h => h.binary === changeBinary);

  result.value = {
    up: BAGUA_MAP[up],
    down: BAGUA_MAP[down],
    move,
    mainGua,
    changeGua,
    source
  };
};

const goToDetail = (id: number) => router.push(`/detail/${id}`);

onBeforeRouteLeave((to) => {
  if (to.path === '/') {
    result.value = null;
    numInput.value = { up: '', down: '', move: '' };
  }
});
</script>

<template>
  <div class="meihua-view">
    <nav class="top-nav">
      <button class="btn-back" @click="router.push('/')">← 返回门户</button>
    </nav>

    <header class="page-header">
      <h1 class="gradient-text">梅花易数</h1>
      <p class="subtitle">心易神占 · 随机应变 · 邵康节秘传</p>
    </header>

    <main class="meihua-content">
      <div class="tabs">
        <button :class="{ active: activeTab === 'time' }" @click="activeTab = 'time'">时间起卦</button>
        <button :class="{ active: activeTab === 'number' }" @click="activeTab = 'number'">报数起卦</button>
      </div>

      <div class="casting-area glass-panel">
        <div v-if="activeTab === 'time'" class="tab-content">
          <p class="hint">点击下方按钮，根据当前时空节律自动取卦</p>
          <button class="btn-primary" @click="castByTime">时空感应 · 起卦</button>
        </div>
        
        <div v-if="activeTab === 'number'" class="tab-content">
          <div class="input-group">
            <input v-model="numInput.up" type="number" placeholder="输入上卦数字">
            <input v-model="numInput.down" type="number" placeholder="输入下卦数字">
            <input v-model="numInput.move" type="number" placeholder="输入动爻数字(可选)">
          </div>
          <button class="btn-primary" @click="castByNumber">数字共振 · 起卦</button>
        </div>
      </div>

      <!-- 规则说明 -->
      <section class="meihua-rules glass-panel">
        <div class="rules-grid">
          <div class="rule-card">
            <h4><span class="dot"></span> 时间起卦法</h4>
            <p><strong>上卦</strong>：(年支数 + 农历月 + 日) ÷ 8，取余数</p>
            <p><strong>下卦</strong>：(年支数 + 农历月 + 日 + 时支数) ÷ 8，取余数</p>
            <p><strong>动爻</strong>：(年支数 + 农历月 + 日 + 时支数) ÷ 6，取余数</p>
          </div>
          <div class="rule-card">
            <h4><span class="dot"></span> 报数起卦法</h4>
            <p><strong>两数</strong>：首数取为上卦（除8取余），次数取为下卦，两数之和除6取动爻。</p>
            <p><strong>三数</strong>：首数为上，次数为下，三数之和除6取动爻。</p>
          </div>
        </div>
        <div class="rules-footer">
          注：余数为 0 时，取最大数（除8余0取8，除6余0取6）。
        </div>
      </section>

      <!-- 结果展示 -->
      <Transition name="fade">
        <div v-if="result" class="result-display">
          <div class="result-header">
            <span class="source-tag">{{ result.source }}</span>
            <span class="move-tag">第{{ result.move }}爻动</span>
          </div>

          <div class="gua-cards">
            <div class="gua-card main">
              <div class="tag">本卦</div>
              <div class="symbol-large">{{ result.up.symbol }}<br>{{ result.down.symbol }}</div>
              <h3>{{ result.mainGua?.name }}卦</h3>
              <p>{{ result.mainGua?.nature }}</p>
              <button class="btn-small" @click="goToDetail(result.mainGua.id)">详情</button>
            </div>

            <div class="divider-arrow">→</div>

            <div class="gua-card change">
              <div class="tag">之卦</div>
              <h3>{{ result.changeGua?.name }}卦</h3>
              <p>{{ result.changeGua?.nature }}</p>
              <button class="btn-small" @click="goToDetail(result.changeGua.id)">详情</button>
            </div>
          </div>

          <div class="interpretation glass-panel">
            <h4><span class="icon">✦</span> 核心解读</h4>
            <p>{{ result.mainGua?.meaning }}</p>
            <div class="tip">提示：梅花易数注重“体用”关系，本卦展示当前背景，之卦揭示最终结局。</div>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.meihua-view { 
  padding: 40px; 
  max-width: 1000px; 
  margin: 0 auto; 
  min-height: 100vh; 
  position: relative;
  z-index: 10;
}
.top-nav { margin-bottom: 40px; }
.btn-back { background: transparent; border: 1px solid rgba($yang-gold, 0.3); color: $yang-gold; padding: 6px 16px; border-radius: 20px; cursor: pointer; }

.page-header { text-align: center; margin-bottom: 40px; }
.gradient-text { font-size: 2.8rem; letter-spacing: 0.1em; }
.subtitle { color: $text-muted; }

.meihua-rules {
  margin-bottom: 40px;
  padding: 30px;
  background: rgba($yin-dark, 0.4);
  
  .rules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .rule-card {
    h4 {
      color: $yang-gold;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      .dot { width: 6px; height: 6px; background: $yang-gold; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px $yang-gold; }
    }
    p {
      color: $text-secondary;
      font-size: 0.85rem;
      margin-bottom: 12px;
      line-height: 1.6;
      strong { color: $yang-light; font-weight: 600; }
    }
  }
  
  .rules-footer {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 0.8rem;
    color: $text-muted;
    text-align: center;
    font-style: italic;
  }
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  button {
    background: transparent;
    border: none;
    color: $text-secondary; // 提高默认亮度
    font-size: 1.1rem;
    padding: 10px 20px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    opacity: 0.6; // 通过透明度区分
    transition: all 0.3s;
    &.active {
      color: $yang-gold;
      border-bottom-color: $yang-gold;
      opacity: 1;
    }
  }
}

.casting-area {
  padding: 50px;
  text-align: center;
  margin-bottom: 40px;
  .hint { color: $text-muted; margin-bottom: 25px; }
}

.input-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 35px;
  
  input {
    width: 180px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba($yang-gold, 0.2);
    border-radius: 12px;
    color: $yang-light;
    font-size: 1.1rem;
    text-align: center;
    font-family: 'Inter', sans-serif;
    backdrop-filter: blur(8px);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    
    // 移除原生箭头
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type=number] {
      -moz-appearance: textfield;
    }

    &:focus {
      outline: none;
      background: rgba($yang-gold, 0.08);
      border-color: $yang-gold;
      box-shadow: 0 0 20px rgba($yang-gold, 0.15), inset 0 0 10px rgba($yang-gold, 0.05);
      transform: translateY(-2px);
    }

    &::placeholder {
      color: rgba($text-muted, 0.6);
      font-size: 0.8rem;
      letter-spacing: 0;
    }
  }
}

.btn-primary {
  position: relative;
  background: linear-gradient(135deg, $yang-gold, #f39c12);
  border: none;
  color: #1a1a1a;
  font-weight: 700;
  padding: 16px 50px;
  border-radius: 50px;
  cursor: pointer;
  letter-spacing: 0.2em;
  font-size: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba($yang-gold, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba($yang-gold, 0.4);
    filter: brightness(1.1);
    &::before { opacity: 1; }
  }

  &:active {
    transform: scale(0.98);
  }
}

.result-display {
  animation: slideUp 0.5s ease;
  .result-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 0.8rem;
    .source-tag { color: $text-muted; }
    .move-tag { color: $yang-gold; border: 1px solid rgba($yang-gold, 0.3); padding: 2px 8px; border-radius: 4px; }
  }
}

.gua-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  .divider-arrow { font-size: 2rem; color: $text-muted; opacity: 0.5; }
}

.gua-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 30px;
  border-radius: 20px;
  min-width: 220px;
  flex: 1;
  max-width: 300px;
  text-align: center;
  position: relative;
  .tag { position: absolute; top: 10px; left: 10px; font-size: 0.7rem; color: $text-muted; border: 1px solid rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }
  .symbol-large { font-size: 3rem; color: $yang-gold; line-height: 1.1; margin: 15px 0; }
  h3 { font-size: 1.5rem; margin-bottom: 5px; }
  p { font-size: 0.8rem; color: $text-muted; margin-bottom: 20px; }
  .btn-small { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: $text-secondary; padding: 4px 12px; border-radius: 4px; cursor: pointer; }
}

.interpretation {
  padding: 30px;
  h4 { color: $yang-gold; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
  p { line-height: 1.8; color: $text-secondary; margin-bottom: 15px; }
  .tip { font-size: 0.75rem; color: $text-muted; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .gua-cards { flex-direction: column; }
  .divider-arrow { transform: rotate(90deg); }
  .input-group {
    flex-direction: column;
    align-items: center;
    input { width: 100%; max-width: 280px; }
  }
}
</style>
