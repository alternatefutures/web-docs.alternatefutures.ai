<template>
  <Alert variant="default" class="border-2 border-yellow-600 bg-yellow-50 dark:bg-yellow-950/20">
    <Lock class="h-5 w-5 text-yellow-600" />
    <AlertTitle class="text-yellow-600 font-bold">{{ title }}</AlertTitle>
    <AlertDescription class="text-foreground mt-2">
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
