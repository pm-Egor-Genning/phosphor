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
  readonly modelChanged: ISignal<this, void>;

  /**
   *
   */
  readonly rowsInserted: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  readonly rowsRemoved: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  readonly rowsMoved: ISignal<this, DataModel.ISectionRangeMove>;

  /**
   *
   */
  readonly columnsInserted: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  readonly columnsRemoved: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  readonly columnsMoved: ISignal<this, DataModel.ISectionRangeMove>;

  /**
   *
   */
  readonly rowHeaderDataChanged: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  readonly columnHeaderDataChanged: ISignal<this, DataModel.ISectionRange>;

  /**
   *
   */
  readonly cellDataChanged: ISignal<this, DataModel.ICellRange>;

  /**
   *
   */
  abstract readonly rowCount: number;

  /**
   *
   */
  abstract readonly columnCount: number;

  /**
   *
   */
  abstract rowHeaderData(row: number, out: DataModel.ICellData): void;

  /**
   *
   */
  abstract columnHeaderData(column: number, out: DataModel.ICellData): void;

  /**
   *
   */
  abstract cellData(row: number, column: number, out: DataModel.ICellData): void;
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
  interface ICellData {
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
    options: any;
  }

  /**
   *
   */
  export
  interface ISectionRange {
    /**
     *
     */
    readonly start: number;

    /**
     *
     */
    readonly end: number;
  }

  /**
   *
   */
  export
  interface ISectionRangeMove extends ISectionRange {
    /**
     *
     */
    readonly destination: number;
  }

  /**
   *
   */
  export
  interface ICellRange {
    /**
     *
     */
    readonly startRow: number;

    /**
     *
     */
    readonly endRow: number;

    /**
     *
     */
    readonly startColumn: number;

    /**
     *
     */
    readonly endColumn: number;
  }
}
