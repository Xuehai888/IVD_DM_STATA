declare module 'jstat' {
  export function mean(arr: number[]): number;
  export function stdev(arr: number[], flag?: boolean): number;
  export function skewness(arr: number[]): number;
  export function kurtosis(arr: number[]): number;
  export function median(arr: number[]): number;
  export function min(arr: number[]): number;
  export function max(arr: number[]): number;
  export function sum(arr: number[]): number;
  export function sumsqerr(arr: number[]): number;
  export function variance(arr: number[], flag?: boolean): number;
  export function corrcoeff(arr1: number[], arr2: number[]): number;
  export function slope(arr1: number[], arr2: number[]): number;
  export function intercept(arr1: number[], arr2: number[]): number;

  export namespace normal {
    export function cdf(x: number, mean: number, std: number): number;
    export function inv(p: number, mean: number, std: number): number;
  }

  export namespace studentt {
    export function cdf(x: number, df: number): number;
    export function inv(p: number, df: number): number;
  }
}