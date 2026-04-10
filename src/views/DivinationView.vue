<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { HEXAGRAMS, type Hexagram } from '@/data/hexagrams';

const router = useRouter();

// ==================== 类型定义 ====================
type LineType = '少阳' | '少阴' | '老阳' | '老阴';
type Phase = 'intro' | 'casting' | 'result';

interface LineResult {
  type: LineType;
  isYang: boolean;   // 当前状态 (本卦)
  isDynamic: boolean; // 是否为动爻
  coins: number[];    // 0=字(阴) 1=背(阳)
}

// ==================== 状态 ====================
const phase = ref<Phase>('intro');
const question = ref('');
const lines = ref<LineResult[]>([]);
const currentCast = ref(0);
const isAnimating = ref(false);
const coinAnimating = ref(false);
const pendingCoins = ref<number[]>([]);
const showCoinResult = ref(false);
const revealResult = ref(false);

// ==================== 占卜逻辑 ====================
const tossCoin = (): number => (Math.random() < 0.5 ? 0 : 1);

const getLineType = (coins: number[]): LineType => {
  const yCount = coins.filter(c => c === 1).length;
  if (yCount === 3) return '老阳'; // 三背 → 动爻
  if (yCount === 0) return '老阴'; // 三字 → 动爻
  if (yCount === 2) return '少阳'; // 两背一字 → 静爻
  return '少阴';                   // 两字一背 → 静爻
};

const startDivination = () => {
  lines.value = [];
  currentCast.value = 0;
  pendingCoins.value = [];
  revealResult.value = false;
  showCoinResult.value = false;
  phase.value = 'casting';
};

const tossForLine = async () => {
  if (isAnimating.value || currentCast.value >= 6) return;

  isAnimating.value = true;
  showCoinResult.value = false;
  coinAnimating.value = true;
  pendingCoins.value = [tossCoin(), tossCoin(), tossCoin()];

  await new Promise(r => setTimeout(r, 1800));
  coinAnimating.value = false;
  showCoinResult.value = true;

  await new Promise(r => setTimeout(r, 1000));

  const lineType = getLineType(pendingCoins.value);
  lines.value.push({
    type: lineType,
    isYang: lineType === '少阳' || lineType === '老阳',
    isDynamic: lineType === '老阳' || lineType === '老阴',
    coins: [...pendingCoins.value],
  });

  currentCast.value++;
  showCoinResult.value = false;
  isAnimating.value = false;

  if (currentCast.value >= 6) {
    await new Promise(r => setTimeout(r, 600));
    phase.value = 'result';
    setTimeout(() => { revealResult.value = true; }, 300);
  }
};

// ==================== 计算卦象 ====================
const linesToBinary = (ls: LineResult[], useChanged = false): string =>
  ls.map(l => {
    let yang = l.isYang;
    if (useChanged && l.isDynamic) yang = !yang;
    return yang ? '1' : '0';
  }).join('');

const mainHexagram = computed<Hexagram | null>(() => {
  if (lines.value.length < 6) return null;
  return HEXAGRAMS.find(h => h.binary === linesToBinary(lines.value)) ?? null;
});

const changingHexagram = computed<Hexagram | null>(() => {
  if (lines.value.length < 6 || !lines.value.some(l => l.isDynamic)) return null;
  const cb = linesToBinary(lines.value, true);
  if (cb === linesToBinary(lines.value)) return null;
  return HEXAGRAMS.find(h => h.binary === cb) ?? null;
});

const dynamicLines = computed(() =>
  lines.value.map((l, i) => ({ ...l, idx: i })).filter(l => l.isDynamic)
);

// 用于视觉展示的爻序：上爻在上，初爻在下（reversed）
const displayLines = computed(() => {
  const slots: (LineResult | null)[] = Array(6).fill(null);
  lines.value.forEach((l, i) => { slots[i] = l; });
  return [...slots].reverse();
});

// ==================== 工具函数 ====================
const posNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
const posLabel = ['初', '二', '三', '四', '五', '上'];

const currentPositionName = computed(() => posNames[currentCast.value] ?? '');

const yaoName = (line: LineResult, idx: number): string => {
  if (idx === 0) return line.isYang ? '初九' : '初六';
  if (idx === 5) return line.isYang ? '上九' : '上六';
  return line.isYang ? `九${posLabel[idx]}` : `六${posLabel[idx]}`;
};

const slotState = (displayIdx: number): 'done' | 'active' | 'pending' => {
  const lineIdx = 5 - displayIdx;
  if (lineIdx < lines.value.length) return 'done';
  if (lineIdx === currentCast.value) return 'active';
  return 'pending';
};

const lineMarker = (type: LineType): string =>
  ({ '老阳': '○', '老阴': '×', '少阳': '', '少阴': '' }[type]);

const coinLabel = (val: number): string => (val === 1 ? '背' : '字');

const reset = () => {
  lines.value = [];
  currentCast.value = 0;
  pendingCoins.value = [];
  question.value = '';
  showCoinResult.value = false;
  isAnimating.value = false;
  coinAnimating.value = false;
  revealResult.value = false;
  phase.value = 'intro';
};

const goToHexagram = (id: number) => router.push(`/detail/${id}`);

onBeforeRouteLeave((to) => {
  // 如果是返回首页门户，则清空起卦状态
  if (to.path === '/') {
    reset();
  }
});
</script>

<template>
  <div class="divination-view">
    <!-- 顶部返回 -->
    <nav class="top-nav">
      <button class="btn-back" @click="router.push('/')">
        <span>←</span> 返回实验室
      </button>
    </nav>

    <!-- ========== 起卦引导 ========== -->
    <Transition name="phase-fade">
      <div v-if="phase === 'intro'" class="phase-intro">
        <div class="intro-glow"></div>

        <header class="intro-header">
          <div class="title-symbol">☰</div>
          <h1 class="intro-title">六爻占卜</h1>
          <p class="intro-sub">三枚铜钱 · 六次摇掷 · 问天地</p>
          <div class="divider">
            <span></span><span class="gem">◆</span><span></span>
          </div>
        </header>

        <div class="question-section">
          <label class="q-label">心中默想，意诚则灵</label>
          <input
            v-model="question"
            class="q-input"
            placeholder="请输入您的问题，一卦只问一事…"
            maxlength="50"
          />
        </div>

        <div class="rules-brief">
          <div class="rule-item">
            <span class="rule-icon">三背无字</span>
            <span>→ 老阳 ○ 动爻（变阴）</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">两背一字</span>
            <span>→ 少阳 — 静爻</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">两字一背</span>
            <span>→ 少阴 - - 静爻</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">三字无背</span>
            <span>→ 老阴 × 动爻（变阳）</span>
          </div>
        </div>

        <button class="btn-start" @click="startDivination">
          <span class="btn-glow"></span>
          开始起卦
        </button>
      </div>
    </Transition>

    <!-- ========== 掷钱起卦 ========== -->
    <Transition name="phase-fade">
      <div v-if="phase === 'casting'" class="phase-casting">

        <div class="cast-header">
          <div class="question-badge">问：{{ question || '（默念心中之事）' }}</div>
          <div class="progress-bar">
            <div
              v-for="i in 6"
              :key="i"
              class="progress-dot"
              :class="{ done: i <= lines.length, active: i === currentCast + 1 }"
            ></div>
          </div>
          <div class="progress-text">
            {{ currentCast < 6 ? `正在起第 ${currentCast + 1} 爻（${posNames[currentCast]}）` : '六爻已成，正在揭示卦象…' }}
          </div>
        </div>

        <div class="cast-body">
          <!-- 左侧：卦象成形过程 -->
          <div class="hexagram-building">
            <div class="building-title">卦象成形</div>
            <div class="building-lines">
              <div
                v-for="(slot, di) in displayLines"
                :key="di"
                class="line-slot"
                :class="slotState(di)"
              >
                <template v-if="slot">
                  <!-- 已成爻 -->
                  <div class="yao-info-mini">
                    <span class="yao-name-mini">{{ yaoName(slot, 5 - di) }}</span>
                    <span v-if="slot.isDynamic" class="dynamic-badge">动</span>
                  </div>
                  <div class="yao-line" :class="{ yang: slot.isYang, yin: !slot.isYang }">
                    <template v-if="slot.isYang">
                      <div class="line-solid">
                        <span v-if="slot.isDynamic" class="line-marker">○</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="line-broken">
                        <span class="seg left"></span>
                        <span v-if="slot.isDynamic" class="line-marker-yin">×</span>
                        <span class="seg right"></span>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else-if="slotState(di) === 'active'">
                  <!-- 正在起的爻 -->
                  <div class="yao-placeholder active-pulse">
                    <span>{{ posNames[5 - di] }}</span>
                  </div>
                </template>
                <template v-else>
                  <!-- 待起的爻 -->
                  <div class="yao-placeholder">
                    <span class="placeholder-line"></span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- 右侧：掷钱区域 -->
          <div class="coin-area">
            <!-- 铜钱动画区 -->
            <div class="coins-container">
              <div
                v-for="(coinVal, ci) in (showCoinResult ? pendingCoins : [0, 0, 0])"
                :key="ci"
                class="coin"
                :class="{
                  spinning: coinAnimating,
                  yang: showCoinResult && pendingCoins[ci] === 1,
                  yin: showCoinResult && pendingCoins[ci] === 0,
                  idle: !coinAnimating && !showCoinResult
                }"
                :style="{ animationDelay: `${ci * 0.12}s` }"
              >
                <span class="coin-face">
                  {{ showCoinResult ? (pendingCoins[ci] === 1 ? '背' : '字') : '☯' }}
                </span>
              </div>
            </div>

            <!-- 掷钱结果 -->
            <div class="result-wrapper">
              <Transition name="result-pop">
                <div v-if="showCoinResult" class="toss-result">
                  <div class="result-type" :class="{ dynamic: getLineType(pendingCoins).startsWith('老') }">
                    {{ getLineType(pendingCoins) }}
                    <span class="result-marker">{{ lineMarker(getLineType(pendingCoins)) }}</span>
                  </div>
                  <div class="result-sub">{{ getLineType(pendingCoins).startsWith('老') ? '动爻 — 此爻将变' : '静爻 — 此爻不变' }}</div>
                  <div class="coins-breakdown">
                    <span v-for="(c, ci) in pendingCoins" :key="ci" :class="c === 1 ? 'yang-coin' : 'yin-coin'">
                      {{ c === 1 ? '背(阳)' : '字(阴)' }}
                    </span>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- 掷钱按钮 -->
            <button
              class="btn-toss"
              :disabled="isAnimating || currentCast >= 6"
              @click="tossForLine"
            >
              <span class="btn-ripple"></span>
              {{ isAnimating ? '摇卦中…' : (currentCast >= 6 ? '六爻已成' : `掷第 ${currentCast + 1} 爻`) }}
            </button>

            <div class="cast-hint">
              <p>心中默念问题，点击掷钱</p>
              <p>自下而上，共掷六次</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ========== 卦象结果 ========== -->
    <Transition name="phase-fade">
      <div v-if="phase === 'result'" class="phase-result" :class="{ revealed: revealResult }">

        <div class="result-crown">
          <div class="crown-line"></div>
          <span class="crown-text">卦象已成</span>
          <div class="crown-line"></div>
        </div>

        <div class="question-echo">问：{{ question || '（心中之事）' }}</div>

        <div class="result-actions top-actions">
          <button class="btn-reset" @click="reset">重新起卦</button>
        </div>

        <!-- 本卦 & 变卦并排 -->
        <div class="hexagrams-row">

          <!-- 本卦 -->
          <div class="hexagram-card result-card">
            <div class="card-label">本卦</div>
            <div class="card-symbol">{{ mainHexagram?.symbol }}</div>
            <h2 class="card-name">{{ mainHexagram?.name }}卦</h2>
            <p class="card-nature">{{ mainHexagram?.nature }}</p>

            <!-- 爻线展示 -->
            <div class="hex-lines">
              <div
                v-for="(slot, di) in displayLines"
                :key="di"
                class="hex-line-row"
              >
                <div class="hex-pos-label">{{ posNames[5 - di] }}</div>
                <div class="hex-line-area">
                  <template v-if="slot">
                    <div class="yao-line" :class="{ yang: slot.isYang, yin: !slot.isYang, dynamic: slot.isDynamic }">
                      <template v-if="slot.isYang">
                        <div class="line-solid">
                          <span v-if="slot.isDynamic" class="marker-yang">○</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="line-broken">
                          <span class="seg left"></span>
                          <span class="seg right"></span>
                          <span v-if="slot.isDynamic" class="marker-yin">×</span>
                        </div>
                      </template>
                    </div>
                    <div class="yao-name-label">{{ yaoName(slot, 5 - di) }}</div>
                  </template>
                </div>
              </div>
            </div>

            <button class="btn-detail" @click="goToHexagram(mainHexagram!.id)">
              查看详细卦义 →
            </button>
          </div>

          <!-- 变卦（如有） -->
          <div v-if="changingHexagram" class="hexagram-card result-card changing-card">
            <div class="card-label changing">变卦（之卦）</div>
            <div class="card-symbol">{{ changingHexagram?.symbol }}</div>
            <h2 class="card-name">{{ changingHexagram?.name }}卦</h2>
            <p class="card-nature">{{ changingHexagram?.nature }}</p>

            <!-- 变卦爻线 -->
            <div class="hex-lines">
              <div
                v-for="(slot, di) in displayLines"
                :key="di"
                class="hex-line-row"
              >
                <div class="hex-pos-label">{{ posNames[5 - di] }}</div>
                <div class="hex-line-area">
                  <template v-if="slot">
                    <!-- 动爻在变卦中翻转 -->
                    <div
                      class="yao-line"
                      :class="{
                        yang: slot.isDynamic ? !slot.isYang : slot.isYang,
                        yin: slot.isDynamic ? slot.isYang : !slot.isYang
                      }"
                    >
                      <template v-if="slot.isDynamic ? !slot.isYang : slot.isYang">
                        <div class="line-solid"></div>
                      </template>
                      <template v-else>
                        <div class="line-broken">
                          <span class="seg left"></span>
                          <span class="seg right"></span>
                        </div>
                      </template>
                    </div>
                    <div class="yao-name-label" :class="{ 'changed-yao': slot.isDynamic }">
                      {{ slot.isDynamic ? '已变' : '' }}
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <button class="btn-detail" @click="goToHexagram(changingHexagram!.id)">
              查看变卦详义 →
            </button>
          </div>

        </div>

        <!-- 动爻解析 -->
        <div v-if="dynamicLines.length > 0" class="dynamic-section">
          <h3 class="section-title"><span>◈</span> 动爻解析</h3>
          <div class="dynamic-list">
            <div v-for="dl in dynamicLines" :key="dl.idx" class="dynamic-item">
              <span class="di-pos">{{ posNames[dl.idx] }}</span>
              <span class="di-sep">｜</span>
              <span class="di-name">{{ yaoName(dl, dl.idx) }}</span>
              <span class="di-type" :class="dl.type === '老阳' ? 'laoyang' : 'laoyin'">
                {{ dl.type }} {{ lineMarker(dl.type) }}
              </span>
              <span class="di-change">→ 变{{ dl.isYang ? '阴爻' : '阳爻' }}</span>
            </div>
          </div>
        </div>

        <!-- 卦辞解读 -->
        <div class="interpretation-section">
          <div class="interp-block">
            <h3 class="section-title"><span>◈</span> 本卦卦辞</h3>
            <p class="interp-text ancient">{{ mainHexagram?.guaCi }}</p>
          </div>
          <div class="interp-block">
            <h3 class="section-title"><span>◈</span> 象曰</h3>
            <p class="interp-text">{{ mainHexagram?.xiangYue }}</p>
          </div>
          <div class="interp-block highlight-block">
            <h3 class="section-title"><span>✦</span> 核心要义</h3>
            <p class="interp-text meaning">{{ mainHexagram?.meaning }}</p>
          </div>
          <div v-if="changingHexagram" class="interp-block">
            <h3 class="section-title"><span>◈</span> 变卦要义</h3>
            <p class="interp-text meaning">{{ changingHexagram?.meaning }}</p>
          </div>
        </div>

        <!-- 口诀提示 -->
        <div class="mnemonic-box">
          <p>老变少不变 · 动则生变卦 · 一卦只问一事</p>
        </div>

      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
// ==================== 布局 ====================
.divination-view {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  padding: 24px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.top-nav {
  margin-bottom: 40px;

  .btn-back {
    background: rgba($yang-gold, 0.05);
    border: 1px solid rgba($yang-gold, 0.15);
    padding: 8px 18px;
    border-radius: 8px;
    color: $text-secondary;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    gap: 8px;
    align-items: center;

    &:hover {
      border-color: $yang-gold;
      color: $yang-gold;
    }
  }
}

// ==================== 过渡动画 ====================
.phase-fade-enter-active,
.phase-fade-leave-active {
  transition: opacity 0.4s ease;
}
.phase-fade-enter-from,
.phase-fade-leave-to {
  opacity: 0;
}

.result-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.result-pop-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

// ==================== 引导页 ====================
.phase-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 60px;
  position: relative;

  .intro-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba($yang-gold, 0.04) 0%, transparent 70%);
    pointer-events: none;
  }
}

.intro-header {
  text-align: center;
  margin-bottom: 50px;

  .title-symbol {
    font-size: 3rem;
    color: $yang-gold;
    margin-bottom: 16px;
    animation: float-slow 4s ease-in-out infinite;
    display: inline-block;
  }

  .intro-title {
    font-size: 3.5rem;
    font-family: 'Ma Shan Zheng', serif;
    letter-spacing: 0.3em;
    background: linear-gradient(to bottom, $yang-light, $yang-gold);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: $yang-gold;
    margin-bottom: 12px;
    filter: drop-shadow(0 0 20px rgba($yang-gold, 0.2));
  }

  .intro-sub {
    font-size: 0.9rem;
    color: $text-secondary;
    letter-spacing: 0.4em;
    margin-bottom: 28px;
    opacity: 0.7;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;

    span:not(.gem) {
      width: 80px;
      height: 1px;
      background: linear-gradient(to right, transparent, $yang-gold, transparent);
      opacity: 0.3;
    }

    .gem {
      color: $yang-gold;
      font-size: 0.8rem;
      text-shadow: 0 0 8px $yang-gold;
    }
  }
}

.question-section {
  width: 100%;
  max-width: 520px;
  margin-bottom: 40px;
  text-align: center;

  .q-label {
    display: block;
    font-size: 0.85rem;
    color: $text-muted;
    letter-spacing: 0.2em;
    margin-bottom: 12px;
  }

  .q-input {
    width: 100%;
    padding: 16px 20px;
    background: rgba($yin-dark, 0.5);
    border: 1px solid rgba($yang-gold, 0.2);
    border-radius: 12px;
    color: $yang-light;
    font-size: 1rem;
    text-align: center;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
    outline: none;

    &::placeholder { color: $text-muted; }

    &:focus {
      border-color: $yang-gold;
      box-shadow: 0 0 20px rgba($yang-gold, 0.1);
    }
  }
}

.rules-brief {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 500px;
  width: 100%;
  margin-bottom: 48px;

  .rule-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba($yin-dark, 0.3);
    border: 1px solid rgba($yang-gold, 0.08);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 0.82rem;
    color: $text-secondary;

    .rule-icon {
      color: $yang-gold;
      font-weight: 600;
      white-space: nowrap;
      font-size: 0.78rem;
    }
  }
}

.btn-start {
  position: relative;
  padding: 16px 60px;
  background: linear-gradient(135deg, rgba($yang-gold, 0.15), rgba($yang-deep, 0.15));
  border: 1px solid rgba($yang-gold, 0.4);
  border-radius: 50px;
  color: $yang-gold;
  font-size: 1.1rem;
  letter-spacing: 0.3em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;

  .btn-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba($yang-gold, 0.1), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: $yang-gold;
    box-shadow: 0 0 40px rgba($yang-gold, 0.2), 0 8px 30px rgba(0,0,0,0.3);
    transform: translateY(-2px);

    .btn-glow { opacity: 1; }
  }
}

// ==================== 起卦过程 ====================
.phase-casting {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cast-header {
  text-align: center;

  .question-badge {
    font-size: 0.9rem;
    color: $text-secondary;
    margin-bottom: 20px;
    letter-spacing: 0.1em;
    opacity: 0.8;
  }

  .progress-bar {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;

    .progress-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba($yang-gold, 0.15);
      border: 1px solid rgba($yang-gold, 0.2);
      transition: all 0.4s ease;

      &.done {
        background: $yang-gold;
        box-shadow: 0 0 8px rgba($yang-gold, 0.5);
      }

      &.active {
        background: rgba($yang-gold, 0.4);
        animation: pulse-dot 1.2s ease-in-out infinite;
      }
    }
  }

  .progress-text {
    font-size: 0.85rem;
    color: $yang-gold;
    opacity: 0.8;
    letter-spacing: 0.1em;
  }
}

.cast-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: start;
}

// 左侧卦象成形
.hexagram-building {
  background: rgba($yin-dark, 0.4);
  border: 1px solid rgba($yang-gold, 0.1);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);

  .building-title {
    text-align: center;
    font-size: 0.8rem;
    color: $text-muted;
    letter-spacing: 0.2em;
    margin-bottom: 24px;
  }

  .building-lines {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.line-slot {
  min-height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch; // 允许内部线条响应 100% 宽度
  gap: 6px;
  transition: all 0.4s ease;

  // 针对起卦过程区域，覆盖默认的固定宽度，直接铺满
  .yao-line {
    width: 100%;
  }

  &.active {
    .yao-placeholder {
      color: $yang-gold;
      animation: pulse-text 1.5s ease-in-out infinite;
    }
  }

  &.done {
    animation: line-appear 0.5s ease-out;
  }

  .yao-info-mini {
    display: flex;
    align-items: center;
    gap: 8px;

    .yao-name-mini {
      font-size: 0.75rem;
      color: $text-muted;
    }

    .dynamic-badge {
      font-size: 0.65rem;
      color: $yang-gold;
      background: rgba($yang-gold, 0.1);
      border: 1px solid rgba($yang-gold, 0.3);
      border-radius: 4px;
      padding: 1px 5px;
    }
  }

  .yao-placeholder {
    font-size: 0.75rem;
    color: $text-muted;
    opacity: 0.5;
    text-align: center;

    .placeholder-line {
      display: block;
      height: 2px;
      background: rgba($yang-gold, 0.1);
      border-radius: 1px;
      margin: 10px 0;
    }
  }
}

// 右侧掷钱区
.coin-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 40px;
  background: rgba($yin-dark, 0.3);
  border: 1px solid rgba($yang-gold, 0.08);
  border-radius: 24px;
  min-height: 360px;
  justify-content: center;
}

.coins-container {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.coin {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Ma Shan Zheng', serif;
  transition: all 0.3s ease;
  position: relative;

  &.idle {
    background: rgba($yin-dark, 0.6);
    border: 2px solid rgba($yang-gold, 0.15);
    color: $text-muted;
  }

  &.spinning {
    animation: coin-flip 1.8s ease-in-out forwards;
    background: rgba($yang-gold, 0.1);
    border: 2px solid rgba($yang-gold, 0.3);
    color: $yang-gold;
  }

  &.yang {
    background: linear-gradient(135deg, $yang-gold, $yang-deep);
    border: 2px solid $yang-gold;
    color: $yin-black;
    box-shadow: 0 0 20px rgba($yang-gold, 0.4);
  }

  &.yin {
    background: rgba($yin-dark, 0.8);
    border: 2px solid rgba($yang-gold, 0.25);
    color: $yang-light;
  }

  .coin-face {
    pointer-events: none;
    user-select: none;
  }
}

.result-wrapper {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.toss-result {
  text-align: center;
  width: 100%;

  .result-type {
    font-size: 1.5rem;
    font-family: 'Ma Shan Zheng', serif;
    color: $yang-light;
    letter-spacing: 0.15em;
    margin-bottom: 6px;

    .result-marker {
      color: $yang-gold;
      margin-left: 8px;
      font-size: 1.2rem;
    }

    &.dynamic {
      color: $yang-gold;
      text-shadow: 0 0 15px rgba($yang-gold, 0.4);
    }
  }

  .result-sub {
    font-size: 0.8rem;
    color: $text-muted;
    margin-bottom: 12px;
  }

  .coins-breakdown {
    display: flex;
    gap: 10px;
    justify-content: center;

    span {
      font-size: 0.75rem;
      padding: 3px 10px;
      border-radius: 20px;

      &.yang-coin {
        background: rgba($yang-gold, 0.1);
        color: $yang-gold;
        border: 1px solid rgba($yang-gold, 0.3);
      }

      &.yin-coin {
        background: rgba($text-secondary, 0.08);
        color: $text-secondary;
        border: 1px solid rgba($text-secondary, 0.2);
      }
    }
  }
}

.btn-toss {
  position: relative;
  padding: 14px 48px;
  background: rgba($yang-gold, 0.1);
  border: 1px solid rgba($yang-gold, 0.35);
  border-radius: 50px;
  color: $yang-gold;
  font-size: 1rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  .btn-ripple {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba($yang-gold, 0.08), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:not(:disabled):hover {
    background: rgba($yang-gold, 0.18);
    border-color: $yang-gold;
    box-shadow: 0 0 30px rgba($yang-gold, 0.2);

    .btn-ripple { opacity: 1; }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.cast-hint {
  text-align: center;
  font-size: 0.78rem;
  color: $text-muted;
  opacity: 0.6;
  line-height: 1.8;
}

// ==================== 爻线渲染（通用） ====================
.yao-line {
  position: relative;
  flex: 1; // 改为铺满剩余空间
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  .line-solid {
    width: 100%;
    height: 8px;
    background: $yang-gold;
    border-radius: 2px;
    box-shadow: 0 0 6px rgba($yang-gold, 0.3);
    position: relative;
  }

  .line-broken {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    position: relative;

    .seg {
      flex: 1;
      height: 8px;
      background: $yang-gold;
      border-radius: 2px;
      box-shadow: 0 0 6px rgba($yang-gold, 0.3);
    }
  }

  .line-marker, .marker-yang {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ff9f43;
    font-size: 1rem;
    font-weight: bold;
    background: rgba(15, 17, 26, 0.9); // 遮盖背后的金线
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 8px rgba(#ff9f43, 0.4);
    z-index: 5;
  }

  .line-marker-yin, .marker-yin {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ff6b6b;
    font-size: 1rem;
    font-weight: normal;
    text-shadow: 0 0 10px rgba(#ff6b6b, 0.5);
    z-index: 5;
  }

  &.dynamic {
    .line-solid, .seg {
      background: rgba($yang-gold, 0.85);
      box-shadow: 0 0 12px rgba($yang-gold, 0.5);
    }
  }
}

// ==================== 结果页 ====================
.phase-result {
  opacity: 0;
  transition: opacity 0.6s ease;

  &.revealed { opacity: 1; }
}

.result-crown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;

  .crown-line {
    width: 120px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba($yang-gold, 0.4), transparent);
  }

  .crown-text {
    font-size: 0.85rem;
    color: $yang-gold;
    letter-spacing: 0.4em;
    opacity: 0.8;
  }
}

.question-echo {
  text-align: center;
  font-size: 0.95rem;
  color: $text-secondary;
  margin-bottom: 48px;
  letter-spacing: 0.1em;
}

.hexagrams-row {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.result-card {
  background: rgba($yin-dark, 0.5);
  border: 1px solid rgba($yang-gold, 0.12);
  border-radius: 24px;
  padding: 36px;
  min-width: 320px;
  flex: 1;
  max-width: 450px;
  min-height: 600px;
  backdrop-filter: blur(12px);
  transition: all 0.5s ease;

  &:hover {
    border-color: rgba($yang-gold, 0.3);
    box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 20px rgba($yang-gold, 0.05);
  }

  &.changing-card {
    border-color: rgba(#a29bfe, 0.2);
    background: rgba(#2d3561, 0.3);

    &:hover {
      border-color: rgba(#a29bfe, 0.4);
    }
  }
}

.card-label {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: $yang-gold;
  margin-bottom: 16px;
  text-align: center;

  &.changing {
    color: #a29bfe;
  }
}

.card-symbol {
  font-size: 3rem;
  text-align: center;
  color: $yang-gold;
  margin-bottom: 8px;
  line-height: 1;
}

.card-name {
  font-family: 'Ma Shan Zheng', serif;
  font-size: 1.6rem;
  text-align: center;
  color: $yang-light;
  margin-bottom: 4px;
  letter-spacing: 0.1em;
}

.card-nature {
  font-size: 0.8rem;
  color: $text-muted;
  text-align: center;
  margin-bottom: 24px;
}

.hex-lines {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
  width: 100%;
}

.hex-line-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 0 10px; // 留出呼吸空间

  .hex-pos-label {
    font-size: 0.8rem;
    color: $text-muted;
    width: 32px;
    flex-shrink: 0;
    text-align: right;
  }

  .hex-line-area {
    display: flex;
    align-items: center;
    gap: 16px; // 增加与右侧文字的间距
    flex: 1; // 极其关键：吸收剩余空间传递给 .yao-line
  }
}

.yao-name-label {
  font-size: 0.8rem;
  color: $text-muted;
  width: 36px;
  flex-shrink: 0;
  text-align: left;

  &.changed-yao {
    color: #a29bfe;
    font-size: 0.75rem;
  }
}

.btn-detail {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid rgba($yang-gold, 0.2);
  border-radius: 8px;
  color: $yang-gold;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba($yang-gold, 0.08);
    border-color: rgba($yang-gold, 0.4);
  }
}

// 动爻区域
.dynamic-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 0.85rem;
  color: $yang-gold;
  letter-spacing: 0.2em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  span { opacity: 0.6; }
}

.dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dynamic-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba($yin-dark, 0.4);
  border: 1px solid rgba($yang-gold, 0.08);
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.85rem;

  .di-pos { color: $text-muted; width: 40px; }
  .di-sep { color: rgba($yang-gold, 0.2); }
  .di-name { color: $yang-light; font-weight: 600; }

  .di-type {
    &.laoyang { color: #fdcb6e; }
    &.laoyin { color: #ff7675; }
  }

  .di-change { color: $text-muted; margin-left: auto; font-size: 0.8rem; }
}

// 解读区域
.interpretation-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 36px;
}

.interp-block {
  background: rgba($yin-dark, 0.35);
  border: 1px solid rgba($yang-gold, 0.08);
  border-radius: 16px;
  padding: 24px 28px;

  &.highlight-block {
    border-color: rgba($yang-gold, 0.2);
    background: rgba($yang-gold, 0.03);
  }
}

.interp-text {
  color: $text-secondary;
  line-height: 1.9;
  font-size: 0.95rem;

  &.ancient {
    color: $yang-light;
    font-size: 1.05rem;
    letter-spacing: 0.05em;
  }

  &.meaning {
    border-left: 2px solid rgba($yang-gold, 0.3);
    padding-left: 16px;
    font-style: italic;
  }
}

.mnemonic-box {
  text-align: center;
  padding: 16px;
  border: 1px dashed rgba($yang-gold, 0.12);
  border-radius: 12px;
  margin-bottom: 40px;

  p {
    font-size: 0.8rem;
    color: $text-muted;
    letter-spacing: 0.15em;
    opacity: 0.6;
  }
}

.result-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  
  &.top-actions {
    margin-bottom: 40px;
  }

  .btn-reset {
    padding: 12px 36px;
    background: rgba($yang-gold, 0.1);
    border: 1px solid rgba($yang-gold, 0.35);
    border-radius: 50px;
    color: $yang-gold;
    font-size: 0.9rem;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba($yang-gold, 0.18);
      box-shadow: 0 0 20px rgba($yang-gold, 0.15);
    }
  }
}

// ==================== 动画关键帧 ====================
@keyframes coin-flip {
  0%   { transform: perspective(400px) rotateY(0deg) scale(1); }
  25%  { transform: perspective(400px) rotateY(540deg) scale(1.15); }
  50%  { transform: perspective(400px) rotateY(1080deg) scale(0.9); }
  75%  { transform: perspective(400px) rotateY(1620deg) scale(1.1); }
  100% { transform: perspective(400px) rotateY(2160deg) scale(1); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

@keyframes pulse-text {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes line-appear {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

// ==================== 响应式 ====================
@media (max-width: 768px) {
  .divination-view {
    padding: 20px 16px 60px;
  }

  .cast-body {
    grid-template-columns: 1fr;
  }

  .hexagrams-row {
    flex-direction: column;
    align-items: center;
  }

  .result-card {
    width: 100%;
  }
}
</style>
