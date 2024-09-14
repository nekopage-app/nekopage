<script lang="ts">
	import { onMount } from "svelte";

	let { settings }: { settings: WidgetSettings } = $props();

    let tableRow: HTMLTableRowElement;
    let tableBody: HTMLTableSectionElement;

    let weekNumber = $state("Week ??");
    let monthYear = $state("???");

    // Creates the table row and set it as the variable
	function createTableRow() {
		tableRow = document.createElement('tr');
		tableBody.appendChild(tableRow);
	}

	function createTableCell(text: string, className?: string, insertBefore?: boolean) {
		const tableCell = document.createElement('td');
		tableCell.innerText = text;

		if (className) {
			tableCell.className = className;
		}

		if (insertBefore) {
			tableRow.insertBefore(tableCell, tableRow.firstChild);
		} else {
			tableRow.appendChild(tableCell);
		}
	}

	// Function to fill in the remaining days from other months to complete the week
	function fillRemaining(startingPoint: number) {
		// Get the amount of remaining cells to fill
		const remaining = 6 - tableRow.children.length;

		// Loop through every day to fill the week.
		for (let i = startingPoint; i <= remaining + startingPoint; i++) {
			createTableCell(i.toString(), 'other-month');
		}
	}

    onMount(() => {
        // Current date
		const date = new Date();
		// getMonth() starts at 0 so we add 1 to get the correct month
		const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

		//#region text
		const firstDayYearDate = new Date(date.getFullYear(), 0, 1);
		// Calculate the number of days passed in the year so far
		const daysPassed = Math.floor((date.valueOf() - firstDayYearDate.valueOf()) / (24 * 60 * 60 * 1000));

		// Set the week text to the calculation rounded up
		weekNumber = `Week ${Math.ceil(daysPassed / 7)}`;
		// Format month and year for the text
		monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
		//#endregion

		createTableRow();

		// Loop through each day of the current month
		for (let day = 1; day <= daysInMonth; day++) {
			// Create a date object for the current day in the loop
			const currentDayDate = new Date(date.getFullYear(), date.getMonth(), day);

			// If it is the first day of the month, fill in the previous days of the week(s)
			if (day == 1) {
				// Temporary date to get the amount of days to fill in for the week
				let tempDate = new Date(date.getFullYear(), date.getMonth(), 1);

				// Run this code until it is Monday
				do {
					// Move back a day
					tempDate.setDate(tempDate.getDate() - 1);

					// Create table cell with "other-month" class and insert it before the first child
					createTableCell(tempDate.getDate().toString(), 'other-month', true);
				} while (tempDate.getDay() != 1);
			}

			// If the current day is a Monday, create a new row
			if (currentDayDate.getDay() == 1) createTableRow();

			// If the day in the loop is the current day of the month
			if (day == date.getDate()) {
				// Create table cell with "selected" class
				createTableCell(day.toString(), 'selected');
			} else {
				// If not, create table cell of the current date without a class
				createTableCell(day.toString());
			}

			// If it is the last day of the month, fill in the remaining days of the week
			if (day == daysInMonth) {
				if (tableBody.children.length == 6) {
					fillRemaining(1);
				} else {
					fillRemaining(1); // Add days from next month

					// Since there is not 6 rows yet we have to add another row of the next month's days starting from the last table cell's text.
					// Calculate the starting point for the remaining days
					const startingPoint = tableRow.querySelectorAll('td.other-month').length + 1;

					createTableRow();
					fillRemaining(startingPoint);
				}
			}
		}

		return;
    });
</script>

<div id="calendar" class="widget">
    <h1>{settings.title}</h1>

    <div class="widget-inner">
        <div class="flex items-center justify-between px-4 h-12">
            <span class="font-semibold">{weekNumber}</span>
            <span class="font-medium">{monthYear}</span>
        </div>

        <table class="w-full h-56 table-fixed">
            <thead>
                <tr class="text-overlay text-xs">
                    <th>Mo</th>
					<th>Tu</th>
					<th>We</th>
					<th>Th</th>
					<th>Fr</th>
					<th>Sa</th>
					<th>Su</th>
                </tr>
            </thead>

            <tbody bind:this={tableBody}></tbody>
        </table>
    </div>
</div>

<style lang="postcss">
    :global(tr) {
        @apply text-text text-[0.85rem] text-center;
    }

    :global(td) {
        @apply rounded-sm transition-colors duration-75 hover:bg-base hover:text-text hover:outline-dashed hover:outline-1 hover:outline-overlay;
    }

    :global(.other-month) {
		@apply text-overlay;
	}

	:global(.selected) {
        @apply bg-text text-crust;
	}
</style>