/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  BoxLayout
} from '../ui/boxpanel';

import {
  Widget
} from '../ui/widget';

import {
  DataModel
} from './datamodel';

import {
  GridCanvas
} from './gridcanvas';

import {
  GridHeader
} from './gridheader';


/**
 *
 */
const DATA_GRID_CLASS = 'p-DataGrid';

/**
 *
 */
const GRID_CANVAS_CLASS = 'p-DataGrid-gridCanvas';


class TestHeader extends GridHeader {

  constructor(public size: number) {
    super();
  }

  sectionPosition(index: number): number {
    return index * this.size;
  }

  sectionSize(index: number): number {
    return this.size;
  }

  sectionAt(position: number): number {
    return Math.floor(position / this.size);
  }
}


class TestModel extends DataModel {

  rowCount(): number {
    return 40;
  }

  columnCount(): number {
    return 20;
  }

  rowHeaderData(row: number, out: DataModel.ICellData): void {

  }

  columnHeaderData(column: number, out: DataModel.ICellData): void {

  }

  cellData(row: number, column: number, out: DataModel.ICellData): void {
    out.value = `(${row}, ${column})`;
  }
}


/**
 *
 */
export
class DataGrid extends Widget {
  /**
   *
   */
  constructor() {
    super();
    this.addClass(DATA_GRID_CLASS);

    let canvas = new GridCanvas();
    canvas.addClass(GRID_CANVAS_CLASS);
    canvas.rowSections = new TestHeader(20);
    canvas.columnSections = new TestHeader(60);
    canvas.model = new TestModel();

    let layout = new BoxLayout();
    layout.addWidget(canvas);

    this.layout = layout;

    this._canvas = canvas;
  }

  /**
   *
   */
  get model(): DataModel {
    return null;
  }

  /*
   *
   */
  set model(value: DataModel) {
    value = value || null;
    if (this._model === value) {
      return;
    }
    // TODO handle signals
    this._model = value;
  }

  /**
   *
   */
  get rowHeader(): GridHeader {
    return this._rowHeader;
  }

  /**
   *
   */
  set rowHeader(value: GridHeader) {
    value = value || null;
    if (this._rowHeader === value) {
      return;
    }
    // TODO handle signals
    this._rowHeader = value;
  }

  /**
   *
   */
  get columnHeader(): GridHeader {
    return this._columnHeader;
  }

  /**
   *
   */
  set columnHeader(value: GridHeader) {
    value = value || null;
    if (this._columnHeader === value) {
      return;
    }
    // TODO handle signals
    this._columnHeader = value;
  }

  protected onAfterAttach(): void {
    let doit = () => {
      this._scrollIt();
      requestAnimationFrame(doit);
    }
    requestAnimationFrame(doit);
  }

  private _scrollIt(): void {
    let i = this._tick++;
    if (i >= 4000) {
      this._tick = i = 0;
    }
    if (i < 500) {
      this._canvas.scrollBy(203, 0);
    } else if (i < 1000) {
      this._canvas.scrollBy(0, 203);
    } else if (i < 1500) {
      this._canvas.scrollBy(-203, 0);
    } else if (i < 2000) {
      this._canvas.scrollBy(0, -203);
    } else if (i < 2500) {
      this._canvas.scrollBy(203, 203);
    } else if (i < 3000) {
      this._canvas.scrollBy(203, -203);
    } else if (i < 3500) {
      this._canvas.scrollBy(-203, 203);
    } else {
      this._canvas.scrollBy(-203, -203);
    }
  }

  private _tick = 0;
  private _model: DataModel = null;
  private _rowHeader: GridHeader = null;
  private _columnHeader: GridHeader = null;
  private _canvas: GridCanvas;
}
