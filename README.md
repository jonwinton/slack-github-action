# Simple Slack GitHub Action

This Action enables sending Slack messages to incoming webhook endpoints.

It works by taking in escaped JSON that is [formatted for Slack's message API](https://api.slack.com/docs/messages) and send a request to the endpoint specified by [environment variables](https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/#environment-variables).

![A complex example Slack message with attachments](/examples/example_msg.png)

## Basic Usage

```hcl
action "Notify" {
  needs = ["Filter For Tags"]
  uses = "docker://jwinton/slack-github-action"
  args = ["{\"text\":\"The tag [BRANCH_OR_TAG] was just pushed!\"}"]
  env = {
    SLACK_PATH = "/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
  }
}
```

For some basic JSON examples see the [examples page](/examples/examples.json).

![A complex example Slack message with attachments](/examples/example_simple.png)

## Prerequisites

- Create a [Slack app](https://api.slack.com/slack-apps)
- Enable [Incoming Webhooks](https://api.slack.com/incoming-webhooks)

## Environment Variables & Interpolation

Only one environment variable is required:

- `SLACK_PATH`: should be set to the path of your Slack Incoming Webhook.
  - If your webhook url is `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX` then the path will be `/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`. Be sure to include the slash at the beginning


### Message Variable Interpolation

When constructing your message your can use environment variables in your message by wrapping a value in brackets. If an environement variable called `FOO` is set, your message can include `[FOO]` and it will be interpolated into the message. For example:

```json
{
  "text": "This message is so show that environment variable FOO is set to: [FOO]"
}
```

This is handy for pulling in default environment variables provided by GitHub as well as passing in your own!

### Additional Environment Variables

As a way to make things easier a convenience environment variable called `BRANCH_OR_TAG` is added to the container. It is simply the name of the branch or value of a tag as defined by the default `$GITHUB_REF` environment variable. Combined with [filters](https://github.com/actions/bin/tree/master/filter) it can be a nice for certain messages.

## Usage
A simple notification for a push of a tag to a repo follows:

```hcl
workflow "Test!" {
  on = "push"
  resolves = ["Send Message"]
}

# Filter for master branch
action "Filter For Tags" {
  uses = "actions/bin/filter@master"
  args = "tag v*"
}

action "Send Message" {
  needs = ["Filter For Tags"]
  uses = "docker://jwinton/slack-github-action"
  args = ["{\"text\":\"The tag [BRANCH_OR_TAG] was just pushed!\"}"]
  env = {
    SLACK_PATH = "/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
  }
}
```

## License
The Dockerfile and associated scripts and documentation in this project are released under the MIT License.
