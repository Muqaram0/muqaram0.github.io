(function () {
  "use strict";

  var root = document.querySelector("[data-tools-page]");
  if (!root) {
    return;
  }

  var notesRoot = root.querySelector("[data-tools-notes]");
  var searchInput = root.querySelector("[data-tools-search]");
  var searchCount = root.querySelector("[data-tools-search-count]");

  if (!notesRoot) {
    return;
  }

  function normalize(value) {
    return (value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function slugify(value) {
    return normalize(value)
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function scrollToHeading(target) {
    if (!target) {
      return;
    }

    var top = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  var headings = Array.prototype.slice.call(notesRoot.querySelectorAll("h1, h2, h3"));
  var usedIds = new Set();

  headings = headings
    .map(function (heading) {
      var label = (heading.textContent || "").trim();
      if (!label) {
        return null;
      }

      var baseId = heading.id || slugify(label);
      if (!baseId) {
        return null;
      }

      var id = baseId;
      var n = 2;
      while (usedIds.has(id)) {
        id = baseId + "-" + n;
        n += 1;
      }

      usedIds.add(id);
      heading.id = id;

      return {
        heading: heading,
        label: label
      };
    })
    .filter(Boolean);

  function clearHeadingHits() {
    headings.forEach(function (entry) {
      entry.heading.classList.remove("tools-heading-hit");
    });
  }

  function applySearch() {
    var query = normalize(searchInput ? searchInput.value : "");
    var hasQuery = query.length > 0;

    clearHeadingHits();

    if (!hasQuery) {
      if (searchCount) {
        searchCount.textContent = "";
      }
      return headings;
    }

    var matches = headings.filter(function (entry) {
      return normalize(entry.label).indexOf(query) !== -1;
    });

    matches.forEach(function (entry) {
      entry.heading.classList.add("tools-heading-hit");
    });

    if (searchCount) {
      searchCount.textContent = matches.length + " match" + (matches.length === 1 ? "" : "es");
    }

    return matches;
  }

  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
    searchInput.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") {
        return;
      }

      var matches = applySearch();
      if (matches.length > 0) {
        event.preventDefault();
        scrollToHeading(matches[0].heading);
        window.history.replaceState(null, "", "#" + matches[0].heading.id);
      }
    });
  }

  window.addEventListener("keydown", function (event) {
    if (event.key !== "/") {
      return;
    }

    var target = event.target;
    var typingContext = target && (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    );

    if (typingContext || !searchInput) {
      return;
    }

    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  });

  applySearch();
})();
