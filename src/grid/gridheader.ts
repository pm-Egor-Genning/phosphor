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
abstract class GridHeader extends Widget implements GridCanvas.ISections {
  /**
   *
   */
  sectionsResized: ISignal<this, GridCanvas.ISectionRange>;

  /**
   *
   */
  model: DataModel;

  /**
   *
   */
  scrollPosition: number;

  /**
   *
   */
  scrollSize: number;

  /**
   *
   */
  abstract sectionPosition(index: number): number;

  /**
   *
   */
  abstract sectionSize(index: number): number;

  /**
   *
   */
  abstract sectionAt(position: number): number;
}


//
defineSignal(GridHeader.prototype, 'sectionsResized');
