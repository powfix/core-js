import base64 from 'base-64';

const {decode, encode} = base64;

export const base64Polyfill = () => {
  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }

  console.log('base64-polyfill initialized', Date.now());
};
