---
sidebar_position: 2
---

# How to use toggle

The FeatureProbe platform provides a powerful feature toggle management module. Feature toggles are used for feature placement by selecting target traffic and gradually releasing data through continuous observation until full volume is deployed.
## Toggle Dashboard

![toggles screenshot](/toggles_en.png)

1. default display of My First Project's online environment toggle list information
2. the left navigation bar provides a quick entry to toggle environments (click the drop-down icon to the right of the environment)
3. filter conditions allow us to quickly filter the ttoggles by "evaluated", "enabled/disabled", "tags", "name/key/description"

## Adding toggle
After the toggle is successfully created, it will be synchronized to all environments under the project.

![create toggle screenshot](/create_toggle_en.png)

1. fill in the toggle name
2. fill in the key of the toggle (a unique identifier for the toggle, unique under the same project, not editable once created)
3. fill in the description information
4. select the label (no initial value, you can create it yourself)
5. select the sdk type
6. select the return type of the toggle (4 types: Boolean, String, Number, JSON), which cannot be edited once created
7. Fill in the Variations
    - Default two variations(at least 2, can be increased or decreased)

8. fill in the "When toggle is disabled" (the return value when the toggle is disabled), the default synchronization variation1 data, can be changed
9. Select "Is this a permanent toggle?" (The default period for a non-permanent toggle is 30 days, and we will remind you to clear it if it exceeds 30 days) Is this a permanent toggle?
10. Click the Create button to complete the creation of the toggle

## Edit the toggle
After successful editing, it will take effect in all environments under the entire project.

![edit toggle screenshot](/edit_toggle_en.png)

## Archive and restore toggle

![archive toggle screenshot](/archived_toggle_en.png)

Archive toggle:
1. Click "Archive" to offline toggle at any time. After Archived, it cannot be edited or published，and this toggle will be displayed in the [Archived toggle List]
2. Click "View Archived toggles" to see all Archived toggles of the project. Click "Back" to return to the toggle being used online

Restore toggle:
1. Click "Restore" to restore the toggle online. After restoration, the toggle will be displayed in the [toggle List]
