/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 *
 */
export
abstract class GridModel {
  /**
   *
   */
  modelChanged: ISignal<this, void>;

  /**
   *
   */
  rowsInserted: ISignal<this, ...>;

  /**
   *
   */
  rowsRemoved: ISignal<this, ...>;

  /**
   *
   */
  rowsMoved: ISignal<this, ...>;

  /**
   *
   */
  columnsInserted: ISignal<this, ...>;

  /**
   *
   */
  columnsRemoved: ISignal<this, ...>;

  /**
   *
   */
  columnsMoved: ISignal<this, ...>;

  /**
   *
   */
  rowDataChanged: ISignal<this, ...>;

  /**
   *
   */
  columnDataChanged: ISignal<this, ...>;

  /**
   *
   */
  cellDataChanged: ISignal<this, ...>;

  /**
   *
   */
  abstract rowCount(): number;

  /**
   *
   */
  abstract columnCount(): number;

  /**
   *
   */
  abstract rowData(row: number, out: DataModel.IData): void;

  /**
   *
   */
  abstract columnData(column: number, out: DataModel.IData): void;

  /**
   *
   */
  abstract cellData(row: number, column: number, out: DataModel.IData): void;
}


//
defineSignal(DataModel.prototype, 'modelChanged');
defineSignal(DataModel.prototype, 'rowsInserted');
defineSignal(DataModel.prototype, 'rowsRemoved');
defineSignal(DataModel.prototype, 'rowsMoved');
defineSignal(DataModel.prototype, 'columnsInserted');
defineSignal(DataModel.prototype, 'columnsRemoved');
defineSignal(DataModel.prototype, 'columnsMoved');
defineSignal(DataModel.prototype, 'rowDataChanged');
defineSignal(DataModel.prototype, 'columnDataChanged');
defineSignal(DataModel.prototype, 'cellDataChanged');


/**
 *
 */
export
namespace DataModel {
  /**
   *
   */
  export
  interface IData {
    /**
     *
     */
    type: string;

    /**
     *
     */
    value: any;

    /**
     *
     */
    config: any;
  }
}
