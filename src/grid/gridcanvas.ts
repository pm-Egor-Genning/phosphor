/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  Message
} from '../core/messaging';

import {
  ISignal
} from '../core/signaling';

import {
  ResizeMessage, Widget, WidgetFlag
} from '../ui/widget';

import {
  DataModel
} from './datamodel';

import {
  GridHeader
} from './gridheader';


/**
 * The class name added to grid canvas instance.
 */
const GRID_CANVAS_CLASS = 'p-GridCanvas';

/**
 * The class name added to the canvas node of a grid canvas.
 */
const CANVAS_CLASS = 'p-GridCanvas-canvas';


/**
 * A widget which renders the cells of a grid.
 *
 * #### Notes
 * User code will not normally interact with this class directly.
 *
 * The `DataGrid` class uses an instance of the class internally.
 */
export
class GridCanvas extends Widget {
  /**
   * Construct a new gird canvas.
   *
   * @param options - The options for initializing the canvas.
   */
  constructor(options: GridCanvas.IOptions = {}) {
    super();
    this.addClass(GRID_CANVAS_CLASS);
    this.setFlag(WidgetFlag.DisallowLayout);

    // Create the offscreen rendering buffer.
    this._buffer = document.createElement('canvas');
    this._buffer.width = 0;
    this._buffer.height = 0;

    // Create the onscreen rendering canvas.
    this._canvas = document.createElement('canvas');
    this._canvas.className = CANVAS_CLASS;
    this._canvas.width = 0;
    this._canvas.height = 0;
    this._canvas.style.position = 'absolute';
    this._canvas.style.top = '0px';
    this._canvas.style.left = '0px';
    this._canvas.style.width = '0px';
    this._canvas.style.height = '0px';

    // Attach the canvas to the widget node.
    this.node.appendChild(this._canvas);
  }

  /**
   * Get the data model rendered by the canvas.
   */
  get model(): DataModel {
    return this._model;
  }

  /**
   * Set the data model rendered by the canvas.
   */
  set model(value: DataModel) {
    // Null and undefined are treated the same.
    value = value || null;

    // Do nothing if the model does not change.
    if (this._model === value) {
      return;
    }

    // Disconnect the signal handlers from the old model.
    if (this._model) {
      // TODO
    }

    // Connect the signal handlers for the new model.
    if (value) {
      // TODO
    }

    // Update the internal model reference.
    this._model = value;

    // Schedule an update of the canvas.
    this.update();
  }

  /**
   * Get the row sections for the canvas.
   */
  get rowSections(): GridCanvas.ISections {
    return this._rowSections;
  }

  /**
   * Set the row sections for the canvas.
   */
  set rowSections(value: GridCanvas.ISections) {
    // Null and undefined are treated the same.
    value = value || null;

    // Lookup the old sections.
    let old = this._rowSections;

    // Do nothing if the sections do not change.
    if (old === value) {
      return;
    }

    // Disconnect the signal handlers from the old sections.
    if (old) {
      old.sectionsResized.disconnect(this._onSectionsResized, this);
    }

    // Connect the signal handlers for the new sections.
    if (value) {
      value.sectionsResized.connect(this._onSectionsResized, this);
    }

    // Update the internal sections reference.
    this._rowSections = value;

    // Schedule an update of the canvas.
    this.update();
  }

  /**
   * Get the column sections for the canvas.
   */
  get columnSections(): GridCanvas.ISections {
    return this._columnSections;
  }

  /**
   * Set the column sections for the canvas.
   */
  set columnSections(value: GridCanvas.ISections) {
    // Null and undefined are treated the same.
    value = value || null;

    // Lookup the old sections.
    let old = this._columnSections;

    // Do nothing if the sections do not change.
    if (old === value) {
      return;
    }

    // Disconnect the signal handlers from the old sections.
    if (old) {
      old.sectionsResized.disconnect(this._onSectionsResized, this);
    }

    // Connect the signal handlers for the new sections.
    if (value) {
      value.sectionsResized.connect(this._onSectionsResized, this);
    }

    // Update the internal sections reference.
    this._columnSections = value;

    // Schedule an update of the canvas.
    this.update();
  }

  /**
   * Get the scroll X offset of the canvas.
   */
  get scrollX(): number {
    return this._scrollX;
  }

  /**
   * Set the scroll X offset of the canvas.
   */
  set scrollX(value: number) {
    this.scrollTo(value, this._scrollY);
  }

  /**
   * Get the scroll Y offset of the canvas.
   */
  get scrollY(): number {
    return this._scrollY;
  }

  /**
   * Set the scroll Y offset of the canvas.
   */
  set scrollY(value: number) {
    this.scrollTo(this._scrollX, value);
  }

  /**
   * Scroll the canvas by the specified delta.
   *
   * @param dx - The scroll X delta, in pixels.
   *
   * @param dy - The scroll Y delta, in pixels.
   */
  scrollBy(dx: number, dy: number): void {
    this.scrollTo(this._scrollX + dx, this._scrollY + dy);
  }

  /**
   * Scroll to the specified offset position.
   *
   * @param x - The scroll X offset, in pixels.
   *
   * @param y - The scroll Y offset, in pixels.
   *
   * #### Notes
   * Negative values will be clamped to zero.
   *
   * Fractional values will be rounded to the nearest integer.
   *
   * The canvas can be scrolled beyond the bounds of the rendered grid
   * if desired. Practically, there is no limit to the scroll position.
   * Technically, the limit is `Number.MAX_SAFE_INTEGER`.
   */
  scrollTo(x: number, y: number): void {

  }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(msg: Message): void {
    this.update();
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.update();
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    // Do nothing if the canvas is not visible.
    if (!this.isVisible) {
      return;
    }

    // Get the visible size of the canvas.
    let width = this._canvas.width;
    let height = this._canvas.height;

    // Do nothing if the canvas has zero area.
    if (width === 0 || height === 0) {
      return;
    }

    // Draw the entire canvas.
    this._draw(0, 0, width, height);
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: ResizeMessage): void {
    // Unpack the message data.
    let { width, height } = msg;

    // Measure the node if the dimensions are unknown.
    if (width === -1) {
      width = this.node.offsetWidth;
    }
    if (height === -1) {
      height = this.node.offsetHeight;
    }

    // Round the dimensions to the nearest pixel.
    width = Math.round(width);
    height = Math.round(height);

    // Get the rendering contexts for the buffer and canvas.
    let bufferGC = this._buffer.getContext('2d');
    let canvasGC = this._canvas.getContext('2d');

    // Get the current size of the canvas.
    let oldWidth = this._canvas.width;
    let oldHeight = this._canvas.height;

    // Determine whether there is valid content to blit.
    let needBlit = oldWidth > 0 && oldHeight > 0 && width > 0 && height > 0;

    // Resize the offscreen buffer to the new size.
    this._buffer.width = width;
    this._buffer.height = height;

    // Blit the old contents into the buffer, if needed.
    if (needBlit) {
      bufferGC.drawImage(this._canvas, 0, 0);
    }

    // Resize the onscreen canvas to the new size.
    this._canvas.width = width;
    this._canvas.height = height;
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;

    // Blit the buffer contents into the canvas, if needed.
    if (needBlit) {
      canvasGC.drawImage(this._buffer, 0, 0);
    }

    // Compute the sizes of the dirty regions.
    let right = Math.max(0, width - oldWidth);
    let bottom = Math.max(0, height - oldHeight);

    // Draw the dirty region at the right, if needed.
    if (right > 0) {
      this._draw(oldWidth, 0, right, height);
    }

    // Draw the dirty region at the bottom, if needed.
    if (bottom > 0) {
      this._draw(0, oldHeight, width - right, bottom);
    }
  }

  /**
   * Draw the portion of the canvas contained within a rect.
   */
  private _draw(rx: number, ry: number, rw: number, rh: number): void {
    // Get the rendering context for the canvas.
    let gc = this._canvas.getContext('2d');

    // Fill the dirty rect with the void space color.
    gc.fillStyle = '#D4D4D4';  // TODO make configurable.
    gc.fillRect(rx, ry, rw, rh);

    // Bail if there is no model or sections.
    if (!this._model || !this._rowSections || !this._columnSections) {
      return;
    }

    // Compute the upper-left cell index.
    let i1 = this._columnSections.sectionAt(rx + this._scrollX);
    let j1 = this._rowSections.sectionAt(ry + this._scrollY);

    // Bail if no cell intersects the origin. Since the canvas scroll
    // position cannot be negative, no cells intersect the rect. This
    // also handles the case where the data model is empty.
    if (i1 < 0 || j1 < 0) {
      return;
    }

    // Compute the lower-right cell index.
    let i2 = this._columnSections.sectionAt(rx + rw + this._scrollX - 1);
    let j2 = this._rowSections.sectionAt(ry + rh + this._scrollY - 1);

    // Clamp the cells to the model limits, if needed.
    if (i2 < 0) {
      i2 = this._model.columnCount() - 1;
    }
    if (j2 < 0) {
      j2 = this._model.rowCount() - 1;
    }

    // Compute the origin of the cell bounding box.
    let x = this._columnSections.sectionPosition(i1) - this._scrollX;
    let y = this._rowSections.sectionPosition(j1) - this._scrollY;

    // Setup the drawing region.
    let rgn: Private.IRegion = {
      x: x, y: y, width: 0, height: 0,
      startColumn: i1, endColumn: i2,
      startRow: j1, endRow: j2,
      columnSizes: [], rowSizes: []
    };

    // Update the column sizes and total region width.
    for (let i = 0, n = i2 - i1 + 1; i < n; ++i) {
      let s = this._columnSections.sectionSize(i1 + i);
      rgn.columnSizes[i] = s;
      rgn.width += s;
    }

    // Update the row sizes and total region height.
    for (let j = 0, n = j2 - j1 + 1; j < n; ++j) {
      let s = this._rowSections.sectionSize(j1 + j);
      rgn.rowSizes[j] = s;
      rgn.height += s;
    }

    // Draw the background behind the cells.
    this._drawBackground(gc, rgn);

    // Draw the grid lines for the cells.
    this._drawGridLines(gc, rgn);

    // Finally, draw the actual cell contents.
    this._drawCells(gc, rgn);

    // temporary: draw the painted rect.
    gc.beginPath();
    gc.rect(rgn.x + 0.5, rgn.y + 0.5, rgn.width - 1, rgn.height - 1);
    gc.lineWidth = 1;
    gc.strokeStyle = Private.nextColor();
    gc.stroke();
  }

  /**
   * Draw the background for the given grid region.
   */
  private _drawBackground(gc: CanvasRenderingContext2D, rgn: Private.IRegion): void {
    // Setup the drawing style.
    gc.fillStyle = 'white';  // TODO make configurable

    // Fill the dirty rect with the background color.
    gc.fillRect(rgn.x, rgn.y, rgn.width, rgn.height);
  }

  /**
   * Draw the gridlines for the given grid region.
   */
  private _drawGridLines(gc: CanvasRenderingContext2D, rgn: Private.IRegion): void {
    // Setup the drawing style.
    gc.lineWidth = 1;
    gc.lineCap = 'butt';
    gc.strokeStyle = 'gray';  // TODO make configurable

    // Start the path for the grid lines.
    gc.beginPath();

    // Draw the vertical grid lines.
    let y1 = rgn.y;
    let y2 = rgn.y + rgn.height;
    let colSizes = rgn.columnSizes;
    for (let i = 0, x = rgn.x - 0.5, n = colSizes.length; i < n; ++i) {
      x += colSizes[i];
      gc.moveTo(x, y1);
      gc.lineTo(x, y2);
    }

    // Draw the horizontal grid lines.
    let x1 = rgn.x;
    let x2 = rgn.x + rgn.width;
    let rowSizes = rgn.rowSizes;
    for (let j = 0, y = rgn.y - 0.5, n = rowSizes.length; j < n; ++j) {
      y += rowSizes[j];
      gc.moveTo(x1, y);
      gc.lineTo(x2, y);
    }

    // Stroke the path to render the lines.
    gc.stroke();
  }

  /**
   * Draw the cells for the given grid region.
   */
  private _drawCells(gc: CanvasRenderingContext2D, rgn: Private.IRegion): void {
    gc.fillStyle = 'black';
    gc.font = '10px sans-serif';
    let x = rgn.x;
    let rowSizes = rgn.rowSizes;
    let colSizes = rgn.columnSizes;
    for (let i = 0, nCols = colSizes.length; i < nCols; ++i) {
      let y = rgn.y;
      for (let j = 0, nRows = rowSizes.length; j < nRows; ++j) {
        let h = rowSizes[j];
        gc.fillText(`Cell ${rgn.startRow + j}, ${rgn.startColumn + i}`, x, y + h / 2);
        y += h;
      }
      x += colSizes[i];
    }
  }

  /**
   * Handle the `sectionsResized` signal of the grid sections.
   */
  private _onSectionsResized(sender: GridCanvas.ISections, range: GridCanvas.ISectionRange): void { }

  private _scrollX = 0;
  private _scrollY = 0;
  private _model: DataModel = null;
  private _buffer: HTMLCanvasElement;
  private _canvas: HTMLCanvasElement;
  private _rowSections: GridCanvas.ISections = null;
  private _columnSections: GridCanvas.ISections = null;
}


/**
 * The namespace for the `GridCanvas` class statics.
 */
export
namespace GridCanvas {
  /**
   * An options object for initializing a grid canvas.
   */
  export
  interface IOptions {

  }

  /**
   *
   */
  export
  interface ISectionRange {

  }

  /**
   *
   */
  export
  interface ISections {
    /**
     *
     */
    sectionsResized: ISignal<ISections, ISectionRange>;

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
}


/**
 * The namespace for the module private data.
 */
namespace Private {
  /**
   *
   */
  export
  interface IRegion {
    /**
     *
     */
    x: number;

    /**
     *
     */
    y: number;

    /**
     *
     */
    width: number;

    /**
     *
     */
    height: number;

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

    /**
     *
     */
    rowSizes: number[];

    /**
     *
     */
    columnSizes: number[];
  }

  const colors = [
    'red', 'green', 'blue', 'yellow', 'orange', 'cyan'
  ];

  let ci = 0;

  export
  function nextColor(): string {
    return colors[ci++ % colors.length];
  }

  const COL_WIDTH = 60;
  const ROW_HEIGHT = 20;

  export
  function rowSize(index: number): number {
    return ROW_HEIGHT;
  }

  export
  function columnSize(index: number): number {
    return COL_WIDTH;
  }

  export
  function rowPosition(index: number): number {
    return index * ROW_HEIGHT;
  }

  export
  function columnPosition(index: number): number {
    return index * COL_WIDTH;
  }

  export
  function rowAt(position: number): number {
    if (position < 0) {
      return -1;
    }
    return Math.floor(position / ROW_HEIGHT);
  }

  export
  function columnAt(position: number): number {
    if (position < 0) {
      return -1;
    }
    return Math.floor(position / COL_WIDTH);
  }
}
