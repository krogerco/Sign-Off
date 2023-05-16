# Sign-off

Sign-off was created to help make sure that QA has a chance to test PRs before they have been merged. This is accomplished by using a label to block the PR from being merged. Once the PR has been approved by QA, the label will be removed and the PR will be cleared for being merged into your main branch. Sign-off also has a manual override switch just in case the necessary party is out of the office.

# Setup

## Label
For this to work, you'll need to decide on a label to add to each PR. The default label needed for blocking the PR is `needs-qa`, but that can be changed once you add the [workflow](#workflow) to your repo (this is covered in the [input parameters](#input-parameters) section). Unfortunately `needs-qa` does not come as one of the default labels for your repository (you can find that list [here](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels#about-default-labels)). Creating a label for your repo is easy and instructions can be found [here](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels#creating-a-label). 

Side note: To make sure that you are always adding the necessary label to the PR, I recommend that you use [Labeler](https://github.com/actions/labeler). You can specify what label you want to automatically add to a PR each time one is created. This will eliminate human error by not manually adding the label yourself.

## Event Trigger
It is highly recommended that the action be run when a PR has a label removed or when a PR review has been submitted. You are free to use it with other event triggers as well, but these are the two that will give the best results.

```yaml
on:     
  pull_request:
    types: [unlabeled]
  pull_request_review:
    types: [submitted]
```

## <a id="workflow"></a>Workflow
You'll need to add a new yaml file to the `<project-root>/.github/workflow` directory. You can name the file anything you like (ex. sign-off.yml). 

You can copy and paste the template below into your file and this will give
you the bare minimum for using the action: 

```yaml
name: Check for Sign Off

on:     
  pull_request:
    types: [unlabeled]
  pull_request_review:
    types: [submitted]

jobs:
  sign-off-check:
    name: Check sign-off
    runs-on: ubuntu-latest
    steps:
      - name: sign off
        uses: krogerco/sign-off@v1.0.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## <a id="input-parameters"></a>Input Parameters ###
You can customize the setup of sign-off to your liking. This can be done by editing the following list of input parameters:

| Parameter   | Required    | Description |
| ----------- | ----------- | ----------- |
| github-token| YES         | The value needed is `${{ secrets.GITHUB_TOKEN }}` (as seen above).
| branch-name | NO          | This is the branch that has the [user list](#user-list) you want to use. <br>The default value is `main`.
| file-name   | NO          | This is the name of the json file you want to use. Do not add the file extension. <br>The default value is `sign-off`.
| label       | NO          | This is the label that needs to be removed from the PR for the merge to take place. <br> The default value is `needs-qa`.

Here is an example of the yaml file with all of the inputs filled in:  
```yaml
name: Check for Sign Off

on:     
  pull_request:
    types: [unlabeled]
  pull_request_review:
    types: [submitted]

jobs:
  sign-off-check:
    name: Check sign-off
    runs-on: ubuntu-latest
    steps:
      - name: sign off
        uses: krogerco/sign-off@v1.0.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          branch-name: 'main'
          file-name: 'sign-off'
          label: 'needs-qa'
```

## <a id="user-list"></a>User List ##
This is the list of users that need to give their approval for the PR to be merged. The name field should have the person's github username set as its value. The default name for the file is `sign-off`, but you do have the ability to name it something else (see [input parameters](#input-parameters) for details). Make sure to place this file in `<project-root>/.github`.
```json
{
    "list": [
        {
            "name": "github-user",
            "team": "team name"
        },
        {
            "name": "github-user-2",
            "team": "team name 2"
        }
    ]
}
```

## Branch Protection
A rule will need to be setup to block PRs from being merged until this action has passed.
You can learn how to setup branch protection rules [here](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule).

# How It Works
Once the PR has gone through the test process, the team member listed in the [user list](#user-list) for your team (more than likely a member of QA) will approve the PR. Once the approval has been submitted, the action will run. It will remove the label from the PR and the action will give the green light for the PR to be merged.

If for some reason someone on your team that is on the [user list](#user-list) isn't available to approve the PR, then you can manually remove the label from the PR and get the green light as well. If this is the route needed for moving forward, Sign-off will post in the action's summary who removed the label.
