define(["require", "exports", "@/components/Area/Area"], function (require, exports, Area_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircleArea = void 0;
    const intersects = require('intersects');
    class CircleArea extends Area_1.Area {
        constructor(x, y, r) {
            super();
            this.x = x;
            this.y = y;
            this.r = r;
        }
        isCircleFit({ x, y, r }) {
            const { x: xt, y: yt, r: rt } = this;
            const dc = Math.sqrt(Math.pow((xt - x), 2) + Math.pow((yt - y), 2));
            return !(rt - r < dc && rt + r > dc)
                && intersects.circlePoint(xt, yt, rt, x, y);
        }
        isExists() {
            return this.r > 0;
        }
        getStartCoordinate(circleRadius) {
            return [this.x, this.y];
        }
    }
    exports.CircleArea = CircleArea;
});
