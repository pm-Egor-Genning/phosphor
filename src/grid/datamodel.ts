/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  ISignal, defineSignal
} from '../core/signaling';


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
  rowsInserted: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  rowsRemoved: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  rowsMoved: ISignal<this, DataModel.ISectionRangeMove>;

  /**
   *
   */
  columnsInserted: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  columnsRemoved: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  columnsMoved: ISignal<this, DataModel.ISectionRangeMove>;

  /**
   *
   */
  rowHeaderDataChanged: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  columnHeaderDataChanged: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  cellDataChanged: ISignal<this, DataModel.ICellRange>;

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
  abstract rowHeaderData(row: number, out: DataModel.IData): void;

  /**
   *
   */
  abstract columnHeaderData(column: number, out: DataModel.IData): void;

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
defineSignal(DataModel.prototype, 'rowHeaderDataChanged');
defineSignal(DataModel.prototype, 'columnHeaderDataChanged');
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

  /**
   *
   */
  export
  interface ISectionRange {
    /**
     *
     */
    start: number;

    /**
     *
     */
    end: number;
  }

  /**
   *
   */
  export
  interface ISectionRangeMove extends ISectionRange {
    /**
     *
     */
    destination: number;
  }

  /**
   *
   */
  export
  interface ICellRange {
    /**
     *
     */
    startRow: number;

    /**
     *
     */
    endRow: number;

    /**
     *
     */
    startColumn: number;

    /**
     *
     */
    endColumn: number;
  }
}
