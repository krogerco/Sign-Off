/*
 Copyright (c) 2023 The Kroger Co. All rights reserved.

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as github from '@actions/github'
import {Octokit} from 'octokit'
import {input} from '../utils/inputs'

export class GithubAPI {
  readonly issueNumber: number
  readonly label: string
  readonly octokit: Octokit
  readonly owner: string
  readonly repo: string

  constructor() {
    this.issueNumber = github.context.issue.number
    this.label = input.label
    this.octokit = new Octokit({auth: input.token})
    this.owner = github.context.repo.owner
    this.repo = github.context.repo.repo
  }

  async removeLabelFromPullRequest(approver: string): Promise<void> {
    try {
      await this.octokit.rest.issues.removeLabel({
        owner: this.owner,
        repo: this.repo,
        issue_number: this.issueNumber,
        name: this.label
      })
    } catch {
      if ((await this.labelWasRemoved()) && approver === github.context.actor) {
        return
      }
      throw new Error(`The ${this.label} was not removed`)
    }
  }

  async labelWasRemoved(): Promise<boolean> {
    let hasLabel: boolean

    try {
      const response = await this.octokit.rest.issues.listLabelsOnIssue({
        owner: this.owner,
        repo: this.repo,
        issue_number: this.issueNumber
      })

      hasLabel = response.data.some(label => label.name === this.label)
    } catch {
      throw new Error()
    }

    return !hasLabel
  }
}
