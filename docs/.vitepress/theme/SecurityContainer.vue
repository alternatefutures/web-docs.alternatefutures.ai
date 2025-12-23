<template>
  <Alert variant="default" class="security-alert border-2 border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40">
    <Lock class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
    <AlertTitle class="text-yellow-700 dark:text-yellow-400 font-bold">{{ title }}</AlertTitle>
    <AlertDescription class="text-gray-900 dark:text-gray-100 mt-2">
      <slot />
    </AlertDescription>
  </Alert>
</template>

<script setup>
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert'
import { Lock } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Security'
  }
})
</script>

<style scoped>
/* Ensure code blocks inside security alerts are visible */
:deep(pre) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  padding: 1rem !important;
  border-radius: 0.375rem !important;
  overflow-x: auto !important;
  margin: 0.5rem 0 !important;
}

:deep(.dark pre) {
  background-color: rgba(0, 0, 0, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

:deep(pre code) {
  color: #1f2937 !important;
  background: none !important;
  padding: 0 !important;
}

:deep(.dark pre code) {
  color: #f3f4f6 !important;
  background: none !important;
}

/* Inline code (backtick-wrapped text) */
:deep(:not(pre) > code) {
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: #1f2937 !important;
  padding: 2px 6px !important;
  border-radius: 0.25rem !important;
  font-size: 0.875em !important;
  font-weight: 500 !important;
}

:deep(.dark :not(pre) > code) {
  background-color: rgba(0, 0, 0, 0.4) !important;
  color: #fef3c7 !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Ensure proper spacing for content inside */
:deep(p) {
  margin-bottom: 0.75rem;
}

:deep(p:last-child) {
  margin-bottom: 0;
}

:deep(strong) {
  font-weight: 600;
}

:deep(a) {
  text-decoration: underline;
  color: #0026ff;
}

:deep(.dark a) {
  color: #5b7fff;
}
</style>
