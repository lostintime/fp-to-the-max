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

import { Program } from "../dsl/program"
import { IO } from "funfix-effect"

export const ProgramIO: Program<"funfix/io"> = {
  pure: <A>(a: A): IO<A> => IO.pure(a),

  chain: <A, B>(f: (a: A) => IO<B>, fa: IO<A>): IO<B> => fa.chain(f)
}
