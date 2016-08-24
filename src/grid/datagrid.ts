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
  SimpleCellRenderer
} from './cellrenderer';

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
    out.value = `Cell (${row}, ${column})`;
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
    canvas.setCellRenderer('default', new SimpleCellRenderer());

    let layout = new BoxLayout();
    layout.addWidget(canvas);

    this.layout = layout;
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

  private _model: DataModel = null;
  private _rowHeader: GridHeader = null;
  private _columnHeader: GridHeader = null;
}
