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

import { Console } from "../dsl/console"
import { IO } from "funfix-effect"
import * as readline from "readline"
import { FutureMaker, Cancelable } from "funfix-exec"

export const ConsoleIO: Console<"funfix/io"> = {
  writeLine: (line: string) => IO.of(() => {
    console.log(line)
  }),

  readLine: (): IO<string> => IO.deferFuture(() => {
    const cl = Cancelable.empty()
    const ft = FutureMaker.empty<string>()

    const rl = readline.createInterface(process.stdin, process.stdout)

    rl.on("SIGINT", () => {
      rl.close()
      cl.cancel()
    })

    rl.question("> ", (answer) => {
      rl.close()
      ft.trySuccess(answer)
    })

    return ft.future(cl)
  })
}
