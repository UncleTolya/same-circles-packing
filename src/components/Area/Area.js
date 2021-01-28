define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Area = void 0;
    class Area {
        findFirstCircleCenter(circleRadius, [initX, initY] = this.getStartCoordinate(circleRadius), radius = 1) {
            if (radius > 10) {
                throw new Error();
            }
            const lastPosition = {
                x: initX,
                y: initY,
            };
            const checkSpiralSide = (condition, axis, offset) => {
                for (let i = 0; i < condition; i += 1) {
                    lastPosition[axis] += offset;
                    if (this.isCircleFit({
                        x: lastPosition.x,
                        y: lastPosition.y,
                        r: circleRadius,
                    })) {
                        return true;
                    }
                }
                return false;
            };
            const checkNewRadiusStartPosition = () => this.isCircleFit({
                x: initX,
                y: initY,
                r: circleRadius,
            });
            const checkCeilRightSide = () => checkSpiralSide(radius, 'x', 1);
            const checkRightSide = () => checkSpiralSide(radius * 2, 'y', -1);
            const checkBottom = () => checkSpiralSide(radius * 2, 'x', -1);
            const checkLeftSide = () => checkSpiralSide(radius * 2, 'y', 1);
            const checkCeilLeftSide = () => checkSpiralSide(radius - 1, 'x', 1);
            if (checkNewRadiusStartPosition()
                || checkCeilRightSide()
                || checkRightSide()
                || checkBottom()
                || checkLeftSide()
                || checkCeilLeftSide()) {
                return [lastPosition.x, lastPosition.y];
            }
            return this.findFirstCircleCenter(circleRadius, [lastPosition.x + 1, lastPosition.y + 1], radius + 1);
        }
    }
    exports.Area = Area;
});
