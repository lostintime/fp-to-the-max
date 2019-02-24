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
import { Eval } from "funfix-effect"

export interface Program<F> {
  // declared as a method
  pass<A>(fa: HK<F, A>): HK<F, A>
}

export const ProgramEval: Program<"funfix/eval"> = {
  pass: <A>(fa: Eval<A>): Eval<A> => fa
}

// export interface Program<F> {
//   // declared as a property
//   pass: <A>(fa: HK<F, A>) => HK<F, A>
// }

// export const ProgramEval: Program<"funfix/eval"> = {
//   pass: <A>(fa: Eval<A>): Eval<A> => fa
// }

// src/utils/bivariance-test.ts:36:3 - error TS2322: Type '<A>(fa: Eval<A>) => Eval<A>' is not assignable to type '<A>(fa: HK<"funfix/eval", A>) => HK<"funfix/eval", A>'.
//   Types of parameters 'fa' and 'fa' are incompatible.
//     Type 'HK<"funfix/eval", A>' is missing the following properties from type 'Eval<A>': get, map, flatMap, chain, and 5 more.

// 36   pass: <A>(fa: Eval<A>): Eval<A> => fa
//      ~~~~
