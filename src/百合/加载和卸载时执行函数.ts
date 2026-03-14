$(() => {
  console.info('[baihe] ui loaded');
});

$(window).on('pagehide', () => {
  console.info('[baihe] ui unloaded');
});
