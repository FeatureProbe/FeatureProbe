---
sidebar_position: 6
---

# How to use Approvals
In many cases, the R&D team is very strict about online change management, and approval can reduce the risk of going online. In addition, FeatureProbe supports setting different approval policies in different environments, and the approval policy can be configured more finely to improve approval efficiency.
## Approval settings
In the "Environment" under the project, you can set approvers and enable approval separately.

![toggle targeting screenshot](/approval_settings_en.png)

1. Environment: All environments under the project are shown here.
2. Approver: Support setting the same or different approvers for each item. Approvers receive release approval for all toggles in the environment.
3. Enable Approval: Approval is only enabled for certain environments. After the approval is enabled, all toggles in this environment need to go through the approval process.  you need to wait for all the approvals to be completed before closing the approval).
4. Click Save to complete the approval settings, and the approval will be officially started.

## trigger approval
After the approval setting is completed, in the environment where the approval is enabled, if the toggle is released, the approval will be triggered.

![sdk screenshot](/publish_en.png)

1. Modify the toggle configuration information, and click "Request Approval", and you will see the approvers for this release.
2. Changes description: The change description is required at this time, and it will be sent to the approver as the title of the approval.
3. Click "Confirm": At this time, the approval is officially initiated, and the approval has been transferred to the approver.

## Approval Center
After the release, the approver can see it in the [Approval Center]~ You can click to enter the toggle to approve, and the applicant can also see it in the application list.
![history screenshot](/approval_list_en.png)
![history screenshot](/application_list_en.png)
+ Approval Status: (Pending review, Accepted, Declined, Skipped, Withdrawn)
   - Pending revie: After the approval is released, it is in the status of "Pending revie"
   - Accepted: "Pending revie" toggle, after the approver approves [Passed], it is in the "Accepted" state
   - Declined: "Pending revie" toggle, after the approver [Rejected] approves, it is in the "Declined" state
   - Skipped: "Pending revie" toggle, after the applicant [Skip Approval and Publish], it is in the "Skipped" state
   - Withdrawn: "Pending revie" toggle, after the applicant [withdraws] approval, it is in the status of "Withdrawn"


## toggle list and toggle targeting
After approval, the applicant needs to click [Publish] to complete the release.
### toggle targeting
![history screenshot](/toggle_approval_en.png)

### switch configuration page
[Pending approval] - [Applicant]:
![history screenshot](/pending_review_q_en.png)
[Pending approval] - [Approver]:
![history screenshot](/pending_review_p_en.png)
【To be released】-【Applicant】：
![history screenshot](/pending_publish_en.png)
+ Switch Status: (Pending review, Pending Publishing, Declined, Published)
   - Pending review: After the approval is released, it is in the status of "Pending review"
   - Pending Publishing: After the approver approves [Pass], it is in the "Pending Publishing" state. At this time, the applicant can click [Publish] or [Abandon]
   - Declined: After approval by the approver [Rejected], the status is "Declined". At this time, the applicant needs to click [Modify] or [Abandon]
   - Published: "Pending Publishing" toggle, after the applicant clicks [Publish], it will be in the "Published" state. The "Pending review" toggle, after the applicant clicks [Skip Approval and Publish], is also in the "Published" state.
Note: Once the approval is turned on, the toggle is equivalent to being locked. Before the approval is completed (finally "publish" or "abandon"), others cannot edit the toggle configuration and click publish again.

In addition: In addition to the normal process of passing the approval and completing the release, there are also some exception handling functions set for special scenarios, as follows:
+ Applicant:
   - Skip approval and publish: the situation is urgent, the applicant needs to skip this approval and publish it online directly
   - Withdrawal: The content of the release is wrong, and the applicant terminates the approval and release
   - Abandon: After the approval is passed, the applicant abandons the change to the online application due to special reasons
+ Approver:
   - Rejected: the published content does not meet expectations, and the approval fails
