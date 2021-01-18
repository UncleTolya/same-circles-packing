import { Area } from '@/components/Area/Area';
import { Circle, Coordinate } from '@/components/Drawer/Drawer';

const intersects = require('intersects');

export class CircleArea extends Area implements Circle {
  constructor(
    public x: number,
    public y: number,
    public r: number,
  ) {
    super();
  }

  public isCircleFit({ x, y, r }: Circle): boolean {
    const { x: xt, y: yt, r: rt } = this;
    const dc = Math.sqrt((xt - x) ** 2 + (yt - y) ** 2);
    return !(rt - r < dc && rt + r > dc)
      && intersects.circlePoint(xt, yt, rt, x, y);
  }

  public isExists(): boolean {
    return this.r > 0;
  }

  protected getStartCoordinate(circleRadius: number): Coordinate {
    return [this.x, this.y];
  }
}
