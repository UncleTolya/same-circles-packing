<template>
  <div>
    <div style="width: 100%; display: flex; padding: 1rem">
      <div style="
        width: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding: 1rem;
      ">
        <ADropdown>
          <template #overlay>
            <AMenu @click="(item) => areaType = item.key">
              <AMenuItem key="polygon">
                polygon
              </AMenuItem>
              <AMenuItem key="circle">
                circle
              </AMenuItem>
            </AMenu>
          </template>
          <AButton>
            areaType
          </AButton>
        </ADropdown>
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>Radius: </div>
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
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>Area Radius: </div>
            <AInputNumber
              :min="Math.floor(minSide / 2)"
              :max="Math.floor(maxSide / 2)"
              size="small"
              v-model="areaRadius"
            />
          </div>
          <ASlider
            :min="Math.floor(minSide / 2)"
            :max="Math.floor(maxSide / 2)"
            v-model="areaRadius"
          />
        </div>
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>Width: </div>
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
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>Height: </div>
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
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>S: </div>
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
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>P: </div>
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
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>Weight: </div>
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
      <canvas id="canvas" width="600" height="600"></canvas>
    </div>
    <div v-if="computedUpdate && false"></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable lines-between-class-members */

import { CircleArea } from '@/components/Area/CircleArea';
import { PolygonArea } from '@/components/Area/PolygonArea';
import { CANVAS_HEIGHT, CANVAS_WIDTH, Coordinate, Drawer } from '@/components/Drawer/Drawer';
import { getFittedCentresRightLine, getFittedCentresSpiral, noop } from '@/components/utils';
import { Component } from 'vue-property-decorator';
import {
  InputNumber,
  Slider,
  Dropdown,
  Menu, Button,
} from 'ant-design-vue';
import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';

// TODO сделать начало отсчета от левого края самой длинный стороны многоугольника
// TODO и не корень из трех а динамический угол

@Component({
  components: {
    [Menu.Item.name]: Menu.Item,
    [Menu.name]: Menu,
    [Dropdown.name]: Dropdown,
    [InputNumber.name]: InputNumber,
    [Slider.name]: Slider,
    [Button.name]: Button,
  },
})
export default class CanvasArea extends Vue {
  private offset = 10;

  private areaType: 'polygon' | 'circle' = 'polygon';

  private minRadius = 10;
  private maxRadius = 400;
  private radius = this.minRadius;

  private areaRadius = this.minRadius + 1;

  private minSide = 15;
  private maxSide = 600 - this.offset * 2;

  private width = this.maxSide;
  private height = this.maxSide;

  private s = 1;
  private minS = 1;
  private maxS = 3000;

  private p = 1;
  private minP = 0;
  private maxP = 250;

  private w = 50;
  private minW = 1;
  private maxW = 250;

  private drawer!: Drawer;

  private get computedUpdate(): boolean {
    const {
      radius,
      polygonArea,
      drawer,
      s,
      p,
    } = this;
    noop(radius, polygonArea, s, p, drawer);
    if (radius < this.minRadius || radius > this.maxRadius || !drawer) {
      return false;
    }
    this.redraw();
    return true;
  }

  private redraw(): void {
    const {
      radius,
      polygonArea,
      circleArea,
      drawer,
      s,
      p,
    } = this;
    drawer.resetCanvas();
    const sum = s * p;
    let fittedCentres: Coordinate[];
    if (this.areaType === 'polygon') {
      drawer.draw(polygonArea);
      fittedCentres = getFittedCentresRightLine(polygonArea, radius, sum);
    } else {
      drawer.draw(circleArea);
      fittedCentres = getFittedCentresSpiral(circleArea, radius, sum);
    }
    fittedCentres.forEach(([x, y]) => {
      const circle = { x, y, r: radius };
      const color = fittedCentres.length < sum
        ? 'white'
        : 'green';
      drawer.draw(circle, { color });
    });
  }

  private get polygonArea(): PolygonArea {
    const { width, height, offset } = this;
    const widthPx = width + offset;
    const heightPx = height + offset;
    return new PolygonArea([
      [offset, offset],
      [widthPx, offset],
      [widthPx, heightPx],
      [offset, heightPx],
      [offset, offset],
    ]);
  }

  private get circleArea(): CircleArea {
    const x = Math.ceil(CANVAS_WIDTH / 2);
    const y = Math.ceil(CANVAS_HEIGHT / 2);
    return new CircleArea(x, y, this.areaRadius);
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
