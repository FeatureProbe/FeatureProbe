---
sidebar_position: 10
---

# How to use Event tracker

Event Tracker provides a way for developers to test and verify behavior such as toggles, verifying that reporting is as expected. The main usage scenarios cover issues such as error troubleshooting, data inspection after access, toggle change tracking, and performance optimization.

## Open Event Tracker
If you want to use the event tracker, you need to manually click the "Enable" button. After it is turned on, all "Toggle Events" and "Metric Events" under "Environment" within this period will be displayed.

![event tracker screenshot](/debug_en.png)

1. This section divides all event reporting data into 6 types: (access event, debug event, summary event, custom event, click event, page event)
    - Access events: all information accessed by each individual function toggle (which user accessed which variation of which toggle at what time) the data will be reported when "start collecting indicator analysis data", only during the reporting period" Only when "Event Tracker" is turned on, the reported data will be displayed in this section.
    - Debug event: The difference from "Access Event" is that even if you don't "Start collecting indicator analysis data", as long as you "Enable" Event Tracker, the reported data will also be displayed in this section.
    - Summary events: Aggregate access information of a single function toggle within a time interval (when and how many times did the user access which variation of which toggle)
    - Custom events: Custom class indicator data (track which user triggered which buried point event at what time, and what is the value)
    - Click event: click index data (track which user clicked which component at what time)
    - Page events: page index data (track which user visited which page at what time)

2. Data display order: the latest data is at the bottom of the list, click the "Back to Bottom" tab in the lower right corner of the page to directly view the latest reported data

## Close Event Tracker
It is supported to click the "Close" button at any time to stop displaying new reported data. The event tracker will automatically shut down 30 minutes after the manual "on" time. After closing the Event Tracker, the data will not be cleared directly, and all historical data will be cleared when the Event Tracker is "opened" again next time.
