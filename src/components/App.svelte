<script>
	import { Temporal } from 'proposal-temporal';

	import ScheduleList from './ScheduleList.svelte';

	function get (type) {
		return fetch(`https://raw.githubusercontent.com/intrnl/pso2-daily-schedule/trunk/data/${type}.json`)
			.then((resp) => resp.json());
	}

	function refetch () {
		return Promise.all([
			get('quest-exploration'),
			get('quest-recommended'),
			get('quest-level'),
			get('orders-exploration'),
			get('orders-daily'),
			get('orders-extra'),
		]);
	}

	let data = refetch();

	let region = 'gl';
	$: tz = region == 'jp' ? 'Asia/Tokyo' : region == 'gl' ? 'America/Los_Angeles' : null;
	$: date = Temporal.now.zonedDateTimeISO(tz);

	function decrement () {
		date = date.subtract({ days: 1 });
	}

	function increment () {
		date = date.add({ days: 1 });
	}

	function today () {
		date = Temporal.now.zonedDateTimeISO(tz);
	}
</script>

<section>
	<select bind:value={region}>
		<option value='gl'>Global [PT]</option>
		<option value='jp'>Japanese [JST]</option>
	</select>
</section>

<section>
	<button on:click={decrement}>Previous</button>
	<button on:click={increment}>Next</button>
	<button on:click={today}>Today</button>
</section>

<section>
	Showing {date.toLocaleString()}
</section>

{#await data}
	<section>
		<span>Fetching data</span>
	</section>
{:then [q_exp, q_rec, q_lvl, o_exp, o_dly, o_ext]}
	<section>
		<h4>Recommended Quests</h4>
		<ul>
			<ScheduleList data={q_exp} region={region} tz={tz} date={date} />
			<ScheduleList data={q_rec} region={region} tz={tz} date={date} />
			<ScheduleList data={q_lvl} region={region} tz={tz} date={date} />
		</ul>
	</section>
	<section>
		<h4>Daily Orders</h4>
		<ul>
			<ScheduleList data={o_exp} region={region} tz={tz} date={date} />
			<ScheduleList data={o_dly} region={region} tz={tz} date={date} />
			<ScheduleList data={o_ext} region={region} tz={tz} date={date} />
		</ul>
	</section>
{:catch err}
	<section>
		<div>Failed to fetch data</div>
		<button on:click={data = refetch()}>Retry</button>
	</section>
{/await}

<style>
	section + section {
		margin-block-start: 10px;
	}

	h4 {
		margin-block: 0;
	}

	ul {
		margin-block: 0;
		padding-inline: 22px;
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
