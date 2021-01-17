import { Area } from "@/components/Area/Area";
import { Circle, Coordinate } from "@/components/Drawer/Drawer";

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
    return !intersects.circleCircle(x, y, r, xt, yt, rt);
  }

  protected getStartCoordinate(circleRadius: number): Coordinate {
    return [this.x, this.y];
  }
}
