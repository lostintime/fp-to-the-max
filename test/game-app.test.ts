/*!
 * Copyright (c) 2019 by The FpToTheMax Project Developers.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from "chai"
import { HK } from "funland"

import { GameDSL, game } from "../src/game-app"
import { Program } from "../src/dsl/program"
import { Numbers } from "../src/dsl/numbers"
import { App } from "../src/dsl/app"

/**
 * Eval higher kinded type
 */
export type Eval<A> = (() => A) & HK<"Eval", A>
export const Eval = <A>(a: () => A): Eval<A> => a as Eval<A>

const ProgramEval: Program<"Eval"> = {
  pure: <A>(a: A): Eval<A> => Eval(() => a),
  chain: <A, B>(f: (a: A) => Eval<B>, fa: Eval<A>): Eval<B> => Eval(() => f(fa())())
}

const NumbersEval: Numbers<"Eval"> = {
  parseInt: (num: string): Eval<number> => Eval(() => parseInt(num, 10))
}

/**
 * This is a container for IO state
 *  `readLines` property used to pass user inputs
 *  `writeLines` property used to collect messages wrote by the app
 *  `randoms` "random" numbers device
 */
class TestState {
  constructor(public readLines: string[],
              public writeLines: string[],
              public randoms: number[]) {}

  /**
   * Return input lines from a predefined list
   */
  readLine(): string {
    const head = this.readLines[0]
    this.readLines = this.readLines.slice(1)

    return head
  }

  /**
   * Collect all lines wrote
   */
  writeLine(line: string): void {
    this.writeLines.push(line)
  }

  /**
   * Issue "random" numbers
   */
  randomInt(min: number, max: number): number {
    const head = this.randoms[0]
    this.randoms = this.randoms.slice(1)

    return head
  }
}

function TestModule(state: TestState): GameDSL<"Eval"> {
  return {
    ...ProgramEval,
    writeLine: (line: string): Eval<void> => {
      return Eval(() => state.writeLine(line))
    },
    readLine(): Eval<string> {
      return Eval(() => state.readLine())
    },
    randomInt(min: number, max: number): Eval<number> {
      return Eval(() => state.randomInt(min, max))
    },
    ...NumbersEval
  }
}

const AppEval: App<"Eval"> = {
  run: <A>(fa: Eval<A>): void => {
    fa()
  }
}

describe("game", () => {
  it("succeeds for right guess", () => {
    const state = new TestState(["1", "n"], [], [1])
    const testModule = TestModule(state)

    // Run the app and mutate the state
    AppEval.run(game(testModule))

    expect(state.readLines, "all lines read").is.empty
    expect(state.writeLines, "wrote the right output").deep.equals([
      "Hello & welcome to our game (press CTRL/CMD+C to exit)",
      "Please enter a number from 1 to 5",
      "You Win!",
      "Do you want to play again? [Y/n]:",
      "Done."
    ])
    expect(state.randoms, "all randoms consumed").is.empty
  })

  it("fails for wrong guess", () => {
    const state = new TestState(["3", "n"], [], [4])
    const testModule = TestModule(state)

    AppEval.run(game(testModule))

    expect(state.readLines, "all lines read").is.empty
    expect(state.writeLines, "wrote the right output").deep.equals([
      "Hello & welcome to our game (press CTRL/CMD+C to exit)",
      "Please enter a number from 1 to 5",
      "Wrong! The right number was 4",
      "Do you want to play again? [Y/n]:",
      "Done."
    ])
    expect(state.randoms, "all randoms consumed").is.empty
  })

  it("continues round", () => {
    const state = new TestState(["1", "y", "5", "n"], [], [1, 3])
    const testModule = TestModule(state)

    AppEval.run(game(testModule))

    expect(state.readLines, "all lines read").is.empty
    expect(state.writeLines, "wrote the right output").deep.equals([
      "Hello & welcome to our game (press CTRL/CMD+C to exit)",
      "Please enter a number from 1 to 5",
      "You Win!",
      "Do you want to play again? [Y/n]:",
      "Please enter a number from 1 to 5",
      "Wrong! The right number was 3",
      "Do you want to play again? [Y/n]:",
      "Done."
    ])
    expect(state.randoms, "all randoms consumed").is.empty
  })
})
