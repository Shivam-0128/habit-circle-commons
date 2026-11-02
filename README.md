# Habit Circle Commons

I want a simple community habit tracking website for a group of friends or colleagues, where we can track our daily habits, keep some private, and share others to ask questions and discuss them in the comments.
1. Joining and signing in
Create a "Sign up" page with "Display name", "Email", "Password" and a "Sign up" button. The account should be ready to use straight after sign-up, without requiring email confirmation. The user's details should also be saved. Create a "Sign in" page with "Email", "Password" and a "Sign in" button. After either action, open "My habits".
2. Getting around and saving information
When someone is signed in, every page should have links to "My habits" and "Community", together with a "Sign out" button. Include buttons in the sidebar to reach those pages as well. Save everyone's habits, daily ticks and comments so that they are still available when users return or sign in to the same account on another phone or computer.
3. Adding my habits
The "My habits" page should show only the signed-in person's own habits. To add one, include "Habit name", "When I do it", a tick box labelled "Share with the community" and an "Add habit" button. Leave the sharing box unticked by default. In "When I do it", people can describe when they usually do the habit and what is happening or makes them more likely to do it. Each habit in the list should show "Shared" or "Private". Clicking its name should open its page.
4. Tracking a habit
Each habit page should show its name and what the person wrote in "When I do it". Include a list called "Last 7 days", with one tick box for each of the last seven days, including today. Each box should be labelled with its date in the format 2026-10-20. If a box is ticked, the habit is counted as completed on that day. If it is unticked, the completion mark is removed. Only the owner of the habit should be able to change these boxes.
5. Showing progress
Show "Days done:" together with the number of days on which the habit was completed. Show "Current streak:" followed by the number of days completed in a row, counting backwards from the most recent day marked as done.
6. Sharing and talking
The "Community" page should contain only habits that members have chosen to share. Private habits should not appear there. For every shared habit, show its name, the owner's display name, the text entered in "When I do it", and "Days done:" with the corresponding number. A user should be able to open the habit by clicking its name. Any signed-in member should be able to enter text in "Comment" and press "Post comment" to ask a question, give advice or discuss the habit. The name of the person who wrote each comment should be visible, and the owner of the habit should also be able to read the comments.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://habit-circle-commons.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/82fd67b5-2bd5-4bfc-9301-12311bafd629).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
