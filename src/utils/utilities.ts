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
import {GITHUB} from '../git/github'
import {GitCommand} from '../git/git-command'
import {exec} from '@actions/exec'
import {input} from './inputs'
import {mv} from '@actions/io'

const git = new GitCommand()

export async function setupRemoteRepo(): Promise<void> {
  const repo = await Promise.resolve(
    github.context.payload.repository?.full_name ?? ''
  )

  if (repo === '') {
    throw new Error(`You do not have a repo!`)
  }

  const url = `https://github:${input.token}@github.com/${repo}.git`

  await git.init()
  await git.addRemote(url)
  await git.fetchRepo()
}

export async function getSignOffList(): Promise<void> {
  if (git.branchName === '' || git.fileName === '') {
    throw new Error(
      `Either branchName or fileName are empty: Branch Name: ${git.branchName}; File Name: ${git.fileName}`
    )
  }

  await git.checkoutGithubDirectory()
}

export async function moveSignOffFile(): Promise<void> {
  await exec('ls', ['-a', `${GITHUB.directory}`])
  await mv(`${GITHUB.directory}/${input.name}.json`, '.')
  await exec('ls')
}
