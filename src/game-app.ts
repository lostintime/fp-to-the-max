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

import { HK } from "funland"
// dsl
import { Program } from "./dsl/program"
import { Console } from "./dsl/console"
import { Numbers } from "./dsl/numbers"
import { Random } from "./dsl/random"

/**
 * The type composes all the languages neede to build a single round game application
 */
export type GameRoundDSL<F> = Program<F> & Console<F> & Numbers<F> & Random<F>

/**
 * Single round application
 */
const gameRound = <F>(dsl: GameRoundDSL<F>): HK<F, void> => {
  const { chain, readLine, writeLine, parseInt, randomInt } = dsl

  const intro = writeLine("Please enter a number from 1 to 5")

  const genInt = () => randomInt(1, 5)

  const readGuess = chain(parseInt, readLine())

  const checkGuess = (num: number) => (guess: number) =>
    guess === num
      ? writeLine("You Win!")
      : writeLine(`Wrong! The right number was ${num}`)

  return chain(
    num => chain(
      checkGuess(num),
      readGuess
    ),
    chain(genInt, intro)
  )
}

/**
 * Recursive game loop: plays a round then asks user to continue
 */
const gameLoop = <F>(dsl: GameDSL<F>): HK<F, void> => {
  const { pure, chain, readLine, writeLine } = dsl

  const checkContinue = chain(
    answer => pure(answer.toLowerCase() === "y" || answer.trim() === "" ? true : false),
    chain(
      readLine,
      writeLine("Do you want to play again? [Y/n]:")
    )
  )

  return chain(
    () => chain(
      go => go ? gameLoop(dsl) : pure(undefined), // Recursive call here, not stack safe!
      checkContinue
    ),
    gameRound(dsl)
  )
}

/**
 * Game DSL is composed from all languages needed to build it
 */
export type GameDSL<F> = Program<F> & Console<F> & Numbers<F> & Random<F>

/**
 * Game Application
 * @param dsl app dsl, injected implicitly in scala
 */
export const game = <F>(dsl: GameDSL<F>): HK<F, void> => {
  const { chain, writeLine } = dsl
  const intro = writeLine("Hello & welcome to our game (press CTRL/CMD+C to exit)")

  return chain(
    () => writeLine("Done."),
    chain(
      () => gameLoop(dsl),
      intro
    )
  )
}
