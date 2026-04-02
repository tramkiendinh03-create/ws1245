<template>
  <div class="gothic-root flex w-full items-center justify-center p-1 font-serif sm:p-2 md:p-3">
    <div
      class="gothic-shell relative flex aspect-[9/16] w-full max-w-[1260px] flex-col overflow-hidden rounded-[1.4rem] border border-amber-200/35 bg-[#120914] shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,210,150,0.16),0_0_46px_rgba(255,120,200,0.14)] sm:aspect-[4/5] sm:rounded-[2rem] md:aspect-[16/10] md:rounded-[2.3rem] lg:rounded-[2.7rem]"
    >
      <div class="pointer-events-none absolute inset-0">
        <div class="velvet-texture absolute inset-0" />
        <div class="rococo-overlay absolute inset-0" />
        <div class="ambient-vignette absolute inset-0" />
      </div>
      <div
        class="opulent-frame pointer-events-none absolute inset-[10px] rounded-[2.1rem] border border-amber-200/30 shadow-[inset_0_0_0_1px_rgba(255,220,170,0.14),inset_0_26px_55px_rgba(0,0,0,0.52)]"
      />
      <div
        class="pointer-events-none absolute top-2 left-1/2 z-30 h-1.5 w-24 -translate-x-1/2 rounded-full bg-fuchsia-200/35 shadow-[0_0_14px_rgba(255,120,200,0.45)]"
      />

      <div
        class="magic-glow relative z-20 mx-2 mt-2 flex items-center justify-between gap-2 rounded-t-2xl border border-amber-200/35 bg-gradient-to-r from-[#3a1a35]/55 via-[#2a1328]/50 to-[#3a1a35]/55 px-3 py-1.5 text-[11px] text-amber-50 shadow-[0_0_22px_rgba(255,120,200,0.2)] backdrop-blur-xl sm:px-4"
      >
        <span class="gilded-text font-medium tracking-[0.06em] text-amber-50/95">{{ gameState.time }}</span>
        <span
          :class="[
            'rounded-full border border-amber-200/40 bg-fuchsia-300/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.06em] text-rose-100 shadow-[0_0_16px_rgba(255,120,200,0.3)]',
            statusNoticeClass,
          ]"
          >{{ statusNotice.text }}</span
        >
      </div>

      <div
        class="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-2.5 overflow-x-hidden overflow-y-auto px-2.5 py-3 sm:gap-4 sm:px-4 sm:py-5 md:grid-cols-12 md:gap-5"
      >
        <section class="space-y-3 sm:space-y-4 md:col-span-4 md:space-y-5">
          <div
            class="ornate-panel rounded-2xl border border-amber-200/30 bg-gradient-to-br from-[#241126]/88 to-[#120913]/92 p-3.5 shadow-[inset_0_0_0_1px_rgba(255,220,170,0.16),0_0_26px_rgba(255,120,200,0.14)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-amber-100/45 hover:shadow-[inset_0_0_0_1px_rgba(255,235,200,0.22),0_0_36px_rgba(255,140,210,0.2)] sm:p-4 md:p-5"
          >
            <div :class="['panel-kicker gilded-text mb-2 text-xs font-bold tracking-wider', themeColor.value]">
              地点
            </div>
            <h2 class="gilded-title text-lg leading-tight font-bold break-words text-white sm:text-xl md:text-2xl">
              {{ locationMain }}
            </h2>
            <div
              class="gilded-title mt-1.5 text-base leading-tight font-bold break-words text-white/85 sm:text-lg md:mt-2 md:text-xl"
            >
              {{ locationSub }}
            </div>

            <div class="mt-4 border-t border-amber-100/20 pt-3 sm:mt-5 sm:pt-4 md:mt-6">
              <div class="mb-2 text-xs text-amber-100/65">环境氛围</div>
              <p class="line-clamp-3 text-sm text-rose-50/90 italic">{{ gameState.atmosphere }}</p>
            </div>
          </div>

          <div
            class="ornate-panel rounded-2xl border border-amber-200/30 bg-gradient-to-br from-[#241126]/88 to-[#120913]/92 p-3.5 shadow-[inset_0_0_0_1px_rgba(255,220,170,0.16),0_0_26px_rgba(255,120,200,0.14)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-amber-100/45 hover:shadow-[inset_0_0_0_1px_rgba(255,235,200,0.22),0_0_36px_rgba(255,140,210,0.2)] sm:p-4 md:p-5"
          >
            <div :class="['panel-kicker gilded-text mb-2 text-xs font-bold tracking-wider', themeColor.value]">
              身份标识
            </div>
            <div class="gilded-title text-lg leading-tight font-bold break-words text-white sm:text-xl md:text-2xl">
              {{ gameState.player.name }}
            </div>
            <div
              class="mt-1.5 line-clamp-3 text-sm leading-snug break-words text-slate-300 sm:text-base md:mt-2 md:text-base"
            >
              {{ gameState.player.currentTask }}
            </div>
          </div>
        </section>

        <section class="md:col-span-8">
          <div class="grid grid-cols-2 content-start gap-3 pt-1 sm:grid-cols-4 sm:gap-6 sm:pt-2 md:gap-7 md:pt-3">
            <button class="group flex flex-col items-center gap-2" @click="openApp = 'target'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200/35 bg-gradient-to-br from-[#2a1427]/90 to-[#170b16]/95 text-rose-200 shadow-[0_0_22px_rgba(255,120,200,0.16)] transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04] group-hover:border-amber-100/60 group-hover:shadow-[0_0_30px_rgba(255,130,210,0.35)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 19a7 7 0 0 1 14 0" />
                </svg>
              </span>
              <span class="text-xs tracking-wide text-rose-50/95 sm:text-sm md:text-base">目标档案</span>
            </button>

            <button class="group flex flex-col items-center gap-2" @click="openApp = 'player'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200/35 bg-gradient-to-br from-[#2a1427]/90 to-[#170b16]/95 text-fuchsia-200 shadow-[0_0_22px_rgba(255,120,200,0.16)] transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04] group-hover:border-amber-100/60 group-hover:shadow-[0_0_30px_rgba(255,130,210,0.35)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                >
                  <path d="M12 3l6 3v5c0 4.5-2.5 7.5-6 10-3.5-2.5-6-5.5-6-10V6l6-3z" />
                </svg>
              </span>
              <span class="text-xs tracking-wide text-rose-50/95 sm:text-sm md:text-base">种付官</span>
            </button>

            <button class="group flex flex-col items-center gap-2" @click="openApp = 'inventory'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200/35 bg-gradient-to-br from-[#2a1427]/90 to-[#170b16]/95 text-amber-200 shadow-[0_0_22px_rgba(255,120,200,0.16)] transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04] group-hover:border-amber-100/60 group-hover:shadow-[0_0_30px_rgba(255,170,120,0.35)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                >
                  <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" />
                  <path d="M4 7.5V16.5L12 21" />
                  <path d="M20 7.5V16.5L12 21" />
                </svg>
              </span>
              <span class="text-xs tracking-wide text-rose-50/95 sm:text-sm md:text-base">道具箱</span>
            </button>

            <button class="group flex flex-col items-center gap-2" @click="openApp = 'settings'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200/35 bg-gradient-to-br from-[#2a1427]/90 to-[#170b16]/95 text-rose-100 shadow-[0_0_22px_rgba(255,120,200,0.16)] transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04] group-hover:border-amber-100/60 group-hover:shadow-[0_0_30px_rgba(255,130,210,0.35)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-1.6a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0l-1.1-1.1a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1 1 0 0 1-1-1v-1.6a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1.1-1.1a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1 1 0 0 1 1 1v1.6a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6z"
                  />
                </svg>
              </span>
              <span class="text-xs tracking-wide text-rose-50/95 sm:text-sm md:text-base">系统设置</span>
            </button>
          </div>
        </section>
      </div>

      <div v-if="openApp" class="modal-overlay absolute inset-0 z-40 p-2 sm:p-3 md:p-4">
        <div
          class="modal-shell flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-amber-200/30 bg-[#140a16]/95 shadow-[0_24px_55px_rgba(0,0,0,0.5),0_0_22px_rgba(255,120,200,0.14)]"
        >
          <header
            class="modal-header flex items-center justify-between border-b border-amber-200/20 bg-gradient-to-r from-[#3a1a35]/80 to-[#251126]/90 px-4 py-2 text-xs md:text-sm"
          >
            <div class="flex items-center gap-2 font-semibold text-rose-50">
              <span class="h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_10px_rgba(255,120,200,0.7)]" />
              <span class="gothic-heading tracking-[0.08em]">{{ appTitle }}</span>
            </div>
            <div class="flex items-center text-slate-300">
              <button class="cursor-pointer text-base leading-none hover:text-white" @click="closeApp">×</button>
            </div>
          </header>

          <main class="modal-main min-h-0 flex-1 overflow-auto p-2 sm:p-2.5 md:p-3">
            <template v-if="openApp === 'target'">
              <div v-if="selectedTarget" class="space-y-3">
                <button
                  class="rounded-2xl border border-amber-200/35 bg-[#2b1025]/55 px-3 py-1.5 text-sm text-amber-100 transition hover:bg-[#3a1630]/70"
                  @click="selectedTargetIndex = null"
                >
                  ← 返回列表
                </button>

                <div
                  class="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-[#2a0f24]/72 via-[#160913]/74 to-[#230814]/78 p-4 shadow-[inset_0_0_24px_rgba(255,0,120,0.16)]"
                >
                  <div class="flex items-start gap-4">
                    <div
                      v-if="selectedTarget.avatarUrl"
                      class="relative h-20 w-20 cursor-zoom-in overflow-hidden rounded-xl border border-pink-400/50 transition hover:scale-[1.02] hover:border-pink-300/70 md:h-24 md:w-24"
                      @click="openPreviewImage(selectedTarget.avatarUrl, selectedTarget.name)"
                    >
                      <img
                        v-if="selectedTarget.avatarUrl"
                        :src="selectedTarget.avatarUrl"
                        :alt="selectedTarget.name"
                        class="h-full w-full object-cover"
                        @error="hideTargetAvatar(selectedTarget)"
                      />
                      <div
                        class="absolute right-1 bottom-1 rounded-full bg-pink-500/80 px-2 py-0.5 text-[11px] text-white"
                      >
                        攻略难度: {{ selectedTarget.difficulty }}
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="gothic-heading text-2xl leading-tight font-bold text-[#e5c593] md:text-3xl">
                        {{ selectedTarget.name }}
                      </h3>
                      <div class="mt-1 text-sm text-pink-200/85 md:text-base">
                        {{ selectedTarget.occupation }} • {{ selectedTarget.relationship }}
                      </div>
                      <div
                        class="mt-2 inline-block rounded-lg border border-violet-400/35 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-200 md:text-sm"
                      >
                        ↯ 表面情绪: {{ selectedTarget.surfaceEmotion }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                    <div class="rounded-xl border border-white/10 bg-black/25 p-4">
                      <div class="space-y-4">
                        <div>
                          <div class="mb-1.5 flex items-center justify-between text-sm text-slate-300 md:text-base">
                            <span>反抗指数</span>
                            <span>{{ selectedTarget.resistanceIndex }}</span>
                          </div>
                          <div class="h-2.5 overflow-hidden rounded-full bg-slate-700/35">
                            <div
                              class="h-full rounded-full bg-gradient-to-r from-slate-300 to-rose-500"
                              :style="{ width: `${selectedTarget.resistanceIndex}%` }"
                            />
                          </div>
                        </div>

                        <div>
                          <div class="mb-1.5 flex items-center justify-between text-sm text-slate-300 md:text-base">
                            <span>臣服度</span>
                            <span>{{ selectedTarget.submissionLevel }}</span>
                          </div>
                          <div class="h-2.5 overflow-hidden rounded-full bg-slate-700/35">
                            <div
                              class="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                              :style="{ width: `${Math.max(0, Math.min(100, selectedTarget.submissionLevel))}%` }"
                            />
                          </div>
                          <div class="mt-1 text-right text-xs font-semibold text-pink-300 md:text-sm">
                            {{ getSubmissionStage(selectedTarget.submissionLevel) }}
                          </div>
                        </div>

                        <div>
                          <div class="mb-1.5 flex items-center justify-between text-sm text-slate-300 md:text-base">
                            <span>好感度</span>
                            <span>{{ selectedTarget.affection }}</span>
                          </div>
                          <div class="h-2.5 overflow-hidden rounded-full bg-slate-700/35">
                            <div
                              class="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-pink-500"
                              :style="{ width: `${selectedTarget.affection}%` }"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-3">
                      <div>
                        <div class="mb-1.5 text-sm text-pink-300 md:text-base">♡ 偏好</div>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="fetish in selectedTarget.fetishes"
                            :key="fetish"
                            class="rounded-lg border border-pink-500/45 bg-pink-500/10 px-2.5 py-0.5 text-xs text-pink-100 md:text-sm"
                            >{{ fetish }}</span
                          >
                        </div>
                      </div>

                      <div>
                        <div class="mb-1.5 text-sm text-violet-300 md:text-base">ღ 关系状态</div>
                        <div
                          class="rounded-lg border border-white/15 bg-white/8 px-2.5 py-1.5 text-xs text-slate-200 md:text-sm"
                        >
                          {{ selectedTarget.partnerStatus }}
                        </div>
                      </div>

                      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div class="mb-1.5 text-xs text-slate-300 md:text-sm">临时状态</div>
                          <div class="flex flex-wrap gap-2">
                            <span
                              v-for="status in selectedTarget.tempStatus"
                              :key="status"
                              class="rounded-md border border-slate-300/25 bg-slate-500/10 px-2 py-0.5 text-[11px] text-slate-200 md:text-xs"
                              >{{ status }}</span
                            >
                          </div>
                        </div>
                        <div>
                          <div class="mb-1.5 text-xs text-emerald-300 md:text-sm">永久状态</div>
                          <div class="flex flex-wrap gap-2">
                            <span
                              v-for="status in selectedTarget.permStatus"
                              :key="status"
                              class="rounded-md border border-emerald-400/35 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200 md:text-xs"
                              >{{ status }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="gothic-scroll grid max-h-full grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 md:gap-3"
              >
                <article
                  v-for="(target, index) in gameState.targets"
                  :key="`${target.name}-${index}`"
                  class="group relative rounded-2xl border border-amber-200/25 bg-gradient-to-r from-[#2a1023]/55 to-[#1a0b16]/45 p-2.5 transition-all hover:border-amber-100/55 md:p-3"
                >
                  <button class="w-full text-left" @click="selectedTargetIndex = index">
                    <div class="flex items-center gap-4">
                      <div
                        v-if="target.avatarUrl"
                        class="h-12 w-12 overflow-hidden rounded-lg border border-white/20 sm:h-14 sm:w-14 md:h-16 md:w-16"
                      >
                        <img
                          v-if="target.avatarUrl"
                          :src="target.avatarUrl"
                          :alt="target.name"
                          class="h-full w-full object-cover"
                          @error="hideTargetAvatar(target)"
                        />
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                          <h3 class="gothic-heading truncate text-base font-bold text-[#e5c593] sm:text-lg md:text-xl">
                            {{ target.name }}
                          </h3>
                          <span class="rounded bg-white/15 px-2 py-0.5 text-xs text-slate-200"
                            >攻略难度: {{ target.difficulty }}</span
                          >
                        </div>
                        <div class="mt-0.5 text-xs text-slate-300 sm:text-sm md:mt-1 md:text-base">
                          {{ target.occupation }}
                        </div>
                        <div class="mt-0.5 text-[11px] text-slate-400 sm:text-xs md:mt-1 md:text-sm">
                          臣服: {{ target.submissionLevel }}% / 反抗: {{ target.resistanceIndex }}%
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    class="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/30 text-xs text-red-200 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/55"
                    @click.stop="requestRemoveTarget(index)"
                  >
                    🗑
                  </button>
                </article>
              </div>
            </template>

            <template v-else-if="openApp === 'player'">
              <div
                class="gothic-scroll mx-auto max-h-full w-full max-w-[920px] overflow-y-auto rounded-2xl border border-amber-200/30 bg-[rgba(20,0,10,0.7)] p-2.5 shadow-[inset_0_0_20px_rgba(255,0,100,0.3),0_0_15px_rgba(255,0,100,0.5)] backdrop-blur-[12px] md:p-3"
              >
                <div class="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-2.5">
                  <div class="md:col-span-8">
                    <div class="flex items-start gap-3">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/40 bg-fuchsia-400/10 text-amber-100 md:h-12 md:w-12"
                      >
                        👤
                      </div>
                      <div>
                        <div
                          class="gothic-heading text-lg leading-tight font-bold break-words text-[#e5c593] sm:text-xl md:text-2xl"
                        >
                          {{ gameState.player.name }}
                        </div>
                        <div class="mt-0.5 text-xs break-words text-rose-100/85 md:mt-1 md:text-sm">
                          {{ gameState.player.identity }} • {{ gameState.player.gender }}
                        </div>
                      </div>
                    </div>
                    <div class="mt-2.5">
                      <div class="h-2.5 overflow-hidden rounded-full bg-[#3b1632]/55">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-[#d379ae] to-[#f0be7f]"
                          :style="{ width: `${(gameState.player.xp / gameState.player.maxXp) * 100}%` }"
                        />
                      </div>
                      <div class="mt-1 text-right text-[11px] text-amber-100/85 md:text-sm">
                        {{ gameState.player.xp }} / {{ gameState.player.maxXp }}
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end md:col-span-4">
                    <div
                      class="gothic-heading h-fit rounded-2xl border border-amber-300/40 bg-fuchsia-400/10 px-2 py-1 text-xs font-semibold text-[#e5c593] md:px-2.5 md:py-1.5 md:text-sm"
                    >
                      当前等级 {{ gameState.player.level }}
                    </div>
                  </div>
                </div>

                <div class="mt-2.5 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-2.5">
                  <div class="rounded-2xl border border-amber-200/25 bg-[#2b1024]/38 p-2.5 md:p-3">
                    <div class="gothic-heading text-sm text-[#e5c593] md:text-base">种付点数</div>
                    <div class="mt-1 text-2xl font-extrabold text-yellow-300 md:text-3xl">
                      ⚡ {{ gameState.player.points }}
                    </div>
                  </div>

                  <div class="rounded-2xl border border-amber-200/25 bg-[#2b1024]/38 p-2.5 md:p-3">
                    <div class="gothic-heading text-sm text-[#e5c593] md:text-base">当前任务</div>
                    <div class="mt-1 line-clamp-2 text-base leading-snug break-words text-white md:text-lg">
                      {{ gameState.player.currentTask }}
                    </div>
                  </div>
                </div>

                <div class="mt-2.5 grid grid-cols-1 gap-2 md:grid-cols-3">
                  <div class="md:col-span-1">
                    <div class="mb-1.5 text-xs text-slate-300 md:text-sm">持有道具</div>
                    <div class="flex max-h-[92px] flex-wrap gap-1.5 overflow-y-auto pr-1">
                      <span
                        v-for="item in gameState.player.items"
                        :key="item"
                        class="rounded-md border border-slate-300/25 bg-slate-500/10 px-2 py-1 text-[11px] text-slate-200 md:text-xs"
                        >{{ item }}</span
                      >
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-2 md:col-span-2 md:grid-cols-2">
                    <div class="rounded-2xl border border-amber-300/30 bg-[#351c1a]/30 p-2.5 md:p-3">
                      <div class="gothic-heading text-sm text-[#e5c593] md:text-base">临时加成</div>
                      <div class="mt-1.5 flex max-h-[86px] flex-wrap gap-1.5 overflow-y-auto pr-1">
                        <span
                          v-for="buff in gameState.player.tempBuffs"
                          :key="buff"
                          class="rounded-md border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-[11px] text-amber-200 md:text-xs"
                          >{{ buff }}</span
                        >
                      </div>
                    </div>
                    <div class="rounded-2xl border border-fuchsia-300/30 bg-[#2d1127]/35 p-2.5 md:p-3">
                      <div class="gothic-heading text-sm text-[#e5c593] md:text-base">永久特性</div>
                      <div class="mt-1.5 flex max-h-[86px] flex-wrap gap-1.5 overflow-y-auto pr-1">
                        <span
                          v-for="trait in gameState.player.permTraits"
                          :key="trait"
                          class="rounded-md border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-[11px] text-emerald-200 md:text-xs"
                          >{{ trait }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="openApp === 'inventory'">
              <div
                class="gothic-scroll mx-auto max-h-full w-full max-w-[920px] overflow-y-auto rounded-2xl border border-amber-200/30 bg-[rgba(20,0,10,0.7)] p-2.5 shadow-[inset_0_0_20px_rgba(255,0,100,0.3),0_0_15px_rgba(255,0,100,0.5)] backdrop-blur-[12px] md:p-3"
              >
                <div class="gothic-heading mb-2.5 text-lg font-bold text-[#e5c593] md:mb-3 md:text-xl">
                  ⌬ 持有道具 ({{ gameState.player.items.length }})
                </div>
                <div class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-2.5 lg:grid-cols-6">
                  <article
                    v-for="(item, index) in gameState.player.items"
                    :key="`${item}-${index}`"
                    class="group relative flex h-18 flex-col items-center justify-center rounded-2xl border border-amber-200/25 bg-[#2b1024]/40 sm:h-20 md:h-22"
                  >
                    <button
                      class="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/30 text-[10px] text-red-200 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/55"
                      @click.stop="requestRemoveItem(index)"
                    >
                      🗑
                    </button>
                    <div class="text-base text-amber-300 md:text-lg">⬡</div>
                    <div class="mt-0.5 line-clamp-1 text-[11px] text-slate-100 md:text-xs">{{ item }}</div>
                  </article>
                </div>
              </div>
            </template>

            <template v-else-if="openApp === 'settings'">
              <div
                class="space-y-3 rounded-2xl border border-amber-200/30 bg-[rgba(20,0,10,0.7)] p-3 shadow-[inset_0_0_20px_rgba(255,0,100,0.3),0_0_15px_rgba(255,0,100,0.5)] backdrop-blur-[12px] md:space-y-4 md:p-4"
              >
                <div class="gothic-heading text-base text-[#e5c593] md:text-xl">界面主题色</div>
                <div class="flex flex-wrap gap-4">
                  <button
                    v-for="color in themeColors"
                    :key="color.name"
                    :title="color.name"
                    :class="[
                      'h-8 w-8 rounded-full border-2 transition hover:scale-110 md:h-10 md:w-10',
                      color.bg,
                      themeColor.name === color.name
                        ? 'border-white ring-2 ring-white/30'
                        : 'border-transparent opacity-80',
                    ]"
                    @click="themeColor = color"
                  />
                </div>
              </div>
            </template>

            <template v-else>
              <div class="flex h-full items-center justify-center text-slate-500">数据库功能即将上线…</div>
            </template>
          </main>
        </div>
      </div>

      <div
        v-if="previewImageUrl"
        class="absolute inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        @click="closePreviewImage"
      >
        <button
          class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-amber-100/35 bg-[#2b1025]/80 text-xl leading-none text-amber-50 transition hover:bg-[#3a1630]/90"
          @click.stop="closePreviewImage"
        >
          ×
        </button>
        <div
          class="max-h-full max-w-full overflow-hidden rounded-[1.6rem] border border-amber-100/35 bg-[#1a0914]/96 shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_32px_rgba(255,120,200,0.22)]"
          @click.stop
        >
          <img
            :src="previewImageUrl"
            :alt="previewImageAlt"
            class="block max-h-[85vh] max-w-[90vw] object-contain"
            @error="closePreviewImage"
          />
        </div>
      </div>

      <div
        v-if="pendingDelete"
        class="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-amber-200/30 bg-[rgba(20,0,10,0.7)] p-4 shadow-[inset_0_0_20px_rgba(255,0,100,0.3),0_0_15px_rgba(255,0,100,0.5),0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-[12px]"
        >
          <div class="flex items-start gap-3">
            <div class="mt-0.5 rounded-xl border border-amber-300/40 bg-amber-400/10 px-2 py-1 text-amber-200">⚠</div>
            <div class="min-w-0 flex-1">
              <div class="gothic-heading text-base font-bold text-[#e5c593]">确认删除</div>
              <p class="mt-1 text-sm text-slate-200/90">
                即将删除
                <span class="font-semibold text-pink-300">「{{ pendingDelete.name }}」</span>
                ，此操作会同步写回变量且不可撤销。
              </p>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button
              class="rounded-2xl border border-amber-200/25 bg-[#2b1024]/45 px-3 py-1.5 text-sm text-amber-50 transition hover:bg-[#3a1630]/70"
              @click="cancelDelete"
            >
              取消
            </button>
            <button
              class="rounded-2xl border border-rose-300/50 bg-rose-500/20 px-3 py-1.5 text-sm font-semibold text-rose-50 transition hover:bg-rose-500/35"
              @click="confirmDelete"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>

      <div class="absolute bottom-1 left-1/2 z-30 h-1 w-20 -translate-x-1/2 rounded-full bg-white/30 sm:w-24 md:w-32" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import _ from 'lodash';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { GameState, TargetProfile } from './types';

type ThemeColor = {
  name: string;
  value: string;
  bg: string;
};

type StatusNotice = {
  text: string;
  type: 'info' | 'success' | 'warn';
};

type PendingDelete = {
  kind: 'target' | 'item';
  index: number;
  name: string;
};

const FALLBACK_STATE: GameState = {
  time: '--:--',
  location: '待初始化',
  atmosphere: '等待变量初始化...',
  targets: [],
  player: {
    name: '待初始化',
    identity: '待初始化',
    gender: '待初始化',
    level: 'D',
    xp: 0,
    maxXp: 100,
    currentTask: '等待任务',
    points: 0,
    items: [],
    tempBuffs: [],
    permTraits: [],
  },
  narrative: [],
};

const themeColors: ThemeColor[] = [
  { name: '霓虹紫', value: 'text-violet-300', bg: 'bg-violet-500' },
  { name: '赛博蓝', value: 'text-cyan-300', bg: 'bg-cyan-500' },
  { name: '赤红', value: 'text-rose-300', bg: 'bg-rose-500' },
  { name: '翡翠', value: 'text-emerald-300', bg: 'bg-emerald-500' },
  { name: '琥珀', value: 'text-amber-300', bg: 'bg-amber-500' },
];

const gameState = ref<GameState>(_.cloneDeep(FALLBACK_STATE));
const openApp = ref<string | null>(null);
const selectedTargetIndex = ref<number | null>(null);
const themeColor = ref<ThemeColor>(themeColors[0]);
const statDataSnapshot = ref('');
const statusNotice = ref<StatusNotice>({ text: '信号稳定', type: 'info' });
const pendingDelete = ref<PendingDelete | null>(null);
const previewImageUrl = ref<string | null>(null);
const previewImageAlt = ref('');

const TARGET_IMAGE_REPO_BASE =
  'https://raw.githubusercontent.com/tramkiendinh03-create/ws1245/main/%E7%99%BE%E7%A0%B4';

type TargetImageStage = '0' | '头像' | '1' | '2' | '3' | '4';

type TargetImageConfig = {
  folderName?: string;
  fileBaseName?: string;
  fileNames?: Partial<Record<TargetImageStage, string>>;
};

const TARGET_IMAGE_CONFIGS: Record<string, TargetImageConfig> = {
  九条沙罗: {
    fileNames: {
      '1': '九条沙罗- 1.png',
    },
  },
  塞西莉亚: {
    fileNames: {
      '1': '塞西莉亚-1 .png',
    },
  },
  如月爱丽丝: {
    fileNames: {
      头像: '如月爱丽丝- 头像.png',
      '1': '如月爱丽丝- 1.png',
      '4': '如月爱丽丝- 4.png',
    },
  },
  白石䌷: {
    fileNames: {
      '0': '白石䌷- (6).png',
    },
  },
  皇都光子: {
    fileBaseName: '皇都神奈',
  },
};

function toStr(value: unknown, fallback = ''): string {
  if (_.isString(value)) return value;
  if (_.isNumber(value)) return String(value);
  return fallback;
}

function toNum(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toBool(value: unknown, fallback = false): boolean {
  if (_.isBoolean(value)) return value;
  if (_.isNumber(value)) return value !== 0;
  if (_.isString(value)) {
    const normalized = value.trim().toLowerCase();
    if (['true', 'turn', 'yes', 'y', '1', 'on', 'pregnant'].includes(normalized)) return true;
    if (['false', 'no', 'n', '0', 'off', 'none', 'null', ''].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeTargetName(name: string): string {
  return name.trim();
}

function getSubmissionImageStage(submissionLevel: number, isPregnant: boolean): TargetImageStage {
  const value = Math.max(-100, Math.min(100, submissionLevel));

  if (isPregnant && value >= 90) return '4';
  if (value <= -40) return '0';
  if (value <= 20) return '头像';
  if (value <= 40) return '1';
  if (value <= 80) return '2';
  return '3';
}

function buildDefaultTargetImageFileName(fileBaseName: string, stage: TargetImageStage): string {
  return `${fileBaseName}-${stage}.png`;
}

function resolveTargetAvatarUrl(name: string, submissionLevel: number, isPregnant: boolean): string | undefined {
  const normalizedName = normalizeTargetName(name);
  if (!normalizedName) return undefined;

  const config = TARGET_IMAGE_CONFIGS[normalizedName] ?? {};
  const folderName = config.folderName ?? normalizedName;
  const fileBaseName = config.fileBaseName ?? normalizedName;
  const stage = getSubmissionImageStage(submissionLevel, isPregnant);
  const fileName = config.fileNames?.[stage] ?? buildDefaultTargetImageFileName(fileBaseName, stage);

  if (!fileName) return undefined;

  return `${TARGET_IMAGE_REPO_BASE}/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
}

function hideTargetAvatar(target: TargetProfile): void {
  target.avatarUrl = undefined;
  if (previewImageUrl.value && previewImageAlt.value === target.name) {
    closePreviewImage();
  }
}

function openPreviewImage(url: string, alt: string): void {
  previewImageUrl.value = url;
  previewImageAlt.value = alt;
}

function closePreviewImage(): void {
  previewImageUrl.value = null;
  previewImageAlt.value = '';
}

function buildTargetRoots(raw: unknown): Record<string, unknown>[] {
  const data = _.isObject(raw) ? (raw as Record<string, unknown>) : {};
  return [
    data,
    _.get(data, '角色状态'),
    _.get(data, '心理画像'),
    _.get(data, '偏好信息'),
    _.get(data, '关系信息'),
    _.get(data, '当前状态'),
    _.get(data, '状态'),
  ].filter(_.isObject) as Record<string, unknown>[];
}

function pickTargetValue(raw: unknown, paths: string[], fallback: unknown = undefined): unknown {
  for (const root of buildTargetRoots(raw)) {
    const value = pickByPaths(root, paths);
    if (!_.isNil(value)) return value;
  }
  return fallback;
}

function hydrateTargetProfile(name: string, raw: unknown): TargetProfile {
  const baseProfile = toTargetProfile(name, raw);
  const targetName = toStr(pickTargetValue(raw, ['name', '姓名'], baseProfile.name), baseProfile.name);
  const submissionLevel = toNum(
    pickTargetValue(raw, ['submissionLevel', '臣服度', '臣服值'], baseProfile.submissionLevel),
    baseProfile.submissionLevel,
  );
  const isPregnant = toBool(
    pickTargetValue(raw, ['isPregnant', '是否怀孕', '怀孕', '妊娠'], baseProfile.isPregnant),
    baseProfile.isPregnant,
  );

  return {
    ...baseProfile,
    name: targetName,
    submissionLevel,
    isPregnant,
    avatarUrl: resolveTargetAvatarUrl(targetName, submissionLevel, isPregnant),
  };
}

function toStringArray(value: unknown): string[] {
  if (_.isString(value) || _.isNumber(value)) {
    const text = toStr(value).trim();
    return text ? [text] : [];
  }

  if (_.isArray(value)) {
    return value.map(item => toStr(item)).filter(Boolean);
  }

  if (_.isObject(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return [];

    const keysAllNumeric = entries.every(([key]) => /^\d+$/.test(key));
    if (keysAllNumeric) {
      return _(entries)
        .sortBy(([key]) => Number(key))
        .map(([, val]) => toStr(val))
        .filter(Boolean)
        .value();
    }

    const values = entries.map(([, val]) => val);
    if (values.every(v => _.isBoolean(v))) {
      return entries.filter(([, val]) => val === true).map(([key]) => key);
    }

    if (values.every(v => _.isNumber(v) && v >= 0 && v <= 1)) {
      return entries.filter(([, val]) => Number(val) > 0).map(([key]) => key);
    }

    const stringValues = values.map(v => toStr(v)).filter(Boolean);
    if (stringValues.length > 0) return stringValues;

    return entries.map(([key]) => key);
  }

  return [];
}

function pickByPaths(source: unknown, paths: string[], fallback: unknown = undefined): unknown {
  for (const path of paths) {
    const value = _.get(source, path);
    if (!_.isNil(value)) return value;
  }
  return fallback;
}

function findByKeyIncludes(source: unknown, keywords: string[]): unknown {
  if (!_.isObject(source)) return undefined;

  const entries = Object.entries(source as Record<string, unknown>);
  const direct = entries.find(([key]) => keywords.some(keyword => key.includes(keyword)));
  if (direct && !_.isNil(direct[1])) return direct[1];

  for (const [, value] of entries) {
    if (_.isObject(value)) {
      const nested = findByKeyIncludes(value, keywords);
      if (!_.isNil(nested)) return nested;
    }
  }

  return undefined;
}

type TavernHelperLike = {
  getVariables?: (option: { type: 'message'; message_id?: number | 'latest' }) => Record<string, any>;
  replaceVariables?: (
    variables: Record<string, any>,
    option: { type: 'message'; message_id?: number | 'latest' },
  ) => void;
};

function getTavernHelper(): TavernHelperLike | undefined {
  return (globalThis as any).TavernHelper as TavernHelperLike | undefined;
}

function getMessageVariables(): Record<string, any> {
  return getTavernHelper()?.getVariables?.({ type: 'message' }) ?? {};
}

function updateMessageVariables(updater: (variables: Record<string, any>) => void): void {
  const helper = getTavernHelper();
  if (!helper?.getVariables || !helper?.replaceVariables) return;

  const variables = _.cloneDeep(helper.getVariables({ type: 'message' }) ?? {});
  updater(variables);
  helper.replaceVariables(variables, { type: 'message' });
}

function toTargetProfile(name: string, raw: unknown): TargetProfile {
  const data = _.isObject(raw) ? (raw as Record<string, unknown>) : {};
  const roots = [
    data,
    _.get(data, '角色状态'),
    _.get(data, '心理画像'),
    _.get(data, '偏好信息'),
    _.get(data, '关系信息'),
    _.get(data, '当前状态'),
    _.get(data, '状态'),
  ];

  const pickFromRoots = (paths: string[], fallback: unknown = undefined): unknown => {
    for (const root of roots) {
      if (!_.isObject(root)) continue;
      const value = pickByPaths(root, paths);
      if (!_.isNil(value)) return value;
    }
    return fallback;
  };

  return {
    name: toStr(pickFromRoots(['name', '姓名'], name || '未知目标'), name || '未知目标'),
    occupation: toStr(pickFromRoots(['occupation', '职业', '身份'], '未知身份'), '未知身份'),
    difficulty: (pickFromRoots(['difficulty', '攻略难度'], 'D') ?? 'D') as TargetProfile['difficulty'],
    relationship: toStr(pickFromRoots(['relationship', '关系', '关系类型'], '未知关系'), '未知关系'),
    surfaceEmotion: toStr(pickFromRoots(['surfaceEmotion', '表面情绪', '情绪'], '未知'), '未知'),
    resistanceIndex: toNum(pickFromRoots(['resistanceIndex', '反抗指数', '反抗值'], 0), 0),
    submissionLevel: toNum(pickFromRoots(['submissionLevel', '臣服度', '臣服值'], 0), 0),
    affection: toNum(pickFromRoots(['affection', '好感度'], 0), 0),
    fetishes: toStringArray(
      pickFromRoots(
        [
          'fetishes',
          '偏好',
          '癖好',
          '性癖',
          '性偏好',
          '偏好列表',
          '性偏好列表',
          '偏好标签',
          '偏好词条',
          '特殊偏好',
          '深层偏好',
        ],
        findByKeyIncludes(data, ['性癖', '偏好', '癖好']) ?? [],
      ),
    ),
    partnerStatus: toStr(
      pickFromRoots(
        [
          'partnerStatus',
          '关系状态',
          '伴侣状态',
          '情侣关系',
          '百合/情侣关系',
          '情侣状态',
          '关系现状',
          '亲密关系',
          '恋爱状态',
        ],
        findByKeyIncludes(data, ['百合/情侣关系', '情侣关系', '伴侣状态', '关系状态']) ?? '未知',
      ),
      '未知',
    ),
    tempStatus: toStringArray(pickFromRoots(['tempStatus', '临时状态'], [])),
    permStatus: toStringArray(pickFromRoots(['permStatus', '永久状态'], [])),
    isPregnant: toBool(pickFromRoots(['isPregnant', '怀孕', '妊娠'], false), false),
    avatarUrl: toStr(
      pickFromRoots(
        ['avatarUrl', '头像'],
        `https://picsum.photos/seed/${encodeURIComponent(name || 'target')}/320/320`,
      ),
      `https://picsum.photos/seed/${encodeURIComponent(name || 'target')}/320/320`,
    ),
  };
}

function parseTargets(raw: unknown): TargetProfile[] {
  if (_.isArray(raw)) {
    return raw.map((item, index) => hydrateTargetProfile(`目标${index + 1}`, item));
  }
  if (_.isObject(raw)) {
    return Object.entries(raw as Record<string, unknown>).map(([name, data]) => hydrateTargetProfile(name, data));
  }
  return [];
}

function syncFromVariables() {
  const variables = getMessageVariables();
  const statData = _.get(variables, 'stat_data');
  const snapshot = JSON.stringify(statData ?? null);
  if (snapshot === statDataSnapshot.value) return;
  statDataSnapshot.value = snapshot;

  if (!_.isObject(statData)) {
    gameState.value = _.cloneDeep(FALLBACK_STATE);
    selectedTargetIndex.value = null;
    return;
  }

  const 当前时空 = _.get(statData, '当前时空', {});
  const 目标档案 = _.get(statData, '目标档案', []);
  const 种付官面板 = _.get(statData, '种付官面板', {});

  const 玩家等级 = toStr(_.get(种付官面板, '当前等级'), 'D') as GameState['player']['level'];
  const 持有道具 = toStringArray(pickByPaths(种付官面板, ['能力资源.持有道具', '背包.持有道具', '道具'], []));
  const 临时加成 = toStringArray(pickByPaths(种付官面板, ['身体状态.临时加成', '自身状态.临时加成', '临时加成'], []));
  const 永久特性 = toStringArray(pickByPaths(种付官面板, ['身体状态.永久特性', '自身状态.永久特性', '永久特性'], []));

  gameState.value = {
    time: toStr(_.get(当前时空, '时间'), '--:--'),
    location: toStr(_.get(当前时空, '地点'), '待初始化'),
    atmosphere: toStr(_.get(当前时空, '环境氛围'), '等待变量初始化...'),
    targets: parseTargets(目标档案),
    player: {
      name: toStr(_.get(种付官面板, '姓名'), '待初始化'),
      identity: toStr(_.get(种付官面板, '身份标识'), '待初始化'),
      gender: toStr(_.get(种付官面板, '性别'), '待初始化'),
      level: ['S', 'A', 'B', 'C', 'D'].includes(玩家等级) ? 玩家等级 : 'D',
      xp: toNum(_.get(种付官面板, '经验值'), 0),
      maxXp: toNum(_.get(种付官面板, '最大经验值'), 100),
      currentTask: toStr(_.get(种付官面板, '当前任务'), '等待分配任务'),
      points: toNum(_.get(种付官面板, '能力资源.种付点数'), 0),
      items: 持有道具,
      tempBuffs: 临时加成,
      permTraits: 永久特性,
    },
    narrative: [],
  };

  if (selectedTargetIndex.value !== null && selectedTargetIndex.value >= gameState.value.targets.length) {
    selectedTargetIndex.value = null;
  }
}

const { pause: stopPolling } = useIntervalFn(syncFromVariables, 400, { immediate: true });

let noticeTimer: ReturnType<typeof setTimeout> | null = null;
const handleWindowKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && previewImageUrl.value) {
    closePreviewImage();
  }
};

function setStatusNotice(text: string, type: StatusNotice['type'] = 'info', duration = 2200) {
  statusNotice.value = { text, type };
  if (noticeTimer) clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    statusNotice.value = { text: '信号稳定', type: 'info' };
    noticeTimer = null;
  }, duration);
}

onMounted(() => {
  window.addEventListener('keydown', handleWindowKeydown);
});

onUnmounted(() => {
  stopPolling();
  window.removeEventListener('keydown', handleWindowKeydown);
  if (noticeTimer) {
    clearTimeout(noticeTimer);
    noticeTimer = null;
  }
});

const selectedTarget = computed(() => {
  if (selectedTargetIndex.value === null) return null;
  return gameState.value.targets[selectedTargetIndex.value] ?? null;
});

const appTitle = computed(() => {
  if (openApp.value === 'target') return '目标档案';
  if (openApp.value === 'player') return '种付官面板';
  if (openApp.value === 'inventory') return '道具箱';
  if (openApp.value === 'settings') return '系统设置';
  return '数据库';
});

const locationMain = computed(() => gameState.value.location.split('-')[0]?.trim() ?? gameState.value.location);
const locationSub = computed(() => gameState.value.location.split('-')[1]?.trim() ?? '');

function requestRemoveTarget(index: number) {
  const target = gameState.value.targets[index];
  pendingDelete.value = {
    kind: 'target',
    index,
    name: target?.name || `目标${index + 1}`,
  };
  setStatusNotice('请确认删除目标档案', 'warn', 3200);
}

function removeTarget(index: number) {
  const removedTarget = gameState.value.targets[index];
  gameState.value.targets = gameState.value.targets.filter((_, i) => i !== index);
  if (selectedTargetIndex.value === index) selectedTargetIndex.value = null;

  updateMessageVariables(variables => {
    const statData = _.get(variables, 'stat_data');
    if (!_.isObject(statData)) return;

    const targetArchive = _.get(statData, '目标档案');

    if (Array.isArray(targetArchive)) {
      const targetArchiveArray: unknown[] = targetArchive;
      targetArchiveArray.splice(index, 1);
      return;
    }

    if (_.isObject(targetArchive)) {
      const entries = Object.entries(targetArchive as Record<string, unknown>);
      const keyByIndex = entries[index]?.[0];
      if (keyByIndex) {
        _.unset(statData, `目标档案.${keyByIndex}`);
        return;
      }

      if (removedTarget?.name) {
        _.unset(statData, `目标档案.${removedTarget.name}`);
      }
    }
  });
}

function requestRemoveItem(index: number) {
  const item = gameState.value.player.items[index];
  pendingDelete.value = {
    kind: 'item',
    index,
    name: item || `道具${index + 1}`,
  };
  setStatusNotice('请确认删除道具', 'warn', 3200);
}

function removeItem(index: number) {
  const removedItem = gameState.value.player.items[index];
  gameState.value.player.items = gameState.value.player.items.filter((_, i) => i !== index);

  updateMessageVariables(variables => {
    const statData = _.get(variables, 'stat_data');
    if (!_.isObject(statData)) return;

    const itemPaths = ['种付官面板.能力资源.持有道具', '种付官面板.背包.持有道具', '种付官面板.道具'];

    itemPaths.forEach(path => {
      const raw = _.get(statData, path);

      if (_.isArray(raw)) {
        raw.splice(index, 1);
        return;
      }

      if (_.isObject(raw)) {
        const record = raw as Record<string, unknown>;
        const entries = Object.entries(record);

        const numericEntries = entries.filter(([key]) => /^\d+$/.test(key));
        if (numericEntries.length > 0) {
          const keyByIndex = _(numericEntries)
            .sortBy(([key]) => Number(key))
            .nth(index)?.[0];
          if (keyByIndex) {
            _.unset(record, keyByIndex);
            return;
          }
        }

        if (removedItem) {
          const matchByValue = entries.find(([, val]) => toStr(val) === removedItem)?.[0];
          if (matchByValue) {
            _.unset(record, matchByValue);
            return;
          }
          if (_.has(record, removedItem)) {
            _.unset(record, removedItem);
          }
        }
      }
    });
  });
}

function confirmDelete() {
  const action = pendingDelete.value;
  if (!action) return;
  pendingDelete.value = null;

  if (action.kind === 'target') {
    removeTarget(action.index);
    setStatusNotice(`已删除目标：${action.name}`, 'success');
    return;
  }

  removeItem(action.index);
  setStatusNotice(`已删除道具：${action.name}`, 'success');
}

function cancelDelete() {
  if (!pendingDelete.value) return;
  pendingDelete.value = null;
  setStatusNotice('已取消删除', 'info');
}

const statusNoticeClass = computed(() => {
  if (statusNotice.value.type === 'success') {
    return 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100';
  }
  if (statusNotice.value.type === 'warn') {
    return 'border-rose-300/45 bg-rose-400/18 text-rose-100';
  }
  return 'border-amber-200/40 bg-fuchsia-300/12 text-rose-100';
});

function closeApp() {
  openApp.value = null;
  selectedTargetIndex.value = null;
}

function getSubmissionStage(val: number) {
  if (val < 0) return '逆转支配 / 女王觉醒';
  if (val <= 40) return '抵抗阶段 / 逻辑自洽';
  if (val <= 80) return '快乐重塑 / 身体背叛';
  return '彻底沦陷 / 完全控制';
}
</script>

<style scoped>
.gothic-root {
  --rose-gold: #e6b78e;
  --rose-gold-2: #d79c79;
  --gloom-plum: #120610;
  --rune-glow: rgba(242, 174, 112, 0.6);
  background-color: #1a0505;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(100, 0, 50, 0.1) 0%, transparent 50%),
    repeating-linear-gradient(
      45deg,
      rgba(70, 0, 20, 0.1) 0px,
      rgba(70, 0, 20, 0.1) 2px,
      transparent 2px,
      transparent 12px
    );
}

:global(body) {
  background-color: #1a0505;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(100, 0, 50, 0.1) 0%, transparent 50%),
    repeating-linear-gradient(
      45deg,
      rgba(70, 0, 20, 0.1) 0px,
      rgba(70, 0, 20, 0.1) 2px,
      transparent 2px,
      transparent 12px
    );
}

.gothic-heading {
  font-family: 'Cinzel Decorative', cursive;
  color: #e5c593;
  font-weight: 700;
  text-shadow:
    0 1px 0 rgba(255, 237, 199, 0.3),
    0 0 10px rgba(255, 0, 222, 0.38),
    0 0 22px rgba(255, 170, 110, 0.24);
}

.modal-overlay {
  background: rgba(10, 0, 8, 0.45);
  backdrop-filter: blur(3px);
}

.modal-shell {
  background: rgba(20, 0, 10, 0.7) !important;
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow:
    0 0 20px rgba(255, 0, 100, 0.3) inset,
    0 0 15px rgba(255, 0, 100, 0.5),
    0 24px 55px rgba(0, 0, 0, 0.5) !important;
}

.modal-header {
  border-radius: 16px 16px 0 0;
  box-shadow:
    0 0 12px rgba(255, 0, 170, 0.24),
    inset 0 -1px 0 rgba(255, 220, 170, 0.14);
}

.modal-main {
  font-family: 'Playfair Display', serif;
}

.modal-main,
.modal-main * {
  border-radius: 16px;
}

.gothic-scroll::-webkit-scrollbar {
  width: 7px;
}

.gothic-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(255, 0, 222, 0.55), rgba(229, 197, 147, 0.5));
  border-radius: 999px;
}

.gothic-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
}

.gothic-shell {
  box-shadow:
    0 38px 88px rgba(0, 0, 0, 0.88),
    0 0 0 1px rgba(230, 183, 142, 0.24),
    0 0 48px rgba(212, 98, 171, 0.25),
    inset 0 0 90px rgba(0, 0, 0, 0.55);
}

.velvet-texture {
  background-image:
    linear-gradient(140deg, rgba(24, 6, 22, 0.9), rgba(10, 3, 12, 0.96)),
    url('https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=2200&q=80');
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat;
  background-blend-mode: multiply, normal;
  filter: saturate(0.9) contrast(1.08) brightness(0.7);
}

.rococo-overlay {
  background-image:
    radial-gradient(circle at 24% 20%, rgba(214, 168, 115, 0.16), transparent 55%),
    radial-gradient(circle at 74% 80%, rgba(186, 92, 156, 0.2), transparent 45%),
    url('https://www.transparenttextures.com/patterns/dark-mosaic.png');
  background-size:
    auto,
    auto,
    280px 280px;
  background-blend-mode: screen, screen, soft-light;
  opacity: 0.5;
}

.ambient-vignette {
  background:
    radial-gradient(circle at 50% 50%, transparent 42%, rgba(0, 0, 0, 0.58) 100%),
    linear-gradient(160deg, rgba(255, 191, 138, 0.04), rgba(0, 0, 0, 0.36));
}

.opulent-frame {
  border-color: rgba(230, 183, 142, 0.45);
  box-shadow:
    inset 0 0 0 1px rgba(241, 197, 151, 0.24),
    inset 0 0 40px rgba(178, 108, 70, 0.16),
    0 0 20px rgba(230, 146, 108, 0.2);
}

.magic-glow {
  box-shadow:
    0 0 22px rgba(214, 96, 178, 0.26),
    0 0 42px rgba(232, 168, 108, 0.14),
    inset 0 0 26px rgba(255, 198, 148, 0.08);
}

.gilded-text {
  color: #f3d7b6;
  text-shadow:
    0 1px 0 rgba(255, 233, 195, 0.32),
    0 0 8px rgba(244, 192, 122, 0.42),
    0 0 16px rgba(245, 171, 108, 0.2);
}

.gilded-title {
  color: #f8e9d0;
  text-shadow:
    0 1px 0 rgba(255, 248, 227, 0.35),
    0 0 10px rgba(246, 193, 128, 0.4),
    0 0 24px rgba(206, 120, 96, 0.24);
}

.ornate-panel {
  position: relative;
  overflow: hidden;
  border-color: rgba(230, 183, 142, 0.42) !important;
}

.ornate-panel::before,
.ornate-panel::after {
  content: '';
  position: absolute;
  width: 42px;
  height: 42px;
  pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(236, 201, 147, 0.85) 0 18%, transparent 38%),
    conic-gradient(from 180deg, rgba(236, 201, 147, 0.9), rgba(178, 110, 73, 0.2), rgba(236, 201, 147, 0.9));
  filter: drop-shadow(0 0 8px rgba(242, 176, 112, 0.5));
  animation: runePulse 3.2s ease-in-out infinite;
}

.ornate-panel::before {
  top: 8px;
  left: 8px;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.ornate-panel::after {
  right: 8px;
  bottom: 8px;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  animation-delay: 1.1s;
}

.panel-kicker {
  letter-spacing: 0.16em;
}

.arcane-dock {
  background-image:
    radial-gradient(circle at 50% 50%, rgba(239, 173, 111, 0.16), transparent 70%),
    linear-gradient(120deg, rgba(82, 28, 60, 0.72), rgba(34, 14, 37, 0.85)),
    url('https://www.transparenttextures.com/patterns/black-linen.png');
  background-blend-mode: screen, normal, soft-light;
}

.dock-key {
  position: relative;
  overflow: hidden;
  border-color: rgba(230, 183, 142, 0.45);
  background-image:
    radial-gradient(circle at 30% 20%, rgba(255, 206, 150, 0.16), transparent 58%),
    radial-gradient(circle at 70% 80%, rgba(213, 90, 159, 0.2), transparent 45%);
  box-shadow:
    inset 0 0 0 1px rgba(245, 207, 162, 0.18),
    0 0 14px rgba(245, 164, 108, 0.2);
}

.dock-key::before {
  content: '';
  position: absolute;
  inset: 12%;
  border-radius: 999px;
  background: conic-gradient(
    from 0deg,
    rgba(255, 205, 138, 0.45),
    rgba(205, 118, 174, 0.32),
    rgba(255, 205, 138, 0.45)
  );
  opacity: 0.46;
  filter: blur(0.3px);
}

.dock-key::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: inherit;
  border: 1px solid rgba(244, 201, 143, 0.3);
  box-shadow: inset 0 0 14px rgba(245, 169, 102, 0.16);
}

.dock-key svg {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 6px rgba(255, 197, 128, 0.5));
}

.dock-key--active {
  border-color: rgba(248, 216, 166, 0.88) !important;
  box-shadow:
    0 0 24px rgba(248, 188, 116, 0.56),
    0 0 46px rgba(214, 86, 171, 0.42),
    inset 0 0 26px rgba(246, 176, 105, 0.3);
}

.dock-key--active::before {
  animation: sigilRotate 4s linear infinite;
  opacity: 0.8;
}

.dock-key--active::after {
  animation: arcaneBurst 1.8s ease-in-out infinite;
}

@keyframes runePulse {
  0%,
  100% {
    transform: scale(0.92);
    filter: drop-shadow(0 0 7px rgba(242, 176, 112, 0.45));
  }
  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 0 14px rgba(242, 176, 112, 0.7));
  }
}

@keyframes sigilRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes arcaneBurst {
  0%,
  100% {
    box-shadow: inset 0 0 12px rgba(248, 184, 118, 0.2);
  }
  50% {
    box-shadow:
      inset 0 0 20px rgba(251, 206, 150, 0.45),
      0 0 20px rgba(216, 84, 168, 0.4);
  }
}
</style>
