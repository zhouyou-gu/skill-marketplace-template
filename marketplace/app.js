const PATHS = {
  config: "../config/marketplace.json",
  registry: "../registry/index.json",
  search: "../registry/search.json"
};

const state = {
  config: null,
  registry: null,
  searchById: new Map(),
  query: "",
  category: "all",
  categorySort: "config"
};

const elements = {
  title: document.getElementById("marketplace-title"),
  description: document.getElementById("marketplace-description"),
  searchInput: document.getElementById("search-input"),
  sortSelect: document.getElementById("sort-select"),
  categoryChips: document.getElementById("category-chips"),
  grid: document.getElementById("skills-grid"),
  errorPanel: document.getElementById("error-panel"),
  emptyPanel: document.getElementById("empty-panel")
};

function normalize(value) {
  return (value || "").toString().toLowerCase().trim();
}

function showError(message) {
  elements.errorPanel.hidden = false;
  elements.errorPanel.textContent = message;
}

function clearError() {
  elements.errorPanel.hidden = true;
  elements.errorPanel.textContent = "";
}

function buildCategoryButtons() {
  const categories = state.config.categories || [];
  const options = ["all", ...categories];

  elements.categoryChips.innerHTML = "";

  options.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.value = value;
    button.setAttribute("aria-pressed", String(state.category === value));
    button.textContent = value === "all" ? "All" : value;
    button.addEventListener("click", () => {
      state.category = value;
      updateCategoryChipState();
      renderSkills();
    });
    elements.categoryChips.appendChild(button);
  });
}

function updateCategoryChipState() {
  const chips = elements.categoryChips.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.dataset.value === state.category));
  });
}

function matchesQuery(skill) {
  const query = normalize(state.query);
  if (!query) {
    return true;
  }

  const searchEntry = state.searchById.get(skill.id);
  const haystack = searchEntry ? searchEntry.text : normalize([skill.name, skill.description, skill.tags.join(" ")].join(" "));
  const terms = query.split(/\s+/).filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}

function matchesCategory(skill) {
  return state.category === "all" || skill.category === state.category;
}

function categoryRank(category) {
  const categories = state.config.categories || [];
  const index = categories.indexOf(category);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function sortSkills(skills) {
  return [...skills].sort((a, b) => {
    if (state.categorySort === "alpha") {
      const categoryCmp = a.category.localeCompare(b.category);
      if (categoryCmp !== 0) {
        return categoryCmp;
      }
    } else {
      const rankCmp = categoryRank(a.category) - categoryRank(b.category);
      if (rankCmp !== 0) {
        return rankCmp;
      }
    }

    return a.name.localeCompare(b.name);
  });
}

function createInstallBadge(label, value) {
  const code = document.createElement("code");
  code.textContent = `${label}: ${value}`;
  return code;
}

function renderSkillCard(skill) {
  const article = document.createElement("article");
  article.className = "card";

  const tagsMarkup = skill.tags.map((tag) => `<span>${tag}</span>`).join("");

  article.innerHTML = `
    <h3>${skill.name}</h3>
    <p>${skill.description}</p>
    <div class="meta">
      <span>${skill.category}</span>
      <span>${skill.difficulty}</span>
      ${tagsMarkup}
    </div>
    <div class="install"></div>
    <div class="actions">
      <a class="primary" href="#" role="button" aria-disabled="true">Install (v1.1)</a>
      <a href="${skill.repo}" target="_blank" rel="noreferrer">View Repo</a>
    </div>
  `;

  const install = article.querySelector(".install");
  if (skill.install.pip) {
    install.appendChild(createInstallBadge("pip", skill.install.pip));
  }
  if (skill.install.npm) {
    install.appendChild(createInstallBadge("npm", skill.install.npm));
  }

  return article;
}

function renderSkills() {
  const source = state.registry.skills || [];
  const filtered = source.filter((skill) => matchesCategory(skill) && matchesQuery(skill));
  const ordered = sortSkills(filtered);

  elements.grid.innerHTML = "";

  if (!ordered.length) {
    elements.emptyPanel.hidden = false;
    return;
  }

  elements.emptyPanel.hidden = true;

  ordered.forEach((skill) => {
    elements.grid.appendChild(renderSkillCard(skill));
  });
}

function wireEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderSkills();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.categorySort = event.target.value;
    renderSkills();
  });
}

async function loadData() {
  const [configResp, registryResp, searchResp] = await Promise.all([
    fetch(PATHS.config),
    fetch(PATHS.registry),
    fetch(PATHS.search)
  ]);

  if (!configResp.ok || !registryResp.ok || !searchResp.ok) {
    throw new Error("Failed to load marketplace assets. Check GitHub Pages paths and generated registry files.");
  }

  const [config, registry, search] = await Promise.all([
    configResp.json(),
    registryResp.json(),
    searchResp.json()
  ]);

  state.config = config;
  state.registry = registry;
  state.searchById = new Map(search.map((entry) => [entry.id, entry]));
}

async function bootstrap() {
  try {
    clearError();
    await loadData();

    elements.title.textContent = state.config.title;
    elements.description.textContent = state.config.description;

    buildCategoryButtons();
    wireEvents();
    renderSkills();
  } catch (error) {
    showError(error instanceof Error ? error.message : "Unknown error while loading marketplace.");
  }
}

bootstrap();
