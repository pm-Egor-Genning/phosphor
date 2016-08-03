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
interface IHeaderView<T extends IDataModel> extends Widget {
  /**
   *
   */
  size: number;

  /**
   *
   */
  offset: number;

  /**
   *
   */
  model: T;

  /**
   *
   */
  sectionPosition(index: number): number;

  /**
   *
   */
  sectionSize(index: number): number;

  /**
   *
   */
  sectionAt(position: number): number;
}
