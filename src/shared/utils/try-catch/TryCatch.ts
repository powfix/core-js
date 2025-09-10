/**
 * Provides a utility class for handling synchronous and asynchronous operations with a consistent try-catch pattern.
 * It returns a tuple where the first element is the error (or null on success) and the second element is the result (or undefined on error).
 */
export class TryCatch {
  /**
   * Executes a synchronous function within a try-catch block.
   * @template T The return type of the function.
   * @template E The type of the error that might be thrown (defaults to Error).
   * @param fn The synchronous function to execute.
   *@param disableLogging console.error is default way of logging on error. You can disable it by setting it true
   * @returns A tuple containing the result of the function and an error (null if successful).
   */
  static function<T, E = Error>(fn: () => T, disableLogging?: boolean) {
    try {
      return [
        null,
        fn(),
      ] as const;
    } catch (e) {
      if (!disableLogging) {
        console.error("ERROR in TryCatch: " , e)
      }
      if (e == null) {
        e = new Error("Unknown error")
      }
      return [
        e as E,
        undefined,
      ] as const;
    }
  }

  /**
   * Executes an asynchronous function (Promise) within a try-catch block.
   * @template T The resolved value type of the Promise.
   * @template E The type of the error that might be rejected (defaults to Error).
   * @param fn The Promise to await.
   * @param disableLogging console.error is default way of logging on error. You can disable it by setting it true
   * @returns A tuple containing the resolved value of the Promise and an error (null if successful).
   */
  static async asyncFunction<T, E = Error>(fn: Promise<T>, disableLogging?: boolean) {
    try {
      const data = await fn;
      return [
        null,
        data,
      ] as const;
    } catch (e) {
      if (!disableLogging) {
        console.error("ERROR in TryCatch: " , e)
      }
      if (e == null) {
        e = new Error("Unknown error")
      }
      return [
        e as E,
        undefined,
      ] as const;
    }
  }
}
