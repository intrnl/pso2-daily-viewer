<script>
	import { Temporal } from 'proposal-temporal';

	export let data;

	export let region;
	export let tz;
	export let date;

	$: items = data.items;
	$: cycle = data.cycle;

	$: start = Temporal.PlainDate.from(data.start).toZonedDateTime(tz);
	$: now = date.withTimeZone(tz);

	$: diff = now.since(start, { largestUnit: 'day', smallestUnit: 'day' }).days;
	$: day = (Math.abs(diff) % cycle) + 1;

	$: filtered_items = items.filter((item) => item.schedule.includes(day));
</script>

{#each filtered_items as item}
	<li>{item.name[region]}</li>
{/each}
