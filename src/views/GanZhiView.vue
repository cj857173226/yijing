<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { TIAN_GAN, DI_ZHI, WU_XING, SHENG_XIAO, getGanZhi, GAN_PINYIN, ZHI_PINYIN } from '@/utils/calendar';
import { GAN_DETAILS, ZHI_DETAILS, type GanZhiDetail } from '@/data/ganzhi';

const router = useRouter();
const currentTime = ref(new Date());
const currentGz = ref(getGanZhi());
const selectedItem = ref<(GanZhiDetail & { shengxiao?: string, hour?: string }) | null>(null);

const selectItem = (name: string, isGan: boolean) => {
  const data = isGan ? GAN_DETAILS[name] : ZHI_DETAILS[name];
  if (data) selectedItem.value = data;
};

const closeDetail = () => {
  selectedItem.value = null;
};

let timer: any = null;

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
    currentGz.value = getGanZhi();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const wuxingColor: Record<string, string> = {
  '金': '#f1c40f',
  '木': '#2ecc71',
  '水': '#3498db',
  '火': '#e74c3c',
  '土': '#e67e22'
};

const getStyle = (name: string) => ({
  color: wuxingColor[WU_XING[name]] || '#fff',
  borderColor: wuxingColor[WU_XING[name]] || 'rgba(255,255,255,0.1)'
});
</script>

<template>
  <div class="ganzhi-view">
    <nav class="top-nav">
      <button class="btn-back" @click="router.push('/')">← 返回门户</button>
      <div class="current-time-banner">
        <span class="date">{{ currentTime.toLocaleDateString() }} {{ currentTime.toLocaleTimeString() }}</span>
        <span class="divider">|</span>
        <span class="gz-display">{{ currentGz.year }}年 {{ currentGz.hour }}时</span>
      </div>
    </nav>

    <header class="page-header">
      <h1 class="gradient-text">天干地支</h1>
      <p class="subtitle">干支计时 · 五行生克 · 宇宙节律</p>
    </header>

    <main class="ganzhi-content">
      <!-- 十天干 -->
      <section class="gan-section box-card">
        <h2 class="section-title">十天干 (Heavenly Stems)</h2>
        <div class="grid">
          <div 
            v-for="gan in TIAN_GAN" 
            :key="gan" 
            class="cell clickable" 
            :style="getStyle(gan)"
            @click="selectItem(gan, true)"
          >
            <div class="pinyin">{{ GAN_PINYIN[gan] }}</div>
            <div class="main-char">{{ gan }}</div>
            <div class="sub-info">{{ WU_XING[gan] }}行</div>
          </div>
        </div>
      </section>

      <!-- 十二地支 -->
      <section class="zhi-section box-card">
        <h2 class="section-title">十二地支 (Earthly Branches)</h2>
        <div class="grid zhi-grid">
          <div 
            v-for="(zhi, index) in DI_ZHI" 
            :key="zhi" 
            class="cell clickable" 
            :style="getStyle(zhi)"
            @click="selectItem(zhi, false)"
          >
            <div class="pinyin">{{ ZHI_PINYIN[zhi] }}</div>
            <div class="main-char">{{ zhi }}</div>
            <div class="sub-info">{{ SHENG_XIAO[index] }} / {{ WU_XING[zhi] }}</div>
          </div>
        </div>
      </section>

      <!-- 详情弹窗 -->
      <Transition name="fade">
        <div v-if="selectedItem" class="detail-overlay" @click.self="closeDetail">
          <div class="detail-modal glass-panel">
            <button class="btn-close" @click="closeDetail">×</button>
            <div class="detail-header">
              <div class="big-char" :style="{ color: wuxingColor[selectedItem.wuxing] }">{{ selectedItem.name }}</div>
              <div class="basic-tags">
                <span class="tag">{{ selectedItem.yinyang }}</span>
                <span class="tag" :style="{ background: wuxingColor[selectedItem.wuxing], color: '#000' }">{{ selectedItem.wuxing }}</span>
                <span v-if="selectedItem.shengxiao" class="tag">{{ selectedItem.shengxiao }}</span>
              </div>
            </div>
            
            <div class="detail-grid">
              <div class="detail-item">
                <label>方位时令</label>
                <p>{{ selectedItem.direction }} · {{ selectedItem.season }}</p>
              </div>
              <div class="detail-item">
                <label>对应脏腑</label>
                <p>{{ selectedItem.organ }}</p>
              </div>
              <div v-if="selectedItem.hour" class="detail-item">
                <label>代表时辰</label>
                <p>{{ selectedItem.hour }}</p>
              </div>
            </div>

            <div class="detail-text">
              <label>核心象义</label>
              <p class="meaning">{{ selectedItem.meaning }}</p>
              <label>性格特质</label>
              <p class="personality">{{ selectedItem.personality }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 知识版块 -->
      <div class="knowledge-grid">
        <div class="info-card glass-panel">
          <h3>什么是干支？</h3>
          <p>天干地支，简称为干支，源自中国古代对天象的观测。简化组合后形成六十甲子，周而复始，用以纪年、纪月、纪日、纪时。</p>
        </div>
        <div class="info-card glass-panel">
          <h3>五行属性</h3>
          <p>干支各有所属五行。东方甲乙寅卯木，南方丙丁巳午火，西方庚辛申酉金，北方壬癸亥子水，中央戊己辰戌丑未土。</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.ganzhi-view {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 20;
  
  .btn-back {
    background: transparent;
    border: 1px solid rgba($yang-gold, 0.3);
    color: $yang-gold;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    &:hover { background: rgba($yang-gold, 0.1); }
  }

  .current-time-banner {
    background: rgba(0,0,0,0.3);
    padding: 10px 24px;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,0.05);
    font-size: 0.9rem;
    color: $text-secondary;
    .gz-display { color: $yang-gold; font-weight: bold; }
    .divider { margin: 0 15px; opacity: 0.3; }
  }
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
  h1 { font-size: 3rem; letter-spacing: 0.2em; margin-bottom: 10px; }
  .subtitle { color: $text-muted; letter-spacing: 0.4em; text-transform: uppercase; font-size: 0.8rem; }
}

.box-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
}

.section-title {
  color: $yang-gold;
  font-size: 1.2rem;
  margin-bottom: 30px;
  text-align: center;
  opacity: 0.8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  
  .cell {
    background: rgba(0,0,0,0.2);
    border: 1px solid transparent;
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px currentColor;
      filter: brightness(1.2);
    }

    .pinyin {
      font-size: 0.85rem;
      color: rgba($text-muted, 0.8);
      margin-bottom: -5px; // 缩进拉近大字距离
      font-family: 'Inter', sans-serif;
    }

    .main-char { 
      font-size: 3rem; 
      font-family: "Ma Shan Zheng", "Inter", sans-serif; 
      margin-bottom: 8px;
      color: inherit;
    }
    .sub-info { font-size: 0.75rem; opacity: 0.6; }

    &.clickable {
      cursor: pointer;
      &:active { transform: scale(0.95); }
    }
  }
}

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.detail-modal {
  width: 100%;
  max-width: 500px;
  background: rgba($yin-dark, 0.95);
  border: 1px solid rgba($yang-gold, 0.3);
  padding: 40px;
  border-radius: 32px;
  position: relative;
  animation: modal-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  .btn-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    color: $text-muted;
    font-size: 2rem;
    cursor: pointer;
    &:hover { color: $yang-gold; }
  }
}

.detail-header {
  text-align: center;
  margin-bottom: 30px;
  .big-char { font-size: 5rem; font-family: "Ma Shan Zheng", serif; line-height: 1; margin-bottom: 15px; }
  .basic-tags {
    display: flex;
    justify-content: center;
    gap: 10px;
    .tag {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      border: 1px solid rgba($yang-gold, 0.2);
      color: $text-secondary;
    }
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  margin-bottom: 30px;
  
  .detail-item {
    label { display: block; font-size: 0.7rem; color: $text-muted; margin-bottom: 4px; }
    p { font-size: 1rem; color: $yang-light; font-weight: 600; }
  }
}

.detail-text {
  label { display: block; font-size: 0.7rem; color: $text-muted; margin-bottom: 8px; margin-top: 15px; }
  p { line-height: 1.6; color: $text-secondary; font-size: 0.95rem; }
  .meaning { color: $yang-light; font-size: 1.1rem; font-weight: 500; }
}

@keyframes modal-up {
  from { opacity: 0; transform: translateY(30px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.zhi-grid { grid-template-columns: repeat(6, 1fr); }

.knowledge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  .info-card {
    padding: 30px;
    h3 { color: $yang-gold; margin-bottom: 15px; }
    p { color: $text-secondary; font-size: 0.9rem; line-height: 1.8; }
  }
}

@media (max-width: 768px) {
  .grid, .zhi-grid, .knowledge-grid { grid-template-columns: repeat(2, 1fr); }
  .ganzhi-view { padding: 20px; }
}
</style>
