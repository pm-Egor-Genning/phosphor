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

import {
  Widget
} from '../ui/widget';

import {
  DataModel
} from './datamodel';

import {
  GridCanvas
} from './gridcanvas';


/**
 *
 */
export
abstract class GridHeader extends Widget {
  /**
   *
   */
  sectionsResized: ISignal<this, GridHeader.ISectionRange>;

  /**
   * abstract
   */
  model: DataModel;

  /**
   * abstract
   */
  scrollPosition: number;

  /**
   * abstract
   */
  scrollSize: number;

  /**
   * Get the origin of the section at a specific index.
   *
   * @params index - The index of the section of interest.
   *
   * @returns The integer position of the section, or `-1` if the
   *   index is out of range.
   *
   * #### Notes
   * The sections **must** be arranged in a dense sequence such that
   * `sectionPosition(i) + sectionSize(i) === sectionPosition(i + 1)`.
   *
   * The position for index `0` **must** be `0`.
   *
   * The section position is independent of the `scrollPosition`.
   */
  abstract sectionPosition(index: number): number;

  /**
   * Get the size of the section at a specific index.
   *
   * @params index - The index of the section of interest.
   *
   * @returns The integer size of the section, or `-1` if the index
   *   is out of range.
   *
   * #### Notes
   * The size of a valid index **must** be `>= 0`.
   *
   * A "hidden" section should report a `0` size.
   */
  abstract sectionSize(index: number): number;

  /**
   * Get the index of the section at a specific position.
   *
   * @params position - The position of the section of interest.
   *
   * @returns The index of the section which intersects the
   *   position, or `-1` if the position is out of range.
   *
   * #### Notes
   * The index of a valid position **must** be `>= 0`.
   */
  abstract sectionAt(position: number): number;
}


//
defineSignal(GridHeader.prototype, 'sectionsResized');


/**
 * The namespace for the `GridHeader` class statics.
 */
export
namespace GridHeader {
  /**
   * An object which represents a range of sections.
   */
  export
  interface ISectionRange {
    /**
     * The first index in the range, inclusive.
     *
     * This must be an integer `<= last`.
     */
    first: number;

    /**
     * The last index in the range, inclusive.
     *
     * This must be an integer `>= first`.
     */
    last: number;
  }
}
