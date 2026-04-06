$(() => {
  console.info('[wuxia] ui loaded');
});

$(window).on('pagehide', () => {
  console.info('[wuxia] ui unloaded');
});
