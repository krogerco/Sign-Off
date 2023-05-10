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
import {describe, expect, jest, test} from '@jest/globals'
import {checkEventTrigger} from '../src/git/github'

jest.mock('@actions/core')

describe('Test checkEventTrigger() return values', () => {
  const context = github.context as jest.Mocked<typeof github.context>

  test('Assert a unlabeled pull request returns true', async () => {
    context.eventName = 'pull_request'
    context.action = 'unlabeled'
    const result = await checkEventTrigger()
    expect(result).toBe(true)
  })

  test('Assert a submitted pull request review returns true', async () => {
    context.eventName = 'pull_request_review'
    context.action = 'submitted'
    const result = await checkEventTrigger()
    expect(result).toBe(true)
  })

  test('Assert a labeled pull request returns false', async () => {
    context.eventName = 'pull_request'
    context.action = 'labeled'
    const result = await checkEventTrigger()
    expect(result).toBe(false)
  })

  test('Assert an edited pull request review returns false', async () => {
    context.eventName = 'pull_request_review'
    context.action = 'edited'
    const result = await checkEventTrigger()
    expect(result).toBe(false)
  })

  test('Assert a pull request target event trigger returns false', async () => {
    context.eventName = 'pull_request_target'
    context.action = 'unlabeled'
    const result = await checkEventTrigger()
    expect(result).toBe(false)
  })
})
