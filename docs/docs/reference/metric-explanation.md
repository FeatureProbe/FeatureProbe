---
sidebar_position: 11
---

# Explanation of Metric Types

## Conversion Metrics
Such as "Click-through Rate" and "Order Conversion Rate"

1. User entry into a particular experimental group is based on whether they visit a certain function, and users can enter the experimental group multiple times.
    * According to the table below, users A, B, E, and F entered experimental group A, while users C and D entered experimental group B.

2. The calling of an event reporting function is counted as one conversion for each user, regardless of whether they have one or more such events.
    * Only users A and E in experimental group A reported an event, resulting in a conversion rate of $\frac{2}{4}=50\%$.
    * Users C and D in experimental group B both reported an event, resulting in a conversion rate of $\frac{2}{2}=100\%$.


| User ID | Experimental Group | Event Reporting Time |
|--------|--------|----------------------|
| A      | A      | time1                |
| A      | A      | time2                |
| B      | A      |                      |
| C      | B      | time3                |
| C      | B      | time4                |
| C      | B      | time5                |
| D      | B      | time6                |
| E      | A      | time7                |
| F      | A      |                      |

## Count Metrics
Such as "Average Visits per Person" and "Average Orders per Person"

1. User entry into a particular experimental group is based on whether they visit a certain function, and users can enter the experimental group multiple times.
    * According to the table below, users A, B, E, and F entered experimental group A, while users C and D entered experimental group B.

2. Each event reporting function call is counted as one event, and if a user does not report any event data, the count is zero.
    * User A reported two events in experimental group A, resulting in a count of 2.
    * User B did not report any events in experimental group A, resulting in a count of 0.
    * User C reported two events in experimental group B, resulting in a count of 2.
    * User D reported one event in experimental group B, resulting in a count of 1.
    * User E reported one event in experimental group A, resulting in a count of 1.
    * User F did not report any events in experimental group A, resulting in a count of 0.

3. Finally, calculate the average count per person.
    * For group A, the sample value should be 2+0+1+0=3, and the sample size is 4. Therefore, the average count per person is $\frac{3}{4}=0.75$.
    * For group B, the sample value should be 2+1=3, and the sample size is 2. Therefore, the average count per person is $\frac{3}{2}=1.5$.


| User ID | Experimental Group	 | Event Reporting Time |
|--------|--------|----------------------|
| A      | A      | time1                |
| A      | A      | time2                |
| B      | A      |                      |
| C      | B      | time3                |
| C      | B      | time4                |
| C      | B      | time5                |
| D      | B      | time6                |
| E      | A      | time7                |
| F      | A      |                      |


## Average Metrics
Such as "Average App Launch Time"


1. User entry into a particular experimental group is based on whether they visit a certain function, and users can enter the experimental group multiple times.
    * According to the table below, users A, B, E, and F entered experimental group A, while users C and D entered experimental group B.

2. Using an event reporting function containing numerical values as one piece of user data, if the same user calls the numerical tracking point reporting function multiple times, it will cause the user to have multiple values. The average category indicator will take the average of the multiple values belonging to a user as the final sample value for that user.
    * User A had two numerical event reports in experimental group A, which were 10 and 15 respectively. The mean is $\frac{10+15}{2}=12.5$.
    * User C had three numerical event reports in experimental group B, which were 5, 8, and 12 respectively. The mean is $\frac{5+8+12}{3}=8.3$.
    * User D had one numerical event report in experimental group B, which was 7.
    * User E had one numerical event report in experimental group A, which was 20.
    * User F had no numerical event report in experimental group A, and the processing method is described in the next item.

3. For users who entered a group but did not report numerical events due to code integration errors or other reasons, the data of entering the group will be discarded and not counted as a sample.
    * Users B and F entered group A during the experiment but did not report numerical events, so they are not counted in the sample size of experimental group A. Therefore, the sample size of experimental group A is 2, namely A and E, and the overall mean of experimental group A is $\frac{12.5+20}{2}=16.25$.
    * The sample size of experimental group B is 2, namely C and D, and its mean is $\frac{8.3+7}{2}=7.65$.

| User ID	 | Experimental Group	 | Event Report Value |
|--------|--------|--------|
| A      | A      | 10     |
| A      | A      | 15     |
| B      | A      |        |
| C      | B      | 5      |
| C      | B      | 8      |
| C      | B      | 12     |
| D      | B      | 7      |
| E      | A      | 20     |
| F      | A      |        |



## Sum Metrics
Such as "Average Order Amount per Person" and "Average online Time per Person"

1. User entry into a particular experimental group is based on whether they visit a certain function, and users can enter the experimental group multiple times.
    * According to the table below, users A, B, E, and F entered experimental group A, while users C and D entered experimental group B.

2. For the same user, multiple event numerical values are added together as the user's sample value.
   * We can obtain that the sample value of user A is 10+15=25.
   * The sample value of user B is 0.
   * The sample value of user C is 5+8+12=25.
   * The sample value of user D is 7.
   * The sample value of user E is 20.
   * The sample value of user F is 0.

3. As long as the user accesses the grouping function, the user is counted as a sample of that group, regardless of whether there is an event numerical value report.
   * Therefore, the sample size of experimental group A is 4, namely A, B, E, F.
   * The sample size of experimental group B is 2, namely C, D.

4. If a user does not report an event, the sample value corresponding to the user is 0.
   * Therefore, the total sample of experimental group A is 25+0+20+0=45.
   * The total sample of experimental group B is 25+7=32.

5. Finally, we can calculate the mean of experimental group A and experimental group B.
   * The mean of experimental group A is $\frac{45}{4}=11.25$.
   * The mean of experimental group B is $\frac{32}{2}=16$.


| User ID	 | Experimental Group	 | Event Numerical Value |
|--------|--------|--------|
| A      | A      | 10     |
| A      | A      | 15     |
| B      | A      |        |
| C      | B      | 5      |
| C      | B      | 8      |
| C      | B      | 12     |
| D      | B      | 7      |
| E      | A      | 20     |
| F      | A      |        |

   