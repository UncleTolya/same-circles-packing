import { Area } from '@/components/Area/Area';
import { CircleArea } from '@/components/Area/CircleArea';
import { RectangleArea } from '@/components/Area/RectangleArea';
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 600;
export const RULER_WIDTH = 30;
export const WORKSPACE_WIDTH = CANVAS_WIDTH - RULER_WIDTH;
export const WORKSPACE_HEIGHT = CANVAS_HEIGHT - RULER_WIDTH;
export const WORKSPACE_CENTER = [
    Math.round(WORKSPACE_WIDTH / 2) + RULER_WIDTH,
    Math.round(WORKSPACE_HEIGHT / 2) + RULER_WIDTH,
];
export class Drawer {
    constructor(ctx) {
        this.ctx = ctx;
        this.drawCircleSizes = ({ x, y, r }, angle) => {
            const { ctx } = this;
            const multiplier = angle < 1 ? 1 : -1;
            ctx.beginPath();
            this.drawArrow(x, y, x - Math.cos(angle) * r, y + Math.sin(angle) * r);
            this.drawArrow(x, y, x + Math.cos(angle) * r, y - Math.sin(angle) * r);
            ctx.moveTo(x, y);
            const dia = Math.sqrt(Math.pow(WORKSPACE_WIDTH, 2) + Math.pow(WORKSPACE_HEIGHT, 2));
            const lineLength = Math.max(Math.min(dia - 770 - 10000 / r, r * 1.5), 50);
            const endX = x + Math.cos(angle) * lineLength;
            const endY = y - Math.sin(angle) * lineLength;
            ctx.lineTo(endX, endY);
            ctx.lineTo(endX + 50 * multiplier, endY);
            ctx.strokeStyle = 'grey';
            ctx.stroke();
            this.drawText(r * 2, endX + 20 * multiplier, endY - 5);
        };
        this.drawRectangleSizes = (points, index = 0) => {
            this.drawRectangleSizesTop(points, index);
            this.drawRectangleSizesLeft(points, index);
        };
        this.drawRectangleSizesTop = (points, index = 0) => {
            const { ctx } = this;
            ctx.beginPath();
            const [lsx, lsy] = points[0];
            const [rsx, rsy] = points[1];
            ctx.strokeStyle = 'grey';
            const endX = (rsx - lsx) / 2 + lsx;
            const endY = index * 10 + lsy - RULER_WIDTH;
            ctx.moveTo(lsx, lsy);
            ctx.lineTo(lsx, endY);
            ctx.moveTo(rsx, rsy);
            ctx.lineTo(rsx, endY);
            this.drawArrow(endX - 12, endY + 10, lsx, endY + 10);
            this.drawArrow(endX + 15, endY + 10, rsx, endY + 10);
            ctx.stroke();
            this.drawText(rsx - lsx, endX - 7, endY + 15);
        };
        this.drawRectangleSizesLeft = (points, index = 0) => {
            const { ctx } = this;
            ctx.beginPath();
            const [dsx, dsy] = points[points.length - 2];
            const [tsx, tsy] = points[0];
            ctx.strokeStyle = 'grey';
            const endX = index * 10 + dsx - RULER_WIDTH;
            const endY = (dsy - tsy) / 2 + tsy;
            ctx.moveTo(dsx, dsy);
            ctx.lineTo(endX, dsy);
            ctx.moveTo(tsx, tsy);
            ctx.lineTo(endX, tsy);
            this.drawArrow(endX + 12, endY - 10, endX + 12, tsy);
            this.drawArrow(endX + 12, endY + 10, endX + 12, dsy);
            ctx.stroke();
            this.drawText(dsy - tsy, endX, endY + 7);
            ctx.restore();
        };
        this.drawRectangle = (points, { strokeColor, fillColor, thickness }) => {
            const { ctx } = this;
            ctx.strokeStyle = strokeColor !== null && strokeColor !== void 0 ? strokeColor : 'grey';
            ctx.beginPath();
            if (thickness) {
                ctx.lineWidth = thickness;
            }
            points.forEach(([x, y], i) => {
                if (!i) {
                    ctx.moveTo(x, y);
                }
                else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            points.forEach(([x, y], i) => {
                if (!i) {
                    ctx.moveTo(x, y);
                }
                else {
                    ctx.lineTo(x, y);
                }
            });
            if (fillColor) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.closePath();
            ctx.lineWidth = 1;
        };
        this.resetCanvas();
    }
    draw(entity, options) {
        if (entity instanceof Area) {
            return this.drawArea(entity, options);
        }
        return this.drawElement(entity, options);
    }
    drawSizes(element, angle = 1, index = 0) {
        if (element.points) {
            this.drawRectangleSizes(element.points, index);
        }
        else {
            this.drawCircleSizes(element, angle);
        }
    }
    resetCanvas() {
        this.fillCanvas();
        this.drawRuler();
    }
    fillCanvas() {
        const { ctx } = this;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    drawElement(element, options) {
        const opt = Object.assign({ fillColor: '#0a63ae', strokeColor: 'grey' }, options !== null && options !== void 0 ? options : {});
        if (element.points) {
            this.drawRectangle(element.points, opt);
        }
        else {
            this.drawCircle(element, opt);
        }
    }
    drawArea(area, options) {
        const opt = Object.assign({ strokeColor: 'black', thickness: 3, index: 0 }, options !== null && options !== void 0 ? options : {});
        if (area instanceof RectangleArea) {
            this.drawRectangle(area.points, opt);
        }
        else if (area instanceof CircleArea) {
            this.drawCircle({ x: area.x, y: area.y, r: area.r }, opt);
        }
    }
    drawText(text, x, y, height = 12) {
        const { ctx } = this;
        const t = `${text}`;
        const { width } = ctx.measureText(t);
        ctx.fillStyle = 'white';
        const offset = 6;
        ctx.fillRect(x - offset, y - offset * 2, width + offset * 2, height * 1.3);
        ctx.font = `${height}px Arial`;
        ctx.strokeStyle = 'black';
        ctx.strokeText(t, x, y);
    }
    drawRuler() {
        const { ctx } = this;
        const fontHeight = 10;
        for (let i = 0; i < Math.ceil(WORKSPACE_WIDTH / 10); i += 1) {
            ctx.strokeStyle = 'grey';
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(i * 10 + RULER_WIDTH, RULER_WIDTH);
            ctx.lineTo(i * 10 + RULER_WIDTH, WORKSPACE_HEIGHT + RULER_WIDTH);
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.moveTo(i * 10 + RULER_WIDTH, RULER_WIDTH);
            if (i * 10 !== 0 && (i * 10) % 100 === 0) {
                ctx.strokeStyle = 'black';
                ctx.lineTo(i * 10 + RULER_WIDTH, RULER_WIDTH - RULER_WIDTH * 0.4);
                ctx.stroke();
                this.drawText(i * 10, i * 10 + RULER_WIDTH - 7, RULER_WIDTH - RULER_WIDTH + 18, fontHeight);
            }
            else {
                ctx.lineTo(i * 10 + RULER_WIDTH, RULER_WIDTH - RULER_WIDTH * 0.2);
                ctx.stroke();
            }
        }
        for (let i = 0; i < Math.ceil(WORKSPACE_HEIGHT / 10); i += 1) {
            ctx.strokeStyle = 'grey';
            ctx.globalAlpha = 0.08;
            ctx.beginPath();
            ctx.moveTo(RULER_WIDTH, i * 10 + RULER_WIDTH);
            ctx.lineTo(RULER_WIDTH + WORKSPACE_WIDTH, i * 10 + RULER_WIDTH);
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.moveTo(RULER_WIDTH, i * 10 + RULER_WIDTH);
            if ((i * 10) % 100 === 0) {
                ctx.strokeStyle = 'black';
                ctx.lineTo(RULER_WIDTH - RULER_WIDTH * 0.4, i * 10 + RULER_WIDTH);
                ctx.stroke();
                this.drawText(i * 10, 1, i * 10 + RULER_WIDTH + 4, fontHeight);
            }
            else {
                ctx.lineTo(RULER_WIDTH - RULER_WIDTH * 0.2, i * 10 + RULER_WIDTH);
                ctx.stroke();
            }
        }
    }
    drawCircle({ x, y, r }, { strokeColor, fillColor, thickness, globalAlpha, }) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.strokeStyle = strokeColor !== null && strokeColor !== void 0 ? strokeColor : 'black';
        if (thickness) {
            ctx.lineWidth = thickness;
            ctx.arc(x, y, r + thickness / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        else {
            ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        if (fillColor) {
            ctx.globalAlpha = globalAlpha !== null && globalAlpha !== void 0 ? globalAlpha : 1;
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;
    }
    drawArrow(fromX, fromY, toX, toY) {
        const { ctx } = this;
        const headlen = 10; // length of head in pixels
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    }
}
