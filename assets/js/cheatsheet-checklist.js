(function () {
  "use strict";

  var markdownChecks = Array.prototype.slice.call(
    document.querySelectorAll(".cheatsheet-page .article-content input[type='checkbox']")
  );
  var markdownStorageKey = "markdown-checklist-state:" + window.location.pathname;
  var markdownState = {};

  try {
    markdownState = JSON.parse(window.localStorage.getItem(markdownStorageKey)) || {};
  } catch (_err) {
    markdownState = {};
  }

  markdownChecks.forEach(function (input, index) {
    var id = String(index);
    input.disabled = false;
    input.removeAttribute("disabled");
    input.classList.add("interactive-check");

    if (Object.prototype.hasOwnProperty.call(markdownState, id)) {
      input.checked = Boolean(markdownState[id]);
    } else {
      markdownState[id] = input.checked;
    }

    input.addEventListener("change", function () {
      markdownState[id] = input.checked;
      window.localStorage.setItem(markdownStorageKey, JSON.stringify(markdownState));
    });
  });

  if (markdownChecks.length > 0) {
    window.localStorage.setItem(markdownStorageKey, JSON.stringify(markdownState));
  }

  var root = document.querySelector("[data-cheatsheet-db]");
  if (!root) {
    return;
  }

  var filter = root.querySelector("[data-phase-filter]");
  var rows = Array.prototype.slice.call(root.querySelectorAll("tbody tr[data-row-id]"));
  var totalEl = root.querySelector("[data-meta-total]");
  var visibleEl = root.querySelector("[data-meta-visible]");
  var doneEl = root.querySelector("[data-meta-done]");

  var keyBase = root.getAttribute("data-cheatsheet-key") || window.location.pathname;
  var storageKey = "oscp-checklist-state:" + keyBase;

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (_err) {
      return null;
    }
  }

  var state = safeParse(window.localStorage.getItem(storageKey)) || {
    phase: "all",
    checks: {}
  };

  function saveState() {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function applyChecksFromState() {
    rows.forEach(function (row) {
      var id = row.getAttribute("data-row-id");
      var input = row.querySelector("input[data-row-check]");
      if (!input) return;

      if (Object.prototype.hasOwnProperty.call(state.checks, id)) {
        input.checked = Boolean(state.checks[id]);
      } else {
        state.checks[id] = input.checked;
      }
    });
  }

  function applyFilter() {
    var phase = (filter && filter.value) || "all";
    var visibleCount = 0;

    rows.forEach(function (row) {
      var rowPhase = row.getAttribute("data-row-phase") || "";
      var show = phase === "all" || rowPhase === phase;
      row.hidden = !show;
      if (show) {
        visibleCount += 1;
      }
    });

    if (visibleEl) {
      visibleEl.textContent = String(visibleCount);
    }
  }

  function updateDoneCount() {
    var checked = 0;
    rows.forEach(function (row) {
      var input = row.querySelector("input[data-row-check]");
      if (input && input.checked) {
        checked += 1;
      }
    });
    if (doneEl) {
      doneEl.textContent = String(checked);
    }
  }

  if (totalEl) {
    totalEl.textContent = String(rows.length);
  }

  applyChecksFromState();

  if (filter) {
    if (state.phase) {
      filter.value = state.phase;
    }

    filter.addEventListener("change", function () {
      state.phase = filter.value;
      saveState();
      applyFilter();
    });
  }

  rows.forEach(function (row) {
    var input = row.querySelector("input[data-row-check]");
    if (!input) return;

    input.addEventListener("change", function () {
      var id = row.getAttribute("data-row-id");
      state.checks[id] = input.checked;
      saveState();
      updateDoneCount();
    });
  });

  applyFilter();
  updateDoneCount();
})();
