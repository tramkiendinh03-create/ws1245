<template>
  <div class="flex w-full items-center justify-center overflow-hidden p-1.5 font-sans sm:p-2 md:p-3">
    <div
      class="relative flex aspect-[16/10] w-full max-w-[1260px] flex-col overflow-hidden rounded-[2rem] border-2 border-cyan-200/25 bg-[#040914] shadow-[0_26px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(80,210,255,0.2),0_0_40px_rgba(60,150,255,0.2)] sm:rounded-[2.3rem] lg:rounded-[2.7rem]"
    >
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-[#101c35] via-[#081328] to-[#040914]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(120,220,255,0.18),transparent_45%)]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_82%_88%,rgba(255,120,220,0.14),transparent_38%)]" />
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,170,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,170,255,0.12)_1px,transparent_1px)] bg-[size:34px_34px] opacity-20"
        />
        <div
          class="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(170,220,255,0.22)_0_1px,transparent_1px_4px)] opacity-[0.12]"
        />
      </div>
      <div
        class="pointer-events-none absolute inset-[10px] rounded-[2.1rem] border border-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_26px_55px_rgba(0,0,0,0.46)]"
      />
      <div
        class="pointer-events-none absolute top-2 left-1/2 z-30 h-1.5 w-24 -translate-x-1/2 rounded-full bg-white/20"
      />

      <div
        class="relative z-20 mx-2 mt-2 flex items-center justify-between rounded-t-2xl border border-cyan-200/25 bg-gradient-to-r from-slate-200/15 via-cyan-300/10 to-violet-300/10 px-4 py-1.5 text-[11px] text-slate-200 shadow-[0_0_18px_rgba(80,190,255,0.25)] backdrop-blur-xl"
      >
        <span class="font-medium">{{ gameState.time }}</span>
        <span
          :class="['rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide', statusNoticeClass]"
          >{{ statusNotice.text }}</span
        >
      </div>

      <div
        class="relative z-10 grid flex-1 grid-cols-1 gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-5 md:grid-cols-12 md:gap-5"
      >
        <section class="space-y-3 sm:space-y-4 md:col-span-3 md:space-y-6">
          <div
            class="rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-slate-200/15 to-slate-900/35 p-3.5 shadow-[inset_0_0_0_1px_rgba(125,220,255,0.12),0_0_24px_rgba(70,170,255,0.14)] backdrop-blur-xl sm:p-4 md:p-5"
          >
            <div :class="['mb-2 text-xs font-bold tracking-wider', themeColor.value]">地点</div>
            <h2 class="text-xl leading-none font-bold text-white sm:text-2xl md:text-[2rem]">{{ locationMain }}</h2>
            <div class="mt-1.5 text-lg leading-none font-bold text-white/85 sm:text-xl md:mt-2 md:text-[1.85rem]">
              {{ locationSub }}
            </div>

            <div class="mt-4 border-t border-white/15 pt-3 sm:mt-5 sm:pt-4 md:mt-6">
              <div class="mb-2 text-xs text-slate-400">环境氛围</div>
              <p class="line-clamp-3 text-sm text-slate-200/90 italic">{{ gameState.atmosphere }}</p>
            </div>
          </div>

          <div
            class="rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-slate-200/15 to-slate-900/35 p-3.5 shadow-[inset_0_0_0_1px_rgba(125,220,255,0.12),0_0_24px_rgba(70,170,255,0.14)] backdrop-blur-xl sm:p-4 md:p-5"
          >
            <div :class="['mb-2 text-xs font-bold tracking-wider', themeColor.value]">身份标识</div>
            <div class="text-xl leading-none font-bold text-white sm:text-2xl md:text-[2rem]">
              {{ gameState.player.name }}
            </div>
            <div class="mt-1.5 text-sm text-slate-300 sm:text-base md:mt-2 md:text-xl">
              {{ gameState.player.currentTask }}
            </div>
          </div>
        </section>

        <section class="md:col-span-9">
          <div class="grid grid-cols-2 content-start gap-4 pt-1.5 sm:grid-cols-4 sm:gap-6 sm:pt-2 md:gap-8 md:pt-3">
            <button class="group flex flex-col items-center gap-2" @click="openApp = 'target'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200/25 bg-gradient-to-br from-[#0c1a33]/90 to-[#091426]/95 text-pink-300 shadow-[0_0_20px_rgba(85,180,255,0.2)] transition-all group-hover:scale-105 group-hover:border-pink-400/50 group-hover:shadow-[0_0_28px_rgba(255,110,220,0.35)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
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
              <span class="text-xs text-white sm:text-sm md:text-base lg:text-lg">目标档案</span>
            </button>

            <button class="group flex flex-col items-center gap-2" @click="openApp = 'player'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200/25 bg-gradient-to-br from-[#0c1a33]/90 to-[#091426]/95 text-blue-300 shadow-[0_0_20px_rgba(85,180,255,0.2)] transition-all group-hover:scale-105 group-hover:border-blue-400/50 group-hover:shadow-[0_0_28px_rgba(90,170,255,0.4)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
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
              <span class="text-xs text-white sm:text-sm md:text-base lg:text-lg">种付官</span>
            </button>

            <button class="group flex flex-col items-center gap-2" @click="openApp = 'inventory'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200/25 bg-gradient-to-br from-[#0c1a33]/90 to-[#091426]/95 text-amber-300 shadow-[0_0_20px_rgba(85,180,255,0.2)] transition-all group-hover:scale-105 group-hover:border-amber-400/50 group-hover:shadow-[0_0_28px_rgba(255,195,90,0.35)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
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
              <span class="text-xs text-white sm:text-sm md:text-base lg:text-lg">道具箱</span>
            </button>

            <button class="group flex flex-col items-center gap-2" @click="openApp = 'settings'">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200/25 bg-gradient-to-br from-[#0c1a33]/90 to-[#091426]/95 text-slate-200 shadow-[0_0_20px_rgba(85,180,255,0.2)] transition-all group-hover:scale-105 group-hover:border-white/40 group-hover:shadow-[0_0_28px_rgba(180,210,255,0.35)] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16"
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
              <span class="text-xs text-white sm:text-sm md:text-base lg:text-lg">系统设置</span>
            </button>
          </div>
        </section>
      </div>

      <div
        class="relative z-20 mx-auto mb-2.5 flex gap-2 rounded-[1.2rem] border border-cyan-200/25 bg-gradient-to-r from-slate-200/15 via-cyan-300/10 to-violet-300/10 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(80,180,255,0.24)] backdrop-blur-2xl sm:mb-3 sm:gap-3 sm:rounded-[1.4rem] sm:p-2.5 md:gap-5 md:rounded-[1.6rem] md:p-3"
      >
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-pink-300 transition hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14"
          @click="openApp = 'target'"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 19a7 7 0 0 1 14 0" />
          </svg>
        </button>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-blue-300 transition hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14"
          @click="openApp = 'player'"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          >
            <path d="M12 3l6 3v5c0 4.5-2.5 7.5-6 10-3.5-2.5-6-5.5-6-10V6l6-3z" />
          </svg>
        </button>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-amber-300 transition hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14"
          @click="openApp = 'inventory'"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          >
            <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" />
            <path d="M4 7.5V16.5L12 21" />
            <path d="M20 7.5V16.5L12 21" />
          </svg>
        </button>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-slate-200 transition hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14"
          @click="openApp = 'settings'"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
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
        </button>
      </div>

      <div v-if="openApp" class="absolute inset-0 z-40 bg-black/45 p-2 backdrop-blur-[2px] sm:p-3 md:p-4">
        <div
          class="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#060b14]/95 shadow-[0_24px_55px_rgba(0,0,0,0.45)]"
        >
          <header
            class="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#202938]/80 to-[#101925]/90 px-4 py-2 text-xs md:text-sm"
          >
            <div class="flex items-center gap-2 font-semibold text-slate-100">
              <span class="h-2 w-2 rounded-full bg-violet-400" />
              <span>{{ appTitle }}</span>
            </div>
            <div class="flex items-center gap-4 text-slate-300">
              <span class="cursor-pointer text-base leading-none">－</span>
              <span class="cursor-pointer text-sm leading-none">↗</span>
              <button class="cursor-pointer text-base leading-none hover:text-white" @click="closeApp">×</button>
            </div>
          </header>

          <main class="min-h-0 flex-1 overflow-auto p-2.5 sm:p-3 md:p-4">
            <template v-if="openApp === 'target'">
              <div v-if="selectedTarget" class="space-y-3">
                <button class="text-sm text-slate-300 hover:text-white" @click="selectedTargetIndex = null">
                  ← 返回列表
                </button>

                <div
                  class="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-[#1d1222]/88 via-[#100f19]/90 to-[#180b11]/90 p-4"
                >
                  <div class="flex items-start gap-4">
                    <div
                      class="relative h-20 w-20 overflow-hidden rounded-xl border border-pink-400/50 md:h-24 md:w-24"
                    >
                      <img
                        :src="selectedTarget.avatarUrl"
                        :alt="selectedTarget.name"
                        class="h-full w-full object-cover"
                      />
                      <div
                        class="absolute right-1 bottom-1 rounded-full bg-pink-500/80 px-2 py-0.5 text-[11px] text-white"
                      >
                        攻略难度: {{ selectedTarget.difficulty }}
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="text-2xl leading-tight font-bold text-pink-300 md:text-3xl">
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

              <div v-else class="grid max-h-full grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 md:gap-3">
                <article
                  v-for="(target, index) in gameState.targets"
                  :key="`${target.name}-${index}`"
                  class="group relative rounded-xl border border-white/15 bg-gradient-to-r from-white/8 to-white/3 p-2.5 transition-all hover:border-violet-400/55 md:rounded-2xl md:p-3"
                >
                  <button class="w-full text-left" @click="selectedTargetIndex = index">
                    <div class="flex items-center gap-4">
                      <div
                        class="h-12 w-12 overflow-hidden rounded-lg border border-white/20 sm:h-14 sm:w-14 md:h-16 md:w-16"
                      >
                        <img :src="target.avatarUrl" :alt="target.name" class="h-full w-full object-cover" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                          <h3 class="truncate text-base font-bold text-pink-200 sm:text-lg md:text-xl">
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
                class="rounded-xl border border-blue-300/20 bg-gradient-to-r from-[#1a2337]/95 to-[#0f213f]/95 p-3 md:rounded-2xl md:p-4"
              >
                <div class="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                  <div class="md:col-span-8">
                    <div class="flex items-start gap-4">
                      <div
                        class="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/35 bg-blue-500/10 text-blue-300 md:h-16 md:w-16"
                      >
                        👤
                      </div>
                      <div>
                        <div class="text-2xl font-bold text-white md:text-4xl">{{ gameState.player.name }}</div>
                        <div class="mt-0.5 text-sm text-blue-200/90 md:mt-1 md:text-2xl">
                          {{ gameState.player.identity }} • {{ gameState.player.gender }}
                        </div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <div class="h-3 overflow-hidden rounded-full bg-blue-900/35">
                        <div
                          class="h-full rounded-full bg-cyan-400"
                          :style="{ width: `${(gameState.player.xp / gameState.player.maxXp) * 100}%` }"
                        />
                      </div>
                      <div class="mt-1 text-right text-xs text-blue-300 md:text-base">
                        {{ gameState.player.xp }} / {{ gameState.player.maxXp }}
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end md:col-span-4">
                    <div
                      class="h-fit rounded-lg border border-blue-400/35 bg-blue-500/15 px-2.5 py-1.5 text-sm font-semibold text-blue-200 md:px-3 md:py-2 md:text-xl"
                    >
                      当前等级 {{ gameState.player.level }}
                    </div>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div class="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4">
                    <div class="text-sm text-cyan-300 md:text-lg">种付点数</div>
                    <div class="mt-1 text-3xl font-extrabold text-yellow-300 md:text-5xl">
                      ⚡ {{ gameState.player.points }}
                    </div>
                  </div>

                  <div class="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4">
                    <div class="text-sm text-cyan-300 md:text-lg">当前任务</div>
                    <div class="mt-1 text-xl text-white md:text-3xl">{{ gameState.player.currentTask }}</div>
                  </div>
                </div>

                <div class="mt-5">
                  <div class="mb-2 text-sm text-slate-300 md:text-lg">持有道具</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="item in gameState.player.items"
                      :key="item"
                      class="rounded-md border border-slate-300/25 bg-slate-500/10 px-2 py-1 text-sm text-slate-200 md:text-lg"
                      >{{ item }}</span
                    >
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div class="rounded-xl border border-amber-400/25 bg-amber-500/5 p-3 md:p-4">
                    <div class="text-sm text-amber-300 md:text-lg">临时加成</div>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span
                        v-for="buff in gameState.player.tempBuffs"
                        :key="buff"
                        class="rounded-md border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-sm text-amber-200 md:text-lg"
                        >{{ buff }}</span
                      >
                    </div>
                  </div>
                  <div class="rounded-xl border border-emerald-400/25 bg-emerald-500/5 p-3 md:p-4">
                    <div class="text-sm text-emerald-300 md:text-lg">永久特性</div>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span
                        v-for="trait in gameState.player.permTraits"
                        :key="trait"
                        class="rounded-md border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-sm text-emerald-200 md:text-lg"
                        >{{ trait }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="openApp === 'inventory'">
              <div
                class="max-h-full overflow-y-auto rounded-xl border border-blue-300/20 bg-gradient-to-r from-[#1a2337]/95 to-[#0f213f]/95 p-3 md:rounded-2xl md:p-4"
              >
                <div class="mb-3 text-xl font-bold text-amber-300 md:mb-4 md:text-2xl">
                  ⌬ 持有道具 ({{ gameState.player.items.length }})
                </div>
                <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
                  <article
                    v-for="(item, index) in gameState.player.items"
                    :key="`${item}-${index}`"
                    class="group relative flex h-24 flex-col items-center justify-center rounded-xl border border-white/15 bg-white/5 sm:h-28 md:h-32 md:rounded-2xl"
                  >
                    <button
                      class="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/30 text-xs text-red-200 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/55"
                      @click.stop="requestRemoveItem(index)"
                    >
                      🗑
                    </button>
                    <div class="text-2xl text-amber-300 md:text-3xl">⬡</div>
                    <div class="mt-1.5 text-sm text-slate-100 md:mt-2 md:text-lg">{{ item }}</div>
                  </article>
                </div>
              </div>
            </template>

            <template v-else-if="openApp === 'settings'">
              <div class="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-3 md:space-y-4 md:p-4">
                <div class="text-base text-slate-200 md:text-xl">界面主题色</div>
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
        v-if="pendingDelete"
        class="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-white/20 bg-gradient-to-br from-[#1a2434] to-[#0f1827] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
        >
          <div class="flex items-start gap-3">
            <div class="mt-0.5 rounded-xl border border-amber-300/40 bg-amber-400/10 px-2 py-1 text-amber-200">⚠</div>
            <div class="min-w-0 flex-1">
              <div class="text-base font-bold text-white">确认删除</div>
              <p class="mt-1 text-sm text-slate-200/90">
                即将删除
                <span class="font-semibold text-pink-300">「{{ pendingDelete.name }}」</span>
                ，此操作会同步写回变量且不可撤销。
              </p>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button
              class="rounded-lg border border-white/20 bg-white/8 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/15"
              @click="cancelDelete"
            >
              取消
            </button>
            <button
              class="rounded-lg border border-red-400/45 bg-red-500/20 px-3 py-1.5 text-sm font-semibold text-red-100 transition hover:bg-red-500/35"
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
import { computed, onUnmounted, ref } from 'vue';
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
  return fallback;
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
    return raw.map((item, index) => toTargetProfile(`目标${index + 1}`, item));
  }
  if (_.isObject(raw)) {
    return Object.entries(raw as Record<string, unknown>).map(([name, data]) => toTargetProfile(name, data));
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

function setStatusNotice(text: string, type: StatusNotice['type'] = 'info', duration = 2200) {
  statusNotice.value = { text, type };
  if (noticeTimer) clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    statusNotice.value = { text: '信号稳定', type: 'info' };
    noticeTimer = null;
  }, duration);
}

onUnmounted(() => {
  stopPolling();
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
    return 'border-amber-300/40 bg-amber-400/15 text-amber-100';
  }
  return 'border-cyan-300/35 bg-cyan-400/10 text-cyan-100';
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
