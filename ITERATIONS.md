# GetFocus Product Iteration Plan

Initial use case: preparing for PM interviews
## Iteration 0
### What I Want
- Set the heading
    - Set a specific goal
        - set a heading and direction
    - Identify constraints
        - timeline
        - penalty for failure
        - budget?
    - Set a goal and rubric for success
        - Identify success conditions
- Prep me
    - Prep me with the right type of breathing up front
- Keep me ontrack
    - Warn me before I'm done
    - Periodic check in during the session
    - Show me the time when I need it
    - Calm me down if I'm freaking out
    - Remind me of win conditions
- Review
    - evaluate my performance against win conditions
### What I Don't
- 

### User Journey
1. Open site
2. State my context - time to prepare, level of preparation
- Receive hints and tips, links to guides
3. Select my company and question type and time limit
- selects and calibrates rubric
- Start interview
5. Final preparation - mindset
- instersitial?
- box breathe >=3 cycles
- read a hint
- affirm something about yourself to give yourself confidence
- reminders
6. Take the test
- keep focus on the window - eye tracking?
- detect idle behavior >2mins
- input via text or excalidraw
- simulate an entire back and forth chat
    break it up into multiple sections
    only send excalidraw image on send
7. Review
- judge answers against the rubric
- provide feedback and tips to improve
- link to resources
- new question
- try same question gain

----
## Iteration 1
act like a 10x coder and designer.
i'm building a webapp to train deepwork
use the index.html file to correct and update and improve the app.js file
populate the dropdowns
on start session i want the tiemr to start, the time button should be a required selection
make the timer work

### What worked
- dropdown selectors
- start session went to the next card
- timer is working
### What didn't
- time selectors aren't doing anything
- time is always 2 hours
- time should be formatted as hh:mm:ss
- selector and input boxes are going outside of the container
- dark mode toggle isn't working

## Iteration 2

### What worked
- dark mode works
- timer works
### What didn't
Step 1
- options for drop downs should be in their own constants.js or constants.json file
- make time duratin selection an on-screen callout, not an error popup
- the goal, method and motivation should be in bold in step 2
- the timer in step 2 should be hh:mm:ss unless hh is 0 then it should be mm:ss
- put the time  selector boxes side by side inside user-input
- make the goal input required
- start a box breathing animation session for 2 cycles on 'start session' and then go to card 2
Step 2
- add an end session button
- enable entries as 'what I tried' with a corresponding optional text input of 'expectations' optional input from a selector which is 'results'
- make the input box much bigger, with rich text
- enable submission of multiple items per session
- every 10 minutes make the timer get bigger for 1s and trigger an audio chime
- trigger an audio chime on completion of the timer, and force the user to step 3

### Lessons Learned
- The biggest asset is being able to iterate fast
    - set clear parameters for each iteration
    - choose what to change and my expectations (hypothesis)
    - record the results
    - review the results to see what I want to change for the next time
- Iterations create data to feed back into the system
    - Capture my feedback
    - Capture system/console results
- Validate data before use
    - Review and validate data points for use
- Re-iterate
    - Use my feedback as input data to run another iteration
- Constraints improve conditions
    - You need a limited budget, time, and scope to have any hope of performing well