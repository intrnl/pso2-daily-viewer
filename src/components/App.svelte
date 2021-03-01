<script context='module'>
	function getDateString () {
		let date = new Date();

		let year = date.getFullYear();
		let month = (date.getMonth() + 1).toString().padStart(2, '0');
		let day = date.getDate().toString().padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
</script>

<script>
	import ScheduleList from './ScheduleList.svelte';

	let region = 'GL';
	let date = getDateString();
</script>

<section>
	<select bind:value={region}>
		<option value='GL'>Global</option>
		<option value='JP'>Japanese</option>
	</select>
	<input type='date' bind:value={date} />
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
	h4 {
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
