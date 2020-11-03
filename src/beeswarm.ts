export let beeswarmSpec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A beeswarm chart example that uses a force-directed layout to group items by category.",
    "width": 700,
    "height": 300,
    "padding": {"left": 5, "right": 5, "top": 0, "bottom": 20},
    "signals": [
      {"name": "cx", "update": "width / 2"},
      {"name": "cy", "update": "height / 2"}
    ],
    "data": [
      { "name": "vals"},
      {"name": "mo_av"}
    ],
    "scales": [
      {
        "name": "xscale",
        "type": "linear",
        "domain": [0, 1],
        "padding": 50,
        "range": "width"
      },
      {
        "name": "color",
        "type": "linear",
        "domain": {"data": "vals", "field": "data"},
        "range": {"scheme": "redyellowgreen"}
      }
    ],
    "axes": [{"orient": "bottom", "scale": "xscale"}],
    "marks": [
      {
        "name": "model_mean_rule",
        "type": "rule",
        "style": ["rule"],
        "from": {"data": "mo_av"},
        "encode": {
          "enter": {
            "tooltip": {"signal": "datum.data"}
          },
          "update": {
            "stroke": {"value": "grey"},
            "strokeDash": {"value": [4,2]},
            "x": { "scale":"xscale", "field":"data"},
            "y": {"value": 0},
            "y2": {"field": {"group": "height"}},
            "strokeWidth": {"value": 1}
          }
        }
      },
      {
        "name": "nodes",
        "type": "symbol",
        "from": {"data": "vals"},
        "encode": {
          "enter": {
            "tooltip": {"signal": "datum.data"},
            "fill": {"scale": "color", "field": "data"},
            "xfocus": {"scale": "xscale", "field": "data", "band": 0.5},
            "yfocus": {"signal": "cy"}
          },
          "update": {
            "size": {"signal": "pow(10, 2)"},
            "stroke": {"value": "white"},
            "strokeWidth": {"value": 1},
            "zindex": {"value": 0}
          },
          "hover": {
            "stroke": {"value": "black"},
            "strokeWidth": {"value": 3},
            "zindex": {"value": 1}
          }
        },
        "transform": [
          {
            "type": "force",
            "iterations": 300,
            "forces": [
              {"force": "collide", "iterations": 1, "radius": 5},
              {"force": "x", "x": "xfocus", "strength": 0.75},
              {"force": "y", "y": "yfocus", "strength": 0.15}
            ]
          }
        ]
      }
      
    ]
  }