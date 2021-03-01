<script>
	import { Temporal } from 'proposal-temporal';

	import ScheduleList from './ScheduleList.svelte';

	let region = 'GL';
	let date = Temporal.now.plainDateISO();

	function decrement () {
		date = date.subtract({ days: 1 });
	}

	function increment () {
		date = date.add({ days: 1 });
	}

	function today () {
		date = Temporal.now.plainDateISO();
	}
</script>

<section>
	<select bind:value={region}>
		<option value='GL'>Global [PT]</option>
		<option value='JP'>Japanese [JST]</option>
	</select>
</section>

<section>
	<button on:click={decrement}>Previous</button>
	<button on:click={increment}>Next</button>
	<button on:click={today}>Today</button>
</section>

<section>
	<span>Showing {date.toLocaleString()}</span>
</section>

<section>
	<h4>Recommended Quests</h4>
	<ul>
		<ScheduleList type='quest-exploration' region={region} date={date} />
		<ScheduleList type='quest-recommended' region={region} date={date} />
		<ScheduleList type='quest-level' region={region} date={date} />
	</ul>
</section>

<section>
	<h4>Daily Orders</h4>
	<ul>
		<ScheduleList type='orders-exploration' region={region} date={date} />
		<ScheduleList type='orders-extra' region={region} date={date} />
		<ScheduleList type='orders-daily' region={region} date={date} />
	</ul>
</section>

<style>
	section + section {
		margin-block-start: 10px;
	}

	h4 {
		margin-block-start: 10px;
		margin-block-end: 0;
	}

	ul {
		margin: 0;
		padding-inline-start: 22px;
	}

	:root {
		font-family: sans-serif;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			color-scheme: dark;
		}
	}
</style>
