// =============================
// Search Suggestions + Panel Content
// =============================
const searchInput = document.querySelector("#searchInput");
const suggestionsBox = document.querySelector("#suggestions");
const searchBtn = document.querySelector("#searchBtn");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modalContent");
const tabsList = document.querySelector("#tabsList");
const tabsDock = document.querySelector("#tabsDock");
const tabsDockList = document.querySelector("#tabsDockList");
const minimizeBtn = document.querySelector("#minimizeBtn");

const suggestions = [
  "about",
  "projects",
  "contact",
];

const contentMap = {
  about: {
    title: "About",
    html: `
      <p>
        I’m Saisa Koirala, a Computer Science student and developer who enjoys
        building clean, human-friendly web experiences. I love learning new
        technologies and turning ideas into functional products.
      </p>
    `,
  },
  projects: {
    title: "Projects",
    html: `
      <div class="project-card">
        <h3>SmartHospital Analytics</h3>
        <p>
          Role-Based Natural Language Hospital Analytics using SQL Views and LLMs.
          The system authenticates staff via role-based login, validates safe SELECT
          queries on analytical views, and presents results in a structured web UI.
        </p>
        <a href="https://github.com/SandeshKhatiwada05/College-Info-Assistant-LLM-Ollama-n8n-Orchestrated-Web-Scraping" target="_blank" rel="noopener">View project</a>
      </div>
      <div class="project-card">
        <h3>sql-data-warehouse-project</h3>
        <p>
          A complete modern data warehouse solution built with SQL Server,
          featuring end-to-end ETL pipelines, structured data modeling, and
          analytics workflows for actionable insights.
        </p>
        <a href="https://github.com/SaisaKoirala/sql-data-warehouse-project" target="_blank" rel="noopener">View project</a>
      </div>
      <div class="project-card">
        <h3>Relational-database-MySQL-Oracle</h3>
        <p>
          Relational database scripts from basic to advanced, practiced during
          internship tenure.
        </p>
        <a href="https://github.com/SaisaKoirala/Relational-database-MySQL-Oracle" target="_blank" rel="noopener">View project</a>
      </div>
      <div class="project-card">
        <h3>django-course-enrollment-project</h3>
        <p>
          A Django-based app for course and user management with student enrollment
          tracking and account management.
        </p>
        <a href="https://github.com/SaisaKoirala/django-course-enrollment-project" target="_blank" rel="noopener">View project</a>
      </div>
    `,
  },
  contact: {
    title: "Contact",
    html: `
      <div class="connect-grid">
        <a class="connect-card" href="https://github.com/SaisaKoirala" target="_blank" rel="noopener">
          <span class="connect-icon github" aria-hidden="true"></span>
          <span class="connect-label">GitHub</span>
          <span class="connect-value">github.com/SaisaKoirala</span>
        </a>
        <a class="connect-card" href="https://www.linkedin.com/in/saisa-koirala/" target="_blank" rel="noopener">
          <span class="connect-icon linkedin" aria-hidden="true"></span>
          <span class="connect-label">LinkedIn</span>
          <span class="connect-value">linkedin.com/in/saisa-koirala</span>
        </a>
        <a class="connect-card" href="mailto:saisakoirala01@gmail.com">
          <span class="connect-icon email" aria-hidden="true"></span>
          <span class="connect-label">Email</span>
          <span class="connect-value">saisakoirala01@gmail.com</span>
        </a>
        <a class="connect-card" href="CV.pdf" target="_blank" rel="noopener">
          <span class="connect-icon cv" aria-hidden="true"></span>
          <span class="connect-label">CV</span>
          <span class="connect-value">View CV</span>
        </a>
      </div>
    `,
  },
};

let activeIndex = -1;

const renderSuggestions = (filter = "", shouldShow = false) => {
  const filtered = suggestions.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );

  suggestionsBox.innerHTML = "";
  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.setAttribute("role", "option");
    li.addEventListener("click", () => openPanel(item));
    if (index === activeIndex) li.classList.add("active");
    suggestionsBox.appendChild(li);
  });

  if (filtered.length > 0 && shouldShow) {
    suggestionsBox.classList.add("show");
  } else {
    suggestionsBox.classList.remove("show");
  }
};

const tabs = new Map();
let activeTab = null;

const showModal = () => {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  tabsDock.classList.remove("show");
  tabsDock.setAttribute("aria-hidden", "true");
};

const minimizeModal = () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  if (tabs.size > 0) {
    tabsDock.classList.add("show");
    tabsDock.setAttribute("aria-hidden", "false");
  }
};

const activateTab = (key) => {
  const tabData = tabs.get(key);
  if (!tabData) return;
  activeTab = key;
  modalContent.innerHTML = tabData.html;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.key === key);
  });
  showModal();
};

const closeTab = (key) => {
  tabs.delete(key);
  const tabEl = tabsList.querySelector(`[data-key="${key}"]`);
  const dockEl = tabsDockList.querySelector(`[data-key="${key}"]`);
  if (tabEl) tabEl.remove();
  if (dockEl) dockEl.remove();

  const remaining = Array.from(tabs.keys());
  if (remaining.length > 0) {
    activateTab(remaining[0]);
  } else {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    tabsDock.classList.remove("show");
    tabsDock.setAttribute("aria-hidden", "true");
  }
};

const createTabElement = (key, listEl, labelText) => {
  const li = document.createElement("li");
  li.className = "tab";
  li.dataset.key = key;

  const label = document.createElement("span");
  label.textContent = labelText || key;
  li.appendChild(label);

  if (listEl === tabsList) {
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      closeTab(key);
    });
    li.appendChild(closeBtn);
  }

  li.addEventListener("click", () => activateTab(key));
  return li;
};

const openPanel = (key) => {
  const entry = contentMap[key];
  if (!entry) return;

  if (!tabs.has(key)) {
    tabs.set(key, entry);
    const labelText = entry.title || key;
    tabsList.appendChild(createTabElement(key, tabsList, labelText));
    tabsDockList.appendChild(createTabElement(key, tabsDockList, labelText));
  }

  activateTab(key);
  suggestionsBox.classList.remove("show");
};

const normalizeQuery = (value) => value.trim().toLowerCase();

const goToMaze = (query) => {
  const cleaned = normalizeQuery(query);
  const params = cleaned ? `?q=${encodeURIComponent(cleaned)}` : "";
  window.location.href = `maze.html${params}`;
};

const handleSearch = (value) => {
  const key = normalizeQuery(value);
  if (!key) return false;
  if (contentMap[key]) {
    openPanel(key);
    return true;
  }
  goToMaze(key);
  return true;
};

if (searchInput) {
  const showOnClick = () => {
    const value = searchInput.value.trim();
    renderSuggestions(value, true);
  };

  searchInput.addEventListener("click", showOnClick);
  searchInput.addEventListener("focus", showOnClick);

  searchInput.addEventListener("input", (event) => {
    activeIndex = -1;
    const shouldShow = suggestionsBox.classList.contains("show");
    renderSuggestions(event.target.value, shouldShow);
  });

  searchInput.addEventListener("keydown", (event) => {
    const items = Array.from(suggestionsBox.children);

    if (event.key === "Enter" && !suggestionsBox.classList.contains("show")) {
      event.preventDefault();
      handleSearch(searchInput.value);
      return;
    }

    if (!items.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      items.forEach((el) => el.classList.remove("active"));
      items[activeIndex].classList.add("active");
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      items.forEach((el) => el.classList.remove("active"));
      items[activeIndex].classList.add("active");
    }

    if (event.key === "Enter") {
      if (!suggestionsBox.classList.contains("show")) return;
      event.preventDefault();
      const selected = items[activeIndex] || items[0];
      if (selected) openPanel(selected.textContent);
    }
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const value = searchInput.value.trim();
    if (!handleSearch(value)) {
      renderSuggestions(value, true);
      searchInput.focus();
    }
  });
}

if (minimizeBtn) {
  minimizeBtn.addEventListener("click", minimizeModal);
}

document.addEventListener("click", (event) => {
  if (
    !suggestionsBox.contains(event.target) &&
    event.target !== searchInput
  ) {
    suggestionsBox.classList.remove("show");
  }
});

// =============================
// Theme Toggle + localStorage
// =============================
const themeToggle = document.querySelector("#themeToggle");
const storedTheme = localStorage.getItem("saisa-theme");

if (storedTheme === "dark") {
  document.body.classList.add("dark");
  if (themeToggle) themeToggle.setAttribute("aria-pressed", "true");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    localStorage.setItem("saisa-theme", isDark ? "dark" : "light");
    const icon = themeToggle.querySelector(".toggle-icon");
    if (icon) icon.textContent = isDark ? "🌙" : "☀️";
  });
}
