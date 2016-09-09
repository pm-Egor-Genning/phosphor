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
  GridHeader
} from './gridheader';

import {
  GridViewport
} from './gridviewport';


/**
 *
 */
const DATA_GRID_CLASS = 'p-DataGrid';

/**
 *
 */
const VIEWPORT_CLASS = 'p-DataGrid-viewport';


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

  redOptions = {
    backgroundColor: '#FF9900'
  };

  greenOptions = {
    backgroundColor: '#93C47D'
  };

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
    if (row < 5 || row > 15 || column < 5 || column > 15) {
      return;
    }
    if (column % 2) {
      out.options = this.redOptions;
    } else {
      out.options = this.greenOptions;
    }
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

    let viewport = new GridViewport();
    viewport.addClass(VIEWPORT_CLASS);
    viewport.rowHeader = new TestHeader(20);
    viewport.columnHeader = new TestHeader(60);
    viewport.model = new TestModel();

    let layout = new BoxLayout();
    layout.addWidget(viewport);

    this.layout = layout;

    this._viewport = viewport;
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

  private _tick = 0;
  private _model: DataModel = null;
  private _rowHeader: GridHeader = null;
  private _columnHeader: GridHeader = null;
  private _viewport: GridViewport;
}
