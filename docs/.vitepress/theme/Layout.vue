<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Content, useData, useRoute, useRouter } from "vitepress";
import iconData from "../data/icons.generated.json";
import categoryData from "../data/categories.generated.json";
import SvgIcon from "./SvgIcon";
import { searchIcons } from "./search";

type IconRecord = (typeof iconData)[number];

const route = useRoute();
const router = useRouter();
const { frontmatter } = useData();
const query = ref("");
const activeCategory = ref("all");
const codeTab = ref<"svg" | "react">("react");
const copied = ref("");
const customizer = reactive({
  color: "#08758a",
  strokeWidth: 2,
  size: 24,
  absoluteStrokeWidth: false,
});

const normalizedPath = computed(() => route.path.replace(/\/$/, "") || "/");
const isHome = computed(() => normalizedPath.value === "/");
const isCatalog = computed(() => normalizedPath.value === "/icons");
const iconName = computed(() =>
  normalizedPath.value.startsWith("/icons/")
    ? normalizedPath.value.slice(7)
    : "",
);
const selectedIcon = computed(() =>
  iconData.find((icon) => icon.name === iconName.value),
);
const isDocumentation = computed(
  () => !isHome.value && !isCatalog.value && !selectedIcon.value,
);
const filteredIcons = computed(() =>
  searchIcons(iconData, query.value, activeCategory.value),
);
const relatedIcons = computed(() => {
  if (!selectedIcon.value) return [];
  return iconData
    .filter(
      (icon) =>
        icon.name !== selectedIcon.value?.name &&
        icon.categories.some((category) =>
          selectedIcon.value?.categories.includes(category),
        ),
    )
    .slice(0, 6);
});

function navigate(path: string) {
  router.go(path);
}

function browseSearch() {
  navigate("/icons");
}

function customizedSvg(icon: IconRecord) {
  const strokeWidth = customizer.absoluteStrokeWidth
    ? (customizer.strokeWidth * 24) / customizer.size
    : customizer.strokeWidth;
  return icon.svg
    .replace(/width="24"/, `width="${customizer.size}"`)
    .replace(/height="24"/, `height="${customizer.size}"`)
    .replace('stroke="currentColor"', `stroke="${customizer.color}"`)
    .replace('stroke-width="2"', `stroke-width="${strokeWidth}"`);
}

function jsxSnippet(icon: IconRecord) {
  return `import { ${icon.componentName} } from "@medhuelabs/openhuman-icons-react";\n\n<${icon.componentName} />`;
}

async function copyText(text: string, action: string) {
  await navigator.clipboard.writeText(text);
  copied.value = action;
  window.setTimeout(() => {
    if (copied.value === action) copied.value = "";
  }, 1600);
}

function downloadSvg(icon: IconRecord) {
  const blob = new Blob([customizedSvg(icon)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${icon.name}.svg`;
  anchor.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="site-frame">
    <header class="site-header">
      <a class="brand" href="/" @click.prevent="navigate('/')">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <path
              d="M16 27c-6-3.4-10-7.3-10-12a5.2 5.2 0 0 1 10-2 5.2 5.2 0 0 1 10 2c0 4.7-4 8.6-10 12Z"
            />
            <path d="M9 17h4l1.6-3.7 3 7 1.6-3.3H23" />
          </svg>
        </span>
        <span>OpenHuman Icons</span>
      </a>
      <nav aria-label="Primary">
        <a
          :class="{ active: normalizedPath.startsWith('/icons') }"
          href="/icons"
          @click.prevent="navigate('/icons')"
          >Icons</a
        >
        <a
          :class="{ active: normalizedPath.startsWith('/guide') }"
          href="/guide"
          @click.prevent="navigate('/guide')"
          >Guide</a
        >
        <a
          :class="{ active: normalizedPath === '/packages' }"
          href="/packages"
          @click.prevent="navigate('/packages')"
          >Packages</a
        >
        <a href="https://github.com/medhuelabs/openhuman-icons"
          >GitHub <span aria-hidden="true">↗</span></a
        >
      </nav>
    </header>

    <main v-if="isHome" class="home-page">
      <section class="hero page-width">
        <div class="hero-copy">
          <h1>Medical icons for human-centered software</h1>
          <p>
            Open-source SVG icons designed for anatomy, clinical, and health
            applications.
          </p>
          <div class="button-row">
            <a
              class="button primary"
              href="/icons"
              @click.prevent="navigate('/icons')"
              >Browse icons <span>→</span></a
            >
            <a
              class="button secondary"
              href="/guide"
              @click.prevent="navigate('/guide')"
              >Read the guide</a
            >
          </div>
        </div>
        <div class="hero-icon-grid" aria-label="Sample medical icons">
          <SvgIcon
            v-for="icon in iconData.slice(0, 12)"
            :key="icon.name"
            :nodes="icon.nodes"
            :size="47"
            color="#071a43"
          />
        </div>
      </section>
      <form class="home-search page-width" @submit.prevent="browseSearch">
        <span class="search-glyph">⌕</span>
        <input
          v-model="query"
          aria-label="Search medical icons"
          placeholder="Search medical icons..."
        />
        <span class="shortcut">⌘K</span>
      </form>
      <section class="feature-row page-width">
        <div class="feature-copy">
          <h2>Designed for<br />medical products</h2>
          <p>
            A consistent 24px outline system for anatomy, diagnostics, devices,
            procedures, and more.
          </p>
          <a href="/icons" @click.prevent="navigate('/icons')"
            >Browse all icons <span>→</span></a
          >
        </div>
        <div class="sample-grid">
          <a
            v-for="icon in iconData.slice(0, 12)"
            :key="icon.name"
            :href="`/icons/${icon.name}`"
            @click.prevent="navigate(`/icons/${icon.name}`)"
          >
            <SvgIcon :nodes="icon.nodes" :size="38" color="#071a43" />
            <span>{{ icon.name }}</span>
          </a>
        </div>
      </section>
      <section class="packages-row page-width">
        <div class="feature-copy">
          <h2>Use them anywhere</h2>
          <p>
            Install the packages you need and start using icons in your project.
          </p>
          <a href="/packages" @click.prevent="navigate('/packages')"
            >View all packages <span>→</span></a
          >
        </div>
        <div class="package-card">
          <strong>@medhuelabs/openhuman-icons</strong>
          <p>SVG icon set and utilities.</p>
          <code>pnpm add @medhuelabs/openhuman-icons</code>
        </div>
        <div class="package-card">
          <strong>@medhuelabs/openhuman-icons-react</strong>
          <p>React components for all icons.</p>
          <code>pnpm add @medhuelabs/openhuman-icons-react</code>
        </div>
      </section>
    </main>

    <main
      v-else-if="isCatalog || selectedIcon"
      class="catalog-layout page-width"
    >
      <aside class="sidebar">
        <h2>Customizer</h2>
        <label>Color <input v-model="customizer.color" type="color" /></label>
        <label
          >Stroke width <output>{{ customizer.strokeWidth }}</output
          ><input
            v-model.number="customizer.strokeWidth"
            type="range"
            min="1"
            max="4"
            step="0.25"
        /></label>
        <label
          >Size <output>{{ customizer.size }}</output
          ><input
            v-model.number="customizer.size"
            type="range"
            min="16"
            max="128"
            step="1"
        /></label>
        <label class="checkbox-row"
          ><input v-model="customizer.absoluteStrokeWidth" type="checkbox" />
          Absolute stroke width</label
        >
        <p class="sidebar-help">Keep stroke width fixed when resizing icons.</p>
        <hr />
        <h2>Categories</h2>
        <button
          :class="{ selected: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          All icons
        </button>
        <button
          v-for="category in categoryData"
          :key="category.name"
          :class="{ selected: activeCategory === category.name }"
          @click="activeCategory = category.name"
        >
          {{ category.title }}
        </button>
      </aside>

      <section v-if="isCatalog" class="catalog-content">
        <h1>Medical icons for human-centered software</h1>
        <p class="lead">
          Open-source SVG icons designed for anatomy, clinical, and health
          applications.
        </p>
        <div class="catalog-title-row">
          <h2>
            {{
              activeCategory === "all"
                ? "All icons"
                : categoryData.find(
                    (category) => category.name === activeCategory,
                  )?.title
            }}
          </h2>
          <span>{{ filteredIcons.length }} icons</span>
        </div>
        <div class="catalog-search">
          <span>⌕</span
          ><input
            v-model="query"
            placeholder="Search medical icons..."
            aria-label="Search medical icons"
          />
        </div>
        <div class="icon-grid">
          <a
            v-for="icon in filteredIcons"
            :key="icon.name"
            class="icon-tile"
            :href="`/icons/${icon.name}`"
            @click.prevent="navigate(`/icons/${icon.name}`)"
          >
            <SvgIcon
              :nodes="icon.nodes"
              :size="customizer.size"
              :color="customizer.color"
              :stroke-width="customizer.strokeWidth"
              :absolute-stroke-width="customizer.absoluteStrokeWidth"
            />
            <span>{{ icon.name }}</span>
            <button
              class="tile-copy"
              title="Copy SVG"
              @click.prevent.stop="
                copyText(customizedSvg(icon), `tile-${icon.name}`)
              "
            >
              ⧉
            </button>
          </a>
        </div>
      </section>

      <section v-else-if="selectedIcon" class="detail-content">
        <div class="detail-heading">
          <div>
            <h1>{{ selectedIcon.name }}</h1>
            <div class="tag-row">
              <span v-for="tag in selectedIcon.tags" :key="tag">{{ tag }}</span>
            </div>
            <p>
              Categories:
              <a
                v-for="category in selectedIcon.categories"
                :key="category"
                href="/icons"
                @click.prevent="
                  activeCategory = category;
                  navigate('/icons');
                "
                >{{ category }}</a
              >
            </p>
          </div>
          <div class="button-row">
            <button
              class="button secondary"
              @click="copyText(customizedSvg(selectedIcon), 'svg')"
            >
              {{ copied === "svg" ? "Copied" : "Copy SVG" }}
            </button>
            <button
              class="button secondary"
              @click="copyText(jsxSnippet(selectedIcon), 'jsx')"
            >
              {{ copied === "jsx" ? "Copied" : "Copy JSX" }}
            </button>
            <button class="button primary" @click="downloadSvg(selectedIcon)">
              Download SVG
            </button>
          </div>
        </div>
        <div class="preview-row">
          <div class="icon-preview">
            <SvgIcon
              :nodes="selectedIcon.nodes"
              :size="Math.max(customizer.size, 180)"
              :color="customizer.color"
              :stroke-width="customizer.strokeWidth"
              :absolute-stroke-width="customizer.absoluteStrokeWidth"
              :label="selectedIcon.name"
            />
          </div>
          <dl>
            <div>
              <dt>ViewBox</dt>
              <dd>24 × 24</dd>
            </div>
            <div>
              <dt>Stroke</dt>
              <dd>currentColor</dd>
            </div>
            <div>
              <dt>Stroke width</dt>
              <dd>{{ customizer.strokeWidth }}</dd>
            </div>
            <div>
              <dt>Linecap / Linejoin</dt>
              <dd>round / round</dd>
            </div>
            <div>
              <dt>Fill</dt>
              <dd>none</dd>
            </div>
          </dl>
        </div>
        <section class="usage">
          <h2>Use this icon</h2>
          <div class="tabs">
            <button
              :class="{ active: codeTab === 'svg' }"
              @click="codeTab = 'svg'"
            >
              SVG</button
            ><button
              :class="{ active: codeTab === 'react' }"
              @click="codeTab = 'react'"
            >
              React
            </button>
          </div>
          <pre><code>{{ codeTab === "react" ? jsxSnippet(selectedIcon) : customizedSvg(selectedIcon) }}</code></pre>
        </section>
        <section class="related">
          <h2>More icons like this</h2>
          <div class="related-grid">
            <a
              v-for="icon in relatedIcons"
              :key="icon.name"
              :href="`/icons/${icon.name}`"
              @click.prevent="navigate(`/icons/${icon.name}`)"
            >
              <SvgIcon :nodes="icon.nodes" :size="40" color="#071a43" />
              <span>{{ icon.name }}</span>
            </a>
          </div>
        </section>
      </section>
    </main>

    <main v-else-if="isDocumentation" class="docs-page page-width">
      <Content />
    </main>

    <footer class="site-footer">
      <div><strong>OpenHuman Icons</strong><span>MedHue Labs</span></div>
      <div>
        Open source under the
        <a href="/license" @click.prevent="navigate('/license')">ISC License</a
        >.
      </div>
      <a href="https://github.com/medhuelabs/openhuman-icons">GitHub ↗</a>
    </footer>
  </div>
</template>
