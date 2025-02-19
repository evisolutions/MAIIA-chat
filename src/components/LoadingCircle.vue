<template>
  <div>
    <VueApexCharts
      id="stats-radial-bar-chart"
      :options="chartOptions"
      :series="loadingProgress"
      type="radialBar"
      :height="150"
    />

    <div class="content"></div>
  </div>
</template>

<script setup>
const loadingProgress = ref(80);

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;

  return {
    chart: { sparkline: { enabled: true } },
    colors: [currentTheme.info],
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: { size: "65%" },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "1.125rem",
            fontWeight: "500",
            offsetY: 0,
            color: `rgba(${hexToRgb(currentTheme["on-surface"])},${
              variableTheme["medium-emphasis-opacity"]
            })`,
          },
        },
        track: { background: currentTheme["track-bg"] },
      },
    },
    stroke: { lineCap: "round" },
    responsive: [
      {
        breakpoint: 450,
        options: { plotOptions: { radialBar: { hollow: { size: "52%" } } } },
      },
    ],
  };
});
</script>

<style lang="scss" scoped></style>
