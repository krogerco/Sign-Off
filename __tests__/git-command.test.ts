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

import {beforeEach, describe, expect, jest, test} from '@jest/globals'
import {GitCommand} from '../src/git/git-command'

jest.mock('../src/git/git-command')

const mockGitReturnCode = (args: string[]) => (args[0] === '-v' ? 0 : 1)

describe('Testing GitCommand.executeGitCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Assert that executeGitCommand does not return 0 (failure)', async () => {
    jest
      .spyOn(GitCommand, 'executeGitCommand')
      .mockResolvedValue(mockGitReturnCode(['fail']))

    const result = await Promise.resolve(GitCommand.executeGitCommand(['fail']))

    expect(result).not.toEqual(0)
  })

  test('Assert that executeGitCommand does return 0 (success)', async () => {
    jest
      .spyOn(GitCommand, 'executeGitCommand')
      .mockResolvedValue(mockGitReturnCode(['-v']))

    const result = await Promise.resolve(GitCommand.executeGitCommand(['-v']))

    expect(result).toEqual(0)
  })
})
