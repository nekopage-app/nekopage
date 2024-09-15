<script lang="ts">
	import { inLayoutEditor, showSettings, showSettingsButton } from '$lib/stores';

    function enterLayoutEditor() {
        showSettings.set(false);
        showSettingsButton.set(false);
        inLayoutEditor.set(true);
    }
</script>

<button class="button" onclick={enterLayoutEditor}>Edit Layout</button>

<hr>