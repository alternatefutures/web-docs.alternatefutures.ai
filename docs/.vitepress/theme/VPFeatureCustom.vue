<template>
  <Card :class="cn('relative transition-all hover:border-primary', feature.status && 'opacity-60 pointer-events-none')">
    <Badge
      v-if="feature.status === 'coming-soon'"
      class="absolute top-3 right-3 bg-muted text-muted-foreground"
    >
      COMING SOON
    </Badge>
    <Badge
      v-if="feature.status === 'in-progress'"
      class="absolute top-3 right-3 bg-accent text-accent-foreground"
    >
      IN PROGRESS
    </Badge>

    <CardHeader>
      <div class="flex items-start gap-4">
        <div class="text-5xl text-primary flex-shrink-0">
          {{ feature.icon }}
        </div>
        <div class="flex-1">
          <CardTitle class="text-2xl mb-2">{{ feature.title }}</CardTitle>
          <CardDescription class="text-base leading-relaxed">
            {{ feature.details }}
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardFooter v-if="feature.link && !feature.status">
      <a
        :href="feature.link"
        class="text-primary font-medium hover:underline inline-flex items-center gap-1"
      >
        {{ feature.linkText || 'Learn more' }}
        <span aria-hidden="true">→</span>
      </a>
    </CardFooter>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { cn } from './lib/utils'

defineProps({
  feature: {
    type: Object,
    required: true
  }
})
</script>
