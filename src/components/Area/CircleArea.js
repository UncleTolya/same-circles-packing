import { Area } from '@/components/Area/Area';
const intersects = require('intersects');
export class CircleArea extends Area {
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
