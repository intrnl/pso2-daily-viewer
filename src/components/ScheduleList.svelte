<script context='module'>
	let collator = new Intl.Collator();
</script>

<script>
	import { Temporal } from 'proposal-temporal';

	export let type;
	export let region;
	export let date;

	function fetchData () {
		return fetch(`https://raw.githubusercontent.com/intrnl/pso2-daily-schedule/trunk/data/${type}.json`)
			.then((resp) => resp.json());
	}

	function filterItems (data, region, date) {
		let tz = region == 'JP' ? 'Asia/Tokyo' : region == 'GL' ? 'America/Los_Angeles' : null;

		let start = Temporal.PlainDate.from(data.start).toZonedDateTime(tz);
		let now = Temporal.PlainDate.from(date).toZonedDateTime(Temporal.now.timeZone()).withTimeZone(tz);

		let cycle = data.cycle;
		let items = data.items;

		let diff = now.since(start, { largestUnit: 'day', smallestUnit: 'day' }).days;
		let day = (Math.abs(diff) % cycle) + 1;

		return items.filter((item) => item.schedule.includes(day));
	}

	$: promise = fetchData();
</script>

{#await promise}
	<div>Fetching <code>{type}</code></div>
{:then data}
	{#each filterItems(data, region, date) as item}
		<li>{item.name[region.toLowerCase()]}</li>
	{/each}
{:catch err}
	<div>Failed to fetch <code>{type}</code></div>
	<button on:click={fetchData}>Retry</button>
{/await}

