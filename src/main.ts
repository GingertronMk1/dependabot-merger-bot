import * as core from "@actions/core";
import * as github from "@actions/github";
import * as yaml from "js-yaml";
import * as fs from "fs";
import { Minimatch } from "minimatch";
import { userInfo } from "node:os";

async function run() {
  try {
    const context = github.context;
    const pullRequest = context.payload.pull_request;
    if (!pullRequest) {
      throw new Error("No pull request information found");
    }
    const {
      issue: { number: issue_number },
      repo: { owner, repo },
    } = context;
    const repoToken = core.getInput("repo-token", { required: true });

    const octokit = github.getOctokit(repoToken);

    console.log("Pull Request");
    console.log(pullRequest);

    if (
      pullRequest.user &&
      [
        "dependabot[bot]",
        "dependabot-preview[bot]",
        "dependabot",
        "dependabot-preview",
      ].indexOf(pullRequest.user.login) > -1
    ) {
      const new_comment = await octokit.issues.createComment({
        owner: owner,
        repo: repo,
        issue_number: issue_number,
        body: "@dependabot merge",
      });
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
