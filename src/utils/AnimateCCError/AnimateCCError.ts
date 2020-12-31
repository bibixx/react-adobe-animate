export default class AnimateCCError extends Error {
  public animationName: string;

  public name = "AnimateCCError";

  __proto__: AnimateCCError;

  constructor(animationName: string) {
    super(`Animation with name ${animationName} was not found`);
    this.constructor = AnimateCCError;
    // eslint-disable-next-line no-proto
    this.__proto__ = AnimateCCError.prototype;

    this.animationName = animationName;
  }
}
