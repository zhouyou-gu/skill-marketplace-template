const PATHS = {
  config: "../config/marketplace.json",
  registry: "../registry/index.json",
  search: "../registry/search.json"
};

const TEMPLATE_REPO_URL = "https://github.com/zhouyou-gu/skill-marketplace-template";
const TEMPLATE_LICENSE_URL = "../LICENSE";
const TEMPLATE_LICENSE_LABEL = "MIT License";
const TEMPLATE_ATTRIBUTION_LABEL = "View Template on GitHub Created by Zhouyou Gu";

const DEFAULTS = {
  query: "",
  sort: "relevance"
};

const state = {
  config: null,
  registry: null,
  searchById: new Map(),
  skillDocs: new Map(),
  query: DEFAULTS.query,
  sort: DEFAULTS.sort
};

const elements = {
  title: document.getElementById("marketplace-title"),
  description: document.getElementById("marketplace-description"),
  heroStats: document.getElementById("hero-stats"),
  ctaAddSkill: document.getElementById("cta-add-skill"),
  ctaStarRepo: document.getElementById("cta-star-repo"),
  starCount: document.getElementById("star-count"),
  footerLicenseLink: document.getElementById("footer-license-link"),
  footerRepoLink: document.getElementById("footer-repo-link"),
  searchContainer: document.getElementById("search-container"),
  searchInput: document.getElementById("search-input"),
  autocomplete: document.getElementById("autocomplete"),
  sortSelect: document.getElementById("sort-select"),
  tagChips: document.getElementById("tag-chips"),
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
let selectedChipIndex = -1;
let autocompleteIndex = -1;
let allTagCounts = [];

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

const FILTER_PATTERN = /(-?)(tag|category):(\S+)/gi;

function parseQueryFilters(query) {
  const filters = { includeTags: [], excludeTags: [], includeCategories: [], excludeCategories: [] };
  const textQuery = query.replace(FILTER_PATTERN, (_, neg, type, value) => {
    const list = neg === "-" ? "exclude" : "include";
    const key = type === "tag" ? `${list}Tags` : `${list}Categories`;
    filters[key].push(value.toLowerCase());
    return "";
  }).trim();
  return { filters, textQuery };
}

function parseQueryTokens(query) {
  const tokens = [];
  const textPart = query.replace(FILTER_PATTERN, (raw, neg, type, value) => {
    tokens.push({ raw: raw.trim(), negate: neg === "-", type: type.toLowerCase(), value: value.toLowerCase() });
    return "";
  }).trim();
  return { tokens, text: textPart };
}

function buildAllTagCounts() {
  const counts = new Map();
  const skills = (state.registry && state.registry.skills) || [];
  skills.forEach((skill) => {
    (skill.tags || []).forEach((tag) => {
      const t = tag.toLowerCase();
      counts.set(t, (counts.get(t) || 0) + 1);
    });
  });
  allTagCounts = [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function renderSearchTokens() {
  const { tokens, text } = parseQueryTokens(state.query);

  // Remove existing chips
  const existingChips = elements.searchContainer.querySelectorAll(".token-chip");
  existingChips.forEach((chip) => chip.remove());

  // Insert chips before the input
  tokens.forEach((token, index) => {
    const chip = document.createElement("span");
    chip.className = "token-chip" + (token.negate ? " is-negated" : "");
    chip.dataset.index = index;

    const label = document.createElement("span");
    label.className = "token-label";
    label.textContent = token.raw;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "token-remove";
    removeBtn.setAttribute("aria-label", `Remove ${token.raw}`);
    removeBtn.textContent = "\u00d7";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTokenAtIndex(index);
    });

    chip.appendChild(label);
    chip.appendChild(removeBtn);
    elements.searchInput.before(chip);
  });

  elements.searchInput.value = text;
  selectedChipIndex = -1;
}

function removeTokenAtIndex(index) {
  const { tokens, text } = parseQueryTokens(state.query);
  tokens.splice(index, 1);
  state.query = rebuildQuery(tokens, text);
  renderSearchTokens();
  renderSkills();
  elements.searchInput.focus();
}

function rebuildQuery(tokens, text) {
  const parts = tokens.map((t) => t.raw);
  if (text.trim()) {
    parts.push(text.trim());
  }
  return parts.join(" ");
}

function rebuildQueryFromUI() {
  const { tokens } = parseQueryTokens(state.query);
  const inputText = elements.searchInput.value;
  state.query = rebuildQuery(tokens, inputText);
}

function promoteTypedFilters() {
  const inputText = elements.searchInput.value;
  // Only promote a filter token when it's followed by a space,
  // meaning the user has finished typing it and moved on
  const COMPLETE_FILTER = /(-?)(tag|category):(\S+)\s/gi;
  if (COMPLETE_FILTER.test(inputText)) {
    rebuildQueryFromUI();
    renderSearchTokens();
    return true;
  }
  return false;
}

function getChips() {
  return elements.searchContainer.querySelectorAll(".token-chip");
}

function clearChipSelection() {
  getChips().forEach((c) => c.classList.remove("is-selected"));
  selectedChipIndex = -1;
}

function selectChip(index) {
  const chips = getChips();
  if (index < 0 || index >= chips.length) {
    clearChipSelection();
    elements.searchInput.focus();
    return;
  }
  clearChipSelection();
  selectedChipIndex = index;
  chips[index].classList.add("is-selected");
  // Keep focus on the container so keydown events still fire
  elements.searchContainer.focus();
}

// Autocomplete
function showAutocomplete(suggestions) {
  const el = elements.autocomplete;
  el.innerHTML = "";
  if (!suggestions.length) {
    el.hidden = true;
    autocompleteIndex = -1;
    return;
  }
  suggestions.forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    item.textContent = s.label;
    item.dataset.value = s.value;
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      acceptAutocompleteSuggestion(s.value);
    });
    el.appendChild(item);
  });
  el.hidden = false;
  autocompleteIndex = -1;
}

function hideAutocomplete() {
  elements.autocomplete.hidden = true;
  elements.autocomplete.innerHTML = "";
  autocompleteIndex = -1;
}

function highlightAutocompleteItem(index) {
  const items = elements.autocomplete.querySelectorAll(".autocomplete-item");
  items.forEach((item) => item.classList.remove("is-active"));
  if (index >= 0 && index < items.length) {
    autocompleteIndex = index;
    items[index].classList.add("is-active");
    items[index].scrollIntoView({ block: "nearest" });
  } else {
    autocompleteIndex = -1;
  }
}

function acceptAutocompleteSuggestion(value) {
  const inputText = elements.searchInput.value;
  const cursor = elements.searchInput.selectionStart || inputText.length;

  // Find the word boundary around the cursor
  const before = inputText.slice(0, cursor);
  const after = inputText.slice(cursor);
  const wordStart = before.search(/\S+$/);
  const wordEnd = cursor + (after.match(/^\S*/) || [""])[0].length;

  // Replace the word at cursor with nothing (the suggestion becomes a chip)
  const remaining = (inputText.slice(0, Math.max(0, wordStart)) + inputText.slice(wordEnd)).trim();

  // Get existing chip tokens only (exclude input text from state.query)
  const chipQuery = state.query.replace(new RegExp(escapeRegex(inputText) + "$"), "").trim();
  const { tokens } = parseQueryTokens(chipQuery);

  const negate = value.startsWith("-");
  const withoutNeg = negate ? value.slice(1) : value;
  const colonIdx = withoutNeg.indexOf(":");
  const type = withoutNeg.slice(0, colonIdx);
  const val = withoutNeg.slice(colonIdx + 1);
  tokens.push({ raw: value, negate, type, value: val });

  elements.searchInput.value = "";
  state.query = rebuildQuery(tokens, remaining);
  renderSearchTokens();
  renderSkills();
  hideAutocomplete();
  elements.searchInput.focus();
}

function updateAutocomplete() {
  const inputText = elements.searchInput.value;
  if (!inputText.trim()) {
    hideAutocomplete();
    return;
  }

  const { tokens: existingTokens } = parseQueryTokens(state.query);
  const existingValues = new Set(existingTokens.map((t) => (t.negate ? "-" : "") + t.type + ":" + t.value));

  // Check if user is typing a tag: or -tag: prefix
  const prefixMatch = inputText.match(/(-?)(tag|category):(\S*)$/i);
  let suggestions = [];

  if (prefixMatch) {
    const neg = prefixMatch[1];
    const type = prefixMatch[2].toLowerCase();
    const partial = prefixMatch[3].toLowerCase();
    suggestions = allTagCounts
      .filter(([tag]) => tag.startsWith(partial) || tag.includes(partial))
      .filter(([tag]) => !existingValues.has(`${neg}${type}:${tag}`))
      .slice(0, 8)
      .map(([tag, count]) => ({
        label: `${neg}${type}:${tag} (${count})`,
        value: `${neg}${type}:${tag}`
      }));
  } else {
    // Free text — suggest tag: completions for matching tags
    const lastWord = inputText.trim().split(/\s+/).pop().toLowerCase();
    if (lastWord.length >= 1) {
      suggestions = allTagCounts
        .filter(([tag]) => tag.startsWith(lastWord) || tag.includes(lastWord))
        .filter(([tag]) => !existingValues.has(`tag:${tag}`))
        .slice(0, 6)
        .map(([tag, count]) => ({
          label: `tag:${tag} (${count})`,
          value: `tag:${tag}`
        }));
    }
  }

  showAutocomplete(suggestions);
}

function matchesFilters(skill, filters) {
  const tags = (skill.tags || []).map((t) => t.toLowerCase());
  const category = (skill.category || "").toLowerCase();

  for (const t of filters.excludeTags) {
    if (tags.includes(t)) return false;
  }
  for (const c of filters.excludeCategories) {
    if (category === c) return false;
  }
  for (const t of filters.includeTags) {
    if (!tags.includes(t)) return false;
  }
  for (const c of filters.includeCategories) {
    if (category !== c) return false;
  }
  return true;
}

function parseInitialStateFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const query = params.get("q");
  if (typeof query === "string") {
    state.query = query;
  }

  const sort = params.get("s");
  if (sort === "alpha" || sort === "relevance") {
    state.sort = sort;
  }
}

function syncStateToUrl() {
  const params = new URLSearchParams();

  if (state.query !== DEFAULTS.query) {
    params.set("q", state.query.trim());
  }
  if (state.sort !== DEFAULTS.sort) {
    params.set("s", state.sort);
  }

  const nextQuery = params.toString();
  const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
  window.history.replaceState(null, "", nextUrl);
}

function syncControlsFromState() {
  renderSearchTokens();
  elements.sortSelect.value = state.sort;
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

function updateTagChips(skills) {
  const { filters } = parseQueryFilters(state.query);
  const activeIncludeTags = new Set(filters.includeTags);

  const counts = new Map();
  skills.forEach((skill) => {
    (skill.tags || []).forEach((tag) => {
      const t = tag.toLowerCase();
      counts.set(t, (counts.get(t) || 0) + 1);
    });
  });

  const topTags = [...counts.entries()]
    .filter(([tag]) => !activeIncludeTags.has(tag))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  elements.tagChips.innerHTML = "";

  topTags.forEach(([tag, count]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = `${tag} (${count})`;

    button.addEventListener("click", () => {
      state.query = `${state.query} tag:${tag}`.trim();
      syncControlsFromState();
      renderSkills();
    });

    elements.tagChips.appendChild(button);
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

function sortSkillEntries(entries, hasQuery) {
  return [...entries].sort((left, right) => {
    if (state.sort === "relevance" && hasQuery) {
      const scoreCmp = right.score - left.score;
      if (scoreCmp !== 0) {
        return scoreCmp;
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
  const folderUrl = resolveSkillFolderUrl(skill);

  const title = document.createElement("h3");
  title.appendChild(createHighlightedFragment(skill.name, queryTerms));

  const description = document.createElement("p");
  description.className = "card-description";
  description.appendChild(createHighlightedFragment(skill.description, queryTerms));

  const meta = document.createElement("div");
  meta.className = "meta";

  meta.appendChild(createBadge(`level: ${skill.difficulty}`, "badge-difficulty", false));

  const tags = Array.isArray(skill.tags) ? skill.tags : [];
  const visibleTags = tags.slice(0, 5);

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

  if (folderUrl) {
    article.classList.add("card-clickable");
    article.tabIndex = 0;
    article.setAttribute("role", "link");
    article.setAttribute("aria-label", `Open ${skill.name} folder`);

    const openFolder = () => {
      window.open(folderUrl, "_blank", "noopener,noreferrer");
    };

    article.addEventListener("click", (event) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("a, button, input, select, textarea, label")
      ) {
        return;
      }
      openFolder();
    });

    article.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFolder();
      }
    });
  }

  return article;
}

function extractGitHubRepoBase(url) {
  if (typeof url !== "string" || !url.trim()) {
    return "";
  }

  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) {
    return "";
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, "");
  if (!owner || !repo) {
    return "";
  }

  return `https://github.com/${owner}/${repo}`;
}

function resolveSkillFolderUrl(skill) {
  const path = typeof skill.path === "string" ? skill.path.replace(/^\/+/, "") : "";
  const repoFromPage = resolveMarketplaceRepoUrl();

  if (repoFromPage && path) {
    return `${repoFromPage}/tree/main/${path}`;
  }

  const skillRepo = typeof skill.repo === "string" ? skill.repo.trim() : "";
  if (!skillRepo) {
    return "";
  }
  if (skillRepo.includes("/tree/") || !path) {
    return skillRepo;
  }

  const repoBase = extractGitHubRepoBase(skillRepo);
  if (repoBase) {
    return `${repoBase}/tree/main/${path}`;
  }

  return skillRepo;
}

function updateSummary(totalCount, visibleCount, hasQuery) {
  let summary = `Showing ${visibleCount} of ${totalCount} ${totalCount === 1 ? 'skill' : 'skills'}`;

  elements.summary.textContent = summary;

  const filtersActive =
    state.query !== DEFAULTS.query ||
    state.sort !== DEFAULTS.sort;

  elements.clearFilters.disabled = !filtersActive;
}

function updateEmptyState(hasQuery) {
  if (elements.emptyPanel.hidden) {
    return;
  }

  const emptyTitle = elements.emptyMessage;
  const emptyHint = elements.emptyPanel.querySelector('.empty-hint');

  if (hasQuery || state.query !== DEFAULTS.query) {
    if (emptyTitle) {
      emptyTitle.textContent = "No matching skills found";
    }
    if (emptyHint) {
      emptyHint.textContent = "Try adjusting your search or filters";
    }
  } else {
    if (emptyTitle) {
      emptyTitle.textContent = "No skills available yet";
    }
    if (emptyHint) {
      emptyHint.textContent = "Be the first to add a skill";
    }
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

function repoUrlFromGitHubPagesUrl(urlString) {
  if (typeof urlString !== "string" || !urlString.trim()) {
    return "";
  }

  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();
    if (!host.endsWith(".github.io")) {
      return "";
    }

    const owner = host.replace(".github.io", "");
    const repo = parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (!owner || !repo || owner.includes("<") || repo.includes("<")) {
      return "";
    }

    return `https://github.com/${owner}/${repo}`;
  } catch (_error) {
    return "";
  }
}

function resolveMarketplaceRepoUrl() {
  return (
    detectMarketplaceRepoUrl() ||
    repoUrlFromGitHubPagesUrl(state.config?.url || "") ||
    repoUrlFromGitHubPagesUrl(state.registry?.marketplace?.url || "")
  );
}

function updateHeroStats() {
  const skills = state.registry.skills || [];
  const tags = new Set();

  skills.forEach((skill) => {
    (skill.tags || []).forEach((tag) => tags.add(tag));
  });

  const parts = [];
  parts.push(`${skills.length} ${skills.length === 1 ? 'skill' : 'skills'}`);
  if (tags.size > 0) {
    parts.push(`${tags.size} ${tags.size === 1 ? 'tag' : 'tags'}`);
  }

  elements.heroStats.textContent = parts.join(' • ');
}

async function fetchGitHubStars(repoUrl) {
  try {
    // Extract owner and repo from URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.stargazers_count;
  } catch (error) {
    return null;
  }
}

function formatStarCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

function configureCtas() {
  const repoUrl = resolveMarketplaceRepoUrl();
  configureFooterAttribution();

  if (repoUrl) {
    elements.ctaAddSkill.href = `${repoUrl}/tree/main/skills`;
    elements.ctaStarRepo.href = repoUrl;
    elements.ctaAddSkill.removeAttribute("aria-disabled");
    elements.ctaStarRepo.removeAttribute("aria-disabled");
    elements.ctaAddSkill.removeAttribute("tabindex");
    elements.ctaStarRepo.removeAttribute("tabindex");
    elements.ctaAddSkill.classList.remove("is-disabled");
    elements.ctaStarRepo.classList.remove("is-disabled");
    elements.ctaStarRepo.classList.add("is-live");
    
    // Fetch and display star count
    fetchGitHubStars(repoUrl).then(stars => {
      if (stars !== null && elements.starCount) {
        elements.starCount.textContent = formatStarCount(stars);
      }
    });
  } else {
    elements.ctaAddSkill.href = "#";
    elements.ctaStarRepo.href = "#";
    elements.ctaAddSkill.setAttribute("aria-disabled", "true");
    elements.ctaStarRepo.setAttribute("aria-disabled", "true");
    elements.ctaAddSkill.setAttribute("tabindex", "-1");
    elements.ctaStarRepo.setAttribute("tabindex", "-1");
    elements.ctaAddSkill.classList.add("is-disabled");
    elements.ctaStarRepo.classList.add("is-disabled");
    elements.ctaStarRepo.classList.remove("is-live");
  }

  const registryUrl = new URL(PATHS.registry, window.location.href).href;
  elements.registryUrl.textContent = registryUrl;
}

function configureFooterAttribution() {
  const footerLinks = [
    {
      element: elements.footerLicenseLink,
      href: TEMPLATE_LICENSE_URL,
      label: TEMPLATE_LICENSE_LABEL
    },
    {
      element: elements.footerRepoLink,
      href: TEMPLATE_REPO_URL,
      label: TEMPLATE_ATTRIBUTION_LABEL
    }
  ];

  footerLinks.forEach(({ element, href, label }) => {
    if (!element) {
      return;
    }

    element.href = href;
    element.textContent = label;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    element.hidden = false;
  });
}

async function copyRegistryUrlToClipboard() {
  const text = elements.registryUrl.textContent;
  const btn = elements.copyRegistry;
  const originalText = btn.innerHTML;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }

    elements.copyStatus.textContent = "✓ Copied";
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg> Copied!`;
    btn.style.pointerEvents = "none";
    
    window.clearTimeout(copyStatusTimer);
    copyStatusTimer = window.setTimeout(() => {
      elements.copyStatus.textContent = "";
      btn.innerHTML = originalText;
      btn.style.pointerEvents = "";
    }, 2000);
  } catch (_error) {
    elements.copyStatus.textContent = "⚠ Copy failed";
    
    window.clearTimeout(copyStatusTimer);
    copyStatusTimer = window.setTimeout(() => {
      elements.copyStatus.textContent = "";
    }, 2000);
  }
}

function renderSkills() {
  const allSkills = state.registry.skills || [];
  const { filters, textQuery } = parseQueryFilters(state.query);
  const source = allSkills.filter((skill) => matchesFilters(skill, filters));
  const queryTerms = uniqueTermsFromQuery(textQuery);
  const queryPhrase = normalize(textQuery);
  const hasQuery = queryTerms.length > 0;

  const scoredEntries = source.map((skill) => ({
    skill,
    score: hasQuery ? scoreSkill(skill, queryTerms, queryPhrase) : 0
  }));

  const queryMatchedEntries = hasQuery
    ? scoredEntries.filter((entry) => entry.score >= 0)
    : scoredEntries;

  const orderedEntries = sortSkillEntries(queryMatchedEntries, hasQuery);

  updateTagChips(orderedEntries.map((e) => e.skill));

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
  state.sort = DEFAULTS.sort;
  syncControlsFromState();
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
  // Click on container focuses input
  elements.searchContainer.addEventListener("click", (e) => {
    if (e.target === elements.searchContainer || e.target.classList.contains("token-input-icon")) {
      elements.searchInput.focus();
    }
  });

  elements.searchInput.addEventListener("input", () => {
    clearChipSelection();
    rebuildQueryFromUI();

    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = window.setTimeout(() => {
      const promoted = promoteTypedFilters();
      if (!promoted) {
        renderSkills();
      }
      updateAutocomplete();
    }, 200);
  });

  elements.searchInput.addEventListener("focus", () => {
    clearChipSelection();
  });

  elements.searchInput.addEventListener("blur", () => {
    // Delay to allow click on autocomplete items
    setTimeout(() => {
      if (!elements.autocomplete.matches(":hover")) {
        hideAutocomplete();
      }
    }, 150);
  });

  elements.searchInput.addEventListener("keydown", (event) => {
    const chips = getChips();

    // Autocomplete navigation
    if (!elements.autocomplete.hidden) {
      const items = elements.autocomplete.querySelectorAll(".autocomplete-item");
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = autocompleteIndex + 1;
        highlightAutocompleteItem(next < items.length ? next : 0);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const prev = autocompleteIndex - 1;
        highlightAutocompleteItem(prev >= 0 ? prev : items.length - 1);
        return;
      }
      if ((event.key === "Enter" || event.key === "Tab") && autocompleteIndex >= 0) {
        event.preventDefault();
        const activeItem = items[autocompleteIndex];
        if (activeItem) {
          acceptAutocompleteSuggestion(activeItem.dataset.value);
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        hideAutocomplete();
        return;
      }
    }

    // Chip selection via backspace/arrow when cursor at start
    const cursorAtStart = elements.searchInput.selectionStart === 0 && elements.searchInput.selectionEnd === 0;

    if (event.key === "Backspace" && cursorAtStart && chips.length > 0) {
      event.preventDefault();
      if (selectedChipIndex >= 0) {
        removeTokenAtIndex(selectedChipIndex);
      } else {
        selectChip(chips.length - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && cursorAtStart && chips.length > 0) {
      event.preventDefault();
      if (selectedChipIndex > 0) {
        selectChip(selectedChipIndex - 1);
      } else if (selectedChipIndex < 0) {
        selectChip(chips.length - 1);
      }
      return;
    }

    if (event.key === "ArrowRight" && selectedChipIndex >= 0) {
      event.preventDefault();
      if (selectedChipIndex < chips.length - 1) {
        selectChip(selectedChipIndex + 1);
      } else {
        clearChipSelection();
        elements.searchInput.focus();
      }
      return;
    }

    if (event.key === "Escape" && selectedChipIndex >= 0) {
      event.preventDefault();
      clearChipSelection();
      elements.searchInput.focus();
      return;
    }
  });

  // Global keydown for chip selection when input not focused
  elements.searchContainer.addEventListener("keydown", (event) => {
    if (event.target === elements.searchInput) return;
    const chips = getChips();

    if (event.key === "Backspace" && selectedChipIndex >= 0) {
      event.preventDefault();
      removeTokenAtIndex(selectedChipIndex);
      return;
    }
    if (event.key === "ArrowLeft" && selectedChipIndex > 0) {
      event.preventDefault();
      selectChip(selectedChipIndex - 1);
      return;
    }
    if (event.key === "ArrowRight" && selectedChipIndex >= 0) {
      event.preventDefault();
      if (selectedChipIndex < chips.length - 1) {
        selectChip(selectedChipIndex + 1);
      } else {
        clearChipSelection();
        elements.searchInput.focus();
      }
      return;
    }
    if (event.key === "Escape") {
      clearChipSelection();
      elements.searchInput.focus();
    }
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
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
      return;
    }

    if (event.key === "Escape") {
      if (!elements.autocomplete.hidden) {
        hideAutocomplete();
        return;
      }
      if (selectedChipIndex >= 0) {
        clearChipSelection();
        elements.searchInput.focus();
        return;
      }
      if (document.activeElement === elements.searchInput) {
        // Clear text portion only, keep tokens
        if (elements.searchInput.value.trim()) {
          elements.searchInput.value = "";
          rebuildQueryFromUI();
          renderSkills();
        } else if (state.query.trim()) {
          state.query = "";
          renderSearchTokens();
          renderSkills();
        } else {
          elements.searchInput.blur();
        }
      }
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

    buildAllTagCounts();
    syncControlsFromState();
    configureCtas();
    updateHeroStats();
    wireEvents();
    renderSkills();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    showError(error instanceof Error ? error.message : "Failed to load marketplace");
  }
}

bootstrap();
