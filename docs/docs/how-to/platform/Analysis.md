---
sidebar_position: 9
---

# How to use analysis

This module supports defining metric in the toggle, and viewing the indicator analysis data corresponding to all groups in the toggle.

![metric analysis screenshot](/metric_analysis_en.png)

## Define metrics

"Metrics" supports 4 event types: custom conversion rate event, custom value event, page event, click event

1. Fill in the metric name
2. Fill in the metric description
3. Select the event type (custom event, page event, click event)

   - Custom events
 
     + Custom events need to choose "conversion rate" or "value" type.
     + Fill in the event name
     + Fill in "Measurement Unit" and "Winning Standard" (only for "value" type, it is required to fill in)
  
   - page events
 
     + Fill in the URL of the target page (currently 4 match types are provided: simple match, exact match, substring match, regular expression match)
   
   - click event
 
     + Fill in the URL of the target page (currently 4 match types are provided: simple match, exact match, substring match, regular expression match)
     + fill click element (input css selector)
   
4. Click to save the metric information

## "Collect data" and view metrics analysis

Once the Metrics are saved, you can start collecting metrics analytics data.

1. After clicking "Collect Data", the collection of metric analysis data can be started (at this time, you can see the sign of "Analysis Data Collection")
2. After clicking "Stop Collection", the collection of metric data will stop. The collection of indicator analysis data will end at the moment of "Stop Collection". After stopping, you can click "Collect Data" to collect analysis data.
3. Graphical display of metric analysis data

   - Table display: display the indicator analysis information of all "groups", and the group with the highest "winning probability" is the best solution.
   - Probability distribution display: By default, the probability distribution of all "groups" is displayed, which can be filtered by the inverse selection operation at the bottom

## Start collecting data while supporting toggle release

In order to ensure the integrity of the indicator analysis data, when the "indicator information has been saved" and "not in the indicator data collection", the function of "start collecting data" is provided when the toggle is released.

![publish metric screenshot](/publish_metric_en.png)

Note: When the indicator analysis data is being analyzed, modifying the content in the toggle configuration other than "information such as name and description" may affect the accuracy of the indicator analysis results.
