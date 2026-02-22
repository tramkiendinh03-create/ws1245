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
          <h1 class="mt-1 text-2xl font-bold text-fuchsia-100 sm:text-3xl">开局身份录入</h1>
          <p class="mt-2 text-sm text-fuchsia-100/75 sm:text-base">填写开局身份信息，一键开局。</p>
        </header>

        <div
          class="mb-4 flex h-[78px] items-center justify-center rounded-xl border border-fuchsia-300/35 bg-gradient-to-br from-fuchsia-400/10 to-violet-400/10 text-xs tracking-[0.2em] text-fuchsia-100/90 shadow-[inset_0_0_24px_rgba(255,120,210,0.14)]"
        >
          ✦ LUST CODE ✦
        </div>

        <div class="grid grid-cols-1 gap-4">
          <label class="space-y-2">
            <span class="text-sm text-fuchsia-100/90">姓名 <span class="text-rose-300">*</span></span>
            <input
              v-model.trim="form.name"
              type="text"
              placeholder="例如：雨宫 夜澪"
              class="w-full rounded-xl border border-fuchsia-300/30 bg-black/30 px-3 py-2.5 text-sm text-fuchsia-50 transition outline-none placeholder:text-fuchsia-200/35 focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm text-fuchsia-100/90">性别 <span class="text-rose-300">*</span></span>
            <select
              v-model="form.gender"
              class="w-full rounded-xl border border-fuchsia-300/30 bg-black/30 px-3 py-2.5 text-sm text-fuchsia-50 transition outline-none focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
            >
              <option value="">请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="扶她">扶她</option>
              <option value="男娘">男娘</option>
            </select>
          </label>

          <label class="space-y-2">
            <span class="text-sm text-fuchsia-100/90">身份标识 <span class="text-rose-300">*</span></span>
            <textarea
              v-model.trim="form.identity"
              rows="3"
              placeholder="例如：成熟御姐女教师｜危险美艳黑帮夫人｜娇纵财阀千金"
              class="w-full rounded-xl border border-fuchsia-300/30 bg-black/30 px-3 py-2.5 text-sm text-fuchsia-50 transition outline-none placeholder:text-fuchsia-200/35 focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
            />
          </label>

          <div>
            <p class="mb-2 text-sm text-fuchsia-100/85">身份标识示例（点击填入）</p>
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

          <label class="space-y-2">
            <span class="text-sm text-fuchsia-100/90">额外设定（可选）</span>
            <textarea
              v-model.trim="form.extra"
              rows="3"
              placeholder="例如：性格偏好、禁忌、互动节奏、剧情雷点、服装风格、口癖等"
              class="w-full rounded-xl border border-fuchsia-300/30 bg-black/30 px-3 py-2.5 text-sm text-fuchsia-50 transition outline-none placeholder:text-fuchsia-200/35 focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
            />
          </label>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
          <button
            :disabled="sending"
            class="rounded-xl border border-fuchsia-100/40 bg-gradient-to-r from-fuchsia-500/45 to-violet-500/45 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-fuchsia-400/60 enabled:hover:to-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
            @click="sendAndGenerate"
          >
            一键开局
          </button>
          <button
            class="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 transition hover:bg-white/20"
            @click="copyPrompt"
          >
            复制设定文本
          </button>
          <button
            class="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 transition hover:bg-white/20"
            @click="resetForm"
          >
            清空表单
          </button>
          <span :class="noticeClass" class="text-xs sm:text-sm">{{ notice }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

const identityExamples = ['成熟御姐女教师', '危险美艳黑帮夫人', '娇纵财阀千金', '清冷病娇研究员', '温柔人妻邻居'];

const form = reactive({
  name: '',
  gender: '',
  identity: '',
  extra: '',
});

const notice = ref('等待填写');
const noticeType = ref<'info' | 'ok' | 'warn'>('info');
const sending = ref(false);

const noticeClass = computed(() => {
  if (noticeType.value === 'ok') return 'text-emerald-300';
  if (noticeType.value === 'warn') return 'text-amber-300';
  return 'text-fuchsia-200/80';
});

function setNotice(text: string, type: 'info' | 'ok' | 'warn' = 'info') {
  notice.value = text;
  noticeType.value = type;
}

type TavernHelperLike = {
  getVariables?: (option: { type: 'message'; message_id?: number | 'latest' }) => Record<string, any>;
  replaceVariables?: (
    variables: Record<string, any>,
    option: { type: 'message'; message_id?: number | 'latest' },
  ) => void;
};

function syncProfileToSeedOfficerPanel(payload: { name: string; gender: string; identity: string }) {
  const helper = (globalThis as any).TavernHelper as TavernHelperLike | undefined;
  if (!helper?.getVariables || !helper?.replaceVariables) return;

  const variables = structuredClone(helper.getVariables({ type: 'message' }) ?? {});
  if (typeof variables !== 'object' || variables === null) return;

  const statData = (variables.stat_data ??= {});
  const panel = (statData.种付官面板 ??= {});

  panel.姓名 = payload.name;
  panel.性别 = payload.gender;
  panel.身份标识 = payload.identity;

  helper.replaceVariables(variables, { type: 'message' });
}

function buildPrompt(): { ok: true; text: string } | { ok: false; message: string } {
  const name = form.name.trim();
  const gender = form.gender.trim();
  const identity = form.identity.trim();
  const extra = form.extra.trim();

  if (!name || !gender || !identity) {
    return { ok: false, message: '请完整填写 姓名 / 性别 / 身份标识。' };
  }

  const lines = [
    '【开局种付官设定】',
    `姓名：${name}`,
    `性别：${gender}`,
    `身份标识：${identity}`,
    `额外设定：${extra || '无'}`,
    '',
    '请基于以上设定，生成一段适合作为当前聊天开局推进的第一幕内容。',
    '要求：保持沉浸感、情绪张力、环境细节与人物行动感。',
    '（务必要所有变量！！！）',
  ];

  return { ok: true, text: lines.join('\n') };
}

function applyExample(item: string) {
  form.identity = item;
  setNotice('已填入示例身份');
}

function resetForm() {
  form.name = '';
  form.gender = '';
  form.identity = '';
  form.extra = '';
  setNotice('已清空表单');
}

async function copyPrompt() {
  const built = buildPrompt();
  if (!built.ok) {
    setNotice('message' in built ? built.message : '输入不完整', 'warn');
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(built.text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = built.text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setNotice('设定文本已复制。', 'ok');
  } catch (error) {
    setNotice(`复制失败：${error instanceof Error ? error.message : String(error)}`, 'warn');
  }
}

async function sendAndGenerate() {
  const built = buildPrompt();
  if (!built.ok) {
    setNotice('message' in built ? built.message : '输入不完整', 'warn');
    return;
  }

  if (typeof (globalThis as any).generate !== 'function') {
    setNotice('未检测到 generate()，无法触发 AI 生成。', 'warn');
    return;
  }
  if (typeof (globalThis as any).createChatMessages !== 'function') {
    setNotice('未检测到 createChatMessages()，无法发送。', 'warn');
    return;
  }

  sending.value = true;
  setNotice('正在代你发送…', 'warn');

  try {
    const userPrompt = built.text;

    syncProfileToSeedOfficerPanel({
      name: form.name.trim(),
      gender: form.gender.trim(),
      identity: form.identity.trim(),
    });

    await (globalThis as any).createChatMessages([{ role: 'user', message: userPrompt }], {
      refresh: 'affected',
    });

    setNotice('已发送，正在触发 AI 生成…', 'warn');

    const assistantReply = await (globalThis as any).generate({
      user_input: userPrompt,
      should_silence: true,
    });

    await (globalThis as any).createChatMessages([{ role: 'assistant', message: assistantReply }], {
      refresh: 'affected',
    });

    setNotice('已代你发送，AI 回复已生成。', 'ok');
  } catch (error) {
    setNotice(`发送或生成失败：${error instanceof Error ? error.message : String(error)}`, 'warn');
  } finally {
    sending.value = false;
  }
}
</script>
