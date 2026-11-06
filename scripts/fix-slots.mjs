import fs from 'fs';

// Fix checkout.vue
let co = fs.readFileSync('app/pages/checkout.vue', 'utf8');
co = co.replace('window.location.href = d.paymentUrl;', 'window.location.href = (d.paymentUrl as string);');
fs.writeFileSync('app/pages/checkout.vue', co, 'utf8');

// Fix UDashboardChart.vue
let ch = fs.readFileSync('app/components/dashboard/UDashboardChart.vue', 'utf8');
ch = ch.replace(
  'const hoveredIndex = ref<number | null>(null);',
  'const hoveredIndex = ref<number | null>(null);\nconst hoveredPoint = computed(() => (hoveredIndex.value !== null && points.value[hoveredIndex.value]) ? points.value[hoveredIndex.value] : null);'
);
ch = ch.replace(
  'v-if="hoveredIndex !== null && points[hoveredIndex]"',
  'v-if="hoveredPoint"'
);
ch = ch.replace(
  '{{ (points[hoveredIndex] as any)?.original?.date }}:',
  '{{ hoveredPoint?.original.date }}:'
);
ch = ch.replace(
  '{{ formatVal(points[hoveredIndex]?.val ?? 0) }}',
  '{{ formatVal(hoveredPoint?.val ?? 0) }}'
);
fs.writeFileSync('app/components/dashboard/UDashboardChart.vue', ch, 'utf8');

console.log('Fixed checkout and chart successfully.');
