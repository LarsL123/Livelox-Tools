const intervalId = setInterval(() => {
  const el = document.querySelector('[data-bind*="onNextButtonClicked"]');
  if (!el) return;

  const paging = ko.dataFor(el);
  paging?.paginator?.onNextButtonClicked?.();
}, 10000);

// stop later:
// clearInterval(intervalId);
