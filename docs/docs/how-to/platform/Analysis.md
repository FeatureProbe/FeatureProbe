---
sidebar_position: 9
---

# How to use analysis

This module supports defining metric in the toggle, and viewing the metric analysis data corresponding to all groups in the toggle.

![metric analysis screenshot](/metric_analysis_en.png)

## Define metrics

"Metrics" supports 4 event types: custom conversion event, custom numeric event, page event, click event

1. Fill in the metric name
2. Fill in the metric description
3. Select the event type (custom event, page event, click event)

   - Custom events
 
     + Custom events need to choose "conversion" or "numeric" type.
     + Fill in the event name
     + Fill in "Measurement Unit" and "Winning Standard" (only for "numeric" type, it is required to fill in)
  
   - page events
 
     + Fill in the URL of the target page (currently 4 match types are provided: simple match, exact match, substring match, regular expression match)
   
   - click event
 
     + Fill in the URL of the target page (currently 4 match types are provided: simple match, exact match, substring match, regular expression match)
     + fill click target (input a CSS selector)
   
4. Click to save the metric information

## "Start iteration" and view metrics analysis

Once the Metrics are saved, you can Start iteration metrics analytics data.

1. After clicking "Start iteration", the collection of metric analysis data can be started (at this time, you can see the sign of "Collection Data ")
2. After clicking "Stop iteration", the collection of metric data will stop. The collection of metric analysis data will end at the moment of "Stop iteration". After stopping, you can click "Start iteration" to collect analysis data.
3. Graphical display of metric analysis data

   - Table display: display the metric analysis information of all "variations", and the variation with the highest "winning probability" is the best solution.
   - Probability distribution display: By default, the probability distribution of all "variations" is displayed, which can be filtered by the inverse selection operation at the bottom

## Start collecting data while publishing toggle release

In order to ensure the integrity of the metric analysis data, when the "metric information has been saved" and not in the "Collection Data", the function of "start data collecting" is provided when the toggle is published.

![publish metric screenshot](/publish_metric_en.png)

Note: When the metric analysis data is being analyzed, modifying the content in the toggle targeting other than "information such as name and description" may affect the accuracy of the metric analysis results.
