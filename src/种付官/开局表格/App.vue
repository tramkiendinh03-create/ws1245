<template>
  <div class="mx-auto flex w-full max-w-[980px] items-center justify-center p-2 sm:p-3 md:p-4">
    <section
      class="relative w-full overflow-hidden rounded-[1.6rem] border border-fuchsia-300/30 bg-[#120714] shadow-[0_25px_80px_rgba(0,0,0,0.65),0_0_35px_rgba(255,90,220,0.22)]"
    >
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-[#2a0d2f] via-[#140917] to-[#0a050f]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,130,225,0.28),transparent_40%)]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_88%_84%,rgba(165,110,255,0.22),transparent_38%)]" />
      </div>

      <div class="relative z-10 p-4 sm:p-5 md:p-6">
        <header class="mb-4 border-b border-fuchsia-200/20 pb-3 sm:mb-5 sm:pb-4">
          <p class="text-xs tracking-[0.2em] text-fuchsia-200/70">SEED-OFFICER / INIT FORM</p>
          <h1 class="mt-1 text-2xl font-bold text-fuchsia-100 sm:text-3xl">开局身份表格</h1>
          <p class="mt-2 text-sm text-fuchsia-100/75 sm:text-base">填写你的开局信息，创建本轮扮演身份。</p>
        </header>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <label class="space-y-2">
            <span class="text-sm text-fuchsia-100/90">姓名</span>
            <input
              v-model.trim="form.name"
              type="text"
              placeholder="例如：夜岚"
              class="w-full rounded-xl border border-fuchsia-300/30 bg-black/30 px-3 py-2.5 text-sm text-fuchsia-50 transition outline-none placeholder:text-fuchsia-200/35 focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm text-fuchsia-100/90">性别</span>
            <select
              v-model="form.gender"
              class="w-full rounded-xl border border-fuchsia-300/30 bg-black/30 px-3 py-2.5 text-sm text-fuchsia-50 transition outline-none focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
            >
              <option value="">请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="非二元">非二元</option>
              <option value="其他">其他</option>
            </select>
          </label>
        </div>

        <label class="mt-4 block space-y-2 sm:mt-5">
          <span class="text-sm text-fuchsia-100/90">身份标识（可自定义）</span>
          <textarea
            v-model.trim="form.identity"
            rows="3"
            placeholder="例如：【隐形人】、【可疑的诊所医生】、【夜行追猎者】"
            class="w-full resize-none rounded-xl border border-fuchsia-300/30 bg-black/30 px-3 py-2.5 text-sm text-fuchsia-50 transition outline-none placeholder:text-fuchsia-200/35 focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
          />
        </label>

        <div class="mt-4 sm:mt-5">
          <p class="mb-2 text-sm text-fuchsia-100/85">身份示例（点击快速填入）</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in identityExamples"
              :key="item"
              class="rounded-full border border-fuchsia-300/35 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100 transition hover:border-fuchsia-200/70 hover:bg-fuchsia-300/20"
              @click="applyExample(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
          <button
            class="rounded-xl border border-fuchsia-100/40 bg-gradient-to-r from-fuchsia-500/45 to-violet-500/45 px-4 py-2 text-sm font-semibold text-white transition hover:from-fuchsia-400/60 hover:to-violet-400/60"
            @click="saveToTavern"
          >
            写入当前楼层变量
          </button>
          <button
            class="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 transition hover:bg-white/20"
            @click="resetForm"
          >
            清空
          </button>
          <span :class="noticeClass" class="text-xs sm:text-sm">{{ notice }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, reactive, ref } from 'vue';

const identityExamples = ['【隐形人】', '【可疑的诊所医生】', '【夜行追猎者】', '【冷面保镖】'];

const form = reactive({
  name: '',
  gender: '',
  identity: '',
});

const notice = ref('等待填写');
const noticeType = ref<'info' | 'ok' | 'warn'>('info');

const noticeClass = computed(() => {
  if (noticeType.value === 'ok') return 'text-emerald-300';
  if (noticeType.value === 'warn') return 'text-amber-300';
  return 'text-fuchsia-200/80';
});

function applyExample(item: string) {
  form.identity = item;
  notice.value = '已填入示例身份';
  noticeType.value = 'info';
}

function resetForm() {
  form.name = '';
  form.gender = '';
  form.identity = '';
  notice.value = '已清空';
  noticeType.value = 'info';
}

function saveToTavern() {
  if (!form.name || !form.gender || !form.identity) {
    notice.value = '请先填写姓名、性别、身份标识';
    noticeType.value = 'warn';
    return;
  }

  const helper = (globalThis as any).TavernHelper as
    | {
        getVariables?: (option: { type: 'message'; message_id?: number | 'latest' }) => Record<string, any>;
        replaceVariables?: (
          variables: Record<string, any>,
          option: { type: 'message'; message_id?: number | 'latest' },
        ) => void;
      }
    | undefined;

  if (!helper?.getVariables || !helper?.replaceVariables) {
    notice.value = '未检测到 TavernHelper，无法写入变量';
    noticeType.value = 'warn';
    return;
  }

  const variables = _.cloneDeep(helper.getVariables({ type: 'message' }) ?? {});
  _.set(variables, 'stat_data.开局信息', {
    姓名: form.name,
    性别: form.gender,
    身份标识: form.identity,
    更新时间: Date.now(),
  });
  helper.replaceVariables(variables, { type: 'message' });

  notice.value = '已写入 stat_data.开局信息';
  noticeType.value = 'ok';
}
</script>
