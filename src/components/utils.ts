import {Area} from "@/components/Area/Area";
import {Circle, Coordinate} from "@/components/Drawer/Drawer";

export const noop = (...elements: any): void => {};

const getCloseCentres = ({ x, y, r }: Circle): Coordinate[] => {
  return [
    [x + 2 * r, y],
    [x + r, y + r * Math.sqrt(3)],
    [x - r, y + r * Math.sqrt(3)],
    [x - 2 * r, y],
    [x - r, y - r * Math.sqrt(3)],
    [x + r, y - r * Math.sqrt(3)],
  ];
}

export const getFittedCentres = (
  area: Area,
  circleRadius: number,
  maximum: number = 10000,
): Coordinate[] => {
  let firstCenter;
  try {
    firstCenter = area.findFirstCircleCenter(circleRadius);
  } catch {
    return [];
  }

  const queue = [firstCenter, ...getCloseCentres({
    x: firstCenter[0],
    y: firstCenter[1],
    r: circleRadius,
  })];
  const checkedCentres: Coordinate[] = [];
  const fittedCentres = [];
  while (queue.length && (maximum === 0 || fittedCentres.length <= maximum - 1)) {
    const center = queue.shift();
    if (!center) {
      break;
    }
    if (checkedCentres.find(([x, y]) => x === center[0] && y === center[1])) {
      // eslint-disable-next-line no-continue
      continue;
    }
    checkedCentres.push(center);
    const circle = { x: center[0], y: center[1], r: circleRadius };
    if (area.isCircleFit(circle)) {
      fittedCentres.push(center);
      queue.push(...getCloseCentres(circle));
    }
  }
  return fittedCentres;
}
