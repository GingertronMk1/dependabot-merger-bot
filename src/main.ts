import * as core from "@actions/core";
import * as github from "@actions/github";
import * as yaml from "js-yaml";
import * as fs from "fs";
import { Minimatch } from "minimatch";

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
    console.table(pullRequest);

  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
