import { Area } from '@/components/Area/Area';
import { Circle, Coordinate, Rectangle } from '@/components/Drawer/Drawer';

const intersects = require('intersects');

export class RectangleArea extends Area implements Rectangle {
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

  public isExists(): boolean {
    const { points } = this;
    const firstX = points[0][0];
    const beforeLastX = points[points.length - 3][0];
    if (beforeLastX <= firstX) {
      return false;
    }
    const firstY = points[0][1];
    const beforeLastY = points[points.length - 2][1];
    return beforeLastY >= firstY;
  }

  protected getStartCoordinate(circleRadius: number): Coordinate {
    const { points } = this;
    return [points[0][0] + circleRadius, points[0][1] + circleRadius];
  }
}
