
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model MarketOrder
 * 
 */
export type MarketOrder = $Result.DefaultSelection<Prisma.$MarketOrderPayload>
/**
 * Model OcrPrice
 * 
 */
export type OcrPrice = $Result.DefaultSelection<Prisma.$OcrPricePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more MarketOrders
 * const marketOrders = await prisma.marketOrder.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more MarketOrders
   * const marketOrders = await prisma.marketOrder.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.marketOrder`: Exposes CRUD operations for the **MarketOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MarketOrders
    * const marketOrders = await prisma.marketOrder.findMany()
    * ```
    */
  get marketOrder(): Prisma.MarketOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ocrPrice`: Exposes CRUD operations for the **OcrPrice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OcrPrices
    * const ocrPrices = await prisma.ocrPrice.findMany()
    * ```
    */
  get ocrPrice(): Prisma.OcrPriceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    MarketOrder: 'MarketOrder',
    OcrPrice: 'OcrPrice'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "marketOrder" | "ocrPrice"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      MarketOrder: {
        payload: Prisma.$MarketOrderPayload<ExtArgs>
        fields: Prisma.MarketOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarketOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarketOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>
          }
          findFirst: {
            args: Prisma.MarketOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarketOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>
          }
          findMany: {
            args: Prisma.MarketOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>[]
          }
          create: {
            args: Prisma.MarketOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>
          }
          createMany: {
            args: Prisma.MarketOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MarketOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>[]
          }
          delete: {
            args: Prisma.MarketOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>
          }
          update: {
            args: Prisma.MarketOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>
          }
          deleteMany: {
            args: Prisma.MarketOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarketOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MarketOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>[]
          }
          upsert: {
            args: Prisma.MarketOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketOrderPayload>
          }
          aggregate: {
            args: Prisma.MarketOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarketOrder>
          }
          groupBy: {
            args: Prisma.MarketOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarketOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.MarketOrderCountArgs<ExtArgs>
            result: $Utils.Optional<MarketOrderCountAggregateOutputType> | number
          }
        }
      }
      OcrPrice: {
        payload: Prisma.$OcrPricePayload<ExtArgs>
        fields: Prisma.OcrPriceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OcrPriceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OcrPriceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>
          }
          findFirst: {
            args: Prisma.OcrPriceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OcrPriceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>
          }
          findMany: {
            args: Prisma.OcrPriceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>[]
          }
          create: {
            args: Prisma.OcrPriceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>
          }
          createMany: {
            args: Prisma.OcrPriceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OcrPriceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>[]
          }
          delete: {
            args: Prisma.OcrPriceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>
          }
          update: {
            args: Prisma.OcrPriceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>
          }
          deleteMany: {
            args: Prisma.OcrPriceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OcrPriceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OcrPriceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>[]
          }
          upsert: {
            args: Prisma.OcrPriceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcrPricePayload>
          }
          aggregate: {
            args: Prisma.OcrPriceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOcrPrice>
          }
          groupBy: {
            args: Prisma.OcrPriceGroupByArgs<ExtArgs>
            result: $Utils.Optional<OcrPriceGroupByOutputType>[]
          }
          count: {
            args: Prisma.OcrPriceCountArgs<ExtArgs>
            result: $Utils.Optional<OcrPriceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    marketOrder?: MarketOrderOmit
    ocrPrice?: OcrPriceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model MarketOrder
   */

  export type AggregateMarketOrder = {
    _count: MarketOrderCountAggregateOutputType | null
    _avg: MarketOrderAvgAggregateOutputType | null
    _sum: MarketOrderSumAggregateOutputType | null
    _min: MarketOrderMinAggregateOutputType | null
    _max: MarketOrderMaxAggregateOutputType | null
  }

  export type MarketOrderAvgAggregateOutputType = {
    quality: number | null
    enchantmentLevel: number | null
    amount: number | null
    price: number | null
  }

  export type MarketOrderSumAggregateOutputType = {
    quality: number | null
    enchantmentLevel: number | null
    amount: number | null
    price: number | null
  }

  export type MarketOrderMinAggregateOutputType = {
    id: string | null
    marketOrderId: string | null
    itemId: string | null
    locationName: string | null
    quality: number | null
    enchantmentLevel: number | null
    type: string | null
    amount: number | null
    price: number | null
    expiresAt: Date | null
    receivedAt: Date | null
  }

  export type MarketOrderMaxAggregateOutputType = {
    id: string | null
    marketOrderId: string | null
    itemId: string | null
    locationName: string | null
    quality: number | null
    enchantmentLevel: number | null
    type: string | null
    amount: number | null
    price: number | null
    expiresAt: Date | null
    receivedAt: Date | null
  }

  export type MarketOrderCountAggregateOutputType = {
    id: number
    marketOrderId: number
    itemId: number
    locationName: number
    quality: number
    enchantmentLevel: number
    type: number
    amount: number
    price: number
    expiresAt: number
    receivedAt: number
    _all: number
  }


  export type MarketOrderAvgAggregateInputType = {
    quality?: true
    enchantmentLevel?: true
    amount?: true
    price?: true
  }

  export type MarketOrderSumAggregateInputType = {
    quality?: true
    enchantmentLevel?: true
    amount?: true
    price?: true
  }

  export type MarketOrderMinAggregateInputType = {
    id?: true
    marketOrderId?: true
    itemId?: true
    locationName?: true
    quality?: true
    enchantmentLevel?: true
    type?: true
    amount?: true
    price?: true
    expiresAt?: true
    receivedAt?: true
  }

  export type MarketOrderMaxAggregateInputType = {
    id?: true
    marketOrderId?: true
    itemId?: true
    locationName?: true
    quality?: true
    enchantmentLevel?: true
    type?: true
    amount?: true
    price?: true
    expiresAt?: true
    receivedAt?: true
  }

  export type MarketOrderCountAggregateInputType = {
    id?: true
    marketOrderId?: true
    itemId?: true
    locationName?: true
    quality?: true
    enchantmentLevel?: true
    type?: true
    amount?: true
    price?: true
    expiresAt?: true
    receivedAt?: true
    _all?: true
  }

  export type MarketOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketOrder to aggregate.
     */
    where?: MarketOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketOrders to fetch.
     */
    orderBy?: MarketOrderOrderByWithRelationInput | MarketOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarketOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MarketOrders
    **/
    _count?: true | MarketOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MarketOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MarketOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarketOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarketOrderMaxAggregateInputType
  }

  export type GetMarketOrderAggregateType<T extends MarketOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateMarketOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarketOrder[P]>
      : GetScalarType<T[P], AggregateMarketOrder[P]>
  }




  export type MarketOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarketOrderWhereInput
    orderBy?: MarketOrderOrderByWithAggregationInput | MarketOrderOrderByWithAggregationInput[]
    by: MarketOrderScalarFieldEnum[] | MarketOrderScalarFieldEnum
    having?: MarketOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarketOrderCountAggregateInputType | true
    _avg?: MarketOrderAvgAggregateInputType
    _sum?: MarketOrderSumAggregateInputType
    _min?: MarketOrderMinAggregateInputType
    _max?: MarketOrderMaxAggregateInputType
  }

  export type MarketOrderGroupByOutputType = {
    id: string
    marketOrderId: string
    itemId: string
    locationName: string
    quality: number
    enchantmentLevel: number
    type: string
    amount: number
    price: number
    expiresAt: Date
    receivedAt: Date
    _count: MarketOrderCountAggregateOutputType | null
    _avg: MarketOrderAvgAggregateOutputType | null
    _sum: MarketOrderSumAggregateOutputType | null
    _min: MarketOrderMinAggregateOutputType | null
    _max: MarketOrderMaxAggregateOutputType | null
  }

  type GetMarketOrderGroupByPayload<T extends MarketOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarketOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarketOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarketOrderGroupByOutputType[P]>
            : GetScalarType<T[P], MarketOrderGroupByOutputType[P]>
        }
      >
    >


  export type MarketOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    marketOrderId?: boolean
    itemId?: boolean
    locationName?: boolean
    quality?: boolean
    enchantmentLevel?: boolean
    type?: boolean
    amount?: boolean
    price?: boolean
    expiresAt?: boolean
    receivedAt?: boolean
  }, ExtArgs["result"]["marketOrder"]>

  export type MarketOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    marketOrderId?: boolean
    itemId?: boolean
    locationName?: boolean
    quality?: boolean
    enchantmentLevel?: boolean
    type?: boolean
    amount?: boolean
    price?: boolean
    expiresAt?: boolean
    receivedAt?: boolean
  }, ExtArgs["result"]["marketOrder"]>

  export type MarketOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    marketOrderId?: boolean
    itemId?: boolean
    locationName?: boolean
    quality?: boolean
    enchantmentLevel?: boolean
    type?: boolean
    amount?: boolean
    price?: boolean
    expiresAt?: boolean
    receivedAt?: boolean
  }, ExtArgs["result"]["marketOrder"]>

  export type MarketOrderSelectScalar = {
    id?: boolean
    marketOrderId?: boolean
    itemId?: boolean
    locationName?: boolean
    quality?: boolean
    enchantmentLevel?: boolean
    type?: boolean
    amount?: boolean
    price?: boolean
    expiresAt?: boolean
    receivedAt?: boolean
  }

  export type MarketOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "marketOrderId" | "itemId" | "locationName" | "quality" | "enchantmentLevel" | "type" | "amount" | "price" | "expiresAt" | "receivedAt", ExtArgs["result"]["marketOrder"]>

  export type $MarketOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MarketOrder"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      marketOrderId: string
      itemId: string
      locationName: string
      quality: number
      enchantmentLevel: number
      type: string
      amount: number
      price: number
      expiresAt: Date
      receivedAt: Date
    }, ExtArgs["result"]["marketOrder"]>
    composites: {}
  }

  type MarketOrderGetPayload<S extends boolean | null | undefined | MarketOrderDefaultArgs> = $Result.GetResult<Prisma.$MarketOrderPayload, S>

  type MarketOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MarketOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MarketOrderCountAggregateInputType | true
    }

  export interface MarketOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MarketOrder'], meta: { name: 'MarketOrder' } }
    /**
     * Find zero or one MarketOrder that matches the filter.
     * @param {MarketOrderFindUniqueArgs} args - Arguments to find a MarketOrder
     * @example
     * // Get one MarketOrder
     * const marketOrder = await prisma.marketOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarketOrderFindUniqueArgs>(args: SelectSubset<T, MarketOrderFindUniqueArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MarketOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MarketOrderFindUniqueOrThrowArgs} args - Arguments to find a MarketOrder
     * @example
     * // Get one MarketOrder
     * const marketOrder = await prisma.marketOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarketOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, MarketOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MarketOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketOrderFindFirstArgs} args - Arguments to find a MarketOrder
     * @example
     * // Get one MarketOrder
     * const marketOrder = await prisma.marketOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarketOrderFindFirstArgs>(args?: SelectSubset<T, MarketOrderFindFirstArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MarketOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketOrderFindFirstOrThrowArgs} args - Arguments to find a MarketOrder
     * @example
     * // Get one MarketOrder
     * const marketOrder = await prisma.marketOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarketOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, MarketOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MarketOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MarketOrders
     * const marketOrders = await prisma.marketOrder.findMany()
     * 
     * // Get first 10 MarketOrders
     * const marketOrders = await prisma.marketOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marketOrderWithIdOnly = await prisma.marketOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarketOrderFindManyArgs>(args?: SelectSubset<T, MarketOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MarketOrder.
     * @param {MarketOrderCreateArgs} args - Arguments to create a MarketOrder.
     * @example
     * // Create one MarketOrder
     * const MarketOrder = await prisma.marketOrder.create({
     *   data: {
     *     // ... data to create a MarketOrder
     *   }
     * })
     * 
     */
    create<T extends MarketOrderCreateArgs>(args: SelectSubset<T, MarketOrderCreateArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MarketOrders.
     * @param {MarketOrderCreateManyArgs} args - Arguments to create many MarketOrders.
     * @example
     * // Create many MarketOrders
     * const marketOrder = await prisma.marketOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarketOrderCreateManyArgs>(args?: SelectSubset<T, MarketOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MarketOrders and returns the data saved in the database.
     * @param {MarketOrderCreateManyAndReturnArgs} args - Arguments to create many MarketOrders.
     * @example
     * // Create many MarketOrders
     * const marketOrder = await prisma.marketOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MarketOrders and only return the `id`
     * const marketOrderWithIdOnly = await prisma.marketOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MarketOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, MarketOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MarketOrder.
     * @param {MarketOrderDeleteArgs} args - Arguments to delete one MarketOrder.
     * @example
     * // Delete one MarketOrder
     * const MarketOrder = await prisma.marketOrder.delete({
     *   where: {
     *     // ... filter to delete one MarketOrder
     *   }
     * })
     * 
     */
    delete<T extends MarketOrderDeleteArgs>(args: SelectSubset<T, MarketOrderDeleteArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MarketOrder.
     * @param {MarketOrderUpdateArgs} args - Arguments to update one MarketOrder.
     * @example
     * // Update one MarketOrder
     * const marketOrder = await prisma.marketOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarketOrderUpdateArgs>(args: SelectSubset<T, MarketOrderUpdateArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MarketOrders.
     * @param {MarketOrderDeleteManyArgs} args - Arguments to filter MarketOrders to delete.
     * @example
     * // Delete a few MarketOrders
     * const { count } = await prisma.marketOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarketOrderDeleteManyArgs>(args?: SelectSubset<T, MarketOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MarketOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MarketOrders
     * const marketOrder = await prisma.marketOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarketOrderUpdateManyArgs>(args: SelectSubset<T, MarketOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MarketOrders and returns the data updated in the database.
     * @param {MarketOrderUpdateManyAndReturnArgs} args - Arguments to update many MarketOrders.
     * @example
     * // Update many MarketOrders
     * const marketOrder = await prisma.marketOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MarketOrders and only return the `id`
     * const marketOrderWithIdOnly = await prisma.marketOrder.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MarketOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, MarketOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MarketOrder.
     * @param {MarketOrderUpsertArgs} args - Arguments to update or create a MarketOrder.
     * @example
     * // Update or create a MarketOrder
     * const marketOrder = await prisma.marketOrder.upsert({
     *   create: {
     *     // ... data to create a MarketOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MarketOrder we want to update
     *   }
     * })
     */
    upsert<T extends MarketOrderUpsertArgs>(args: SelectSubset<T, MarketOrderUpsertArgs<ExtArgs>>): Prisma__MarketOrderClient<$Result.GetResult<Prisma.$MarketOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MarketOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketOrderCountArgs} args - Arguments to filter MarketOrders to count.
     * @example
     * // Count the number of MarketOrders
     * const count = await prisma.marketOrder.count({
     *   where: {
     *     // ... the filter for the MarketOrders we want to count
     *   }
     * })
    **/
    count<T extends MarketOrderCountArgs>(
      args?: Subset<T, MarketOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarketOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MarketOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MarketOrderAggregateArgs>(args: Subset<T, MarketOrderAggregateArgs>): Prisma.PrismaPromise<GetMarketOrderAggregateType<T>>

    /**
     * Group by MarketOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MarketOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarketOrderGroupByArgs['orderBy'] }
        : { orderBy?: MarketOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MarketOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MarketOrder model
   */
  readonly fields: MarketOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MarketOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarketOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MarketOrder model
   */
  interface MarketOrderFieldRefs {
    readonly id: FieldRef<"MarketOrder", 'String'>
    readonly marketOrderId: FieldRef<"MarketOrder", 'String'>
    readonly itemId: FieldRef<"MarketOrder", 'String'>
    readonly locationName: FieldRef<"MarketOrder", 'String'>
    readonly quality: FieldRef<"MarketOrder", 'Int'>
    readonly enchantmentLevel: FieldRef<"MarketOrder", 'Int'>
    readonly type: FieldRef<"MarketOrder", 'String'>
    readonly amount: FieldRef<"MarketOrder", 'Int'>
    readonly price: FieldRef<"MarketOrder", 'Int'>
    readonly expiresAt: FieldRef<"MarketOrder", 'DateTime'>
    readonly receivedAt: FieldRef<"MarketOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MarketOrder findUnique
   */
  export type MarketOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * Filter, which MarketOrder to fetch.
     */
    where: MarketOrderWhereUniqueInput
  }

  /**
   * MarketOrder findUniqueOrThrow
   */
  export type MarketOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * Filter, which MarketOrder to fetch.
     */
    where: MarketOrderWhereUniqueInput
  }

  /**
   * MarketOrder findFirst
   */
  export type MarketOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * Filter, which MarketOrder to fetch.
     */
    where?: MarketOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketOrders to fetch.
     */
    orderBy?: MarketOrderOrderByWithRelationInput | MarketOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketOrders.
     */
    cursor?: MarketOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketOrders.
     */
    distinct?: MarketOrderScalarFieldEnum | MarketOrderScalarFieldEnum[]
  }

  /**
   * MarketOrder findFirstOrThrow
   */
  export type MarketOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * Filter, which MarketOrder to fetch.
     */
    where?: MarketOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketOrders to fetch.
     */
    orderBy?: MarketOrderOrderByWithRelationInput | MarketOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketOrders.
     */
    cursor?: MarketOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketOrders.
     */
    distinct?: MarketOrderScalarFieldEnum | MarketOrderScalarFieldEnum[]
  }

  /**
   * MarketOrder findMany
   */
  export type MarketOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * Filter, which MarketOrders to fetch.
     */
    where?: MarketOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketOrders to fetch.
     */
    orderBy?: MarketOrderOrderByWithRelationInput | MarketOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MarketOrders.
     */
    cursor?: MarketOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketOrders.
     */
    skip?: number
    distinct?: MarketOrderScalarFieldEnum | MarketOrderScalarFieldEnum[]
  }

  /**
   * MarketOrder create
   */
  export type MarketOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * The data needed to create a MarketOrder.
     */
    data: XOR<MarketOrderCreateInput, MarketOrderUncheckedCreateInput>
  }

  /**
   * MarketOrder createMany
   */
  export type MarketOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MarketOrders.
     */
    data: MarketOrderCreateManyInput | MarketOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MarketOrder createManyAndReturn
   */
  export type MarketOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * The data used to create many MarketOrders.
     */
    data: MarketOrderCreateManyInput | MarketOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MarketOrder update
   */
  export type MarketOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * The data needed to update a MarketOrder.
     */
    data: XOR<MarketOrderUpdateInput, MarketOrderUncheckedUpdateInput>
    /**
     * Choose, which MarketOrder to update.
     */
    where: MarketOrderWhereUniqueInput
  }

  /**
   * MarketOrder updateMany
   */
  export type MarketOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MarketOrders.
     */
    data: XOR<MarketOrderUpdateManyMutationInput, MarketOrderUncheckedUpdateManyInput>
    /**
     * Filter which MarketOrders to update
     */
    where?: MarketOrderWhereInput
    /**
     * Limit how many MarketOrders to update.
     */
    limit?: number
  }

  /**
   * MarketOrder updateManyAndReturn
   */
  export type MarketOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * The data used to update MarketOrders.
     */
    data: XOR<MarketOrderUpdateManyMutationInput, MarketOrderUncheckedUpdateManyInput>
    /**
     * Filter which MarketOrders to update
     */
    where?: MarketOrderWhereInput
    /**
     * Limit how many MarketOrders to update.
     */
    limit?: number
  }

  /**
   * MarketOrder upsert
   */
  export type MarketOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * The filter to search for the MarketOrder to update in case it exists.
     */
    where: MarketOrderWhereUniqueInput
    /**
     * In case the MarketOrder found by the `where` argument doesn't exist, create a new MarketOrder with this data.
     */
    create: XOR<MarketOrderCreateInput, MarketOrderUncheckedCreateInput>
    /**
     * In case the MarketOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarketOrderUpdateInput, MarketOrderUncheckedUpdateInput>
  }

  /**
   * MarketOrder delete
   */
  export type MarketOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
    /**
     * Filter which MarketOrder to delete.
     */
    where: MarketOrderWhereUniqueInput
  }

  /**
   * MarketOrder deleteMany
   */
  export type MarketOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketOrders to delete
     */
    where?: MarketOrderWhereInput
    /**
     * Limit how many MarketOrders to delete.
     */
    limit?: number
  }

  /**
   * MarketOrder without action
   */
  export type MarketOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketOrder
     */
    select?: MarketOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketOrder
     */
    omit?: MarketOrderOmit<ExtArgs> | null
  }


  /**
   * Model OcrPrice
   */

  export type AggregateOcrPrice = {
    _count: OcrPriceCountAggregateOutputType | null
    _avg: OcrPriceAvgAggregateOutputType | null
    _sum: OcrPriceSumAggregateOutputType | null
    _min: OcrPriceMinAggregateOutputType | null
    _max: OcrPriceMaxAggregateOutputType | null
  }

  export type OcrPriceAvgAggregateOutputType = {
    quality: number | null
    price: number | null
  }

  export type OcrPriceSumAggregateOutputType = {
    quality: number | null
    price: number | null
  }

  export type OcrPriceMinAggregateOutputType = {
    id: string | null
    itemId: string | null
    quality: number | null
    location: string | null
    price: number | null
    createdAt: Date | null
  }

  export type OcrPriceMaxAggregateOutputType = {
    id: string | null
    itemId: string | null
    quality: number | null
    location: string | null
    price: number | null
    createdAt: Date | null
  }

  export type OcrPriceCountAggregateOutputType = {
    id: number
    itemId: number
    quality: number
    location: number
    price: number
    createdAt: number
    _all: number
  }


  export type OcrPriceAvgAggregateInputType = {
    quality?: true
    price?: true
  }

  export type OcrPriceSumAggregateInputType = {
    quality?: true
    price?: true
  }

  export type OcrPriceMinAggregateInputType = {
    id?: true
    itemId?: true
    quality?: true
    location?: true
    price?: true
    createdAt?: true
  }

  export type OcrPriceMaxAggregateInputType = {
    id?: true
    itemId?: true
    quality?: true
    location?: true
    price?: true
    createdAt?: true
  }

  export type OcrPriceCountAggregateInputType = {
    id?: true
    itemId?: true
    quality?: true
    location?: true
    price?: true
    createdAt?: true
    _all?: true
  }

  export type OcrPriceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OcrPrice to aggregate.
     */
    where?: OcrPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcrPrices to fetch.
     */
    orderBy?: OcrPriceOrderByWithRelationInput | OcrPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OcrPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcrPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcrPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OcrPrices
    **/
    _count?: true | OcrPriceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OcrPriceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OcrPriceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OcrPriceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OcrPriceMaxAggregateInputType
  }

  export type GetOcrPriceAggregateType<T extends OcrPriceAggregateArgs> = {
        [P in keyof T & keyof AggregateOcrPrice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOcrPrice[P]>
      : GetScalarType<T[P], AggregateOcrPrice[P]>
  }




  export type OcrPriceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OcrPriceWhereInput
    orderBy?: OcrPriceOrderByWithAggregationInput | OcrPriceOrderByWithAggregationInput[]
    by: OcrPriceScalarFieldEnum[] | OcrPriceScalarFieldEnum
    having?: OcrPriceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OcrPriceCountAggregateInputType | true
    _avg?: OcrPriceAvgAggregateInputType
    _sum?: OcrPriceSumAggregateInputType
    _min?: OcrPriceMinAggregateInputType
    _max?: OcrPriceMaxAggregateInputType
  }

  export type OcrPriceGroupByOutputType = {
    id: string
    itemId: string
    quality: number
    location: string
    price: number
    createdAt: Date
    _count: OcrPriceCountAggregateOutputType | null
    _avg: OcrPriceAvgAggregateOutputType | null
    _sum: OcrPriceSumAggregateOutputType | null
    _min: OcrPriceMinAggregateOutputType | null
    _max: OcrPriceMaxAggregateOutputType | null
  }

  type GetOcrPriceGroupByPayload<T extends OcrPriceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OcrPriceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OcrPriceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OcrPriceGroupByOutputType[P]>
            : GetScalarType<T[P], OcrPriceGroupByOutputType[P]>
        }
      >
    >


  export type OcrPriceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    quality?: boolean
    location?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ocrPrice"]>

  export type OcrPriceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    quality?: boolean
    location?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ocrPrice"]>

  export type OcrPriceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    quality?: boolean
    location?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ocrPrice"]>

  export type OcrPriceSelectScalar = {
    id?: boolean
    itemId?: boolean
    quality?: boolean
    location?: boolean
    price?: boolean
    createdAt?: boolean
  }

  export type OcrPriceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itemId" | "quality" | "location" | "price" | "createdAt", ExtArgs["result"]["ocrPrice"]>

  export type $OcrPricePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OcrPrice"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemId: string
      quality: number
      location: string
      price: number
      createdAt: Date
    }, ExtArgs["result"]["ocrPrice"]>
    composites: {}
  }

  type OcrPriceGetPayload<S extends boolean | null | undefined | OcrPriceDefaultArgs> = $Result.GetResult<Prisma.$OcrPricePayload, S>

  type OcrPriceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OcrPriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OcrPriceCountAggregateInputType | true
    }

  export interface OcrPriceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OcrPrice'], meta: { name: 'OcrPrice' } }
    /**
     * Find zero or one OcrPrice that matches the filter.
     * @param {OcrPriceFindUniqueArgs} args - Arguments to find a OcrPrice
     * @example
     * // Get one OcrPrice
     * const ocrPrice = await prisma.ocrPrice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OcrPriceFindUniqueArgs>(args: SelectSubset<T, OcrPriceFindUniqueArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OcrPrice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OcrPriceFindUniqueOrThrowArgs} args - Arguments to find a OcrPrice
     * @example
     * // Get one OcrPrice
     * const ocrPrice = await prisma.ocrPrice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OcrPriceFindUniqueOrThrowArgs>(args: SelectSubset<T, OcrPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OcrPrice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcrPriceFindFirstArgs} args - Arguments to find a OcrPrice
     * @example
     * // Get one OcrPrice
     * const ocrPrice = await prisma.ocrPrice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OcrPriceFindFirstArgs>(args?: SelectSubset<T, OcrPriceFindFirstArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OcrPrice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcrPriceFindFirstOrThrowArgs} args - Arguments to find a OcrPrice
     * @example
     * // Get one OcrPrice
     * const ocrPrice = await prisma.ocrPrice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OcrPriceFindFirstOrThrowArgs>(args?: SelectSubset<T, OcrPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OcrPrices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcrPriceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OcrPrices
     * const ocrPrices = await prisma.ocrPrice.findMany()
     * 
     * // Get first 10 OcrPrices
     * const ocrPrices = await prisma.ocrPrice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ocrPriceWithIdOnly = await prisma.ocrPrice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OcrPriceFindManyArgs>(args?: SelectSubset<T, OcrPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OcrPrice.
     * @param {OcrPriceCreateArgs} args - Arguments to create a OcrPrice.
     * @example
     * // Create one OcrPrice
     * const OcrPrice = await prisma.ocrPrice.create({
     *   data: {
     *     // ... data to create a OcrPrice
     *   }
     * })
     * 
     */
    create<T extends OcrPriceCreateArgs>(args: SelectSubset<T, OcrPriceCreateArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OcrPrices.
     * @param {OcrPriceCreateManyArgs} args - Arguments to create many OcrPrices.
     * @example
     * // Create many OcrPrices
     * const ocrPrice = await prisma.ocrPrice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OcrPriceCreateManyArgs>(args?: SelectSubset<T, OcrPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OcrPrices and returns the data saved in the database.
     * @param {OcrPriceCreateManyAndReturnArgs} args - Arguments to create many OcrPrices.
     * @example
     * // Create many OcrPrices
     * const ocrPrice = await prisma.ocrPrice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OcrPrices and only return the `id`
     * const ocrPriceWithIdOnly = await prisma.ocrPrice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OcrPriceCreateManyAndReturnArgs>(args?: SelectSubset<T, OcrPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OcrPrice.
     * @param {OcrPriceDeleteArgs} args - Arguments to delete one OcrPrice.
     * @example
     * // Delete one OcrPrice
     * const OcrPrice = await prisma.ocrPrice.delete({
     *   where: {
     *     // ... filter to delete one OcrPrice
     *   }
     * })
     * 
     */
    delete<T extends OcrPriceDeleteArgs>(args: SelectSubset<T, OcrPriceDeleteArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OcrPrice.
     * @param {OcrPriceUpdateArgs} args - Arguments to update one OcrPrice.
     * @example
     * // Update one OcrPrice
     * const ocrPrice = await prisma.ocrPrice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OcrPriceUpdateArgs>(args: SelectSubset<T, OcrPriceUpdateArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OcrPrices.
     * @param {OcrPriceDeleteManyArgs} args - Arguments to filter OcrPrices to delete.
     * @example
     * // Delete a few OcrPrices
     * const { count } = await prisma.ocrPrice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OcrPriceDeleteManyArgs>(args?: SelectSubset<T, OcrPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OcrPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcrPriceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OcrPrices
     * const ocrPrice = await prisma.ocrPrice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OcrPriceUpdateManyArgs>(args: SelectSubset<T, OcrPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OcrPrices and returns the data updated in the database.
     * @param {OcrPriceUpdateManyAndReturnArgs} args - Arguments to update many OcrPrices.
     * @example
     * // Update many OcrPrices
     * const ocrPrice = await prisma.ocrPrice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OcrPrices and only return the `id`
     * const ocrPriceWithIdOnly = await prisma.ocrPrice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OcrPriceUpdateManyAndReturnArgs>(args: SelectSubset<T, OcrPriceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OcrPrice.
     * @param {OcrPriceUpsertArgs} args - Arguments to update or create a OcrPrice.
     * @example
     * // Update or create a OcrPrice
     * const ocrPrice = await prisma.ocrPrice.upsert({
     *   create: {
     *     // ... data to create a OcrPrice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OcrPrice we want to update
     *   }
     * })
     */
    upsert<T extends OcrPriceUpsertArgs>(args: SelectSubset<T, OcrPriceUpsertArgs<ExtArgs>>): Prisma__OcrPriceClient<$Result.GetResult<Prisma.$OcrPricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OcrPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcrPriceCountArgs} args - Arguments to filter OcrPrices to count.
     * @example
     * // Count the number of OcrPrices
     * const count = await prisma.ocrPrice.count({
     *   where: {
     *     // ... the filter for the OcrPrices we want to count
     *   }
     * })
    **/
    count<T extends OcrPriceCountArgs>(
      args?: Subset<T, OcrPriceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OcrPriceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OcrPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcrPriceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OcrPriceAggregateArgs>(args: Subset<T, OcrPriceAggregateArgs>): Prisma.PrismaPromise<GetOcrPriceAggregateType<T>>

    /**
     * Group by OcrPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcrPriceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OcrPriceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OcrPriceGroupByArgs['orderBy'] }
        : { orderBy?: OcrPriceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OcrPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOcrPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OcrPrice model
   */
  readonly fields: OcrPriceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OcrPrice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OcrPriceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OcrPrice model
   */
  interface OcrPriceFieldRefs {
    readonly id: FieldRef<"OcrPrice", 'String'>
    readonly itemId: FieldRef<"OcrPrice", 'String'>
    readonly quality: FieldRef<"OcrPrice", 'Int'>
    readonly location: FieldRef<"OcrPrice", 'String'>
    readonly price: FieldRef<"OcrPrice", 'Int'>
    readonly createdAt: FieldRef<"OcrPrice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OcrPrice findUnique
   */
  export type OcrPriceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * Filter, which OcrPrice to fetch.
     */
    where: OcrPriceWhereUniqueInput
  }

  /**
   * OcrPrice findUniqueOrThrow
   */
  export type OcrPriceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * Filter, which OcrPrice to fetch.
     */
    where: OcrPriceWhereUniqueInput
  }

  /**
   * OcrPrice findFirst
   */
  export type OcrPriceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * Filter, which OcrPrice to fetch.
     */
    where?: OcrPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcrPrices to fetch.
     */
    orderBy?: OcrPriceOrderByWithRelationInput | OcrPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OcrPrices.
     */
    cursor?: OcrPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcrPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcrPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OcrPrices.
     */
    distinct?: OcrPriceScalarFieldEnum | OcrPriceScalarFieldEnum[]
  }

  /**
   * OcrPrice findFirstOrThrow
   */
  export type OcrPriceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * Filter, which OcrPrice to fetch.
     */
    where?: OcrPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcrPrices to fetch.
     */
    orderBy?: OcrPriceOrderByWithRelationInput | OcrPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OcrPrices.
     */
    cursor?: OcrPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcrPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcrPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OcrPrices.
     */
    distinct?: OcrPriceScalarFieldEnum | OcrPriceScalarFieldEnum[]
  }

  /**
   * OcrPrice findMany
   */
  export type OcrPriceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * Filter, which OcrPrices to fetch.
     */
    where?: OcrPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcrPrices to fetch.
     */
    orderBy?: OcrPriceOrderByWithRelationInput | OcrPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OcrPrices.
     */
    cursor?: OcrPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcrPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcrPrices.
     */
    skip?: number
    distinct?: OcrPriceScalarFieldEnum | OcrPriceScalarFieldEnum[]
  }

  /**
   * OcrPrice create
   */
  export type OcrPriceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * The data needed to create a OcrPrice.
     */
    data: XOR<OcrPriceCreateInput, OcrPriceUncheckedCreateInput>
  }

  /**
   * OcrPrice createMany
   */
  export type OcrPriceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OcrPrices.
     */
    data: OcrPriceCreateManyInput | OcrPriceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OcrPrice createManyAndReturn
   */
  export type OcrPriceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * The data used to create many OcrPrices.
     */
    data: OcrPriceCreateManyInput | OcrPriceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OcrPrice update
   */
  export type OcrPriceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * The data needed to update a OcrPrice.
     */
    data: XOR<OcrPriceUpdateInput, OcrPriceUncheckedUpdateInput>
    /**
     * Choose, which OcrPrice to update.
     */
    where: OcrPriceWhereUniqueInput
  }

  /**
   * OcrPrice updateMany
   */
  export type OcrPriceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OcrPrices.
     */
    data: XOR<OcrPriceUpdateManyMutationInput, OcrPriceUncheckedUpdateManyInput>
    /**
     * Filter which OcrPrices to update
     */
    where?: OcrPriceWhereInput
    /**
     * Limit how many OcrPrices to update.
     */
    limit?: number
  }

  /**
   * OcrPrice updateManyAndReturn
   */
  export type OcrPriceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * The data used to update OcrPrices.
     */
    data: XOR<OcrPriceUpdateManyMutationInput, OcrPriceUncheckedUpdateManyInput>
    /**
     * Filter which OcrPrices to update
     */
    where?: OcrPriceWhereInput
    /**
     * Limit how many OcrPrices to update.
     */
    limit?: number
  }

  /**
   * OcrPrice upsert
   */
  export type OcrPriceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * The filter to search for the OcrPrice to update in case it exists.
     */
    where: OcrPriceWhereUniqueInput
    /**
     * In case the OcrPrice found by the `where` argument doesn't exist, create a new OcrPrice with this data.
     */
    create: XOR<OcrPriceCreateInput, OcrPriceUncheckedCreateInput>
    /**
     * In case the OcrPrice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OcrPriceUpdateInput, OcrPriceUncheckedUpdateInput>
  }

  /**
   * OcrPrice delete
   */
  export type OcrPriceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
    /**
     * Filter which OcrPrice to delete.
     */
    where: OcrPriceWhereUniqueInput
  }

  /**
   * OcrPrice deleteMany
   */
  export type OcrPriceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OcrPrices to delete
     */
    where?: OcrPriceWhereInput
    /**
     * Limit how many OcrPrices to delete.
     */
    limit?: number
  }

  /**
   * OcrPrice without action
   */
  export type OcrPriceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcrPrice
     */
    select?: OcrPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcrPrice
     */
    omit?: OcrPriceOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MarketOrderScalarFieldEnum: {
    id: 'id',
    marketOrderId: 'marketOrderId',
    itemId: 'itemId',
    locationName: 'locationName',
    quality: 'quality',
    enchantmentLevel: 'enchantmentLevel',
    type: 'type',
    amount: 'amount',
    price: 'price',
    expiresAt: 'expiresAt',
    receivedAt: 'receivedAt'
  };

  export type MarketOrderScalarFieldEnum = (typeof MarketOrderScalarFieldEnum)[keyof typeof MarketOrderScalarFieldEnum]


  export const OcrPriceScalarFieldEnum: {
    id: 'id',
    itemId: 'itemId',
    quality: 'quality',
    location: 'location',
    price: 'price',
    createdAt: 'createdAt'
  };

  export type OcrPriceScalarFieldEnum = (typeof OcrPriceScalarFieldEnum)[keyof typeof OcrPriceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type MarketOrderWhereInput = {
    AND?: MarketOrderWhereInput | MarketOrderWhereInput[]
    OR?: MarketOrderWhereInput[]
    NOT?: MarketOrderWhereInput | MarketOrderWhereInput[]
    id?: StringFilter<"MarketOrder"> | string
    marketOrderId?: StringFilter<"MarketOrder"> | string
    itemId?: StringFilter<"MarketOrder"> | string
    locationName?: StringFilter<"MarketOrder"> | string
    quality?: IntFilter<"MarketOrder"> | number
    enchantmentLevel?: IntFilter<"MarketOrder"> | number
    type?: StringFilter<"MarketOrder"> | string
    amount?: IntFilter<"MarketOrder"> | number
    price?: IntFilter<"MarketOrder"> | number
    expiresAt?: DateTimeFilter<"MarketOrder"> | Date | string
    receivedAt?: DateTimeFilter<"MarketOrder"> | Date | string
  }

  export type MarketOrderOrderByWithRelationInput = {
    id?: SortOrder
    marketOrderId?: SortOrder
    itemId?: SortOrder
    locationName?: SortOrder
    quality?: SortOrder
    enchantmentLevel?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    expiresAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type MarketOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MarketOrderWhereInput | MarketOrderWhereInput[]
    OR?: MarketOrderWhereInput[]
    NOT?: MarketOrderWhereInput | MarketOrderWhereInput[]
    marketOrderId?: StringFilter<"MarketOrder"> | string
    itemId?: StringFilter<"MarketOrder"> | string
    locationName?: StringFilter<"MarketOrder"> | string
    quality?: IntFilter<"MarketOrder"> | number
    enchantmentLevel?: IntFilter<"MarketOrder"> | number
    type?: StringFilter<"MarketOrder"> | string
    amount?: IntFilter<"MarketOrder"> | number
    price?: IntFilter<"MarketOrder"> | number
    expiresAt?: DateTimeFilter<"MarketOrder"> | Date | string
    receivedAt?: DateTimeFilter<"MarketOrder"> | Date | string
  }, "id">

  export type MarketOrderOrderByWithAggregationInput = {
    id?: SortOrder
    marketOrderId?: SortOrder
    itemId?: SortOrder
    locationName?: SortOrder
    quality?: SortOrder
    enchantmentLevel?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    expiresAt?: SortOrder
    receivedAt?: SortOrder
    _count?: MarketOrderCountOrderByAggregateInput
    _avg?: MarketOrderAvgOrderByAggregateInput
    _max?: MarketOrderMaxOrderByAggregateInput
    _min?: MarketOrderMinOrderByAggregateInput
    _sum?: MarketOrderSumOrderByAggregateInput
  }

  export type MarketOrderScalarWhereWithAggregatesInput = {
    AND?: MarketOrderScalarWhereWithAggregatesInput | MarketOrderScalarWhereWithAggregatesInput[]
    OR?: MarketOrderScalarWhereWithAggregatesInput[]
    NOT?: MarketOrderScalarWhereWithAggregatesInput | MarketOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MarketOrder"> | string
    marketOrderId?: StringWithAggregatesFilter<"MarketOrder"> | string
    itemId?: StringWithAggregatesFilter<"MarketOrder"> | string
    locationName?: StringWithAggregatesFilter<"MarketOrder"> | string
    quality?: IntWithAggregatesFilter<"MarketOrder"> | number
    enchantmentLevel?: IntWithAggregatesFilter<"MarketOrder"> | number
    type?: StringWithAggregatesFilter<"MarketOrder"> | string
    amount?: IntWithAggregatesFilter<"MarketOrder"> | number
    price?: IntWithAggregatesFilter<"MarketOrder"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"MarketOrder"> | Date | string
    receivedAt?: DateTimeWithAggregatesFilter<"MarketOrder"> | Date | string
  }

  export type OcrPriceWhereInput = {
    AND?: OcrPriceWhereInput | OcrPriceWhereInput[]
    OR?: OcrPriceWhereInput[]
    NOT?: OcrPriceWhereInput | OcrPriceWhereInput[]
    id?: StringFilter<"OcrPrice"> | string
    itemId?: StringFilter<"OcrPrice"> | string
    quality?: IntFilter<"OcrPrice"> | number
    location?: StringFilter<"OcrPrice"> | string
    price?: IntFilter<"OcrPrice"> | number
    createdAt?: DateTimeFilter<"OcrPrice"> | Date | string
  }

  export type OcrPriceOrderByWithRelationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quality?: SortOrder
    location?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type OcrPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OcrPriceWhereInput | OcrPriceWhereInput[]
    OR?: OcrPriceWhereInput[]
    NOT?: OcrPriceWhereInput | OcrPriceWhereInput[]
    itemId?: StringFilter<"OcrPrice"> | string
    quality?: IntFilter<"OcrPrice"> | number
    location?: StringFilter<"OcrPrice"> | string
    price?: IntFilter<"OcrPrice"> | number
    createdAt?: DateTimeFilter<"OcrPrice"> | Date | string
  }, "id">

  export type OcrPriceOrderByWithAggregationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quality?: SortOrder
    location?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    _count?: OcrPriceCountOrderByAggregateInput
    _avg?: OcrPriceAvgOrderByAggregateInput
    _max?: OcrPriceMaxOrderByAggregateInput
    _min?: OcrPriceMinOrderByAggregateInput
    _sum?: OcrPriceSumOrderByAggregateInput
  }

  export type OcrPriceScalarWhereWithAggregatesInput = {
    AND?: OcrPriceScalarWhereWithAggregatesInput | OcrPriceScalarWhereWithAggregatesInput[]
    OR?: OcrPriceScalarWhereWithAggregatesInput[]
    NOT?: OcrPriceScalarWhereWithAggregatesInput | OcrPriceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OcrPrice"> | string
    itemId?: StringWithAggregatesFilter<"OcrPrice"> | string
    quality?: IntWithAggregatesFilter<"OcrPrice"> | number
    location?: StringWithAggregatesFilter<"OcrPrice"> | string
    price?: IntWithAggregatesFilter<"OcrPrice"> | number
    createdAt?: DateTimeWithAggregatesFilter<"OcrPrice"> | Date | string
  }

  export type MarketOrderCreateInput = {
    id?: string
    marketOrderId: string
    itemId: string
    locationName: string
    quality: number
    enchantmentLevel: number
    type: string
    amount: number
    price: number
    expiresAt: Date | string
    receivedAt?: Date | string
  }

  export type MarketOrderUncheckedCreateInput = {
    id?: string
    marketOrderId: string
    itemId: string
    locationName: string
    quality: number
    enchantmentLevel: number
    type: string
    amount: number
    price: number
    expiresAt: Date | string
    receivedAt?: Date | string
  }

  export type MarketOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketOrderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    locationName?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    enchantmentLevel?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketOrderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    locationName?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    enchantmentLevel?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketOrderCreateManyInput = {
    id?: string
    marketOrderId: string
    itemId: string
    locationName: string
    quality: number
    enchantmentLevel: number
    type: string
    amount: number
    price: number
    expiresAt: Date | string
    receivedAt?: Date | string
  }

  export type MarketOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketOrderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    locationName?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    enchantmentLevel?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketOrderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    locationName?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    enchantmentLevel?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcrPriceCreateInput = {
    id?: string
    itemId: string
    quality?: number
    location: string
    price: number
    createdAt?: Date | string
  }

  export type OcrPriceUncheckedCreateInput = {
    id?: string
    itemId: string
    quality?: number
    location: string
    price: number
    createdAt?: Date | string
  }

  export type OcrPriceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcrPriceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcrPriceCreateManyInput = {
    id?: string
    itemId: string
    quality?: number
    location: string
    price: number
    createdAt?: Date | string
  }

  export type OcrPriceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcrPriceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quality?: IntFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MarketOrderCountOrderByAggregateInput = {
    id?: SortOrder
    marketOrderId?: SortOrder
    itemId?: SortOrder
    locationName?: SortOrder
    quality?: SortOrder
    enchantmentLevel?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    expiresAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type MarketOrderAvgOrderByAggregateInput = {
    quality?: SortOrder
    enchantmentLevel?: SortOrder
    amount?: SortOrder
    price?: SortOrder
  }

  export type MarketOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    marketOrderId?: SortOrder
    itemId?: SortOrder
    locationName?: SortOrder
    quality?: SortOrder
    enchantmentLevel?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    expiresAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type MarketOrderMinOrderByAggregateInput = {
    id?: SortOrder
    marketOrderId?: SortOrder
    itemId?: SortOrder
    locationName?: SortOrder
    quality?: SortOrder
    enchantmentLevel?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    expiresAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type MarketOrderSumOrderByAggregateInput = {
    quality?: SortOrder
    enchantmentLevel?: SortOrder
    amount?: SortOrder
    price?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OcrPriceCountOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quality?: SortOrder
    location?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type OcrPriceAvgOrderByAggregateInput = {
    quality?: SortOrder
    price?: SortOrder
  }

  export type OcrPriceMaxOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quality?: SortOrder
    location?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type OcrPriceMinOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quality?: SortOrder
    location?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type OcrPriceSumOrderByAggregateInput = {
    quality?: SortOrder
    price?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}