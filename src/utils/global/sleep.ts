export const sleep = async (delayInMilliseconds: number, callback?: (...args: any) => void, ...args: any): Promise<any[]> => new Promise((resolve) => {
  setTimeout(() => {
    callback?.(...args);
    resolve(args);
  }, delayInMilliseconds);
});
