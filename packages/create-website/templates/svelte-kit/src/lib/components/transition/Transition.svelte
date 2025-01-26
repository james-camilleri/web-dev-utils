<script lang="ts">
  import type { Snippet } from 'svelte'

  import { fade } from 'svelte/transition'

  import { navigating } from '$app/state'

  interface Props {
    order?: number
    group?: number
    children: Snippet
  }

  let { order: manualOrder, group, children }: Props = $props()

  let element = $state<HTMLElement>()
  let order = $derived(manualOrder ?? (element && calculateOffset(element, group)))
  let delay = $derived(order && 100 * order)

  const duration = 300

  function calculateOffset(element: HTMLElement, group?: number) {
    let match = element
    if (group) {
      const firstInGroup = document.querySelector(
        `.transition-block[data-group="${group}"]`,
      ) as HTMLElement

      match = firstInGroup
    }

    return [...document.querySelectorAll('.transition-block').values()].indexOf(match)
  }
</script>

{#key order}
  <div
    in:fade={{
      delay,
      // Only animate if an internal navigation takes place.
      // This avoids the elements blinking out of existence
      // and then animating back in on first load.
      duration: navigating.type ? duration : 0
    }}
    class="transition-block"
    data-group={group}
    bind:this={element}
  >
    {@render children()}
  </div>
{/key}
