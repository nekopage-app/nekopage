<script lang="ts">
	import { showSettings, showSettingsButton } from '$lib/stores';

    function enterLayoutEditor() {
        showSettings.set(false);
        showSettingsButton.set(false);
    }
</script>

<button class="button" onclick={enterLayoutEditor}>Edit Layout</button>

<hr>