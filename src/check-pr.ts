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
import {GithubAPI} from './git/github-api'
import {input} from './utils/inputs'
import {moveSignOffFile} from './utils/utilities'
import {notice} from '@actions/core'
import {readFileSync} from 'fs'

const api = new GithubAPI()

export async function hasBeenApproved(): Promise<void> {
  const isApproved = await isApprover()
  const labelHasBeenRemoved = await api.labelWasRemoved()

  if (isApproved || labelHasBeenRemoved) {
    notice(
      `The ${api.label} label has been removed. This PR has been signed off.`
    )
    return
  } else {
    throw new Error('This PR has not been approved!')
  }
}

async function isApprover(): Promise<boolean> {
  await moveSignOffFile()

  const data = readFileSync(`${input.name}.json`, 'utf-8')
  const approvers = JSON.parse(data)

  for (const approver of approvers.list) {
    if (approver.name === github.context.actor) {
      await api.removeLabelFromPullRequest()
      notice(`This was approved by ${approver.name} on team ${approver.team}`)
      return true
    }
  }

  return false
}
