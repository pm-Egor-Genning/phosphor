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
