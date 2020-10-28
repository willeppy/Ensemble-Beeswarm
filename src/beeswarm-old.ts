export let beeswarmSpec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description:
    "A beeswarm chart example that uses a force-directed layout to group items by category.",
  width: 1000,
  height: 100,
  padding: { left: 5, right: 5, top: 0, bottom: 20 },
  autosize: "none",

  signals: [
    { name: "cx", update: "width / 2" },
    { name: "cy", update: "height / 2" },
    {
      name: "radius",
      value: 8,
      // bind: { input: "range", min: 2, max: 15, step: 1 },
    },
    {
      name: "collide",
      value: 1,
      // bind: { input: "range", min: 1, max: 10, step: 1 },
    },
    {
      name: "gravityX",
      value: 0.2,
      //bind: { input: "range", min: 0, max: 1 }
    },
    {
      name: "gravityY",
      value: 0.1,
      //bind: { input: "range", min: 0, max: 1 }
    },
    {
      name: "static",
      value: true,
      //bind: { input: "checkbox" }
    },
  ],

  data: [
    {
      name: "groups",
      url: "miserables.json",
      format: { type: "json", property: "groups" },
    },
  ],

  scales: [
    {
      name: "xscale",
      type: "linear",
      domain: [0, 100],
      padding: 30,
      // domain: {
      //   data: "groups",
      //   field: "metric",
      //   sort: true,
      // },
      range: "width",
    },
    {
      name: "color",
      type: "linear",
      domain: { data: "groups", field: "metric" },
      range: { scheme: "redyellowblue" },
    },
  ],

  axes: [{ orient: "bottom", scale: "xscale", text: "metric" }],

  marks: [
    {
      name: "nodes",
      type: "symbol",
      from: { data: "groups" },
      encode: {
        enter: {
          tooltip: { signal: "datum.group" },
          fill: { scale: "color", field: "metric" },
          xfocus: { scale: "xscale", field: "metric", band: 0.5 },
          yfocus: { signal: "cy" },
        },
        update: {
          size: { signal: "pow(2 * radius, 2)" },
          stroke: { value: "white" },
          strokeWidth: { value: 1 },
          zindex: { value: 0 },
        },
        hover: {
          stroke: { value: "purple" },
          strokeWidth: { value: 3 },
          zindex: { value: 1 },
        },
      },
      transform: [
        {
          type: "force",
          iterations: 300,
          // static: { signal: "static" },
          forces: [
            {
              force: "collide",
              iterations: { signal: "collide" },
              radius: { signal: "radius" },
            },
            { force: "x", x: "xfocus", strength: { signal: "gravityX" } },
            { force: "y", y: "yfocus", strength: { signal: "gravityY" } },
          ],
        },
      ],
    },
  ],
};
