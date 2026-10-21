<script lang="ts">
	import type { Part } from './thread';

	let { parts }: { parts: Part[] } = $props();
</script>

{#each parts as part}{#if typeof part === 'string'}{part}{:else if 'del' in part}<del
			>{part.del}</del
		>{:else}<ins>{part.ins}</ins>{/if}{/each}

<style>
	del {
		text-decoration-thickness: 2px;
		opacity: 0.7;
	}
	ins {
		text-decoration: none;
		font-weight: 800;
		color: var(--color--success);
	}
</style>
