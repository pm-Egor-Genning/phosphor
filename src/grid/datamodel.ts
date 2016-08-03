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
abstract class DataModel {
  /**
   *
   */
  modelChanged: ISignal<this, void>;

  /**
   *
   */
  cellDataChanged: ISignal<this, ...>;

  /**
   *
   */
  rowHeaderDataChanged: ISignal<this, ...>;

  /**
   *
   */
  columnHeaderDataChanged: ISignal<this, ...>;

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
  abstract rowCount(): number;

  /**
   *
   */
  abstract columnCount(): number;

  /**
   *
   */
  abstract cellData(row: number, column: number, out: DataModel.IDatum): void;

  /**
   *
   */
  abstract rowHeaderData(row: number, out: DataModel.IDatum): void;

  /**
   *
   */
  abstract columnHeaderData(column: number, out: DataModel.IDatum): void;
}


//
defineSignal(DataModel.prototype, 'modelChanged');
defineSignal(DataModel.prototype, 'cellDataChanged');
defineSignal(DataModel.prototype, 'rowHeaderDataChanged');
defineSignal(DataModel.prototype, 'columnHeaderDataChanged');
defineSignal(DataModel.prototype, 'rowsInserted');
defineSignal(DataModel.prototype, 'rowsRemoved');
defineSignal(DataModel.prototype, 'rowsMoved');
defineSignal(DataModel.prototype, 'columnsInserted');
defineSignal(DataModel.prototype, 'columnsRemoved');
defineSignal(DataModel.prototype, 'columnsMoved');


/**
 *
 */
export
namespace DataModel {
  /**
   *
   */
  export
  interface IDatum {
    /**
     *
     */
    value: any;

    /**
     *
     */
    renderer: string;

    /**
     *
     */
    config: any;
  }
}
