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
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>Radius: </div>
            <InputNumber
              :min="minRadius"
              :max="maxRadius"
              size="small"
              v-model="radius"
            />
          </div>
          <Slider
            :min="minRadius"
            :max="maxRadius"
            v-model="radius"
          />
        </div>
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>Width: </div>
            <InputNumber
              :min="minSide"
              :max="maxSide"
              size="small"
              v-model="width"
            />
          </div>
          <Slider
            :min="minSide"
            :max="maxSide"
            v-model="width"
          />
        </div>
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>Height: </div>
            <InputNumber
              :min="minSide"
              :max="maxSide"
              size="small"
              v-model="height"
            />
          </div>
          <Slider
            :min="minSide"
            :max="maxSide"
            v-model="height"
          />
        </div>
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div>S: </div>
            <InputNumber
              :min="minS"
              :max="maxS"
              size="small"
              v-model="s"
            />
          </div>
          <Slider
            :min="minS"
            :max="maxS"
            v-model="s"
          />
        </div>
        <div style="display: flex; flex: 1; flex-direction: column">
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>P: </div>
              <InputNumber
                :min="minP"
                :max="maxP"
                size="small"
                v-model="p"
              />
            </div>
            <Slider
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
              <InputNumber
                :min="minW"
                :max="maxW"
                size="small"
                v-model="w"
              />
            </div>
            <Slider
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

import { PolygonArea } from '@/components/Area/PolygonArea';
import { Drawer } from '@/components/Drawer/Drawer';
import {getFittedCentresRightLine, getFittedCentresSpiral, noop} from '@/components/utils';
import { Component } from 'vue-property-decorator';
import { InputNumber, Slider } from 'ant-design-vue';
import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';

// TODO сделать начало отсчета от левого края самой длинный стороны многоугольника
// TODO и не корень из трех а динамический угол

@Component({
  components: {
    InputNumber,
    Slider,
  },
})
export default class CanvasArea extends Vue {
  private offset = 10;

  private minRadius = 10;
  private maxRadius = 400;
  private radius = this.minRadius;

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
      drawer,
      s,
      p,
    } = this;
    drawer.resetCanvas();
    const sum = s * p;
    drawer.draw(polygonArea);
    // const fittedCentres = getFittedCentresSpiral(polygonArea, radius, sum);
    const fittedCentres = getFittedCentresRightLine(polygonArea, radius, sum);
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
