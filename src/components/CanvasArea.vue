<template>
  <div>
    <div style="width: 100%; display: flex; padding: 1rem">
      <div style="
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 1rem;
      ">
<!--        <div style="margin-bottom: 3rem; font-size: 1.5rem">-->
<!--          Расчет формы батареи-->
<!--        </div>-->
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom: 3rem;
        ">
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>Радиус элемента: </div>
              <AInputNumber
                :min="minRadius"
                :max="maxRadius"
                size="small"
                v-model="radius"
              />
            </div>
            <ASlider
              :min="minRadius"
              :max="maxRadius"
              v-model="radius"
            />
          </div>
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>Длина серии (S): </div>
              <AInputNumber
                :min="minS"
                :max="maxS"
                size="small"
                v-model="s"
              />
            </div>
            <ASlider
              :min="minS"
              :max="maxS"
              v-model="s"
            />
          </div>
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Кол-во параллелей (P): </div>
                <AInputNumber
                  :min="minP"
                  :max="maxP"
                  size="small"
                  v-model="p"
                />
              </div>
              <ASlider
                :min="minP"
                :max="maxP"
                v-model="p"
              />
            </div>
          </div>
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Вес элемента: </div>
                <AInputNumber
                  :min="minW"
                  :max="maxW"
                  size="small"
                  v-model="w"
                />
              </div>
              <ASlider
                :min="minW"
                :max="maxW"
                v-model="w"
              />
            </div>
          </div>
        </div>
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        ">
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>Отступ: </div>
              <AInputNumber
                :min="minOffset"
                :max="maxOffset"
                size="small"
                v-model="offset"
              />
            </div>
            <ASlider
              :min="minOffset"
              :max="maxOffset"
              v-model="offset"
            />
          </div>
          <ARadioGroup
            :value="areaType"
            buttonStyle="solid"
            size="small"
            style="display: flex; margin-bottom: 1rem"
          >
            <ARadioButton
              :key="AreaType.CIRCLE"
              style="flex: 1"
              :value="AreaType.CIRCLE"
              @click="areaType = AreaType.CIRCLE"
            >
              <AIcon type="circle"></AIcon>
              Круг
            </ARadioButton>
            <ARadioButton
              :key="AreaType.POLYGON"
              style="flex: 1"
              :value="AreaType.POLYGON"
              @click="areaType = AreaType.POLYGON"
            >
              <AIcon type="square"></AIcon>
              Прямоугольник
            </ARadioButton>
          </ARadioGroup>
          <div
            v-if="areaType === AreaType.CIRCLE"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Радиус: </div>
              <AInputNumber
                :min="Math.floor(minRadius)"
                :max="Math.floor(maxSide / 2)"
                size="small"
                v-model="areaRadius"
              />
            </div>
            <ASlider
              :min="Math.floor(minRadius)"
              :max="Math.floor(maxSide / 2)"
              v-model="areaRadius"
            />
          </div>
          <div
            v-if="areaType === AreaType.POLYGON"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Ширина: </div>
              <AInputNumber
                :min="minSide"
                :max="maxSide"
                size="small"
                v-model="width"
              />
            </div>
            <ASlider
              :min="minSide"
              :max="maxSide"
              v-model="width"
            />
          </div>
          <div
            v-if="areaType === AreaType.POLYGON"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Высота: </div>
              <AInputNumber
                :min="minSide"
                :max="maxSide"
                size="small"
                v-model="height"
              />
            </div>
            <ASlider
              :min="minSide"
              :max="maxSide"
              v-model="height"
            />
          </div>
        </div>
      </div>
      <canvas id="canvas" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT"></canvas>
    </div>
    <div v-if="computedUpdate && false"></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable lines-between-class-members */

import { CircleArea } from '@/components/Area/CircleArea';
import { PolygonArea } from '@/components/Area/PolygonArea';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  Coordinate,
  Drawer,
} from '@/components/Drawer/Drawer';
import { getFittedCentresRightLine, getFittedCentresSpiral, noop } from '@/components/utils';
import { Component } from 'vue-property-decorator';
import {
  InputNumber,
  Slider,
  Dropdown,
  Radio,
  Icon,
} from 'ant-design-vue';
import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';
import { Area } from '@/components/Area/Area';

// TODO сделать начало отсчета от левого края самой длинный стороны многоугольника
// TODO и не корень из трех а динамический угол

enum AreaType {
  POLYGON = 'POLYGON',
  CIRCLE = 'CIRCLE',
}

@Component({
  components: {
    [Dropdown.name]: Dropdown,
    [InputNumber.name]: InputNumber,
    [Slider.name]: Slider,
    [Icon.name]: Icon,
    [Radio.Button.name]: Radio.Button,
    [Radio.Group.name]: Radio.Group,
  },
  data() {
    return {
      AreaType,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
    };
  },
})
export default class CanvasArea extends Vue {
  private offset = 0;

  private areaType: AreaType = AreaType.POLYGON;

  private minRadius = 10;
  private maxRadius = 100;
  private radius = 18;

  private areaRadius = this.maxSide / 4;

  private width = this.maxSide / 2;
  private height = this.maxSide / 2;

  private minOffset = 0;

  private s = 1;
  private minS = 1;
  private maxS = 100;

  private p = 1;
  private minP = 0;
  private maxP = 1000;

  private w = 50;
  private minW = 1;
  private maxW = 100;

  private drawer!: Drawer;

  // eslint-disable-next-line class-methods-use-this
  private get maxSide(): number {
    return CANVAS_WIDTH - 2;
  }

  private get minSide(): number {
    return this.radius * 2 + 2;
  }
  private get maxOffset(): number {
    return this.maxSide / 2;
  }

  private get computedUpdate(): boolean {
    const {
      radius,
      polygonArea,
      circleArea,
      areaRadius,
      areaType,
      drawer,
      s,
      p,
    } = this;
    noop(radius, polygonArea, s, p, drawer, circleArea, areaRadius, areaType);
    if (radius < this.minRadius || radius > this.maxRadius || !drawer) {
      return false;
    }
    this.redraw();
    return true;
  }

  private redraw(): void {
    const {
      radius,
      area,
      shell,
      drawer,
      totalElementCount,
      fittedCentres,
    } = this;
    drawer.resetCanvas();
    drawer.draw(shell, { fillColor: 'white', strokeColor: 'blue' });
    if (area.isExists()) {
      drawer.draw(area);
    }
    const fillColor = fittedCentres.length < totalElementCount
      ? 'white'
      : 'green';
    fittedCentres.forEach(([x, y]) => {
      const circle = { x, y, r: radius };
      drawer.draw(circle, { fillColor, strokeColor: 'grey' });
    });
  }

  private get area(): Area {
    return this.areaType === AreaType.POLYGON
      ? this.polygonArea
      : this.circleArea;
  }

  private get shell(): Area {
    return this.areaType === AreaType.POLYGON
      ? this.polygonShell
      : this.circleShell;
  }

  private get totalElementCount(): number {
    return this.s * this.p;
  }

  private get fittedCentres(): Coordinate[] {
    const {
      radius,
      polygonArea,
      circleArea,
      totalElementCount,
    } = this;
    return this.areaType === AreaType.POLYGON
      ? getFittedCentresRightLine(polygonArea, radius, totalElementCount)
      : getFittedCentresSpiral(circleArea, radius, totalElementCount);
  }

  private get polygonArea(): PolygonArea {
    const { width, height, offset } = this;
    const [xc, yc] = this.canvasCenter;
    const [xs, ys] = [Math.round(xc - width / 2), Math.round(yc - height / 2)];
    return new PolygonArea([
      [xs + offset, ys + offset],
      [xs + width - offset, ys + offset],
      [xs + width - offset, ys + height - offset],
      [xs + offset, ys + height - offset],
      [xs + offset, ys + offset],
    ]);
  }

  private get polygonShell(): PolygonArea {
    const { width, height } = this;
    const [xc, yc] = this.canvasCenter;
    const [xs, ys] = [Math.round(xc - width / 2), Math.round(yc - height / 2)];
    return new PolygonArea([
      [xs, ys],
      [xs + width, ys],
      [xs + width, ys + height],
      [xs, ys + height],
      [xs, ys],
    ]);
  }

  private get circleArea(): CircleArea {
    const [x, y] = this.canvasCenter;
    return new CircleArea(x, y, this.areaRadius - this.offset);
  }

  private get circleShell(): CircleArea {
    const [x, y] = this.canvasCenter;
    return new CircleArea(x, y, this.areaRadius);
  }

  // eslint-disable-next-line class-methods-use-this
  private get canvasCenter(): Coordinate {
    const x = Math.round(CANVAS_WIDTH / 2);
    const y = Math.round(CANVAS_HEIGHT / 2);
    return [x, y];
  }

  private mounted(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    this.drawer = new Drawer(ctx);
    this.redraw();
  }
}
</script>
