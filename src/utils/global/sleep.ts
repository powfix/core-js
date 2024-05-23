export const sleep = async (time: number, callback?: (...args: any) => void, ...args: any): Promise<any[]> => new Promise((resolve) => {
  setTimeout(() => {
    callback?.(...args);
    resolve(args);
  }, time);
});
