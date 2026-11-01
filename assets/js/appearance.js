document.documentElement.classList.add("dark");
try {
  localStorage.setItem("appearance", "dark");
} catch (e) {}

const sitePreference = document.documentElement.getAttribute("data-default-appearance");
const userPreference = "dark";

if ((sitePreference === "dark" && userPreference === null) || userPreference === "dark") {
  document.documentElement.classList.add("dark");
}

// Mermaid dark mode support
var updateMermaidTheme = () => {
  if (typeof mermaid !== 'undefined') {
    const isDark = document.documentElement.classList.contains("dark");

    const mermaids = document.querySelectorAll('pre.mermaid');
    mermaids.forEach(e => {
      if (e.getAttribute('data-processed')) {
        e.removeAttribute('data-processed');
        e.innerHTML = e.getAttribute('data-graph');
      } else {
        e.setAttribute('data-graph', e.textContent);
      }
    });

    if (isDark) {
      initMermaidDark();
      mermaid.run();
    } else {
      initMermaidLight();
      mermaid.run();
    }
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  document.documentElement.classList.add("dark");
  const switcher = document.getElementById("appearance-switcher");
  const switcherMobile = document.getElementById("appearance-switcher-mobile");

  updateMeta();
  this.updateLogo?.(getTargetAppearance());

  updateMermaidTheme();

  if (switcher) {
    switcher.addEventListener("click", (event) => {
      event.preventDefault();
      document.documentElement.classList.add("dark");
      localStorage.setItem("appearance", "dark");
      updateMeta();
      updateMermaidTheme();
      this.updateLogo?.("dark");
    });
  }
  if (switcherMobile) {
    switcherMobile.addEventListener("click", (event) => {
      event.preventDefault();
      document.documentElement.classList.add("dark");
      localStorage.setItem("appearance", "dark");
      updateMeta();
      updateMermaidTheme();
      this.updateLogo?.("dark");
    });
  }
});


var updateMeta = () => {
  var elem, style;
  elem = document.querySelector('body');
  style = getComputedStyle(elem);
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  if (elem && themeMeta) {
    themeMeta.setAttribute('content', style.backgroundColor);
  }
}

{{ if and (.Site.Params.Logo) (.Site.Params.SecondaryLogo) }}
{{ $primaryLogo := resources.Get .Site.Params.Logo }}
{{ $secondaryLogo := resources.Get .Site.Params.SecondaryLogo }}
{{ if and ($primaryLogo) ($secondaryLogo) }}
var updateLogo = (targetAppearance) => {
  var imgElems = document.querySelectorAll("img.logo");
  var logoContainers = document.querySelectorAll("span.logo");

  targetLogoPath =
    targetAppearance == "{{ .Site.Params.DefaultAppearance }}" ?
    "{{ $primaryLogo.RelPermalink }}" : "{{ $secondaryLogo.RelPermalink }}"
  for (const elem of imgElems) {
    elem.setAttribute("src", targetLogoPath)
  }

  {{ if eq $primaryLogo.MediaType.SubType "svg" }}
  targetContent =
    targetAppearance == "{{ .Site.Params.DefaultAppearance }}" ?
    `{{ $primaryLogo.Content | safeHTML }}` : `{{ $secondaryLogo.Content | safeHTML }}`
  for (const container of logoContainers) {
    container.innerHTML = targetContent;
  }
  {{ end }}
}
{{ end }}
{{- end }}

var getTargetAppearance = () => {
  return "dark"
}

window.addEventListener("DOMContentLoaded", (event) => {
  const scroller = document.getElementById("top-scroller");
  const footer = document.getElementById("site-footer");
  if(scroller && footer && scroller.getBoundingClientRect().top > footer.getBoundingClientRect().top) {
    scroller.hidden = true;
  }
});
