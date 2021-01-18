import { Circle, Coordinate } from '@/components/Drawer/Drawer';

export abstract class Area {
  public abstract isCircleFit(circle: Circle): boolean;

  protected abstract getStartCoordinate(circleRadius: number): Coordinate;

  public findFirstCircleCenter(
    circleRadius: number,
    [initX, initY]: Coordinate = this.getStartCoordinate(circleRadius),
    radius = 1,
  ): Coordinate {
    if (radius > 10) {
      throw new Error();
    }
    const lastPosition = {
      x: initX,
      y: initY,
    };
    const checkSpiralSide = (
      condition: number,
      axis: 'x' | 'y',
      offset: number,
    ): boolean => {
      for (let i = 0; i < condition; i += 1) {
        lastPosition[axis] += offset;
        if (this.isCircleFit(
          {
            x: lastPosition.x,
            y: lastPosition.y,
            r: circleRadius,
          },
        )) {
          return true;
        }
      }
      return false;
    };

    const checkNewRadiusStartPosition = (): boolean => this.isCircleFit(
      {
        x: initX,
        y: initY,
        r: circleRadius,
      },
    );

    const checkCeilRightSide = (): boolean => checkSpiralSide(radius, 'x', 1);
    const checkRightSide = (): boolean => checkSpiralSide(radius * 2, 'y', -1);
    const checkBottom = (): boolean => checkSpiralSide(radius * 2, 'x', -1);
    const checkLeftSide = (): boolean => checkSpiralSide(radius * 2, 'y', 1);
    const checkCeilLeftSide = (): boolean => checkSpiralSide(radius - 1, 'x', 1);

    if (
      checkNewRadiusStartPosition()
      || checkCeilRightSide()
      || checkRightSide()
      || checkBottom()
      || checkLeftSide()
      || checkCeilLeftSide()
    ) {
      return [lastPosition.x, lastPosition.y];
    }
    return this.findFirstCircleCenter(
      circleRadius,
      [lastPosition.x + 1, lastPosition.y + 1],
      radius + 1,
    );
  }

  public abstract isExists(): boolean;
}
