<template>
  <div
    class="flex flex-1 justify-between items-center bg-white p-4 rounded-lg shadow-md"
  >
    <div class="flex items-center gap-2">
      <div class="flex items-center justify-center p-2 rounded-lg bg-gray-800">
        <UIcon name="solar:calendar-linear" class="text-white text-[1.2rem]" />
      </div>
      <UPopover>
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          {{
            modelValue
              ? df.format(modelValue.toDate(getLocalTimeZone()))
              : "Select a date"
          }}
        </UButton>

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" />
        </template>
      </UPopover>
    </div>
    <UButton
      @click="onSort()"
      class="cursor-pointer flex items-center justify-center p-2 rounded-lg bg-gray-800"
    >
      <UIcon
        :name="
          sortOptions
            ? 'solar:sort-from-bottom-to-top-broken'
            : 'solar:sort-from-top-to-bottom-broken'
        "
        class="text-white text-[1.2rem]"
      />
    </UButton>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});
const modelValue = shallowRef(new CalendarDate(2022, 1, 10));
const sortOptions = shallowRef(false);

const onSort = () => {
  sortOptions.value = !sortOptions.value;

  useTransactions().getTransactions({ sort: sortOptions.value });
};
</script>
