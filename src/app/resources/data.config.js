const chart = {
  variant: "flat", // flat | gradient | outline
  mode: "sequential", // categorical | divergent | sequential
  height: 24, // default chart height
  axisLine: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
  },
  tickLine: false,
};

export { chart };