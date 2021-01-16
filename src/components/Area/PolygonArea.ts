import { Area } from "@/components/Area/Area";
import { Circle, Coordinate, Polygon } from "@/components/Drawer/Drawer";

const intersects = require('intersects');

export class PolygonArea extends Area implements Polygon {
  constructor(public points: Coordinate[]) {
    super();
  }


  public isCircleFit({ x, y, r }: Circle): boolean {
    const { points } = this;
    if (!intersects.polygonPoint(points.flat(), x, y)) {
      return false;
    }
    for (let i = 0; i < points.length - 1; i += 1) {
      const x1 = points[i][0];
      const y1 = points[i][1];
      const x2 = points[i + 1][0];
      const y2 = points[i + 1][1];
      if (intersects.circleLine(x, y, r, x1, y1, x2, y2)) {
        return false;
      }
    }
    return true;
  }

  protected getStartCoordinate(circleRadius: number): Coordinate {
    const { points } = this;
    return [points[0][0] + circleRadius, points[0][1] + circleRadius];
  }
}
