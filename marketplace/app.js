const PATHS = {
  config: "../config/marketplace.json",
  registry: "../registry/index.json",
  search: "../registry/search.json"
};

const DEFAULTS = {
  query: "",
  category: "all",
  categorySort: "relevance"
};

const state = {
  config: null,
  registry: null,
  searchById: new Map(),
  skillDocs: new Map(),
  query: DEFAULTS.query,
  category: DEFAULTS.category,
  categorySort: DEFAULTS.categorySort
};

const elements = {
  title: document.getElementById("marketplace-title"),
  description: document.getElementById("marketplace-description"),
  heroStats: document.getElementById("hero-stats"),
  ctaAddSkill: document.getElementById("cta-add-skill"),
  ctaStarRepo: document.getElementById("cta-star-repo"),
  searchInput: document.getElementById("search-input"),
  sortSelect: document.getElementById("sort-select"),
  categoryChips: document.getElementById("category-chips"),
  summary: document.getElementById("results-summary"),
  clearFilters: document.getElementById("clear-filters"),
  registryUrl: document.getElementById("registry-url"),
  copyRegistry: document.getElementById("copy-registry"),
  copyStatus: document.getElementById("copy-status"),
  loadingPanel: document.getElementById("loading-panel"),
  grid: document.getElementById("skills-grid"),
  errorPanel: document.getElementById("error-panel"),
  emptyPanel: document.getElementById("empty-panel"),
  emptyMessage: document.getElementById("empty-message"),
  emptyReset: document.getElementById("empty-reset")
};

let searchDebounceTimer = 0;
let copyStatusTimer = 0;

function normalize(value) {
  return (value || "").toString().toLowerCase().trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueTokens(text, limit = Number.POSITIVE_INFINITY) {
  const seen = new Set();
  const tokens = normalize(text)
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => {
      if (seen.has(token)) {
        return false;
      }
      seen.add(token);
      return true;
    });

  return tokens.slice(0, limit);
}

function uniqueTermsFromQuery(query) {
  return uniqueTokens(query, 8);
}

function parseInitialStateFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const query = params.get("q");
  if (typeof query === "string") {
    state.query = query;
  }

  const category = params.get("c");
  if (typeof category === "string" && category) {
    state.category = normalize(category);
  }

  const categorySort = params.get("s");
  if (categorySort === "alpha" || categorySort === "config" || categorySort === "relevance") {
    state.categorySort = categorySort;
  }
}

function syncStateToUrl() {
  const params = new URLSearchParams();

  if (normalize(state.query)) {
    params.set("q", state.query.trim());
  }
  if (state.category !== DEFAULTS.category) {
    params.set("c", state.category);
  }
  if (state.categorySort !== DEFAULTS.categorySort) {
    params.set("s", state.categorySort);
  }

  const nextQuery = params.toString();
  const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
  window.history.replaceState(null, "", nextUrl);
}

function syncControlsFromState() {
  elements.searchInput.value = state.query;
  elements.sortSelect.value = state.categorySort;
}

function setLoading(isLoading) {
  elements.loadingPanel.hidden = !isLoading;
}

function showError(message) {
  elements.errorPanel.hidden = false;
  elements.errorPanel.textContent = message;
}

function clearError() {
  elements.errorPanel.hidden = true;
  elements.errorPanel.textContent = "";
}

function updateCategoryChipState() {
  const chips = elements.categoryChips.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.dataset.value === state.category));
  });
}

function buildCategoryButtons() {
  const categories = state.config.categories || [];
  const options = ["all", ...categories];

  elements.categoryChips.innerHTML = "";

  options.forEach((value) => {
    const button = document.createElement("button");
    const label = value === "all" ? "All" : value;

    button.type = "button";
    button.className = "chip";
    button.dataset.value = value;
    button.dataset.label = label;
    button.textContent = label;
    button.setAttribute("aria-pressed", String(state.category === value));

    button.addEventListener("click", () => {
      state.category = value;
      updateCategoryChipState();
      renderSkills();
    });

    elements.categoryChips.appendChild(button);
  });
}

function updateCategoryCounts(queryMatchedSkills) {
  const counts = new Map();
  queryMatchedSkills.forEach((skill) => {
    counts.set(skill.category, (counts.get(skill.category) || 0) + 1);
  });

  const chips = elements.categoryChips.querySelectorAll(".chip");
  chips.forEach((chip) => {
    const value = chip.dataset.value;
    const label = chip.dataset.label || value;
    const count = value === "all" ? queryMatchedSkills.length : (counts.get(value) || 0);

    chip.textContent = `${label} (${count})`;

    const isSelected = value === state.category;
    chip.disabled = !isSelected && count === 0;
  });
}

function buildSkillDoc(skill, searchEntry) {
  const name = normalize(skill.name);
  const description = normalize(skill.description);
  const category = normalize(skill.category);
  const tags = (skill.tags || []).map((tag) => normalize(tag));

  const tokenSet = new Set();
  const tokenList = [];

  const addToken = (token) => {
    if (!token || tokenSet.has(token)) {
      return;
    }
    tokenSet.add(token);
    tokenList.push(token);
  };

  if (searchEntry && Array.isArray(searchEntry.tokens)) {
    searchEntry.tokens.forEach((token) => addToken(normalize(token)));
  }

  uniqueTokens([name, description, category, tags.join(" ")].join(" "), 200).forEach(addToken);

  const text = normalize(
    searchEntry && typeof searchEntry.text === "string"
      ? searchEntry.text
      : [name, description, category, tags.join(" ")].join(" ")
  );

  return {
    name,
    description,
    category,
    tags,
    tokens: tokenSet,
    tokenList,
    text
  };
}

function scoreSkill(skill, queryTerms, queryPhrase) {
  const doc = state.skillDocs.get(skill.id);
  if (!doc) {
    return -1;
  }

  let score = 0;

  for (const term of queryTerms) {
    let termScore = 0;
    let matched = false;

    if (doc.name.startsWith(term)) {
      termScore = Math.max(termScore, 58);
      matched = true;
    }
    if (doc.name.includes(term)) {
      termScore = Math.max(termScore, 40);
      matched = true;
    }

    if (doc.tags.some((tag) => tag === term)) {
      termScore = Math.max(termScore, 34);
      matched = true;
    }
    if (doc.tags.some((tag) => tag.startsWith(term))) {
      termScore = Math.max(termScore, 24);
      matched = true;
    }

    if (doc.category === term) {
      termScore = Math.max(termScore, 20);
      matched = true;
    }

    if (doc.tokens.has(term)) {
      termScore = Math.max(termScore, 16);
      matched = true;
    }
    if (doc.tokenList.some((token) => token.startsWith(term))) {
      termScore = Math.max(termScore, 12);
      matched = true;
    }

    if (doc.description.includes(term)) {
      termScore = Math.max(termScore, 10);
      matched = true;
    }

    if (!matched) {
      return -1;
    }

    score += termScore;
  }

  if (queryPhrase) {
    if (doc.name.includes(queryPhrase)) {
      score += 40;
    } else if (doc.text.includes(queryPhrase)) {
      score += 18;
    }
  }

  return score;
}

function matchesCategory(skill) {
  return state.category === "all" || skill.category === state.category;
}

function categoryRank(category) {
  const categories = state.config.categories || [];
  const index = categories.indexOf(category);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function sortSkillEntries(entries, hasQuery) {
  return [...entries].sort((left, right) => {
    if (state.categorySort === "relevance" && hasQuery) {
      const scoreCmp = right.score - left.score;
      if (scoreCmp !== 0) {
        return scoreCmp;
      }
    } else if (state.categorySort === "alpha") {
      const categoryCmp = left.skill.category.localeCompare(right.skill.category);
      if (categoryCmp !== 0) {
        return categoryCmp;
      }
    } else {
      const rankCmp = categoryRank(left.skill.category) - categoryRank(right.skill.category);
      if (rankCmp !== 0) {
        return rankCmp;
      }
    }

    return left.skill.name.localeCompare(right.skill.name);
  });
}

function createHighlightedFragment(text, queryTerms) {
  const fragment = document.createDocumentFragment();
  const source = String(text || "");

  if (!queryTerms.length) {
    fragment.append(source);
    return fragment;
  }

  const escapedTerms = queryTerms
    .map((term) => escapeRegex(term))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!escapedTerms.length) {
    fragment.append(source);
    return fragment;
  }

  const regex = new RegExp(`(${escapedTerms.join("|")})`, "ig");
  let lastIndex = 0;

  source.replace(regex, (match, _group, offset) => {
    if (offset > lastIndex) {
      fragment.append(source.slice(lastIndex, offset));
    }

    const mark = document.createElement("mark");
    mark.textContent = match;
    fragment.append(mark);

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < source.length) {
    fragment.append(source.slice(lastIndex));
  }

  return fragment;
}

function createBadge(text, className, isMatch) {
  const badge = document.createElement("span");
  badge.className = `badge ${className}${isMatch ? " is-match" : ""}`;
  badge.textContent = text;
  return badge;
}

function renderSkillCard(skill, queryTerms) {
  const article = document.createElement("article");
  article.className = "card";

  const title = document.createElement("h3");
  title.appendChild(createHighlightedFragment(skill.name, queryTerms));

  const description = document.createElement("p");
  description.className = "card-description";
  description.appendChild(createHighlightedFragment(skill.description, queryTerms));

  const meta = document.createElement("div");
  meta.className = "meta";

  const categoryMatch = queryTerms.some((term) => normalize(skill.category).includes(term));

  meta.appendChild(createBadge(skill.category, "badge-category", categoryMatch));
  meta.appendChild(createBadge(`level: ${skill.difficulty}`, "badge-difficulty", false));

  const tags = Array.isArray(skill.tags) ? skill.tags : [];
  const visibleTags = tags.slice(0, 3);

  visibleTags.forEach((tag) => {
    const tagMatch = queryTerms.some((term) => normalize(tag).includes(term));
    meta.appendChild(createBadge(tag, "badge-tag", tagMatch));
  });

  if (tags.length > visibleTags.length) {
    meta.appendChild(createBadge(`+${tags.length - visibleTags.length} more`, "badge-muted", false));
  }

  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(meta);

  return article;
}

function updateSummary(totalCount, visibleCount, hasQuery) {
  const queryLabel = normalize(state.query);

  let summary = `${visibleCount} of ${totalCount} skills`;
  if (queryLabel) {
    summary += ` match \"${state.query.trim()}\"`;
  }
  if (state.category !== "all") {
    summary += ` in ${state.category}`;
  }
  if (hasQuery && state.categorySort === "relevance") {
    summary += " · sorted by relevance";
  }

  elements.summary.textContent = summary;

  const filtersActive =
    normalize(state.query) ||
    state.category !== DEFAULTS.category ||
    state.categorySort !== DEFAULTS.categorySort;

  elements.clearFilters.disabled = !filtersActive;
}

function updateEmptyState(hasQuery) {
  if (elements.emptyPanel.hidden) {
    return;
  }

  if (hasQuery || state.category !== "all") {
    elements.emptyMessage.textContent = "No skills match these filters yet. Try a shorter query or reset filters.";
  } else {
    elements.emptyMessage.textContent = "No skills published yet. Be the first contributor.";
  }
}

function detectMarketplaceRepoUrl() {
  const host = window.location.hostname.toLowerCase();
  if (!host.endsWith(".github.io")) {
    return "";
  }

  const owner = host.replace(".github.io", "");
  const parts = window.location.pathname.split("/").filter(Boolean);

  if (!owner || parts.length === 0) {
    return "";
  }

  const repo = parts[0];
  return `https://github.com/${owner}/${repo}`;
}

function updateHeroStats() {
  const skills = state.registry.skills || [];
  const categories = new Set();
  const tags = new Set();

  skills.forEach((skill) => {
    if (skill.category) {
      categories.add(skill.category);
    }
    (skill.tags || []).forEach((tag) => tags.add(tag));
  });

  elements.heroStats.textContent = `${skills.length} skills · ${categories.size} categories · ${tags.size} unique tags`;
}

function configureCtas() {
  const repoUrl = detectMarketplaceRepoUrl();

  if (repoUrl) {
    elements.ctaAddSkill.href = `${repoUrl}/tree/main/skills`;
    elements.ctaStarRepo.href = repoUrl;
    elements.ctaAddSkill.hidden = false;
    elements.ctaStarRepo.hidden = false;
  } else {
    elements.ctaAddSkill.hidden = true;
    elements.ctaStarRepo.hidden = true;
  }

  const registryUrl = new URL(PATHS.registry, window.location.href).href;
  elements.registryUrl.textContent = registryUrl;
}

async function copyRegistryUrlToClipboard() {
  const text = elements.registryUrl.textContent;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }

    elements.copyStatus.textContent = "Copied";
  } catch (_error) {
    elements.copyStatus.textContent = "Copy failed";
  }

  window.clearTimeout(copyStatusTimer);
  copyStatusTimer = window.setTimeout(() => {
    elements.copyStatus.textContent = "";
  }, 1800);
}

function renderSkills() {
  const source = state.registry.skills || [];
  const queryTerms = uniqueTermsFromQuery(state.query);
  const queryPhrase = normalize(state.query);
  const hasQuery = queryTerms.length > 0;

  const scoredEntries = source.map((skill) => ({
    skill,
    score: hasQuery ? scoreSkill(skill, queryTerms, queryPhrase) : 0
  }));

  const queryMatchedEntries = hasQuery
    ? scoredEntries.filter((entry) => entry.score >= 0)
    : scoredEntries;

  updateCategoryCounts(queryMatchedEntries.map((entry) => entry.skill));

  const categoryFilteredEntries = queryMatchedEntries.filter((entry) => matchesCategory(entry.skill));
  const orderedEntries = sortSkillEntries(categoryFilteredEntries, hasQuery);

  const fragment = document.createDocumentFragment();
  orderedEntries.forEach((entry) => {
    fragment.appendChild(renderSkillCard(entry.skill, queryTerms));
  });

  elements.grid.replaceChildren(fragment);
  elements.emptyPanel.hidden = orderedEntries.length > 0;
  updateEmptyState(hasQuery);

  updateSummary(source.length, orderedEntries.length, hasQuery);
  syncStateToUrl();
}

function resetFilters() {
  state.query = DEFAULTS.query;
  state.category = DEFAULTS.category;
  state.categorySort = DEFAULTS.categorySort;
  syncControlsFromState();
  updateCategoryChipState();
  renderSkills();
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

function wireEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;

    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = window.setTimeout(() => {
      renderSkills();
    }, 120);
  });

  elements.searchInput.addEventListener("search", (event) => {
    state.query = event.target.value;
    renderSkills();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.categorySort = event.target.value;
    renderSkills();
  });

  elements.clearFilters.addEventListener("click", () => {
    resetFilters();
  });

  elements.emptyReset.addEventListener("click", () => {
    resetFilters();
  });

  elements.copyRegistry.addEventListener("click", () => {
    copyRegistryUrlToClipboard();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !isTypingTarget(event.target)) {
      event.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
      return;
    }

    if (event.key === "Escape" && isTypingTarget(document.activeElement) && normalize(state.query)) {
      state.query = "";
      elements.searchInput.value = "";
      renderSkills();
    }
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

  const allowedCategories = new Set(["all", ...(config.categories || [])]);
  if (!allowedCategories.has(state.category)) {
    state.category = "all";
  }

  (registry.skills || []).forEach((skill) => {
    const searchEntry = state.searchById.get(skill.id);
    state.skillDocs.set(skill.id, buildSkillDoc(skill, searchEntry));
  });
}

async function bootstrap() {
  try {
    parseInitialStateFromUrl();
    clearError();
    setLoading(true);

    await loadData();

    elements.title.textContent = state.config.title;
    elements.description.textContent = state.config.description;

    syncControlsFromState();
    buildCategoryButtons();
    configureCtas();
    updateHeroStats();
    wireEvents();
    renderSkills();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    showError(error instanceof Error ? error.message : "Unknown error while loading marketplace.");
  }
}

bootstrap();
