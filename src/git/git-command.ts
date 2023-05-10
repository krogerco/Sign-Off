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

import {exec} from '@actions/exec'
import {getInput} from '@actions/core'
import {input} from '../utils/inputs'

export class GitCommand {
  private readonly signOffAlias: string
  private readonly path: string
  private readonly file: string
  private readonly repo: string

  readonly branchName: string
  readonly fileName: string

  constructor() {
    this.signOffAlias = 'sign-off-repo'
    this.branchName = getInput('branch-name')
    this.fileName = input.name
    this.path = input.path
    this.repo = `${this.signOffAlias}/${this.branchName}`
    this.file =
      this.path === ''
        ? `${this.fileName}.json`
        : `./${this.path}/${this.fileName}.json`
  }

  async init(): Promise<void> {
    const result = GitCommand.executeGitCommand([
      'init',
      '--initial-branch',
      'main'
    ])

    if ((await result) !== 0) {
      throw new Error('We could not initialize git')
    }
  }

  async addRemote(repo: string): Promise<void> {
    const result = GitCommand.executeGitCommand([
      'remote',
      'add',
      this.signOffAlias,
      `${repo}`
    ])

    if ((await result) !== 0) {
      throw new Error('We could not configure the remote repo')
    }
  }

  async fetchRepo(): Promise<void> {
    const result = GitCommand.executeGitCommand([
      'fetch',
      `${this.signOffAlias}`
    ])

    if ((await result) !== 0) {
      throw new Error('We could not fetch the remote repo')
    }
  }

  async checkoutSignOffFile(): Promise<void> {
    const result = GitCommand.executeGitCommand([
      'checkout',
      this.repo,
      '--',
      this.file
    ])

    if ((await result) !== 0) {
      throw new Error('We could not checkout the remote repo')
    }
  }

  static async executeGitCommand(args: string[]): Promise<number> {
    return await exec('git', args)
  }
}
