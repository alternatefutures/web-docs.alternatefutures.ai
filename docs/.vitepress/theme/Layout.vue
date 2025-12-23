<script setup>
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, watch } from 'vue'

const { Layout } = DefaultTheme
const route = useRoute()

const updateLangForActiveTab = (group) => {
  const tabs = group.querySelector('.tabs')
  const langInTabs = tabs?.querySelector('.lang-moved')

  if (!langInTabs) return

  // Find the checked radio input
  const checkedInput = tabs.querySelector('input[type="radio"]:checked')
  if (!checkedInput) return

  // Get the index from the input's id or by finding its position
  const allInputs = Array.from(tabs.querySelectorAll('input[type="radio"]'))
  const activeIndex = allInputs.indexOf(checkedInput)

  // Find all code blocks in this group
  const codeBlocks = Array.from(group.querySelectorAll('div[class*="language-"]'))

  console.log('[Layout] Active tab index:', activeIndex, 'Total blocks:', codeBlocks.length)

  if (codeBlocks[activeIndex]) {
    const activeLangSpan = codeBlocks[activeIndex].querySelector('span.lang')
    if (activeLangSpan) {
      // Update the visible lang tag with the active tab's language
      const newLang = activeLangSpan.textContent
      console.log('[Layout] Updating lang from', langInTabs.textContent, 'to', newLang)
      langInTabs.textContent = newLang
    }
  }
}

const setupTabListeners = () => {
  const codeGroups = document.querySelectorAll('.vp-code-group')

  codeGroups.forEach(group => {
    if (group.dataset.listenersAdded === 'true') return

    const tabs = group.querySelector('.tabs')
    if (!tabs) return

    console.log('[Layout] Setting up listeners for code group')

    // Listen for clicks on tab labels and inputs
    const tabInputs = tabs.querySelectorAll('input[type="radio"]')
    console.log('[Layout] Found', tabInputs.length, 'tab inputs')

    tabInputs.forEach((input, index) => {
      input.addEventListener('change', (e) => {
        console.log('[Layout] Tab changed, input index:', index)
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
          updateLangForActiveTab(group)
        }, 0)
      })

      // Also listen for click events
      input.addEventListener('click', (e) => {
        console.log('[Layout] Tab clicked, input index:', index)
        setTimeout(() => {
          updateLangForActiveTab(group)
        }, 0)
      })
    })

    // Also listen for clicks on labels
    const labels = tabs.querySelectorAll('label')
    labels.forEach((label, index) => {
      label.addEventListener('click', () => {
        console.log('[Layout] Label clicked, index:', index)
        setTimeout(() => {
          updateLangForActiveTab(group)
        }, 50)
      })
    })

    group.dataset.listenersAdded = 'true'
  })
}

const moveLangToTabs = () => {
  nextTick(() => {
    // Handle code groups with tabs
    const codeGroups = document.querySelectorAll('.vp-code-group')

    codeGroups.forEach(group => {
      const tabs = group.querySelector('.tabs')
      const codeBlocks = group.querySelectorAll('div[class*="language-"]')

      if (tabs && codeBlocks.length > 0 && !tabs.querySelector('.lang-moved')) {
        // Get the first (default active) code block's lang
        const firstLangSpan = codeBlocks[0]?.querySelector('span.lang')

        if (firstLangSpan) {
          // Clone and move to tabs
          const langClone = firstLangSpan.cloneNode(true)
          langClone.classList.add('lang-moved')
          langClone.style.display = 'inline-block'
          langClone.style.opacity = '1'
          langClone.style.visibility = 'visible'
          tabs.appendChild(langClone)

          // Hide all original lang spans
          codeBlocks.forEach(block => {
            const langSpan = block.querySelector('span.lang')
            if (langSpan) langSpan.style.display = 'none'
          })
        }
      }
    })

    // Handle standalone code blocks - create a tab bar
    const allCodeBlocks = document.querySelectorAll('div[class*="language-"]')

    allCodeBlocks.forEach(block => {
      // Skip if already processed or inside a code group
      if (block.dataset.tabsAdded === 'true' || block.closest('.vp-code-group')) {
        return
      }

      const langSpan = block.querySelector('span.lang')
      if (!langSpan) return

      // Create a tabs-like bar
      const tabBar = document.createElement('div')
      tabBar.className = 'code-tabs-bar'

      const langClone = langSpan.cloneNode(true)
      langClone.classList.add('lang-moved')
      langClone.style.display = 'inline-block'
      langClone.style.opacity = '1'
      langClone.style.visibility = 'visible'
      tabBar.appendChild(langClone)

      // Insert before the code block
      block.parentNode.insertBefore(tabBar, block)

      // Hide original
      langSpan.style.display = 'none'

      block.dataset.tabsAdded = 'true'
    })

    // Setup tab change listeners
    setupTabListeners()
  })
}

onMounted(() => {
  console.log('[Layout] Component mounted')
  moveLangToTabs()

  // Run again after delays to catch late-rendering content
  setTimeout(moveLangToTabs, 100)
  setTimeout(moveLangToTabs, 500)
  setTimeout(moveLangToTabs, 1000)
  setTimeout(moveLangToTabs, 2000)
})

// Watch for route changes
watch(() => route.path, () => {
  console.log('[Layout] Route changed to:', route.path)
  setTimeout(moveLangToTabs, 100)
  setTimeout(moveLangToTabs, 500)
})
</script>

<template>
  <Layout>
    <template #home-hero-info-before>
      <div class="hero-wordmark">
        <img src="/wordmark.svg" alt="Alternate Futures" class="wordmark-img" />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.hero-wordmark {
  display: flex;
  justify-content: center;
  margin-bottom: calc(1.5rem + 15px);
}

.wordmark-img {
  height: 72px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

@media (min-width: 640px) {
  .wordmark-img {
    height: 88px;
  }
}

@media (min-width: 960px) {
  .wordmark-img {
    height: 100px;
  }
}
</style>
